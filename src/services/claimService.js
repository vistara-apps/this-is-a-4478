import { supabase, isDemoMode } from './supabaseClient'
import { logError } from '../utils/errorHandler'

/**
 * Create a new claim
 * @param {object} claimData - Claim data
 * @returns {Promise<object>} - Create result
 */
export async function createClaim(claimData) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock claim
      return {
        data: {
          claimId: `claim_${Date.now()}`,
          ...claimData,
        },
        error: null,
      }
    }
    
    return await supabase
      .from('claims')
      .insert(claimData)
      .select()
      .single()
  } catch (error) {
    logError(error, 'createClaim')
    return { data: null, error }
  }
}

/**
 * Get a claim by ID
 * @param {string} claimId - Claim ID
 * @returns {Promise<object>} - Claim result
 */
export async function getClaimById(claimId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock claim
      return {
        data: {
          claimId,
          claimNumber: 'INS-12345',
          userId: 'demo-user-id',
          description: 'Vehicle damage from accident',
          incidentDate: '2024-01-10',
          policyNumber: 'POL-67890',
          claimType: 'vehicle',
          status: 'pending',
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
        },
        error: null,
      }
    }
    
    return await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single()
  } catch (error) {
    logError(error, 'getClaimById')
    return { data: null, error }
  }
}

/**
 * Get claims for a user
 * @param {string} userId - User ID
 * @param {object} options - Query options
 * @returns {Promise<object>} - Claims result
 */
export async function getUserClaims(userId, options = {}) {
  try {
    const {
      limit = 10,
      offset = 0,
      orderBy = 'createdAt',
      order = 'desc',
    } = options
    
    if (isDemoMode()) {
      // In demo mode, return mock claims
      const mockClaims = [
        {
          claimId: 'claim_1',
          claimNumber: 'INS-12345',
          userId: 'demo-user-id',
          description: 'Vehicle damage from accident',
          incidentDate: '2024-01-10',
          policyNumber: 'POL-67890',
          claimType: 'vehicle',
          status: 'pending',
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
          photoCount: 3,
        },
        {
          claimId: 'claim_2',
          claimNumber: 'INS-67890',
          userId: 'demo-user-id',
          description: 'Water damage to property',
          incidentDate: '2024-01-05',
          policyNumber: 'POL-12345',
          claimType: 'property',
          status: 'approved',
          createdAt: '2024-01-10T00:00:00.000Z',
          updatedAt: '2024-01-12T00:00:00.000Z',
          photoCount: 5,
        },
        {
          claimId: 'claim_3',
          claimNumber: 'INS-24680',
          userId: 'demo-user-id',
          description: 'Stolen personal items',
          incidentDate: '2024-01-01',
          policyNumber: 'POL-13579',
          claimType: 'personal',
          status: 'rejected',
          createdAt: '2024-01-05T00:00:00.000Z',
          updatedAt: '2024-01-08T00:00:00.000Z',
          photoCount: 2,
        },
      ]
      
      // Sort claims
      const sortedClaims = [...mockClaims].sort((a, b) => {
        if (order === 'asc') {
          return a[orderBy] > b[orderBy] ? 1 : -1
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1
        }
      })
      
      // Paginate claims
      const paginatedClaims = sortedClaims.slice(offset, offset + limit)
      
      return {
        data: paginatedClaims,
        count: mockClaims.length,
        error: null,
      }
    }
    
    // Get claims count
    const { count, error: countError } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (countError) {
      throw countError
    }
    
    // Get claims with pagination
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        photos:photos(count)
      `)
      .eq('user_id', userId)
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)
    
    if (error) {
      throw error
    }
    
    // Format data
    const formattedData = data.map(claim => ({
      ...claim,
      photoCount: claim.photos[0]?.count || 0,
    }))
    
    return {
      data: formattedData,
      count,
      error: null,
    }
  } catch (error) {
    logError(error, 'getUserClaims')
    return { data: null, count: 0, error }
  }
}

/**
 * Update a claim
 * @param {string} claimId - Claim ID
 * @param {object} claimData - Claim data to update
 * @returns {Promise<object>} - Update result
 */
export async function updateClaim(claimId, claimData) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock updated claim
      return {
        data: {
          claimId,
          ...claimData,
          updatedAt: new Date().toISOString(),
        },
        error: null,
      }
    }
    
    return await supabase
      .from('claims')
      .update({
        ...claimData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', claimId)
      .select()
      .single()
  } catch (error) {
    logError(error, 'updateClaim')
    return { data: null, error }
  }
}

/**
 * Delete a claim
 * @param {string} claimId - Claim ID
 * @returns {Promise<object>} - Delete result
 */
export async function deleteClaim(claimId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return success
      return { error: null }
    }
    
    return await supabase
      .from('claims')
      .delete()
      .eq('id', claimId)
  } catch (error) {
    logError(error, 'deleteClaim')
    return { error }
  }
}

/**
 * Get claim statistics
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Statistics result
 */
export async function getClaimStatistics(userId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock statistics
      return {
        data: {
          totalClaims: 34,
          pendingClaims: 12,
          approvedClaims: 18,
          rejectedClaims: 4,
          averageProcessingTime: 2.3,
        },
        error: null,
      }
    }
    
    // Get total claims
    const { count: totalClaims, error: totalError } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (totalError) {
      throw totalError
    }
    
    // Get pending claims
    const { count: pendingClaims, error: pendingError } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending')
    
    if (pendingError) {
      throw pendingError
    }
    
    // Get approved claims
    const { count: approvedClaims, error: approvedError } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'approved')
    
    if (approvedError) {
      throw approvedError
    }
    
    // Get rejected claims
    const { count: rejectedClaims, error: rejectedError } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'rejected')
    
    if (rejectedError) {
      throw rejectedError
    }
    
    // Calculate average processing time
    const { data: processedClaims, error: processedError } = await supabase
      .from('claims')
      .select('created_at, updated_at')
      .eq('user_id', userId)
      .or('status.eq.approved,status.eq.rejected')
    
    if (processedError) {
      throw processedError
    }
    
    let averageProcessingTime = 0
    
    if (processedClaims.length > 0) {
      const totalDays = processedClaims.reduce((total, claim) => {
        const createdAt = new Date(claim.created_at)
        const updatedAt = new Date(claim.updated_at)
        const days = (updatedAt - createdAt) / (1000 * 60 * 60 * 24)
        return total + days
      }, 0)
      
      averageProcessingTime = totalDays / processedClaims.length
    }
    
    return {
      data: {
        totalClaims,
        pendingClaims,
        approvedClaims,
        rejectedClaims,
        averageProcessingTime,
      },
      error: null,
    }
  } catch (error) {
    logError(error, 'getClaimStatistics')
    return { data: null, error }
  }
}

