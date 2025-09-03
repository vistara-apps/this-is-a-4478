import React from 'react'
import { Bell, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Header = () => {
  const { state } = useApp()
  
  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Welcome back!</h2>
          <p className="text-gray-600">Analyze your insurance claim photos with AI</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-accent">Pro Plan</span>
          </div>
          
          <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">{state.user.email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header