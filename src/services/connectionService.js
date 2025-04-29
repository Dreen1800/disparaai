// src/services/connectionService.js
import { supabase } from '../lib/supabase';

export const connectionService = {
  // Obter todas as conexões do usuário
  async getAllConnections(userId) {
    const { data, error } = await supabase
      .from('whatsapp_connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter conexão por ID
  async getConnectionById(id) {
    const { data, error } = await supabase
      .from('whatsapp_connections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Obter conexões por tipo
  async getConnectionsByType(userId, type) {
    const { data, error } = await supabase
      .from('whatsapp_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Criar uma nova conexão
  async createConnection(connectionData) {
    const { data, error } = await supabase
      .from('whatsapp_connections')
      .insert([connectionData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar uma conexão existente
  async updateConnection(id, connectionData) {
    const { data, error } = await supabase
      .from('whatsapp_connections')
      .update({
        ...connectionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar status de uma conexão
  async updateConnectionStatus(id, status) {
    const { data, error } = await supabase
      .from('whatsapp_connections')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir uma conexão
  async deleteConnection(id) {
    const { error } = await supabase
      .from('whatsapp_connections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Obter todas as instâncias de uma conexão
  async getInstancesByConnection(connectionId) {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter todas as instâncias de um usuário
  async getAllInstances(userId) {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .select(`
        *,
        whatsapp_connections!inner(*)
      `)
      .eq('whatsapp_connections.user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter instância por ID
  async getInstanceById(id) {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .select(`
        *,
        whatsapp_connections(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar uma nova instância
  async createInstance(instanceData) {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .insert([instanceData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar uma instância existente
  async updateInstance(id, instanceData) {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .update({
        ...instanceData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar status de uma instância
  async updateInstanceStatus(id, status, qrCodeUrl = null) {
    const updateData = {
      status,
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (qrCodeUrl) {
      updateData.qr_code_url = qrCodeUrl;
    }
    
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir uma instância
  async deleteInstance(id) {
    const { error } = await supabase
      .from('whatsapp_instances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Incrementar contador de mensagens de uma instância
  async incrementInstanceMessageCount(id) {
    const instance = await this.getInstanceById(id);
    
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .update({
        messages_count: (instance.messages_count || 0) + 1,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};