import { isDemoMode } from './supabaseClient'
import { logError } from '../utils/errorHandler'

/**
 * Analyze an image using OpenAI's API
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<object>} - Analysis results
 */
export async function analyzeImage(imageFile) {
  try {
    // Check if in demo mode
    if (isDemoMode()) {
      return mockAnalyzeImage(imageFile)
    }
    
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile)
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/images/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this insurance claim photo. Identify the type of damage, the object category, and the scene context. Return the results in JSON format with the following structure: { "damage_types": ["type1", "type2"], "object_category": "category", "scene_context": "context", "confidence": 0-100 }'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to analyze image')
    }
    
    const data = await response.json()
    
    // Parse the response to extract the JSON
    const content = data.choices[0]?.message?.content
    if (!content) {
      throw new Error('No analysis results returned')
    }
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid analysis results format')
    }
    
    const analysisResults = JSON.parse(jsonMatch[0])
    
    return {
      damage_types: analysisResults.damage_types || [],
      object_category: analysisResults.object_category || 'Unknown',
      scene_context: analysisResults.scene_context || 'Unknown',
      confidence: analysisResults.confidence || 0,
    }
  } catch (error) {
    logError(error, 'analyzeImage')
    throw error
  }
}

/**
 * Mock image analysis for demo mode
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<object>} - Mock analysis results
 */
function mockAnalyzeImage(imageFile) {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate random analysis results based on file name
      const fileName = imageFile.name.toLowerCase()
      
      let damageTypes = []
      let objectCategory = 'Unknown'
      let sceneContext = 'Unknown'
      
      // Determine object category
      if (fileName.includes('car') || fileName.includes('vehicle') || fileName.includes('auto')) {
        objectCategory = 'Vehicle'
        damageTypes = getRandomItems(['Dent', 'Scratch', 'Paint Damage', 'Glass Damage', 'Impact Damage'], 1, 3)
        sceneContext = getRandomItems(['Outdoor, Clear Weather', 'Outdoor, Overcast', 'Garage', 'Parking Lot'], 1)[0]
      } else if (fileName.includes('house') || fileName.includes('home') || fileName.includes('property')) {
        objectCategory = 'Property'
        damageTypes = getRandomItems(['Water Damage', 'Fire Damage', 'Structural Damage', 'Roof Damage', 'Wind Damage'], 1, 3)
        sceneContext = getRandomItems(['Indoor', 'Outdoor, Residential', 'Outdoor, Commercial'], 1)[0]
      } else if (fileName.includes('item') || fileName.includes('personal')) {
        objectCategory = 'Personal Item'
        damageTypes = getRandomItems(['Broken', 'Scratched', 'Water Damaged', 'Torn', 'Stained'], 1, 2)
        sceneContext = 'Indoor'
      } else {
        // Default to random values
        objectCategory = getRandomItems(['Vehicle', 'Property', 'Personal Item'], 1)[0]
        damageTypes = getRandomItems(['Dent', 'Scratch', 'Water Damage', 'Fire Damage', 'Structural Damage'], 1, 3)
        sceneContext = getRandomItems(['Indoor', 'Outdoor, Clear Weather', 'Outdoor, Overcast'], 1)[0]
      }
      
      // Generate random confidence score between 85 and 98
      const confidence = Math.floor(Math.random() * 14) + 85
      
      resolve({
        damage_types: damageTypes,
        object_category: objectCategory,
        scene_context: sceneContext,
        confidence,
      })
    }, 1500) // Simulate 1.5s delay
  })
}

/**
 * Convert a file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]
      resolve(base64String)
    }
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Get random items from an array
 * @param {Array} array - The array to get items from
 * @param {number} min - Minimum number of items to get
 * @param {number} max - Maximum number of items to get
 * @returns {Array} - Array of random items
 */
function getRandomItems(array, min, max = min) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

