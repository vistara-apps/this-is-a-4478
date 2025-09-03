import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export async function analyzeImage(file) {
  try {
    // Convert file to base64
    const base64Image = await fileToBase64(file)
    
    // For demo purposes, we'll simulate the API call with mock data
    // In production, you would make the actual API call
    
    if (import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'demo-key') {
      // Make actual API call
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this insurance claim photo and provide:
                1. Detected damage types (if any)
                2. Object category (vehicle, property, or item)
                3. Scene context (indoor, outdoor, weather conditions)
                4. Confidence level (1-100)
                
                Return results in JSON format with keys: damageTypes (array), objectCategory (string), sceneContext (string), confidence (number)`
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
      
      const result = JSON.parse(response.choices[0].message.content)
      return result
    } else {
      // Demo mode - return mock analysis
      return getMockAnalysis(file.name)
    }
  } catch (error) {
    console.error('AI Analysis error:', error)
    // Fallback to mock data on error
    return getMockAnalysis(file.name)
  }
}

function getMockAnalysis(fileName) {
  // Generate realistic mock data based on filename patterns
  const mockAnalyses = [
    {
      damageTypes: ['Dent', 'Scratch', 'Paint Damage'],
      objectCategory: 'Vehicle',
      sceneContext: 'Outdoor, Clear Weather',
      confidence: 94,
    },
    {
      damageTypes: ['Water Damage', 'Staining'],
      objectCategory: 'Property',
      sceneContext: 'Indoor, Residential',
      confidence: 87,
    },
    {
      damageTypes: ['Impact Damage', 'Glass Damage'],
      objectCategory: 'Vehicle',
      sceneContext: 'Outdoor, Overcast',
      confidence: 92,
    },
    {
      damageTypes: ['Fire Damage', 'Smoke Damage'],
      objectCategory: 'Property',
      sceneContext: 'Indoor, Commercial',
      confidence: 89,
    },
    {
      damageTypes: ['Crack', 'Structural Damage'],
      objectCategory: 'Property',
      sceneContext: 'Outdoor, Construction Site',
      confidence: 91,
    },
  ]
  
  // Simple hash function to consistently return same analysis for same filename
  let hash = 0
  for (let i = 0; i < fileName.length; i++) {
    const char = fileName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % mockAnalyses.length
  return mockAnalyses[index]
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}