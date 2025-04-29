// src/services/flowService.js
import { supabase } from '../lib/supabase';

export const flowService = {
  // Buscar todos os fluxos do usuário
  async getAllFlows(userId) {
    const { data, error } = await supabase
      .from('recovery_flows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Buscar fluxos por status
  async getFlowsByStatus(userId, status) {
    const { data, error } = await supabase
      .from('recovery_flows')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Buscar um fluxo específico com suas mensagens
  async getFlowById(id) {
    const { data: flow, error: flowError } = await supabase
      .from('recovery_flows')
      .select('*')
      .eq('id', id)
      .single();
    
    if (flowError) throw flowError;
    
    const { data: messages, error: msgError } = await supabase
      .from('flow_messages')
      .select('*')
      .eq('flow_id', id)
      .order('sequence_order', { ascending: true });
    
    if (msgError) throw msgError;
    
    return { ...flow, messages };
  },
  
  // Criar um novo fluxo
  async createFlow(flowData) {
    // Garantir que temos um settings JSON se não foi fornecido
    const dataToInsert = {
      ...flowData,
      settings: flowData.settings || {}
    };
    
    const { data, error } = await supabase
      .from('recovery_flows')
      .insert([dataToInsert])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar um fluxo existente
  async updateFlow(id, flowData) {
    const { data, error } = await supabase
      .from('recovery_flows')
      .update({
        ...flowData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar status de um fluxo
  async updateFlowStatus(id, status) {
    const { data, error } = await supabase
      .from('recovery_flows')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir um fluxo
  async deleteFlow(id) {
    const { error } = await supabase
      .from('recovery_flows')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Duplicar um fluxo
  async duplicateFlow(id) {
    // Buscar o fluxo original com mensagens
    const original = await this.getFlowById(id);
    
    // Criar novo fluxo baseado no original
    const newFlowData = {
      name: `${original.name} (Cópia)`,
      user_id: original.user_id,
      status: 'draft',
      settings: original.settings || {}
    };
    
    const newFlow = await this.createFlow(newFlowData);
    
    // Duplicar mensagens
    if (original.messages && original.messages.length > 0) {
      for (const message of original.messages) {
        await this.addFlowMessage(newFlow.id, {
          name: message.name,
          content: message.content,
          delay_hours: message.delay_hours,
          sequence_order: message.sequence_order
        });
      }
    }
    
    return this.getFlowById(newFlow.id);
  },
  
  // Buscar todas as mensagens de um fluxo
  async getFlowMessages(flowId) {
    const { data, error } = await supabase
      .from('flow_messages')
      .select('*')
      .eq('flow_id', flowId)
      .order('sequence_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Adicionar mensagem a um fluxo
  async addFlowMessage(flowId, messageData) {
    const { data, error } = await supabase
      .from('flow_messages')
      .insert([{ 
        ...messageData, 
        flow_id: flowId 
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Adicionar múltiplas mensagens a um fluxo
  async addFlowMessages(flowId, messages) {
    const messagesWithFlowId = messages.map(msg => ({
      ...msg,
      flow_id: flowId
    }));
    
    const { data, error } = await supabase
      .from('flow_messages')
      .insert(messagesWithFlowId)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Atualizar mensagem de um fluxo
  async updateFlowMessage(id, messageData) {
    const { data, error } = await supabase
      .from('flow_messages')
      .update({
        ...messageData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir uma mensagem
  async deleteFlowMessage(id) {
    const { error } = await supabase
      .from('flow_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Reordenar mensagens de um fluxo
  async reorderFlowMessages(flowId, messagesOrder) {
    // messagesOrder é um array de objetos { id, sequence_order }
    const updates = messagesOrder.map(item => 
      supabase
        .from('flow_messages')
        .update({ sequence_order: item.sequence_order })
        .eq('id', item.id)
    );
    
    await Promise.all(updates);
    
    // Buscar mensagens atualizadas
    const { data, error } = await supabase
      .from('flow_messages')
      .select('*')
      .eq('flow_id', flowId)
      .order('sequence_order', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};