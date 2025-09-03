import React, { useState } from 'react'
import { Download, FileText, Image, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { exportPhotos, exportClaims, exportUserData } from '../../services/exportService'
import LoadingSpinner from '../common/LoadingSpinner'

const ExportOptions = ({ photos, claims }) => {
  const { user, profile, isDemoUser } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [exportType, setExportType] = useState('photos')
  const [exportFormat, setExportFormat] = useState('csv')
  const [error, setError] = useState(null)
  
  const handleExport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      switch (exportType) {
        case 'photos':
          exportPhotos(photos, exportFormat, 'claimsnap-photos')
          break
        case 'claims':
          exportClaims(claims, exportFormat, 'claimsnap-claims')
          break
        case 'all':
          exportUserData(
            { ...user, ...profile },
            claims,
            photos,
            'json',
            'claimsnap-user-data'
          )
          break
        default:
          throw new Error('Invalid export type')
      }
      
      showSuccess('Data exported successfully')
    } catch (err) {
      console.error('Export error:', err)
      setError('Failed to export data. Please try again.')
      showError('Failed to export data')
    } finally {
      setLoading(false)
    }
  }
  
  // Check if export is available based on subscription tier
  const isExportAvailable = () => {
    if (isDemoUser) return true
    return profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'business'
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Export Data</h2>
        <p className="text-gray-600 mt-1">Download your data in various formats</p>
      </div>
      
      {!isExportAvailable() && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Upgrade Required</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Data export is available on Pro and Business plans. Please upgrade your subscription to
              access this feature.
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-6">Export Options</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to export?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  exportType === 'photos'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setExportType('photos')}
              >
                <div className="flex items-center justify-between mb-2">
                  <Image className="w-6 h-6 text-gray-500" />
                  {exportType === 'photos' && (
                    <Check className="w-5 h-5 text-accent" />
                  )}
                </div>
                <h4 className="font-medium text-primary">Photos & Analysis</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Export all photos with AI analysis results
                </p>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  exportType === 'claims'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setExportType('claims')}
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-6 h-6 text-gray-500" />
                  {exportType === 'claims' && (
                    <Check className="w-5 h-5 text-accent" />
                  )}
                </div>
                <h4 className="font-medium text-primary">Claims</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Export all claims and their status
                </p>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  exportType === 'all'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setExportType('all')}
              >
                <div className="flex items-center justify-between mb-2">
                  <Download className="w-6 h-6 text-gray-500" />
                  {exportType === 'all' && (
                    <Check className="w-5 h-5 text-accent" />
                  )}
                </div>
                <h4 className="font-medium text-primary">All Data</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Export all your data including profile
                </p>
              </div>
            </div>
          </div>
          
          {exportType !== 'all' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export Format
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300"
                  />
                  <span className="text-sm text-gray-700">CSV</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={() => setExportFormat('json')}
                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300"
                  />
                  <span className="text-sm text-gray-700">JSON</span>
                </label>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              disabled={loading || !isExportAvailable()}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">About Data Export</h3>
        <p className="text-sm text-blue-700">
          Exported data is downloaded directly to your device and is not sent to our servers.
          Your data remains private and secure.
        </p>
      </div>
    </div>
  )
}

export default ExportOptions

