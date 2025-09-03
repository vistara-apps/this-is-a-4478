import React, { useState } from 'react'
import { X } from 'lucide-react'
import Login from './Login'
import Register from './Register'

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  
  if (!isOpen) return null
  
  const handleSuccess = () => {
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
          aria-hidden="true"
        ></div>
        
        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {mode === 'login' ? (
              <Login 
                onSuccess={handleSuccess} 
                onRegisterClick={() => setMode('register')} 
              />
            ) : (
              <Register 
                onSuccess={handleSuccess} 
                onLoginClick={() => setMode('login')} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal

