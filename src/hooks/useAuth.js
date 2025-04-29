// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obter sessão atual
    const getSession = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      setUser(session?.user || null)
      setLoading(false)
      
      // Ouvir mudanças de autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null)
        }
      )
      
      return () => subscription.unsubscribe()
    }
    
    getSession()
  }, [])
  
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  }
  
  const signUp = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  }
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  
  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}