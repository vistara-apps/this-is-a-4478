import React, { useState, useEffect } from 'react'
import { Download, AlertTriangle, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { getBillingHistory } from '../../services/stripeService'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

const BillingHistory = () => {
  const { user, isDemoUser } = useAuth()
  const { error: showError } = useToast()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch billing history
  useEffect(() => {
    async function fetchBillingHistory() {
      if (!user) return
      
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await getBillingHistory(user.id)
        
        if (error) throw error
        
        setInvoices(data || [])
      } catch (err) {
        console.error('Error fetching billing history:', err)
        setError('Failed to load billing history. Please try again.')
        showError('Failed to load billing history')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBillingHistory()
  }, [user, showError])
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
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
          <h3 className="text-sm font-medium text-red-800">Error loading billing history</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    )
  }
  
  // Render empty state
  if (invoices.length === 0) {
    return (
      <EmptyState
        type="default"
        title="No billing history"
        message="You don't have any invoices yet."
        icon={FileText}
      />
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Billing History</h2>
        <p className="text-gray-600 mt-1">View and download your past invoices</p>
      </div>
      
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Download</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(invoice.created * 1000).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ClaimSnap AI {invoice.plan} Plan
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'open'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      if (isDemoUser) {
                        showError('Invoice download is not available in demo mode')
                      } else {
                        // In a real implementation, this would download the invoice PDF
                        console.log('Download invoice:', invoice.id)
                      }
                    }}
                    className="text-accent hover:text-accent-dark"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isDemoUser && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <p>
            <strong>Note:</strong> Invoice download is not available in demo mode. In a real
            implementation, clicking the download button would download the invoice PDF.
          </p>
        </div>
      )}
    </div>
  )
}

export default BillingHistory

