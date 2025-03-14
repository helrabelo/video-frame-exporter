'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

// Define supported video formats
const SUPPORTED_FORMATS = ['video/mp4', 'video/webm', 'video/ogg']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

interface VideoUploadProps {
  onVideoSelected: (videoSrc: string, videoType: string, fileName: string) => void
  className?: string
  isProcessing?: boolean
}

const VideoUpload = ({ onVideoSelected, className = '', isProcessing = false }: VideoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  // Reset error when component is disabled
  useEffect(() => {
    if (isProcessing) {
      setError(null)
    }
  }, [isProcessing])

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
    setUploadProgress(0)

    if (!validateFile(file)) {
      setIsUploading(false)
      return
    }

    try {
      // Clear any existing progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Simulate upload progress for better UX
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          // Only go to 95% with the simulation, the final 5% happens when we finish
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 100);

      // Create a blob URL for the video - SIMPLIFIED APPROACH
      const videoUrl = URL.createObjectURL(file)
      
      // Set timeout to simulate processing completion
      setTimeout(() => {
        // Clear the progress interval
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        
        // Show 100% complete
        setUploadProgress(100)
        
        // Pass the video source to the parent component
        onVideoSelected(videoUrl, file.type, file.name)
        
        // Reset upload state after a brief delay
        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)
        }, 500)
      }, 1000); // Just a short delay to show progress
      
    } catch (err) {
      console.error('Error processing video file:', err)
      setError('An error occurred while processing the video. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
      
      // Clear any existing interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isProcessing || isUploading) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }, [isProcessing, isUploading, onVideoSelected])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isProcessing && !isUploading) {
      setIsDragging(true)
    }
  }, [isProcessing, isUploading])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing || isUploading) return
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      processFile(file)
    }
  }

  // Handle click to open file dialog
  const handleClick = () => {
    if (isProcessing || isUploading) return
    
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const isDisabled = isProcessing || isUploading

  return (
    <div className={`${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDisabled
            ? 'border-gray-600 bg-gray-700/20 cursor-not-allowed opacity-75'
            : isDragging 
              ? 'border-indigo-500 bg-indigo-50/10 cursor-pointer' 
              : 'border-gray-600 hover:border-indigo-400 hover:bg-gray-700/30 cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            handleClick()
          }
        }}
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-label="Upload video"
        aria-describedby="upload-description"
        aria-disabled={isDisabled}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={SUPPORTED_FORMATS.join(',')}
          className="sr-only"
          aria-hidden="true"
          disabled={isDisabled}
        />
        
        <div className="space-y-2">
          {isUploading ? (
            <>
              <svg className="animate-spin h-12 w-12 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="text-sm text-indigo-300 font-medium">
                Processing video...
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </>
          ) : isProcessing ? (
            <>
              <svg className="h-12 w-12 mx-auto text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-sm text-gray-400">
                Video player is busy
              </div>
              <p className="text-xs text-gray-500">
                Please wait until the current video is fully loaded
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
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