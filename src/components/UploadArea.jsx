import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { analyzeImage } from '../services/aiService'

const UploadArea = () => {
  const { state, dispatch } = useApp()
  const [uploadedFiles, setUploadedFiles] = useState([])

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0,
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Process each file
    for (const fileObj of newFiles) {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200))
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileObj.id ? { ...f, progress } : f
            )
          )
        }
        
        // Mark as analyzing
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'analyzing' } : f
          )
        )
        
        // Perform AI analysis
        const analysisResult = await analyzeImage(fileObj.file)
        
        // Create photo object
        const photo = {
          photoId: fileObj.id,
          claimId: 'claim_' + Date.now(),
          imageUrl: URL.createObjectURL(fileObj.file),
          originalFileName: fileObj.file.name,
          detectedDamageTypes: analysisResult.damageTypes,
          objectCategory: analysisResult.objectCategory,
          sceneContext: analysisResult.sceneContext,
          analysisResults: analysisResult,
          uploadedAt: new Date().toISOString(),
        }
        
        // Add to app state
        dispatch({ type: 'ADD_PHOTOS', payload: [photo] })
        dispatch({ type: 'UPDATE_USER_QUOTA', payload: 1 })
        
        // Mark as complete
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'complete', analysisResult } : f
          )
        )
        
      } catch (error) {
        console.error('Analysis failed:', error)
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f
          )
        )
        dispatch({ type: 'SET_ERROR', payload: error.message })
      }
    }
  }, [dispatch])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 10,
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
        return <Loader className="w-5 h-5 animate-spin text-accent" />
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileImage className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...'
      case 'analyzing':
        return 'Analyzing with AI...'
      case 'complete':
        return 'Analysis complete'
      case 'error':
        return 'Analysis failed'
      default:
        return 'Ready'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Upload Photos</h2>
          <p className="text-gray-600 mt-1">Upload insurance claim photos for AI analysis</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Monthly Usage</p>
          <p className="text-lg font-semibold text-accent">
            {state.user.usedQuota} / {state.user.monthlyQuota}
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="card">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragActive
              ? 'border-accent bg-accent/5'
              : 'border-gray-300 hover:border-accent hover:bg-accent/5'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">
            {isDragActive ? 'Drop files here' : 'Upload claim photos'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your photos here, or click to browse
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Supports: JPG, PNG, GIF, WebP</span>
            <span>•</span>
            <span>Max 10 files</span>
            <span>•</span>
            <span>Up to 10MB each</span>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-primary mb-4">Processing Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {getStatusIcon(fileObj.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getStatusText(fileObj.status)}
                  </p>
                  {fileObj.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-accent h-1 rounded-full transition-all"
                        style={{ width: `${fileObj.progress}%` }}
                      ></div>
                    </div>
                  )}
                  {fileObj.status === 'complete' && fileObj.analysisResult && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {fileObj.analysisResult.damageTypes.map((type, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded-md">
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                  {fileObj.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">{fileObj.error}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {(fileObj.file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadArea