'use client'
import { useState, useEffect } from 'react'
import { FrameData } from '@/utils/frameUtils'

export type ExportFormat = 'png' | 'jpeg' | 'webp'
export type ExportResolution = '100%' | '75%' | '50%' | '25%'

interface ExportOptionsProps {
  frameData: FrameData | null
  format: ExportFormat
  resolution: ExportResolution
  onFormatChange: (format: ExportFormat) => void
  onResolutionChange: (resolution: ExportResolution) => void
}

const ExportOptions = ({
  frameData,
  format,
  resolution,
  onFormatChange,
  onResolutionChange
}: ExportOptionsProps) => {
  // Calculate dimensions based on resolution
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (!frameData) {
      setDimensions(null)
      return
    }

    try {
      // Calculate dimensions based on selected resolution
      const percentageStr = resolution.replace('%', '')
      const percentage = parseInt(percentageStr) / 100
      
      if (isNaN(percentage)) {
        console.error('Invalid percentage value:', resolution)
        setDimensions({ width: frameData.width, height: frameData.height })
        return
      }
      
      const width = Math.round(frameData.width * percentage)
      const height = Math.round(frameData.height * percentage)
      
      setDimensions({ width, height })
    } catch (error) {
      console.error('Error calculating dimensions:', error)
      // Fallback to original dimensions
      setDimensions({ width: frameData.width, height: frameData.height })
    }
  }, [frameData, resolution])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="format-select" className="block text-sm font-medium text-gray-300 mb-2">
            Format
          </label>
          <div className="relative">
            <select
              id="format-select"
              value={format}
              onChange={(e) => onFormatChange(e.target.value as ExportFormat)}
              className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-10 py-2 appearance-none"
              disabled={!frameData}
              aria-describedby="format-description"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p id="format-description" className="mt-1 text-xs text-gray-400">
            {format === 'png' && 'Lossless quality, larger file size'}
            {format === 'jpeg' && 'Lossy compression, smaller file size'}
            {format === 'webp' && 'Modern format with better compression'}
          </p>
        </div>

        <div className="flex-1">
          <label htmlFor="resolution-select" className="block text-sm font-medium text-gray-300 mb-2">
            Resolution
          </label>
          <div className="relative">
            <select
              id="resolution-select"
              value={resolution}
              onChange={(e) => onResolutionChange(e.target.value as ExportResolution)}
              className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-10 py-2 appearance-none"
              disabled={!frameData}
              aria-describedby="resolution-description"
            >
              <option value="100%">100% (Original)</option>
              <option value="75%">75%</option>
              <option value="50%">50%</option>
              <option value="25%">25%</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {frameData && (
            <p id="resolution-description" className="mt-1 text-xs text-gray-400">
              Output dimensions: {dimensions 
                ? `${dimensions.width} × ${dimensions.height} px` 
                : resolution === '100%' 
                  ? `${frameData.width} × ${frameData.height} px`
                  : 'Calculating...'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportOptions 