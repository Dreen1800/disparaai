// src/services/flowService.js
import { supabase } from '../lib/supabase'

export const flowService = {
  // Buscar todos os fluxos
  async getAllFlows() {
    const { data, error } = await supabase
      .from('recovery_flows')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  
  // Buscar um fluxo específico com suas mensagens
  async getFlowById(id) {
    const { data: flow, error: flowError } = await supabase
      .from('recovery_flows')
      .select('*')
      .eq('id', id)
      .single()
    
    if (flowError) throw flowError
    
    const { data: messages, error: msgError } = await supabase
      .from('flow_messages')
      .select('*')
      .eq('flow_id', id)
      .order('sequence_order', { ascending: true })
    
    if (msgError) throw msgError
    
    return { ...flow, messages }
  },
  
  // Criar um novo fluxo
  async createFlow(flowData) {
    const { data, error } = await supabase
      .from('recovery_flows')
      .insert([flowData])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  // Atualizar um fluxo existente
  async updateFlow(id, flowData) {
    const { data, error } = await supabase
      .from('recovery_flows')
      .update(flowData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  // Adicionar mensagem a um fluxo
  async addFlowMessage(flowId, messageData) {
    const { data, error } = await supabase
      .from('flow_messages')
      .insert([{ ...messageData, flow_id: flowId }])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  // Atualizar mensagem de um fluxo
  async updateFlowMessage(id, messageData) {
    const { data, error } = await supabase
      .from('flow_messages')
      .update(messageData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  // Excluir uma mensagem
  async deleteFlowMessage(id) {
    const { error } = await supabase
      .from('flow_messages')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}