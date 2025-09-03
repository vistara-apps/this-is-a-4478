import React, { useState, useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider, useToast } from './components/common/Toast'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import PhotoGallery from './components/PhotoGallery'
import UploadArea from './components/UploadArea'
import AccountSettings from './components/AccountSettings'
import AuthModal from './components/Auth/AuthModal'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'
import ClaimsList from './components/Claims/ClaimsList'
import ClaimDetail from './components/Claims/ClaimDetail'
import ClaimForm from './components/Claims/ClaimForm'
import SubscriptionPlans from './components/Billing/SubscriptionPlans'
import BillingHistory from './components/Billing/BillingHistory'
import PaymentForm from './components/Billing/PaymentForm'
import ExportOptions from './components/Export/ExportOptions'
import NotificationSettings from './components/Settings/NotificationSettings'
import DisplaySettings from './components/Settings/DisplaySettings'

// Main App wrapper with providers
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

// App content with authentication check
function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // Show auth modal if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [isAuthenticated, loading])
  
  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <LoadingSpinner size="xl" />
      </div>
    )
  }
  
  return (
    <>
      {isAuthenticated ? (
        <AuthenticatedApp />
      ) : (
        <div className="flex items-center justify-center h-screen bg-bg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">ClaimSnap AI</h1>
            <p className="text-gray-600 mb-6">Automated photo analysis for faster, smarter insurance claims.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-primary"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}

// Authenticated app with navigation and content
function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeSubTab, setActiveSubTab] = useState(null)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const { success: showSuccess } = useToast()
  
  // Reset sub-tab when main tab changes
  useEffect(() => {
    setActiveSubTab(null)
    setSelectedClaim(null)
  }, [activeTab])
  
  // Handle claim selection
  const handleSelectClaim = (claim) => {
    setSelectedClaim(claim)
    setActiveSubTab('claim-detail')
  }
  
  // Handle create claim
  const handleCreateClaim = () => {
    setActiveSubTab('create-claim')
  }
  
  // Handle claim creation success
  const handleClaimCreated = (claim) => {
    setSelectedClaim(claim)
    setActiveSubTab('claim-detail')
  }
  
  // Handle claim upload
  const handleClaimUpload = (claim) => {
    setSelectedClaim(claim)
    setActiveTab('upload')
  }
  
  // Render content based on active tab and sub-tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      
      case 'claims':
        if (activeSubTab === 'create-claim') {
          return (
            <ClaimForm
              onSuccess={handleClaimCreated}
              onCancel={() => setActiveSubTab(null)}
            />
          )
        } else if (activeSubTab === 'claim-detail' && selectedClaim) {
          return (
            <ClaimDetail
              claimId={selectedClaim.claimId}
              onBack={() => setActiveSubTab(null)}
              onUpload={handleClaimUpload}
              onEdit={() => setActiveSubTab('edit-claim')}
              onDelete={() => {
                // Handle delete claim
                setActiveSubTab(null)
                showSuccess('Claim deleted successfully')
              }}
            />
          )
        } else {
          return (
            <ClaimsList
              onSelectClaim={handleSelectClaim}
              onCreateClaim={handleCreateClaim}
            />
          )
        }
      
      case 'upload':
        return <UploadArea selectedClaim={selectedClaim} />
      
      case 'gallery':
        return <PhotoGallery />
      
      case 'billing':
        if (activeSubTab === 'plans') {
          return <SubscriptionPlans />
        } else if (activeSubTab === 'payment') {
          return <PaymentForm />
        } else if (activeSubTab === 'history') {
          return <BillingHistory />
        } else {
          return <SubscriptionPlans />
        }
      
      case 'export':
        return <ExportOptions photos={[]} claims={[]} />
      
      case 'settings':
        if (activeSubTab === 'notifications') {
          return <NotificationSettings />
        } else if (activeSubTab === 'display') {
          return <DisplaySettings />
        } else {
          return <AccountSettings />
        }
      
      default:
        return <Dashboard />
    }
  }
  
  return (
    <div className="flex h-screen bg-bg">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />
        <main className="flex-1 overflow-auto p-6">
          <ErrorBoundary
            resetErrorBoundary={() => {
              setActiveTab('dashboard')
              setActiveSubTab(null)
            }}
          >
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default App

