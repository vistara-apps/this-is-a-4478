import React, { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import PhotoGallery from './components/PhotoGallery'
import UploadArea from './components/UploadArea'
import AccountSettings from './components/AccountSettings'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'upload':
        return <UploadArea />
      case 'gallery':
        return <PhotoGallery />
      case 'account':
        return <AccountSettings />
      default:
        return <Dashboard />
    }
  }

  return (
    <AppProvider>
      <div className="flex h-screen bg-bg">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppProvider>
  )
}

export default App