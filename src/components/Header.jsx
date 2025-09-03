import React, { useState } from 'react'
import { Bell, User, Search, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

const Header = ({ activeTab, activeSubTab, setActiveSubTab }) => {
  const { user, profile } = useAuth()
  const { state } = useApp()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get title based on active tab and sub-tab
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard'
      case 'claims':
        if (activeSubTab === 'create-claim') {
          return 'Create Claim'
        } else if (activeSubTab === 'claim-detail') {
          return 'Claim Details'
        } else {
          return 'Claims'
        }
      case 'upload':
        return 'Upload Photos'
      case 'gallery':
        return 'Photo Gallery'
      case 'billing':
        if (activeSubTab === 'plans') {
          return 'Subscription Plans'
        } else if (activeSubTab === 'payment') {
          return 'Payment Method'
        } else if (activeSubTab === 'history') {
          return 'Billing History'
        } else {
          return 'Billing'
        }
      case 'export':
        return 'Export Data'
      case 'settings':
        if (activeSubTab === 'notifications') {
          return 'Notification Settings'
        } else if (activeSubTab === 'display') {
          return 'Display Settings'
        } else {
          return 'Account Settings'
        }
      default:
        return 'Welcome back!'
    }
  }
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Search query:', searchQuery)
    // Reset search
    setShowSearch(false)
    setSearchQuery('')
  }
  
  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div>
            <h2 className="text-2xl font-bold text-primary">{getTitle()}</h2>
            <p className="text-gray-600">
              {activeTab === 'dashboard' 
                ? 'Analyze your insurance claim photos with AI'
                : `Welcome back, ${user?.email?.split('@')[0] || 'User'}`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {/* Subscription badge */}
          <div className="hidden md:flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-accent">
              {profile?.subscription_tier === 'free' ? 'Free Plan' : 
               profile?.subscription_tier === 'business' ? 'Business Plan' : 
               'Pro Plan'}
            </span>
          </div>
          
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* User menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium hidden md:block">{user?.email}</span>
          </div>
        </div>
      </div>
      
      {/* Search bar */}
      {showSearch && (
        <div className="mt-4 animate-fade-in">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims, photos, or damage types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden mt-4 bg-gray-50 rounded-lg p-4 animate-fade-in">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveSubTab('plans')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100"
                >
                  <span>Subscription Plans</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSubTab('account')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100"
                >
                  <span>Account Settings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSubTab('notifications')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100"
                >
                  <span>Notification Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

