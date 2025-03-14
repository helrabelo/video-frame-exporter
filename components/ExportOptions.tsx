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

    // Calculate dimensions based on selected resolution
    const percentage = parseInt(resolution.replace('%', '')) / 100
    const width = Math.round(frameData.width * percentage)
    const height = Math.round(frameData.height * percentage)
    
    setDimensions({ width, height })
  }, [frameData, resolution])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-200">Export Options</h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value as ExportFormat)}
            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!frameData}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">
            {format === 'png' && 'Lossless quality, larger file size'}
            {format === 'jpeg' && 'Lossy compression, smaller file size'}
            {format === 'webp' && 'Modern format with better compression'}
          </p>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Resolution
          </label>
          <select
            value={resolution}
            onChange={(e) => onResolutionChange(e.target.value as ExportResolution)}
            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!frameData}
          >
            <option value="100%">100% (Original)</option>
            <option value="75%">75%</option>
            <option value="50%">50%</option>
            <option value="25%">25%</option>
          </select>
          {dimensions && (
            <p className="mt-1 text-xs text-gray-400">
              Output dimensions: {dimensions.width} × {dimensions.height} px
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportOptions 