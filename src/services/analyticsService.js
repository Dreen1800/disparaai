// src/services/analyticsService.js
import { supabase } from '../lib/supabase';

export const analyticsService = {
  // Obter dados de analytics por período
  async getAnalyticsByDateRange(userId, startDate, endDate) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Obter analytics por fluxo
  async getAnalyticsByFlow(userId, flowId, startDate, endDate) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .eq('flow_id', flowId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Obter resumo de analytics para um usuário
  async getAnalyticsSummary(userId, days = 30) {
    // Calcular data de início
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('analytics')
      .select(`
        sum(messages_sent) as total_sent,
        sum(messages_delivered) as total_delivered,
        sum(messages_read) as total_read,
        sum(responses_received) as total_responses,
        sum(carts_recovered) as total_recovered,
        sum(revenue_recovered) as total_revenue
      `)
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0]);
    
    if (error) throw error;
    return data[0];
  },
  
  // Obter taxas de conversão
  async getConversionRates(userId, days = 30) {
    const summary = await this.getAnalyticsSummary(userId, days);
    
    if (!summary) return null;
    
    const conversionRates = {
      deliveryRate: summary.total_sent > 0 ? (summary.total_delivered / summary.total_sent) * 100 : 0,
      readRate: summary.total_delivered > 0 ? (summary.total_read / summary.total_delivered) * 100 : 0,
      responseRate: summary.total_read > 0 ? (summary.total_responses / summary.total_read) * 100 : 0,
      recoveryRate: summary.total_sent > 0 ? (summary.total_recovered / summary.total_sent) * 100 : 0,
      averageRevenue: summary.total_recovered > 0 ? summary.total_revenue / summary.total_recovered : 0
    };
    
    return conversionRates;
  },
  
  // Registrar um item de analytics
  async createAnalyticsEntry(analyticsData) {
    // Verificar se já existe um registro para esta data e fluxo
    const { data: existingData, error: checkError } = await supabase
      .from('analytics')
      .select('id')
      .eq('user_id', analyticsData.user_id)
      .eq('date', analyticsData.date)
      .eq('flow_id', analyticsData.flow_id || null);
    
    if (checkError) throw checkError;
    
    if (existingData && existingData.length > 0) {
      // Atualizar registro existente
      const { data, error } = await supabase
        .from('analytics')
        .update({
          messages_sent: supabase.rpc('increment', { x: analyticsData.messages_sent || 0 }),
          messages_delivered: supabase.rpc('increment', { x: analyticsData.messages_delivered || 0 }),
          messages_read: supabase.rpc('increment', { x: analyticsData.messages_read || 0 }),
          responses_received: supabase.rpc('increment', { x: analyticsData.responses_received || 0 }),
          carts_recovered: supabase.rpc('increment', { x: analyticsData.carts_recovered || 0 }),
          revenue_recovered: supabase.rpc('increment', { x: analyticsData.revenue_recovered || 0 }),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData[0].id)
        .select();
      
      if (error) throw error;
      return data[0];
    } else {
      // Criar novo registro
      const { data, error } = await supabase
        .from('analytics')
        .insert([analyticsData])
        .select();
      
      if (error) throw error;
      return data[0];
    }
  }
};