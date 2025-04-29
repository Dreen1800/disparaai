// src/services/cartService.js
import { supabase } from '../lib/supabase';

export const cartService = {
  // Obter todos os carrinhos abandonados
  async getAllCarts(userId) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter carrinhos por status
  async getCartsByStatus(userId, status) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('user_id', userId)
      .eq('recovery_status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter carrinho por ID
  async getCartById(id) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar um novo carrinho abandonado
  async createCart(cartData) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .insert([cartData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar um carrinho existente
  async updateCart(id, cartData) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .update({
        ...cartData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar status de um carrinho
  async updateCartStatus(id, status) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .update({
        recovery_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir um carrinho
  async deleteCart(id) {
    const { error } = await supabase
      .from('abandoned_carts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Obter estatísticas de recuperação (totais por status)
  async getCartStats(userId) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('recovery_status, count(*)')
      .eq('user_id', userId)
      .group('recovery_status');
    
    if (error) throw error;
    return data;
  },
  
  // Obter valor total de carrinhos recuperados
  async getRecoveredValue(userId) {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('cart_value')
      .eq('user_id', userId)
      .eq('recovery_status', 'recovered');
    
    if (error) throw error;
    
    return data.reduce((total, item) => total + parseFloat(item.cart_value), 0);
  },
  
  // Obter mensagens recebidas para um carrinho
  async getCartReceivedMessages(cartId) {
    const { data, error } = await supabase
      .from('received_messages')
      .select('*')
      .eq('cart_id', cartId)
      .order('received_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};