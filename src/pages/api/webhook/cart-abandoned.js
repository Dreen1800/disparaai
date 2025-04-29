// src/pages/api/webhook/cart-abandoned.js - Adaptado para usar seu schema de banco de dados
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  // Permitir apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // Validar o token de autenticação do webhook
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7); // Remover 'Bearer ' do header
    
    // Verificar o token na tabela de usuários ou em uma tabela específica de tokens
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('webhook_token', token)
      .single();
    
    if (userError || !userData) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const userId = userData.id;
    const payload = req.body;
    
    // Validação básica dos dados recebidos
    if (!payload.customer || !payload.customer.phone || !payload.cart || !payload.cart.value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Processar o carrinho abandonado
    const cartData = {
      user_id: userId,
      customer_name: payload.customer.name || 'Cliente',
      customer_phone: payload.customer.phone,
      cart_value: payload.cart.value,
      cart_items: payload.cart.items || [],
      recovery_status: 'pending',
      store_id: payload.store_id || null,
      external_id: payload.cart.id || null
    };
    
    // Salvar o carrinho abandonado no Supabase
    const { data: cartData, error: cartError } = await supabase
      .from('abandoned_carts')
      .insert([cartData])
      .select();
    
    if (cartError) {
      console.error('Error saving abandoned cart:', cartError);
      return res.status(500).json({ error: 'Failed to save abandoned cart' });
    }
    
    // Iniciar o processo de recuperação assíncrono
    startRecoveryProcess(cartData[0].id, userId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Abandoned cart received and processing started',
      cart_id: cartData[0].id
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Inicia o processo de recuperação de um carrinho abandonado
 */
async function startRecoveryProcess(cartId, userId) {
  try {
    // 1. Buscar um fluxo de recuperação ativo
    const { data: flows, error: flowError } = await supabase
      .from('recovery_flows')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (flowError || !flows || flows.length === 0) {
      console.log(`No active recovery flow found for user ${userId}`);
      return;
    }
    
    const flow = flows[0];
    
    // 2. Buscar a primeira mensagem do fluxo
    const { data: messages, error: msgError } = await supabase
      .from('flow_messages')
      .select('*')
      .eq('flow_id', flow.id)
      .order('sequence_order', { ascending: true })
      .limit(1);
    
    if (msgError || !messages || messages.length === 0) {
      console.log(`No messages found for flow ${flow.id}`);
      return;
    }
    
    const firstMessage = messages[0];
    
    // 3. Buscar uma instância WhatsApp disponível
    const { data: instances, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select(`
        *,
        whatsapp_connections!inner(*)
      `)
      .eq('whatsapp_connections.user_id', userId)
      .eq('status', 'connected')
      .limit(1);
    
    if (instanceError || !instances || instances.length === 0) {
      console.log(`No active WhatsApp instance found for user ${userId}`);
      return;
    }
    
    const instance = instances[0];
    
    // 4. Obter informações do carrinho
    const { data: cart, error: cartError } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('id', cartId)
      .single();
    
    if (cartError) {
      console.error('Error fetching cart data:', cartError);
      return;
    }
    
    // 5. Calcular o horário de envio (agora + delay configurado)
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + (firstMessage.delay_hours * 60 * 60 * 1000));
    
    // 6. Personalizar o conteúdo da mensagem
    const personalizedContent = personalizeMessage(
      firstMessage.content,
      {
        nome: cart.customer_name,
        valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cart.cart_value),
        produto: getProductsText(cart.cart_items),
        link_carrinho: `https://loja.com.br/carrinho?id=${cart.external_id}`
      }
    );
    
    // 7. Criar o registro da mensagem agendada
    const { data: sentMessage, error: sentError } = await supabase
      .from('sent_messages')
      .insert([{
        flow_id: flow.id,
        flow_message_id: firstMessage.id,
        cart_id: cartId,
        instance_id: instance.id,
        status: 'scheduled',
        content: personalizedContent,
        scheduled_for: scheduledTime.toISOString()
      }])
      .select();
    
    if (sentError) {
      console.error('Error scheduling message:', sentError);
      return;
    }
    
    // 8. Atualizar o status do carrinho
    const { error: updateError } = await supabase
      .from('abandoned_carts')
      .update({ 
        recovery_status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', cartId);
    
    if (updateError) {
      console.error('Error updating cart status:', updateError);
      return;
    }
    
    console.log(`Recovery process started for cart ${cartId}. First message scheduled for ${scheduledTime.toISOString()}`);
    
  } catch (error) {
    console.error('Error in recovery process:', error);
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
  
  if (items.length === 1) {
    return items[0].name || 'Produto';
  }
  
  const productNames = items.map(item => item.name).filter(Boolean);
  
  if (productNames.length <= 2) {
    return productNames.join(' e ');
  } else {
    const lastProduct = productNames.pop();
    return `${productNames.join(', ')} e ${lastProduct}`;
  }
}