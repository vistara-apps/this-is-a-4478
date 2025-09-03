import React from 'react'
import { 
  LayoutDashboard, 
  Upload, 
  Image, 
  Settings, 
  Camera,
  TrendingUp,
  FileText,
  CreditCard,
  Download,
  Bell,
  Monitor,
  User,
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

const Sidebar = ({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) => {
  const { logout, profile } = useAuth()
  const { state } = useApp()
  
  // Main menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'upload', label: 'Upload Photos', icon: Upload },
    { id: 'gallery', label: 'Photo Gallery', icon: Image },
    { id: 'billing', label: 'Billing', icon: CreditCard, subItems: [
      { id: 'plans', label: 'Subscription Plans' },
      { id: 'payment', label: 'Payment Method' },
      { id: 'history', label: 'Billing History' },
    ]},
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings, subItems: [
      { id: 'account', label: 'Account' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'display', label: 'Display' },
    ]},
  ]
  
  // Handle logout
  const handleLogout = async () => {
    await logout()
  }
  
  // Check if menu item has sub-items and is expanded
  const isExpanded = (item) => {
    return item.subItems && activeTab === item.id
  }
  
  return (
    <div className="w-64 bg-surface border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">ClaimSnap AI</h1>
            <p className="text-sm text-gray-500">Insurance Claims</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const expanded = isExpanded(item)
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id)
                    if (!item.subItems) {
                      setActiveSubTab(null)
                    }
                  }}
                  className={`sidebar-item w-full ${
                    activeTab === item.id && (!item.subItems || !activeSubTab) ? 'active' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.subItems && (
                    expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {/* Sub-items */}
                {expanded && item.subItems && (
                  <ul className="mt-1 ml-6 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.id}>
                        <button
                          onClick={() => setActiveSubTab(subItem.id)}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                            activeSubTab === subItem.id
                              ? 'text-accent font-medium'
                              : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                          }`}
                        >
                          <span>{subItem.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Usage This Month</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Photos Analyzed</span>
              <span className="font-medium">{state.user.usedQuota} / {state.user.monthlyQuota}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full" 
                style={{ width: `${(state.user.usedQuota / state.user.monthlyQuota) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">{state.user.email}</p>
              <p className="text-xs text-accent">{profile?.subscription_tier || 'Pro'} Plan</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

