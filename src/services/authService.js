import { supabase, isDemoMode, getSession, getUser } from './supabaseClient'
import { logError } from '../utils/errorHandler'

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - Auth result
 */
export async function signIn(email, password) {
  try {
    if (isDemoMode()) {
      // Check if using demo credentials
      if (email === 'demo@insurance.com' && password === 'demo-password') {
        return {
          data: {
            user: {
              id: 'demo-user-id',
              email: 'demo@insurance.com',
              user_metadata: {
                full_name: 'Demo User',
              },
            },
            session: {
              access_token: 'demo-token',
              expires_at: Date.now() + 3600000, // 1 hour from now
            },
          },
          error: null,
        }
      } else {
        // Demo mode but invalid credentials
        return {
          data: null,
          error: {
            message: 'Invalid login credentials',
          },
        }
      }
    }
    
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  } catch (error) {
    logError(error, 'signIn')
    return { data: null, error }
  }
}

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - Auth result
 */
export async function signUp(email, password) {
  try {
    if (isDemoMode()) {
      // In demo mode, just return success
      return {
        data: {
          user: {
            id: 'demo-user-id',
            email,
            user_metadata: {},
          },
          session: {
            access_token: 'demo-token',
            expires_at: Date.now() + 3600000, // 1 hour from now
          },
        },
        error: null,
      }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (!error && data?.user) {
      // Create user profile
      await createUserProfile(data.user.id, {
        email: data.user.email,
        subscription_tier: 'free',
        monthly_quota: 50,
        used_quota: 0,
      })
    }
    
    return { data, error }
  } catch (error) {
    logError(error, 'signUp')
    return { data: null, error }
  }
}

/**
 * Sign out the current user
 * @returns {Promise<object>} - Sign out result
 */
export async function signOut() {
  try {
    if (isDemoMode()) {
      // In demo mode, just return success
      return { error: null }
    }
    
    return await supabase.auth.signOut()
  } catch (error) {
    logError(error, 'signOut')
    return { error }
  }
}

/**
 * Get the current user session
 * @returns {Promise<object>} - Session result
 */
export async function getCurrentSession() {
  try {
    return await getSession()
  } catch (error) {
    logError(error, 'getCurrentSession')
    return { data: null, error }
  }
}

/**
 * Get the current user
 * @returns {Promise<object>} - User result
 */
export async function getCurrentUser() {
  try {
    return await getUser()
  } catch (error) {
    logError(error, 'getCurrentUser')
    return { data: null, error }
  }
}

/**
 * Create a user profile
 * @param {string} userId - User ID
 * @param {object} profileData - Profile data
 * @returns {Promise<object>} - Create result
 */
export async function createUserProfile(userId, profileData) {
  try {
    if (isDemoMode()) {
      // In demo mode, just return success
      return {
        data: {
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        error: null,
      }
    }
    
    return await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
  } catch (error) {
    logError(error, 'createUserProfile')
    return { data: null, error }
  }
}

/**
 * Get a user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Profile result
 */
export async function getUserProfile(userId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock profile
      return {
        data: {
          id: userId,
          email: 'demo@insurance.com',
          subscription_tier: 'pro',
          monthly_quota: 500,
          used_quota: 127,
          notification_settings: {
            email_notifications: true,
            analysis_complete: true,
            monthly_reports: true,
            product_updates: false,
          },
          display_settings: {
            theme: 'light',
            gallery_view: 'grid',
            items_per_page: 12,
          },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
        error: null,
      }
    }
    
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  } catch (error) {
    logError(error, 'getUserProfile')
    return { data: null, error }
  }
}

/**
 * Update a user profile
 * @param {string} userId - User ID
 * @param {object} profileData - Profile data to update
 * @returns {Promise<object>} - Update result
 */
export async function updateUserProfile(userId, profileData) {
  try {
    if (isDemoMode()) {
      // In demo mode, just return success
      return {
        data: {
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString(),
        },
        error: null,
      }
    }
    
    return await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()
  } catch (error) {
    logError(error, 'updateUserProfile')
    return { data: null, error }
  }
}

/**
 * Reset password
 * @param {string} email - User email
 * @returns {Promise<object>} - Reset result
 */
export async function resetPassword(email) {
  try {
    if (isDemoMode()) {
      // In demo mode, just return success
      return { error: null }
    }
    
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  } catch (error) {
    logError(error, 'resetPassword')
    return { error }
  }
}

/**
 * Update password
 * @param {string} password - New password
 * @returns {Promise<object>} - Update result
 */
export async function updatePassword(password) {
  try {
    if (isDemoMode()) {
      // In demo mode, just return success
      return { data: {}, error: null }
    }
    
    return await supabase.auth.updateUser({
      password,
    })
  } catch (error) {
    logError(error, 'updatePassword')
    return { data: null, error }
  }
}

