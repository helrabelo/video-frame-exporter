'use client'
import { useState } from 'react'

interface FrameCaptureProps {
  videoElement: HTMLVideoElement | null
  onCapture: (frameDataUrl: string) => void
}

const FrameCapture = ({ videoElement, onCapture }: FrameCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false)

  const captureFrame = async () => {
    if (!videoElement) return

    try {
      setIsCapturing(true)

      // Create a canvas element with the same dimensions as the video
      const canvas = document.createElement('canvas')
      const width = videoElement.videoWidth
      const height = videoElement.videoHeight
      canvas.width = width
      canvas.height = height

      // Draw the current video frame to the canvas
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Could not get canvas context')
      }
      context.drawImage(videoElement, 0, 0, width, height)

      // Convert the canvas to a data URL
      const frameDataUrl = canvas.toDataURL('image/png')
      
      // Pass the captured frame data URL to the parent component
      onCapture(frameDataUrl)
    } catch (error) {
      console.error('Error capturing frame:', error)
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <button
      onClick={captureFrame}
      disabled={!videoElement || isCapturing}
      className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCapturing ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Capturing...
        </div>
      ) : (
        'Capture Frame'
      )}
    </button>
  )
}

export default FrameCapture 