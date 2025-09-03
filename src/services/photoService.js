import { supabase, isDemoMode, uploadFile, getPublicUrl, deleteFile } from './supabaseClient'
import { analyzeImage } from './aiService'
import { logError } from '../utils/errorHandler'

/**
 * Upload and analyze a photo
 * @param {File} photoFile - Photo file
 * @param {string} claimId - Claim ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Upload result
 */
export async function uploadAndAnalyzePhoto(photoFile, claimId, userId) {
  try {
    // Analyze photo with AI
    const analysisResults = await analyzeImage(photoFile)
    
    // Upload photo to storage
    const path = `${userId}/${claimId}`
    const { data: uploadData, error: uploadError } = await uploadFile(photoFile, path)
    
    if (uploadError) {
      throw uploadError
    }
    
    // Get public URL
    const imageUrl = getPublicUrl(uploadData.path)
    
    // Create photo record in database
    const photoData = {
      claim_id: claimId,
      user_id: userId,
      image_url: imageUrl,
      storage_path: uploadData.path,
      original_file_name: photoFile.name,
      detected_damage_types: analysisResults.damage_types,
      object_category: analysisResults.object_category,
      scene_context: analysisResults.scene_context,
      analysis_results: analysisResults,
      uploaded_at: new Date().toISOString(),
    }
    
    if (isDemoMode()) {
      // In demo mode, return mock photo
      return {
        data: {
          photoId: `photo_${Date.now()}`,
          ...photoData,
        },
        error: null,
      }
    }
    
    return await supabase
      .from('photos')
      .insert(photoData)
      .select()
      .single()
  } catch (error) {
    logError(error, 'uploadAndAnalyzePhoto')
    return { data: null, error }
  }
}

/**
 * Get a photo by ID
 * @param {string} photoId - Photo ID
 * @returns {Promise<object>} - Photo result
 */
export async function getPhotoById(photoId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock photo
      return {
        data: {
          photoId,
          claimId: 'claim_1',
          userId: 'demo-user-id',
          imageUrl: 'https://example.com/photos/demo-user-id/claim_1/photo_1.jpg',
          storagePath: 'demo-user-id/claim_1/photo_1.jpg',
          originalFileName: 'car_damage_001.jpg',
          detectedDamageTypes: ['Dent', 'Scratch', 'Paint Damage'],
          objectCategory: 'Vehicle',
          sceneContext: 'Outdoor, Clear Weather',
          analysisResults: {
            damage_types: ['Dent', 'Scratch', 'Paint Damage'],
            object_category: 'Vehicle',
            scene_context: 'Outdoor, Clear Weather',
            confidence: 94,
          },
          uploadedAt: '2024-01-15T00:00:00.000Z',
        },
        error: null,
      }
    }
    
    return await supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single()
  } catch (error) {
    logError(error, 'getPhotoById')
    return { data: null, error }
  }
}

/**
 * Get photos for a claim
 * @param {string} claimId - Claim ID
 * @returns {Promise<object>} - Photos result
 */
export async function getClaimPhotos(claimId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock photos
      return {
        data: [
          {
            photoId: 'photo_1',
            claimId,
            userId: 'demo-user-id',
            imageUrl: 'https://example.com/photos/demo-user-id/claim_1/photo_1.jpg',
            storagePath: 'demo-user-id/claim_1/photo_1.jpg',
            originalFileName: 'car_damage_001.jpg',
            detectedDamageTypes: ['Dent', 'Scratch', 'Paint Damage'],
            objectCategory: 'Vehicle',
            sceneContext: 'Outdoor, Clear Weather',
            analysisResults: {
              damage_types: ['Dent', 'Scratch', 'Paint Damage'],
              object_category: 'Vehicle',
              scene_context: 'Outdoor, Clear Weather',
              confidence: 94,
            },
            uploadedAt: '2024-01-15T00:00:00.000Z',
          },
          {
            photoId: 'photo_2',
            claimId,
            userId: 'demo-user-id',
            imageUrl: 'https://example.com/photos/demo-user-id/claim_1/photo_2.jpg',
            storagePath: 'demo-user-id/claim_1/photo_2.jpg',
            originalFileName: 'vehicle_collision.jpg',
            detectedDamageTypes: ['Impact Damage', 'Glass Damage'],
            objectCategory: 'Vehicle',
            sceneContext: 'Outdoor, Overcast',
            analysisResults: {
              damage_types: ['Impact Damage', 'Glass Damage'],
              object_category: 'Vehicle',
              scene_context: 'Outdoor, Overcast',
              confidence: 88,
            },
            uploadedAt: '2024-01-14T00:00:00.000Z',
          },
        ],
        error: null,
      }
    }
    
    return await supabase
      .from('photos')
      .select('*')
      .eq('claim_id', claimId)
      .order('uploaded_at', { ascending: false })
  } catch (error) {
    logError(error, 'getClaimPhotos')
    return { data: null, error }
  }
}

