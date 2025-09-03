import React from 'react'
import { FileImage, Upload, Search, AlertCircle } from 'lucide-react'

const EmptyState = ({ 
  type = 'default', 
  title, 
  message, 
  actionLabel, 
  onAction,
  icon: CustomIcon,
}) => {
  // Default content based on type
  let defaultTitle = 'No data available'
  let defaultMessage = 'There is no data to display at this time.'
  let Icon = CustomIcon || AlertCircle
  
  switch (type) {
    case 'photos':
      defaultTitle = 'No photos yet'
      defaultMessage = 'Upload some photos to get started with AI analysis.'
      Icon = CustomIcon || FileImage
      break
    case 'search':
      defaultTitle = 'No results found'
      defaultMessage = 'Try adjusting your search criteria.'
      Icon = CustomIcon || Search
      break
    case 'upload':
      defaultTitle = 'Upload photos'
      defaultMessage = 'Drag and drop photos here or click to browse.'
      Icon = CustomIcon || Upload
      break
    case 'claims':
      defaultTitle = 'No claims yet'
      defaultMessage = 'Create a new claim to get started.'
      Icon = CustomIcon || FileImage
      break
    case 'error':
      defaultTitle = 'Something went wrong'
      defaultMessage = 'An error occurred while loading the data.'
      Icon = CustomIcon || AlertCircle
      break
    default:
      break
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {message || defaultMessage}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState

