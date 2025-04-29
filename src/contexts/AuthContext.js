// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/AuthService'; // changed from '../services/authService'
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUserFromSupabase() {
      try {
        setLoading(true);
        
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Buscar dados do usuário da tabela users
          try {
            const userProfile = await authService.getUserProfile(session.user.id);
            setUser({
              ...session.user,
              profile: userProfile
            });
          } catch (profileError) {
            console.error('Erro ao carregar perfil:', profileError);
            setUser(session.user);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserFromSupabase();
    
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Buscar dados do usuário da tabela users
          try {
            const userProfile = await authService.getUserProfile(session.user.id);
            setUser({
              ...session.user,
              profile: userProfile
            });
          } catch (profileError) {
            console.error('Erro ao carregar perfil:', profileError);
            setUser(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user, session } = await authService.signInWithEmail(email, password);
      
      if (user) {
        // Buscar dados do usuário da tabela users
        try {
          const userProfile = await authService.getUserProfile(user.id);
          setUser({
            ...user,
            profile: userProfile
          });
        } catch (profileError) {
          console.error('Erro ao carregar perfil:', profileError);
          setUser(user);
        }
      }
      
      return { user, session };
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user, session } = await authService.signUpWithEmail(email, password, userData);
      
      // Normalmente, o usuário precisará confirmar o email antes de fazer login
      return { user, session };
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signOut();
      setUser(null);
    } catch (err) {
      console.error('Erro no logout:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Recuperar senha
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.resetPassword(email);
    } catch (err) {
      console.error('Erro na recuperação de senha:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil do usuário
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) throw new Error('Usuário não autenticado');
      
      const updatedProfile = await authService.updateUserProfile(user.id, profileData);
      
      setUser(current => ({
        ...current,
        profile: updatedProfile
      }));
      
      return updatedProfile;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}