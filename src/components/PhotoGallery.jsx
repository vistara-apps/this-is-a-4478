import React, { useState } from 'react'
import { Search, Filter, Download, Eye, Tag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import TagDisplay from './TagDisplay'

const PhotoGallery = () => {
  const { state } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  // Filter photos based on search and filter criteria
  const filteredPhotos = state.photos.filter(photo => {
    const matchesSearch = photo.originalFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.detectedDamageTypes.some(type => 
                           type.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    const matchesFilter = selectedFilter === 'all' || 
                         photo.objectCategory.toLowerCase() === selectedFilter.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  const exportData = () => {
    const exportData = filteredPhotos.map(photo => ({
      fileName: photo.originalFileName,
      damageTypes: photo.detectedDamageTypes.join(', '),
      objectCategory: photo.objectCategory,
      sceneContext: photo.sceneContext,
      confidence: photo.analysisResults?.confidence || 'N/A',
      uploadDate: new Date(photo.uploadedAt).toLocaleDateString(),
    }))
    
    const csv = [
      ['File Name', 'Damage Types', 'Object Category', 'Scene Context', 'Confidence', 'Upload Date'],
      ...exportData.map(row => [
        row.fileName,
        row.damageTypes,
        row.objectCategory,
        row.sceneContext,
        row.confidence,
        row.uploadDate
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'claimsnap-analysis-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-primary">Photo Gallery</h2>
          <p className="text-gray-600 mt-1">{filteredPhotos.length} photos analyzed</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={exportData}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search photos by filename or damage type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="all">All Categories</option>
              <option value="vehicle">Vehicle</option>
              <option value="property">Property</option>
              <option value="item">Item</option>
            </select>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="card text-center py-12">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">No photos found</h3>
          <p className="text-gray-600">
            {state.photos.length === 0 
              ? 'Upload some photos to get started with AI analysis'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.photoId} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={photo.imageUrl}
                  alt={photo.originalFileName}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedPhoto(photo)}
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-primary truncate">{photo.originalFileName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-gray-700">Damage Types</span>
                  </div>
                  <TagDisplay tags={photo.detectedDamageTypes} variant="badge" />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {photo.objectCategory} • {photo.sceneContext}
                  </span>
                  {photo.analysisResults?.confidence && (
                    <span className="text-green-600 font-medium">
                      {photo.analysisResults.confidence}% confident
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-primary">{selectedPhoto.originalFileName}</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.originalFileName}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Analysis Results</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Object Category:</span>
                        <span className="ml-2 font-medium">{selectedPhoto.objectCategory}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Scene Context:</span>
                        <span className="ml-2 font-medium">{selectedPhoto.sceneContext}</span>
                      </div>
                      {selectedPhoto.analysisResults?.confidence && (
                        <div>
                          <span className="text-sm text-gray-600">Confidence:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {selectedPhoto.analysisResults.confidence}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Detected Damage</h4>
                    <TagDisplay tags={selectedPhoto.detectedDamageTypes} variant="list" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Upload Information</h4>
                    <div className="text-sm text-gray-600">
                      <p>Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleString()}</p>
                      <p>Claim ID: {selectedPhoto.claimId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoGallery