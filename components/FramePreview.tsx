'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FrameData } from '@/utils/frameUtils'
import { ExportFormat, ExportResolution } from './ExportOptions'

interface FramePreviewProps {
  frameData: FrameData | null
  exportFormat: ExportFormat
  exportResolution: ExportResolution
}

const FramePreview = ({ frameData, exportFormat, exportResolution }: FramePreviewProps) => {
  // Calculate dimensions based on resolution
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (!frameData) {
      setOutputDimensions(null)
      return
    }

    try {
      // Calculate dimensions based on selected resolution
      const percentageStr = exportResolution.replace('%', '')
      const percentage = parseInt(percentageStr) / 100
      
      if (isNaN(percentage)) {
        console.error('Invalid percentage value:', exportResolution)
        setOutputDimensions({ width: frameData.width, height: frameData.height })
        return
      }
      
      const width = Math.round(frameData.width * percentage)
      const height = Math.round(frameData.height * percentage)
      
      setOutputDimensions({ width, height })
    } catch (error) {
      console.error('Error calculating dimensions:', error)
      // Fallback to original dimensions
      setOutputDimensions({ width: frameData.width, height: frameData.height })
    }
  }, [frameData, exportResolution])

  // Format the timestamp as minutes:seconds.milliseconds
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const milliseconds = Math.floor((seconds % 1) * 1000)
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }

  if (!frameData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-700/50 rounded-lg border border-gray-600 border-dashed">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-sm">
            No frame captured yet. <br />
            Use the "Capture Frame" button to capture a frame from the video.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 text-gray-200">Captured Frame</h3>
      
      {/* Frame metadata */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="block text-gray-400 text-xs mb-1">Original Dimensions</span>
          <span className="font-mono">{frameData.width} × {frameData.height}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="block text-gray-400 text-xs mb-1">Timestamp</span>
          <span className="font-mono">{formatTimestamp(frameData.timestamp)}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="block text-gray-400 text-xs mb-1">Export Format</span>
          <span className="font-mono">{exportFormat.toUpperCase()}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="block text-gray-400 text-xs mb-1">Export Dimensions</span>
          <span className="font-mono">
            {outputDimensions 
              ? `${outputDimensions.width} × ${outputDimensions.height}` 
              : exportResolution === '100%' 
                ? `${frameData.width} × ${frameData.height}`
                : 'Calculating...'}
          </span>
        </div>
      </div>
      
      {/* Frame preview */}
      <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-600 bg-black/30">
        <Image
          src={frameData.dataUrl}
          alt="Captured frame"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}

export default FramePreview 