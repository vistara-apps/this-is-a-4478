import React, { useState } from 'react'
import { Bell, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { updateUserProfile } from '../../services/authService'
import LoadingSpinner from '../common/LoadingSpinner'

const NotificationSettings = () => {
  const { user, profile, updateProfile, isDemoUser } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Default notification settings if not in profile
  const defaultSettings = {
    emailNotifications: true,
    analysisComplete: true,
    monthlyReports: true,
    productUpdates: false,
  }
  
  // Get notification settings from profile or use defaults
  const notificationSettings = profile?.notificationSettings || defaultSettings
  
  // State for notification settings
  const [settings, setSettings] = useState(notificationSettings)
  
  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
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
        notificationSettings: settings,
      })
      
      if (error) throw error
      
      // Update profile in context
      updateProfile({ notificationSettings: settings })
      
      showSuccess('Notification settings saved successfully')
    } catch (err) {
      console.error('Save notification settings error:', err)
      setError('Failed to save notification settings. Please try again.')
      showError('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Notification Settings</h2>
        <p className="text-gray-600 mt-1">Manage how you receive notifications</p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-accent" />
          <h3 className="text-lg font-semibold text-primary">Email Notifications</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">All Email Notifications</p>
              <p className="text-xs text-gray-500 mt-1">
                Master toggle for all email notifications
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Analysis Complete</p>
                <p className="text-xs text-gray-500 mt-1">
                  Get notified when photo analysis is finished
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.analysisComplete}
                  onChange={() => handleToggle('analysisComplete')}
                  disabled={!settings.emailNotifications}
                />
                <div className={`w-11 h-6 ${
                  settings.emailNotifications ? 'bg-gray-200' : 'bg-gray-100'
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent ${
                  !settings.emailNotifications && 'opacity-50 cursor-not-allowed'
                }`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Monthly Usage Reports</p>
                <p className="text-xs text-gray-500 mt-1">
                  Receive monthly summaries of your usage
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.monthlyReports}
                  onChange={() => handleToggle('monthlyReports')}
                  disabled={!settings.emailNotifications}
                />
                <div className={`w-11 h-6 ${
                  settings.emailNotifications ? 'bg-gray-200' : 'bg-gray-100'
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent ${
                  !settings.emailNotifications && 'opacity-50 cursor-not-allowed'
                }`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Product Updates</p>
                <p className="text-xs text-gray-500 mt-1">
                  Stay informed about new features and improvements
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.productUpdates}
                  onChange={() => handleToggle('productUpdates')}
                  disabled={!settings.emailNotifications}
                />
                <div className={`w-11 h-6 ${
                  settings.emailNotifications ? 'bg-gray-200' : 'bg-gray-100'
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent ${
                  !settings.emailNotifications && 'opacity-50 cursor-not-allowed'
                }`}></div>
              </label>
            </div>
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
    </div>
  )
}

export default NotificationSettings