/**
 * Get all photos for a user
 * @param {string} userId - User ID
 * @param {object} options - Query options
 * @returns {Promise<object>} - Photos result
 */
export async function getUserPhotos(userId, options = {}) {
  try {
    const {
      limit = 10,
      offset = 0,
      orderBy = 'uploadedAt',
      order = 'desc',
      objectCategory,
      damageType,
      search,
    } = options
    
    if (isDemoMode()) {
      // In demo mode, return mock photos
      const mockPhotos = [
        {
          photoId: 'photo_1',
          claimId: 'claim_1',
          userId,
          imageUrl: 'https://example.com/photos/demo-user-id/claim_1/photo_1.jpg',
          storagePath: 'demo-user-id/claim_1/photo_1.jpg',
          originalFileName: 'car_damage_001.jpg',
          detectedDamageTypes: ['Dent', 'Scratch', 'Paint Damage'],
          objectCategory: 'Vehicle',
          sceneContext: 'Outdoor, Clear Weather',
          analysisResults: {
            damage_types: ['Dent', 'Scratch', 'Paint Damage'],
            object_category: 'Vehicle',
            scene_context: 'Outdoor, Clear Weather',
            confidence: 94,
          },
          uploadedAt: '2024-01-15T00:00:00.000Z',
        },
        {
          photoId: 'photo_2',
          claimId: 'claim_1',
          userId,
          imageUrl: 'https://example.com/photos/demo-user-id/claim_1/photo_2.jpg',
          storagePath: 'demo-user-id/claim_1/photo_2.jpg',
          originalFileName: 'vehicle_collision.jpg',
          detectedDamageTypes: ['Impact Damage', 'Glass Damage'],
          objectCategory: 'Vehicle',
          sceneContext: 'Outdoor, Overcast',
          analysisResults: {
            damage_types: ['Impact Damage', 'Glass Damage'],
            object_category: 'Vehicle',
            scene_context: 'Outdoor, Overcast',
            confidence: 88,
          },
          uploadedAt: '2024-01-14T00:00:00.000Z',
        },
        {
          photoId: 'photo_3',
          claimId: 'claim_2',
          userId,
          imageUrl: 'https://example.com/photos/demo-user-id/claim_2/photo_3.jpg',
          storagePath: 'demo-user-id/claim_2/photo_3.jpg',
          originalFileName: 'water_damage.jpg',
          detectedDamageTypes: ['Water Damage', 'Structural Damage'],
          objectCategory: 'Property',
          sceneContext: 'Indoor',
          analysisResults: {
            damage_types: ['Water Damage', 'Structural Damage'],
            object_category: 'Property',
            scene_context: 'Indoor',
            confidence: 92,
          },
          uploadedAt: '2024-01-13T00:00:00.000Z',
        },
      ]
      
      // Filter by object category
      let filteredPhotos = [...mockPhotos]
      
      if (objectCategory) {
        filteredPhotos = filteredPhotos.filter(photo => 
          photo.objectCategory === objectCategory
        )
      }
      
      // Filter by damage type
      if (damageType) {
        filteredPhotos = filteredPhotos.filter(photo => 
          photo.detectedDamageTypes.includes(damageType)
        )
      }
      
      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase()
        filteredPhotos = filteredPhotos.filter(photo => 
          photo.originalFileName.toLowerCase().includes(searchLower) ||
          photo.detectedDamageTypes.some(type => type.toLowerCase().includes(searchLower))
        )
      }
      
      // Sort photos
      const sortedPhotos = [...filteredPhotos].sort((a, b) => {
        if (order === 'asc') {
          return a[orderBy] > b[orderBy] ? 1 : -1
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1
        }
      })
      
      // Paginate photos
      const paginatedPhotos = sortedPhotos.slice(offset, offset + limit)
      
      return {
        data: paginatedPhotos,
        count: filteredPhotos.length,
        error: null,
      }
    }
    
    // Build query
    let query = supabase
      .from('photos')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
    
    // Apply filters
    if (objectCategory) {
      query = query.eq('object_category', objectCategory)
    }
    
    if (damageType) {
      query = query.contains('detected_damage_types', [damageType])
    }
    
    if (search) {
      query = query.or(`original_file_name.ilike.%${search}%,detected_damage_types.cs.{${search}}`)
    }
    
    // Get count
    const { count, error: countError } = await query.count()
    
    if (countError) {
      throw countError
    }
    
    // Apply pagination and ordering
    query = query
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)
    
    // Execute query
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    return {
      data,
      count,
      error: null,
    }
  } catch (error) {
    logError(error, 'getUserPhotos')
    return { data: null, count: 0, error }
  }
}

/**
 * Delete a photo
 * @param {string} photoId - Photo ID
 * @returns {Promise<object>} - Delete result
 */
export async function deletePhoto(photoId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return success
      return { error: null }
    }
    
    // Get photo to get storage path
    const { data: photo, error: getError } = await supabase
      .from('photos')
      .select('storage_path')
      .eq('id', photoId)
      .single()
    
    if (getError) {
      throw getError
    }
    
    // Delete from storage
    const { error: deleteStorageError } = await deleteFile(photo.storage_path)
    
    if (deleteStorageError) {
      throw deleteStorageError
    }
    
    // Delete from database
    return await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)
  } catch (error) {
    logError(error, 'deletePhoto')
    return { error }
  }
}

/**
 * Get photo statistics
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Statistics result
 */
export async function getPhotoStatistics(userId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock statistics
      return {
        data: {
          totalPhotos: 127,
          byObjectCategory: {
            Vehicle: 78,
            Property: 42,
            Item: 7,
          },
          byDamageType: {
            Dent: 45,
            Scratch: 38,
            'Water Damage': 22,
            'Glass Damage': 15,
            'Fire Damage': 7,
          },
          averageConfidence: 91.2,
        },
        error: null,
      }
    }
    
    // Get total photos
    const { count: totalPhotos, error: totalError } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (totalError) {
      throw totalError
    }
    
    // Get photos by object category
    const { data: categoryData, error: categoryError } = await supabase
      .from('photos')
      .select('object_category')
      .eq('user_id', userId)
    
    if (categoryError) {
      throw categoryError
    }
    
    const byObjectCategory = {}
    categoryData.forEach(photo => {
      const category = photo.object_category
      byObjectCategory[category] = (byObjectCategory[category] || 0) + 1
    })
    
    // Get photos by damage type
    const { data: damageData, error: damageError } = await supabase
      .from('photos')
      .select('detected_damage_types')
      .eq('user_id', userId)
    
    if (damageError) {
      throw damageError
    }
    
    const byDamageType = {}
    damageData.forEach(photo => {
      photo.detected_damage_types.forEach(type => {
        byDamageType[type] = (byDamageType[type] || 0) + 1
      })
    })
    
    // Calculate average confidence
    const { data: confidenceData, error: confidenceError } = await supabase
      .from('photos')
      .select('analysis_results->confidence')
      .eq('user_id', userId)
    
    if (confidenceError) {
      throw confidenceError
    }
    
    let averageConfidence = 0
    
    if (confidenceData.length > 0) {
      const totalConfidence = confidenceData.reduce((total, photo) => {
        return total + (photo.analysis_results?.confidence || 0)
      }, 0)
      
      averageConfidence = totalConfidence / confidenceData.length
    }
    
    return {
      data: {
        totalPhotos,
        byObjectCategory,
        byDamageType,
        averageConfidence,
      },
      error: null,
    }
  } catch (error) {
    logError(error, 'getPhotoStatistics')
    return { data: null, error }
  }
}

