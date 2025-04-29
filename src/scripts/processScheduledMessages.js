// src/scripts/processScheduledMessages.js
import { supabase } from '../lib/supabase';
import { connectionService } from '../services/connectionService';
import { messageService } from '../services/messageService';
import { cartService } from '../services/cartService';
import { analyticsService } from '../services/analyticsService';
import { sendWhatsAppMessage } from '../utils/whatsappSender';

/**
 * Processa mensagens agendadas e as envia
 */
async function processScheduledMessages() {
  console.log('Starting scheduled messages processing...');
  
  try {
    // Buscar mensagens agendadas para o horário atual
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const { data: messages, error } = await supabase
      .from('sent_messages')
      .select(`
        *,
        whatsapp_instances(*),
        abandoned_carts(*),
        flow_messages(*),
        recovery_flows(*)
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_for', now.toISOString())
      .gte('scheduled_for', fiveMinutesAgo.toISOString())
      .order('scheduled_for', { ascending: true });
    
    if (error) {
      console.error('Error fetching scheduled messages:', error);
      return;
    }
    
    console.log(`Found ${messages?.length || 0} messages to process.`);
    
    // Processar cada mensagem
    if (messages && messages.length > 0) {
      for (const message of messages) {
        await processMessage(message);
      }
    }
    
    console.log('Scheduled messages processing completed.');
  } catch (error) {
    console.error('Error in message processing:', error);
  }
}

/**
 * Processa uma mensagem individual
 */
async function processMessage(message) {
  console.log(`Processing message ID: ${message.id}`);
  
  try {
    // Verificar se a instância está ativa
    if (message.whatsapp_instances.status !== 'connected') {
      console.log(`Instance ${message.instance_id} is not connected. Marking message as failed.`);
      await messageService.updateMessageStatus(message.id, 'failed', {
        failed_reason: 'WhatsApp instance not connected'
      });
      return;
    }
    
    // Verificar se o carrinho ainda está em status de recuperação
    if (message.abandoned_carts.recovery_status !== 'in_progress') {
      console.log(`Cart ${message.cart_id} is no longer in recovery process. Skipping message.`);
      await messageService.updateMessageStatus(message.id, 'skipped', {
        failed_reason: 'Cart is no longer in recovery process'
      });
      return;
    }
    
    // Obter dados da conexão WhatsApp
    const instance = await connectionService.getInstanceById(message.instance_id);
    
    if (!instance || !instance.whatsapp_connections) {
      console.log(`Cannot find connection for instance ${message.instance_id}. Marking message as failed.`);
      await messageService.updateMessageStatus(message.id, 'failed', {
        failed_reason: 'WhatsApp connection not found'
      });
      return;
    }
    
    // Enviar mensagem
    const phoneNumber = message.abandoned_carts.customer_phone;
    const content = message.content;
    const connectionType = instance.whatsapp_connections.type;
    
    try {
      // Enviar mensagem usando o serviço apropriado
      const result = await sendWhatsAppMessage(
        connectionType,
        instance,
        phoneNumber,
        content
      );
      
      // Atualizar status da mensagem para 'sent'
      await messageService.updateMessageStatus(message.id, 'sent', {
        sent_at: new Date().toISOString()
      });
      
      // Incrementar contadores de mensagens
      await connectionService.incrementInstanceMessageCount(message.instance_id);
      
      // Registrar atividade em analytics
      const today = new Date().toISOString().split('T')[0];
      await analyticsService.createAnalyticsEntry({
        user_id: instance.whatsapp_connections.user_id,
        flow_id: message.flow_id,
        date: today,
        messages_sent: 1
      });
      
      console.log(`Message ${message.id} sent successfully.`);
      
      // Programar próxima mensagem, se houver
      await scheduleNextMessage(message);
      
    } catch (sendError) {
      console.error(`Error sending message ${message.id}:`, sendError);
      
      await messageService.updateMessageStatus(message.id, 'failed', {
        failed_reason: sendError.message || 'Error sending message'
      });
    }
    
  } catch (error) {
    console.error(`Error processing message ${message.id}:`, error);
    
    // Marcar mensagem como falha em caso de erro
    await messageService.updateMessageStatus(message.id, 'failed', {
      failed_reason: error.message || 'Error processing message'
    });
  }
}

/**
 * Agenda a próxima mensagem do fluxo, se houver
 */
async function scheduleNextMessage(currentMessage) {
  try {
    // Buscar a próxima mensagem do fluxo
    const currentSequence = currentMessage.flow_messages.sequence_order;
    
    const { data: nextMessages, error } = await supabase
      .from('flow_messages')
      .select('*')
      .eq('flow_id', currentMessage.flow_id)
      .eq('sequence_order', currentSequence + 1)
      .limit(1);
    
    if (error || !nextMessages || nextMessages.length === 0) {
      console.log(`No next message found for flow ${currentMessage.flow_id}.`);
      return;
    }
    
    const nextMessage = nextMessages[0];
    
    // Calcular horário de envio
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + (nextMessage.delay_hours * 60 * 60 * 1000));
    
    // Agendar a próxima mensagem
    await messageService.createMessage({
      flow_id: currentMessage.flow_id,
      flow_message_id: nextMessage.id,
      cart_id: currentMessage.cart_id,
      instance_id: currentMessage.instance_id,
      status: 'scheduled',
      content: nextMessage.content, // Personalizar aqui para substituir variáveis
      scheduled_for: scheduledTime.toISOString()
    });
    
    console.log(`Next message for flow ${currentMessage.flow_id} scheduled for ${scheduledTime.toISOString()}.`);
    
  } catch (error) {
    console.error('Error scheduling next message:', error);
  }
}

// Executar o processador
processScheduledMessages();