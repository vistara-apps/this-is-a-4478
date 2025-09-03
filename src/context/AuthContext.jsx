import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentSession, 
  getUserProfile 
} from '../services/authService'
import { isDemoMode } from '../services/supabaseClient'

// Create context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true)
        
        // Check for existing session
        const { data, error } = await getCurrentSession()
        
        if (error) {
          throw error
        }
        
        if (data?.session?.user) {
          setUser(data.session.user)
          
          // Get user profile
          const { data: profileData, error: profileError } = await getUserProfile(data.session.user.id)
          
          if (profileError) {
            throw profileError
          }
          
          if (profileData) {
            setProfile(profileData)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    initializeAuth()
  }, [])

  // Handle user login
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await signIn(email, password)
      
      if (error) {
        throw error
      }
      
      if (data?.user) {
        setUser(data.user)
        
        // Get user profile
        const { data: profileData, error: profileError } = await getUserProfile(data.user.id)
        
        if (profileError) {
          throw profileError
        }
        
        if (profileData) {
          setProfile(profileData)
        }
        
        return { success: true }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Handle user registration
  const register = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await signUp(email, password)
      
      if (error) {
        throw error
      }
      
      if (data?.user) {
        // In a real app, we might not set the user here if email verification is required
        // For this demo, we'll set the user immediately
        setUser(data.user)
        
        // Get user profile (should have been created during signup)
        const { data: profileData, error: profileError } = await getUserProfile(data.user.id)
        
        if (profileError) {
          throw profileError
        }
        
        if (profileData) {
          setProfile(profileData)
        }
        
        return { success: true }
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Handle user logout
  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await signOut()
      
      if (error) {
        throw error
      }
      
      setUser(null)
      setProfile(null)
      
      return { success: true }
    } catch (err) {
      console.error('Logout error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Update user profile in context
  const updateProfile = (newProfile) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      ...newProfile,
    }))
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Check if user is in demo mode
  const isDemoUser = isDemoMode() || (user?.email === 'demo@insurance.com')

  // Context value
  const value = {
    user,
    profile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isDemoUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

