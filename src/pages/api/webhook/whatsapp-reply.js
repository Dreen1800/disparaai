// src/pages/api/webhook/whatsapp-reply.js
import { supabase } from '../../../lib/supabase';
import { messageService } from '../../../services/messageService';
import { cartService } from '../../../services/cartService';
import { analyticsService } from '../../../services/analyticsService';

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
    if (!payload.phone || !payload.message || !payload.instanceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Processar a mensagem recebida
    await processReceivedMessage(userId, payload);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Message received and processed'
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Processa uma mensagem recebida
 */
async function processReceivedMessage(userId, payload) {
  const { instanceId, phone, message, timestamp } = payload;
  
  try {
    // Buscar a instância
    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();
    
    if (instanceError || !instance) {
      console.error(`Instance ${instanceId} not found.`);
      return;
    }
    
    // Buscar carrinhos abandonados para este cliente
    const { data: carts, error: cartError } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('user_id', userId)
      .eq('customer_phone', phone)
      .eq('recovery_status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (cartError) {
      console.error('Error fetching cart:', cartError);
      return;
    }
    
    // Se não temos nenhum carrinho em andamento, registrar apenas a mensagem
    if (!carts || carts.length === 0) {
      await messageService.createReceivedMessage({
        instance_id: instanceId,
        customer_phone: phone,
        content: message,
        received_at: timestamp || new Date().toISOString()
      });
      return;
    }
    
    const cart = carts[0];
    
    // Registrar a mensagem recebida
    await messageService.createReceivedMessage({
      cart_id: cart.id,
      instance_id: instanceId,
      customer_phone: phone,
      content: message,
      received_at: timestamp || new Date().toISOString()
    });
    
    // Atualizar analytics
    const today = new Date().toISOString().split('T')[0];
    await analyticsService.createAnalyticsEntry({
      user_id: userId,
      date: today,
      responses_received: 1
    });
    
    // Analisar o conteúdo da mensagem para identificar intenção do cliente
    const lowerMessage = message.toLowerCase();
    
    // Verificar se o cliente deseja finalizar a compra
    if (
      lowerMessage.includes('sim') || 
      lowerMessage.includes('quero') || 
      lowerMessage.includes('comprar') || 
      lowerMessage.includes('finalizar') || 
      lowerMessage.includes('confirmar')
    ) {
      // Atualizar status do carrinho para 'recovered'
      await cartService.updateCartStatus(cart.id, 'recovered');
      
      // Registrar recuperação em analytics
      await analyticsService.createAnalyticsEntry({
        user_id: userId,
        date: today,
        carts_recovered: 1,
        revenue_recovered: parseFloat(cart.cart_value) || 0
      });
      
      console.log(`Cart ${cart.id} marked as recovered.`);
    }
    
  } catch (error) {
    console.error('Error processing received message:', error);
  }
}