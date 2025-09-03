import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'accent', fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }
  
  // Color classes
  const colorClasses = {
    accent: 'text-accent',
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-400',
  }
  
  // Get the appropriate classes
  const spinnerSize = sizeClasses[size] || sizeClasses.md
  const spinnerColor = colorClasses[color] || colorClasses.accent
  
  // Spinner component
  const Spinner = () => (
    <svg 
      className={`animate-spin ${spinnerSize} ${spinnerColor}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
  
  // If fullScreen, render in the center of the screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Spinner />
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Otherwise, render inline
  return <Spinner />
}

export default LoadingSpinner

