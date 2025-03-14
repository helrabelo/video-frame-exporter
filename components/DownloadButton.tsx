'use client'
import { useState } from 'react'
import { FrameData, resizeFrame, downloadFrame } from '@/utils/frameUtils'
import { ExportFormat, ExportResolution } from './ExportOptions'

interface DownloadButtonProps {
  frameData: FrameData | null
  format: ExportFormat
  resolution: ExportResolution
}

const DownloadButton = ({ frameData, format, resolution }: DownloadButtonProps) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!frameData) return
    
    try {
      setIsExporting(true)
      
      // Resize the frame if needed and convert to the selected format
      const processedFrame = await resizeFrame(
        frameData,
        resolution,
        format
      )
      
      // Generate a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `frame-${timestamp}`
      
      // Download the frame
      downloadFrame(processedFrame, filename, format)
    } catch (error) {
      console.error('Error exporting frame:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      className="flex-1 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!frameData || isExporting}
    >
      {isExporting ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Downloading...
        </div>
      ) : (
        'Download Frame'
      )}
    </button>
  )
}

export default DownloadButton 