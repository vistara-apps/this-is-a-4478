import React, { useState } from 'react'
import { Monitor, AlertCircle, Grid, List, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { updateUserProfile } from '../../services/authService'
import LoadingSpinner from '../common/LoadingSpinner'

const DisplaySettings = () => {
  const { user, profile, updateProfile, isDemoUser } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Default display settings if not in profile
  const defaultSettings = {
    theme: 'light',
    galleryView: 'grid',
    itemsPerPage: 12,
  }
  
  // Get display settings from profile or use defaults
  const displaySettings = profile?.displaySettings || defaultSettings
  
  // State for display settings
  const [settings, setSettings] = useState(displaySettings)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handleSave = async () => {
    if (isDemoUser) {
      showSuccess('Settings saved (demo mode)')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await updateUserProfile(user.id, {
        displaySettings: settings,
      })
      
      if (error) throw error
      
      // Update profile in context
      updateProfile({ displaySettings: settings })
      
      showSuccess('Display settings saved successfully')
    } catch (err) {
      console.error('Save display settings error:', err)
      setError('Failed to save display settings. Please try again.')
      showError('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Display Settings</h2>
        <p className="text-gray-600 mt-1">Customize your viewing experience</p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Monitor className="w-6 h-6 text-accent" />
          <h3 className="text-lg font-semibold text-primary">Display Preferences</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  settings.theme === 'light'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
              >
                <div className="flex items-center space-x-3">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h4 className="font-medium text-primary">Light Mode</h4>
                    <p className="text-sm text-gray-600">
                      Bright interface with light background
                    </p>
                  </div>
                </div>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  settings.theme === 'dark'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
              >
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h4 className="font-medium text-primary">Dark Mode</h4>
                    <p className="text-sm text-gray-600">
                      Dark interface for low-light environments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gallery View
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  settings.galleryView === 'grid'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setSettings(prev => ({ ...prev, galleryView: 'grid' }))}
              >
                <div className="flex items-center space-x-3">
                  <Grid className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-medium text-primary">Grid View</h4>
                    <p className="text-sm text-gray-600">
                      Display photos in a grid layout
                    </p>
                  </div>
                </div>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  settings.galleryView === 'list'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setSettings(prev => ({ ...prev, galleryView: 'list' }))}
              >
                <div className="flex items-center space-x-3">
                  <List className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-medium text-primary">List View</h4>
                    <p className="text-sm text-gray-600">
                      Display photos in a detailed list
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
              Items Per Page
            </label>
            <select
              id="itemsPerPage"
              name="itemsPerPage"
              value={settings.itemsPerPage}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            >
              <option value={6}>6 items</option>
              <option value={12}>12 items</option>
              <option value={24}>24 items</option>
              <option value={48}>48 items</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isDemoUser && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <p>
            <strong>Note:</strong> Settings changes are simulated in demo mode. In a real
            implementation, your preferences would be saved to your user profile.
          </p>
        </div>
      )}
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">About Dark Mode</h3>
        <p className="text-sm text-blue-700">
          Dark mode is currently in beta. Some elements may not display correctly in dark mode.
          We're working on improving the dark mode experience.
        </p>
      </div>
    </div>
  )
}

export default DisplaySettings

