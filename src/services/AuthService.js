// src/services/authService.js
import { supabase } from '../lib/supabase';

export const authService = {
  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Obter perfil do usuário com dados adicionais
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Atualizar perfil do usuário
  async updateUserProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Login com email e senha
  async signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Cadastro com email e senha
  async signUpWithEmail(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    
    // Criar registro na tabela users
    if (data.user) {
      await this.createUserRecord(data.user.id, email, userData);
    }
    
    return data;
  },
  
  // Criar registro do usuário na tabela users
  async createUserRecord(userId, email, userData) {
    const { error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email,
        full_name: userData?.full_name || '',
        avatar_url: userData?.avatar_url || null
      }]);
    
    if (error) throw error;
    return true;
  },
  
  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
  
  // Recuperação de senha
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Atualizar senha
  async updatePassword(password) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
    return data;
  }
};