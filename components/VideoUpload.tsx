'use client'
import { useState, useRef, useCallback } from 'react'

// Define supported video formats
const SUPPORTED_FORMATS = ['video/mp4', 'video/webm', 'video/ogg']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

interface VideoUploadProps {
  onVideoSelected: (videoSrc: string, videoType: string, fileName: string) => void
  className?: string
}

const VideoUpload = ({ onVideoSelected, className = '' }: VideoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file validation
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError(`Unsupported file format. Please upload a video in ${SUPPORTED_FORMATS.map(f => f.split('/')[1]).join(', ')} format.`)
      return false
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
      return false
    }

    return true
  }

  // Process the selected file
  const processFile = (file: File) => {
    setIsUploading(true)
    setError(null)

    if (!validateFile(file)) {
      setIsUploading(false)
      return
    }

    try {
      // Create a blob URL for the video
      const videoUrl = URL.createObjectURL(file)
      
      // Pass the video source to the parent component
      onVideoSelected(videoUrl, file.type, file.name)
      
      setIsUploading(false)
    } catch (err) {
      console.error('Error processing video file:', err)
      setError('An error occurred while processing the video. Please try again.')
      setIsUploading(false)
    }
  }

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }, [])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      processFile(file)
    }
  }

  // Handle click to open file dialog
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/10' 
            : 'border-gray-600 hover:border-indigo-400 hover:bg-gray-700/30'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick()
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload video"
        aria-describedby="upload-description"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={SUPPORTED_FORMATS.join(',')}
          className="sr-only"
          aria-hidden="true"
        />
        
        <div className="space-y-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          
          <div className="text-sm text-gray-300">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          
          <p id="upload-description" className="text-xs text-gray-400">
            Supported formats: MP4, WebM, OGG (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
          </p>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/70 rounded-lg">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="mt-2 text-sm text-white">Processing video...</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500 bg-red-900/20 p-2 rounded-md" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

export default VideoUpload 