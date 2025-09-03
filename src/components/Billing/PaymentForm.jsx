import React, { useState } from 'react'
import { CreditCard, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import LoadingSpinner from '../common/LoadingSpinner'

const PaymentForm = () => {
  const { isDemoUser } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
      setFormData(prev => ({ ...prev, [name]: formatted }))
      return
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '')
      let formatted = cleaned
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
      }
      setFormData(prev => ({ ...prev, [name]: formatted }))
      return
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isDemoUser) {
      showError('Payment method updates are not available in demo mode')
      return
    }
    
    // Basic validation
    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvc) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // In a real implementation, this would call Stripe to create a payment method
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      showSuccess('Payment method updated successfully')
      
      // Reset form
      setFormData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvc: '',
      })
    } catch (err) {
      console.error('Payment method update error:', err)
      setError('Failed to update payment method. Please try again.')
      showError('Failed to update payment method')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Payment Method</h2>
        <p className="text-gray-600 mt-1">Update your payment information</p>
      </div>
      
      {/* Current payment method */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Current Payment Method</h3>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
          <div>
            <p className="text-sm font-medium text-primary">•••• •••• •••• 4242</p>
            <p className="text-xs text-gray-500">Expires 12/25</p>
          </div>
        </div>
      </div>
      
      {/* Update payment method form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Update Payment Method</h3>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                value={formData.cardNumber}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              id="cardName"
              name="cardName"
              type="text"
              value={formData.cardName}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
              placeholder="John Doe"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="text"
                value={formData.expiryDate}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                id="cvc"
                name="cvc"
                type="text"
                value={formData.cvc}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={loading || isDemoUser}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Payment Method</span>
              )}
            </button>
          </div>
        </form>
        
        {isDemoUser && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <p>
              <strong>Note:</strong> Payment method updates are not available in demo mode. In a real
              implementation, this form would update your payment method with Stripe.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentForm

