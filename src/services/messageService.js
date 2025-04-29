// src/services/messageService.js
import { supabase } from '../lib/supabase';

export const messageService = {
  // Obter todas as mensagens enviadas
  async getAllSentMessages(userId) {
    const { data, error } = await supabase
      .from('sent_messages')
      .select(`
        *,
        recovery_flows!inner(*),
        whatsapp_instances(*),
        abandoned_carts(*),
        flow_messages(*)
      `)
      .eq('recovery_flows.user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter mensagens por status
  async getMessagesByStatus(userId, status) {
    const { data, error } = await supabase
      .from('sent_messages')
      .select(`
        *,
        recovery_flows!inner(*),
        whatsapp_instances(*),
        abandoned_carts(*),
        flow_messages(*)
      `)
      .eq('recovery_flows.user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter mensagens agendadas para hoje
  async getTodayScheduledMessages(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('sent_messages')
      .select(`
        *,
        recovery_flows!inner(*),
        whatsapp_instances(*),
        abandoned_carts(*),
        flow_messages(*)
      `)
      .eq('recovery_flows.user_id', userId)
      .eq('status', 'scheduled')
      .gte('scheduled_for', startOfDay.toISOString())
      .lte('scheduled_for', endOfDay.toISOString())
      .order('scheduled_for', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Obter mensagem por ID
  async getMessageById(id) {
    const { data, error } = await supabase
      .from('sent_messages')
      .select(`
        *,
        recovery_flows(*),
        whatsapp_instances(*),
        abandoned_carts(*),
        flow_messages(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar uma nova mensagem agendada
  async createMessage(messageData) {
    const { data, error } = await supabase
      .from('sent_messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar uma mensagem existente
  async updateMessage(id, messageData) {
    const { data, error } = await supabase
      .from('sent_messages')
      .update({
        ...messageData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar status de uma mensagem
  async updateMessageStatus(id, status, statusData = {}) {
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      ...statusData
    };
    
    // Adicionar campos específicos baseados no status
    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    } else if (status === 'read') {
      updateData.read_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('sent_messages')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Cancelar uma mensagem agendada
  async cancelScheduledMessage(id) {
    const { error } = await supabase
      .from('sent_messages')
      .delete()
      .eq('id', id)
      .eq('status', 'scheduled');
    
    if (error) throw error;
    return true;
  },
  
  // Obter estatísticas de mensagens (contagem por status)
  async getMessageStats(userId) {
    const { data, error } = await supabase
      .from('sent_messages')
      .select(`
        status, count(*)
      `)
      .eq('recovery_flows.user_id', userId)
      .group('status');
    
    if (error) throw error;
    return data;
  },
  
  // Obter mensagens de um fluxo específico
  async getMessagesByFlow(flowId) {
    const { data, error } = await supabase
      .from('sent_messages')
      .select(`
        *,
        whatsapp_instances(*),
        abandoned_carts(*),
        flow_messages(*)
      `)
      .eq('flow_id', flowId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter mensagens de um carrinho específico
  async getMessagesByCart(cartId) {
    const { data, error } = await supabase
      .from('sent_messages')
      .select(`
        *,
        recovery_flows(*),
        whatsapp_instances(*),
        flow_messages(*)
      `)
      .eq('cart_id', cartId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Criar nova mensagem recebida
  async createReceivedMessage(messageData) {
    const { data, error } = await supabase
      .from('received_messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Obter mensagens recebidas por instância
  async getReceivedMessagesByInstance(instanceId) {
    const { data, error } = await supabase
      .from('received_messages')
      .select('*')
      .eq('instance_id', instanceId)
      .order('received_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};