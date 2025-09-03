import React from 'react'
import { 
  LayoutDashboard, 
  Upload, 
  Image, 
  Settings, 
  Camera,
  TrendingUp 
} from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Photos', icon: Upload },
    { id: 'gallery', label: 'Photo Gallery', icon: Image },
    { id: 'account', label: 'Account', icon: Settings },
  ]

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
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`sidebar-item w-full ${
                    activeTab === item.id ? 'active' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
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
              <span className="font-medium">127 / 500</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '25.4%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar