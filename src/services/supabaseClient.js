import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Check if the app is running in demo mode
 * @returns {boolean} - True if in demo mode, false otherwise
 */
export function isDemoMode() {
  return import.meta.env.VITE_DEMO_MODE === 'true' || !supabaseUrl || supabaseUrl === 'https://example.supabase.co'
}

/**
 * Get the current user session
 * @returns {Promise<object>} - User session
 */
export async function getSession() {
  if (isDemoMode()) {
    // Return mock session for demo mode
    return {
      data: {
        session: {
          user: {
            id: 'demo-user-id',
            email: 'demo@insurance.com',
            user_metadata: {
              full_name: 'Demo User',
            },
          },
        },
      },
      error: null,
    }
  }
  
  return await supabase.auth.getSession()
}

/**
 * Get the current user
 * @returns {Promise<object>} - User object
 */
export async function getUser() {
  if (isDemoMode()) {
    // Return mock user for demo mode
    return {
      data: {
        user: {
          id: 'demo-user-id',
          email: 'demo@insurance.com',
          user_metadata: {
            full_name: 'Demo User',
          },
        },
      },
      error: null,
    }
  }
  
  return await supabase.auth.getUser()
}

/**
 * Upload a file to Supabase Storage
 * @param {File} file - File to upload
 * @param {string} path - Storage path
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result
 */
export async function uploadFile(file, path, options = {}) {
  if (isDemoMode()) {
    // Return mock upload result for demo mode
    return {
      data: {
        path: `${path}/${file.name}`,
        fullPath: `https://example.supabase.co/storage/v1/object/public/${path}/${file.name}`,
      },
      error: null,
    }
  }
  
  return await supabase.storage
    .from('photos')
    .upload(`${path}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
      ...options,
    })
}

/**
 * Get a public URL for a file in Supabase Storage
 * @param {string} path - Storage path
 * @returns {string} - Public URL
 */
export function getPublicUrl(path) {
  if (isDemoMode()) {
    // Return mock URL for demo mode
    return `https://example.supabase.co/storage/v1/object/public/${path}`
  }
  
  return supabase.storage.from('photos').getPublicUrl(path).data.publicUrl
}

/**
 * Delete a file from Supabase Storage
 * @param {string} path - Storage path
 * @returns {Promise<object>} - Delete result
 */
export async function deleteFile(path) {
  if (isDemoMode()) {
    // Return mock delete result for demo mode
    return {
      data: { path },
      error: null,
    }
  }
  
  return await supabase.storage.from('photos').remove([path])
}

