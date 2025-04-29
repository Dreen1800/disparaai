// src/pages/api/webhook/cart-abandoned.js
import { supabase } from '../../../lib/supabase';
import { validateWebhookRequest } from '../../../utils/security';

export default async function handler(req, res) {
  // Permitir apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // Validar o webhook (verifique a assinatura ou token)
    const isValid = await validateWebhookRequest(req);
    if (!isValid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const payload = req.body;
    
    // Validação básica dos dados recebidos
    if (!payload.customer || !payload.customer.phone || !payload.cart || !payload.cart.value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Processar o carrinho abandonado
    const cartData = {
      user_id: payload.store_user_id, // ID do usuário do Supabase que corresponde à loja
      customer_name: payload.customer.name || 'Cliente',
      customer_phone: payload.customer.phone,
      cart_value: payload.cart.value,
      cart_items: payload.cart.items || [],
      recovery_status: 'pending',
      store_id: payload.store_id,
      external_id: payload.cart.id
    };
    
    // Salvar o carrinho abandonado no Supabase
    const { data, error } = await supabase
      .from('abandoned_carts')
      .insert([cartData])
      .select();
    
    if (error) {
      console.error('Error saving abandoned cart:', error);
      return res.status(500).json({ error: 'Failed to save abandoned cart' });
    }
    
    // Iniciar o processo de recuperação assíncrono
    // Em um sistema real, você pode usar um job queue como Bull ou similar
    await startRecoveryProcess(data[0].id);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Abandoned cart received and processing started',
      cart_id: data[0].id
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Inicia o processo de recuperação de um carrinho abandonado
 * Em um sistema real, este processo seria executado em background
 */
async function startRecoveryProcess(cartId) {
  try {
    // 1. Obter informações do carrinho
    const { data: cart, error: cartError } = await supabase
      .from('abandoned_carts')
      .select(`
        *,
        users:user_id (id)
      `)
      .eq('id', cartId)
      .single();
    
    if (cartError) throw cartError;
    
    // 2. Buscar o fluxo de recuperação ativo para o usuário
    const { data: flows, error: flowError } = await supabase
      .from('recovery_flows')
      .select('*')
      .eq('user_id', cart.user_id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (flowError) throw flowError;
    if (!flows || flows.length === 0) {
      console.log(`No active recovery flow found for user ${cart.user_id}`);
      return;
    }
    
    const flow = flows[0];
    
    // 3. Buscar a primeira mensagem do fluxo
    const { data: messages, error: msgError } = await supabase
      .from('flow_messages')
      .select('*')
      .eq('flow_id', flow.id)
      .order('sequence_order', { ascending: true })
      .limit(1);
    
    if (msgError) throw msgError;
    if (!messages || messages.length === 0) {
      console.log(`No messages found for flow ${flow.id}`);
      return;
    }
    
    const firstMessage = messages[0];
    
    // 4. Buscar uma instância WhatsApp disponível
    const { data: instances, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select(`
        *,
        connections:connection_id (
          id,
          user_id,
          type
        )
      `)
      .eq('connections.user_id', cart.user_id)
      .eq('status', 'connected')
      .limit(1);
    
    if (instanceError) throw instanceError;
    if (!instances || instances.length === 0) {
      console.log(`No active WhatsApp instance found for user ${cart.user_id}`);
      return;
    }
    
    const instance = instances[0];
    
    // 5. Programar o envio da primeira mensagem
    // Calcular o horário de envio (agora + delay configurado)
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + (firstMessage.delay_hours * 60 * 60 * 1000));
    
    // Personalizar o conteúdo da mensagem
    const personalizedContent = personalizeMessage(
      firstMessage.content,
      {
        nome: cart.customer_name,
        valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cart.cart_value),
        produtos: getProductsText(cart.cart_items),
        link_carrinho: `https://loja.com.br/carrinho?id=${cart.external_id}`
      }
    );
    
    // Criar o registro da mensagem agendada
    const { data: sentMessage, error: sentError } = await supabase
      .from('sent_messages')
      .insert([{
        flow_id: flow.id,
        flow_message_id: firstMessage.id,
        cart_id: cart.id,
        instance_id: instance.id,
        status: 'scheduled',
        content: personalizedContent,
        scheduled_for: scheduledTime.toISOString()
      }])
      .select();
    
    if (sentError) throw sentError;
    
    // 6. Atualizar o status do carrinho
    const { error: updateError } = await supabase
      .from('abandoned_carts')
      .update({ recovery_status: 'in_progress' })
      .eq('id', cart.id);
    
    if (updateError) throw updateError;
    
    console.log(`Recovery process started for cart ${cartId}. First message scheduled for ${scheduledTime.toISOString()}`);
    
  } catch (error) {
    console.error('Error starting recovery process:', error);
  }
}

/**
 * Personaliza uma mensagem substituindo variáveis por valores
 */
function personalizeMessage(template, data) {
  let result = template;
  
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value || '');
  }
  
  return result;
}

/**
 * Formata o texto dos produtos para a mensagem
 */
function getProductsText(items) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return '';
  }
  
  return items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
}