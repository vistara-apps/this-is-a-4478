import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { createClaim } from '../../services/claimService'
import LoadingSpinner from '../common/LoadingSpinner'

const ClaimForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    claimNumber: '',
    description: '',
    incidentDate: '',
    policyNumber: '',
    claimType: 'vehicle',
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.claimNumber) {
      setError('Claim number is required')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const claimData = {
        ...formData,
        userId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const { data, error } = await createClaim(claimData)
      
      if (error) throw error
      
      showSuccess('Claim created successfully')
      
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (err) {
      console.error('Error creating claim:', err)
      setError('Failed to create claim. Please try again.')
      showError('Failed to create claim')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Create New Claim</h2>
        <p className="text-gray-600 mt-1">Enter the details for your insurance claim</p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="claimNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Claim Number *
            </label>
            <input
              id="claimNumber"
              name="claimNumber"
              type="text"
              value={formData.claimNumber}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
              placeholder="e.g., INS-12345"
              required
            />
          </div>
          
          <div>
            <label htmlFor="claimType" className="block text-sm font-medium text-gray-700 mb-1">
              Claim Type
            </label>
            <select
              id="claimType"
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            >
              <option value="vehicle">Vehicle</option>
              <option value="property">Property</option>
              <option value="personal">Personal Item</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Date
            </label>
            <input
              id="incidentDate"
              name="incidentDate"
              type="date"
              value={formData.incidentDate}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            />
          </div>
          
          <div>
            <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Policy Number
            </label>
            <input
              id="policyNumber"
              name="policyNumber"
              type="text"
              value={formData.policyNumber}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
              placeholder="e.g., POL-67890"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            placeholder="Describe the incident and damage..."
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Claim</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClaimForm

