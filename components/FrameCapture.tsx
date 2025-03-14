'use client'
import { useState, useEffect, useRef } from 'react'
import { captureVideoFrame, FrameData } from '@/utils/frameUtils'

interface FrameCaptureProps {
  videoElement: HTMLVideoElement | null
  onCapture: (frameData: FrameData) => void
}

const FrameCapture = ({ videoElement, onCapture }: FrameCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const successTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const captureFrame = async () => {
    if (!videoElement) return

    try {
      setIsCapturing(true)

      // Use the utility function to capture the frame with metadata
      const frameData = captureVideoFrame(videoElement)
      
      if (frameData) {
        // Pass the captured frame data to the parent component
        onCapture(frameData)
        
        // Show success message
        setShowSuccess(true)
        
        // Clear any existing timer
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current)
        }
        
        // Set new timer and store the reference
        successTimerRef.current = setTimeout(() => {
          setShowSuccess(false)
          successTimerRef.current = null
        }, 3000)
      } else {
        throw new Error('Failed to capture frame')
      }
    } catch (error) {
      console.error('Error capturing frame:', error)
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={captureFrame}
        disabled={!videoElement || isCapturing}
        className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Capture frame from video"
        aria-busy={isCapturing}
      >
        {isCapturing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Capturing...
          </div>
        ) : (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Capture Frame
          </div>
        )}
      </button>
      
      {/* Success message */}
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 -mt-10 bg-green-500 text-white text-sm py-1 px-3 rounded-md shadow-md transition-opacity animate-fade-in-out">
          Frame captured successfully!
        </div>
      )}
    </div>
  )
}

export default FrameCapture 