import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  Upload, 
  Download, 
  Edit, 
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { getClaimById, updateClaim, deleteClaim } from '../../services/claimService'
import { getClaimPhotos } from '../../services/photoService'
import { exportCompleteClaim } from '../../services/exportService'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'
import PhotoGallery from '../PhotoGallery'

const ClaimDetail = ({ claimId, onBack, onUpload, onEdit, onDelete }) => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const [claim, setClaim] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch claim and photos
  useEffect(() => {
    async function fetchClaimData() {
      if (!claimId || !user) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Fetch claim details
        const { data: claimData, error: claimError } = await getClaimById(claimId)
        
        if (claimError) throw claimError
        
        if (claimData) {
          setClaim(claimData)
          
          // Fetch claim photos
          const { data: photosData, error: photosError } = await getClaimPhotos(claimId)
          
          if (photosError) throw photosError
          
          setPhotos(photosData || [])
        }
      } catch (err) {
        console.error('Error fetching claim data:', err)
        setError('Failed to load claim details. Please try again.')
        showError('Failed to load claim details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchClaimData()
  }, [claimId, user, showError])
  
  // Handle export
  const handleExport = () => {
    if (!claim) return
    
    try {
      exportCompleteClaim(claim, photos, 'json', `claim-${claim.claimNumber}`)
      showSuccess('Claim data exported successfully')
    } catch (err) {
      console.error('Export error:', err)
      showError('Failed to export claim data')
    }
  }
  
  // Get status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Clock className="w-4 h-4 mr-1" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <Clock className="w-4 h-4 mr-1" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error loading claim</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button
            onClick={onBack}
            className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }
  
  // Render not found state
  if (!claim) {
    return (
      <EmptyState
        type="error"
        title="Claim not found"
        message="The claim you're looking for doesn't exist or you don't have access to it."
        actionLabel="Go Back"
        onAction={onBack}
      />
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-primary">Claim {claim.claimNumber}</h2>
            <p className="text-gray-600 mt-1">
              Created on {new Date(claim.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onUpload(claim)}
            className="btn-primary flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photos</span>
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Claim details */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">Claim Details</h3>
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            {getStatusBadge(claim.status)}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(claim)}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(claim)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Claim Number</p>
                <p className="text-base font-medium text-primary">{claim.claimNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Claim Type</p>
                <p className="text-base font-medium text-primary">{claim.claimType || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Policy Number</p>
                <p className="text-base font-medium text-primary">{claim.policyNumber || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Incident Date</p>
                <p className="text-base font-medium text-primary">
                  {claim.incidentDate ? new Date(claim.incidentDate).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p className="text-base font-medium text-primary">
                  {new Date(claim.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-medium text-primary">
                  {new Date(claim.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {claim.description && (
          <div className="mt-6">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-base text-primary mt-1">{claim.description}</p>
          </div>
        )}
      </div>
      
      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Claim Photos</h3>
          <p className="text-sm text-gray-600">{photos.length} photos</p>
        </div>
        
        {photos.length === 0 ? (
          <EmptyState
            type="photos"
            title="No photos yet"
            message="Upload photos to analyze damage for this claim"
            actionLabel="Upload Photos"
            onAction={() => onUpload(claim)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.photoId} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={photo.imageUrl}
                    alt={photo.originalFileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary truncate">{photo.originalFileName}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {photo.detectedDamageTypes.map((type, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {photo.objectCategory} • {photo.sceneContext}
                    </span>
                    {photo.analysisResults?.confidence && (
                      <span className="text-green-600 font-medium">
                        {photo.analysisResults.confidence}% confident
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimDetail

