import React, { useState, useEffect, createContext, useContext } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Create context
const ToastContext = createContext()

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
}

// Toast provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // Add a new toast
  const addToast = (message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = Date.now().toString()
    const newToast = { id, message, type, duration }
    setToasts(prevToasts => [...prevToasts, newToast])
    
    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  // Remove a toast by ID
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }

  // Convenience methods for different toast types
  const success = (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration)
  const error = (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration)
  const info = (message, duration) => addToast(message, TOAST_TYPES.INFO, duration)
  const warning = (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration)

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Custom hook to use toast context
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast container component
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

// Individual toast component
function Toast({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false)
  
  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300) // Match the animation duration
  }
  
  // Auto-close on unmount
  useEffect(() => {
    return () => {
      if (onClose) onClose()
    }
  }, [onClose])
  
  // Get icon and styles based on toast type
  const getToastStyles = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        }
      case TOAST_TYPES.ERROR:
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
        }
      case TOAST_TYPES.WARNING:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
        }
      case TOAST_TYPES.INFO:
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
        }
    }
  }
  
  const { icon, bgColor, borderColor, textColor } = getToastStyles()
  
  return (
    <div 
      className={`${bgColor} ${borderColor} ${textColor} border rounded-lg shadow-lg p-4 flex items-start space-x-3 transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button 
        onClick={handleClose}
        className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Toast

