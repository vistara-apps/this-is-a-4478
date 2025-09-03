import { logError } from '../utils/errorHandler'

/**
 * Export photos to a file
 * @param {Array} photos - Photos to export
 * @param {string} format - Export format (csv, json)
 * @param {string} filename - Export filename
 * @returns {boolean} - Success status
 */
export function exportPhotos(photos, format = 'csv', filename = 'photos') {
  try {
    if (!photos || photos.length === 0) {
      throw new Error('No photos to export')
    }
    
    if (format === 'csv') {
      return exportToCsv(photos, filename, [
        'photoId',
        'claimId',
        'originalFileName',
        'detectedDamageTypes',
        'objectCategory',
        'sceneContext',
        'uploadedAt',
      ])
    } else {
      return exportToJson(photos, filename)
    }
  } catch (error) {
    logError(error, 'exportPhotos')
    return false
  }
}

/**
 * Export claims to a file
 * @param {Array} claims - Claims to export
 * @param {string} format - Export format (csv, json)
 * @param {string} filename - Export filename
 * @returns {boolean} - Success status
 */
export function exportClaims(claims, format = 'csv', filename = 'claims') {
  try {
    if (!claims || claims.length === 0) {
      throw new Error('No claims to export')
    }
    
    if (format === 'csv') {
      return exportToCsv(claims, filename, [
        'claimId',
        'claimNumber',
        'description',
        'incidentDate',
        'policyNumber',
        'claimType',
        'status',
        'createdAt',
        'updatedAt',
      ])
    } else {
      return exportToJson(claims, filename)
    }
  } catch (error) {
    logError(error, 'exportClaims')
    return false
  }
}

/**
 * Export a complete claim with photos
 * @param {object} claim - Claim to export
 * @param {Array} photos - Photos to export
 * @param {string} format - Export format (csv, json)
 * @param {string} filename - Export filename
 * @returns {boolean} - Success status
 */
export function exportCompleteClaim(claim, photos, format = 'json', filename = 'claim') {
  try {
    if (!claim) {
      throw new Error('No claim to export')
    }
    
    const data = {
      claim,
      photos: photos || [],
    }
    
    return exportToJson(data, filename)
  } catch (error) {
    logError(error, 'exportCompleteClaim')
    return false
  }
}

/**
 * Export user data to a file
 * @param {object} user - User data
 * @param {Array} claims - Claims to export
 * @param {Array} photos - Photos to export
 * @param {string} format - Export format (json only)
 * @param {string} filename - Export filename
 * @returns {boolean} - Success status
 */
export function exportUserData(user, claims, photos, format = 'json', filename = 'user-data') {
  try {
    if (!user) {
      throw new Error('No user data to export')
    }
    
    // Remove sensitive data
    const userData = { ...user }
    delete userData.password
    delete userData.auth_token
    
    const data = {
      user: userData,
      claims: claims || [],
      photos: photos || [],
    }
    
    return exportToJson(data, filename)
  } catch (error) {
    logError(error, 'exportUserData')
    return false
  }
}

/**
 * Export data to CSV
 * @param {Array} data - Data to export
 * @param {string} filename - Export filename
 * @param {Array} fields - Fields to include
 * @returns {boolean} - Success status
 */
function exportToCsv(data, filename, fields) {
  try {
    // Create CSV header
    let csv = fields.join(',') + '\\n'
    
    // Add data rows
    data.forEach(item => {
      const row = fields.map(field => {
        const value = item[field]
        
        // Handle arrays
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"` // Wrap in quotes and join with semicolons
        }
        
        // Handle dates
        if (field.includes('Date') || field.includes('At')) {
          if (value) {
            const date = new Date(value)
            if (!isNaN(date)) {
              return date.toISOString()
            }
          }
        }
        
        // Handle strings with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        
        return value || ''
      }).join(',')
      
      csv += row + '\\n'
    })
    
    // Create and download file
    downloadFile(csv, `${filename}.csv`, 'text/csv')
    
    return true
  } catch (error) {
    logError(error, 'exportToCsv')
    return false
  }
}

/**
 * Export data to JSON
 * @param {object|Array} data - Data to export
 * @param {string} filename - Export filename
 * @returns {boolean} - Success status
 */
function exportToJson(data, filename) {
  try {
    const json = JSON.stringify(data, null, 2)
    downloadFile(json, `${filename}.json`, 'application/json')
    return true
  } catch (error) {
    logError(error, 'exportToJson')
    return false
  }
}

/**
 * Download a file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} contentType - Content type
 */
function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  
  URL.revokeObjectURL(url)
}

