'use client'
import { useState } from 'react'
import Image from 'next/image'
import VideoPlayer from '@/components/VideoPlayer'
import FrameCapture from '@/components/FrameCapture'
import { FrameData, resizeFrame, downloadFrame } from '@/utils/frameUtils'

type ExportFormat = 'png' | 'jpeg' | 'webp'
type ExportResolution = 'original' | '720p' | '1080p'

export default function Home() {
  // Video element reference
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // Captured frame data
  const [capturedFrame, setCapturedFrame] = useState<FrameData | null>(null)
  
  // Loading state for export
  const [isExporting, setIsExporting] = useState(false)

  // Export options
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [exportResolution, setExportResolution] = useState<ExportResolution>('original')

  const handleVideoElementReady = (element: HTMLVideoElement) => {
    setVideoElement(element)
  }

  const handleFrameCapture = (frameData: FrameData) => {
    setCapturedFrame(frameData)
  }
  
  const handleExportFrame = async () => {
    if (!capturedFrame) return
    
    try {
      setIsExporting(true)
      
      // Resize the frame if needed and convert to the selected format
      const processedFrame = await resizeFrame(
        capturedFrame,
        exportResolution,
        exportFormat
      )
      
      // Generate a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `frame-${timestamp}`
      
      // Download the frame
      downloadFrame(processedFrame, filename, exportFormat)
    } catch (error) {
      console.error('Error exporting frame:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Format the timestamp as minutes:seconds.milliseconds
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const milliseconds = Math.floor((seconds % 1) * 1000)
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <main className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Video Frame Exporter</h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Video Player</h2>
          <VideoPlayer onVideoElementReady={handleVideoElementReady} />

          <div className="mt-6 space-y-6">
            {/* Export options */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resolution
                </label>
                <select
                  value={exportResolution}
                  onChange={(e) => setExportResolution(e.target.value as ExportResolution)}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="original">Original</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Frame capture button */}
              <FrameCapture 
                videoElement={videoElement} 
                onCapture={handleFrameCapture} 
              />

              {/* Frame export button */}
              <button
                onClick={handleExportFrame}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!capturedFrame || isExporting}
              >
                {isExporting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </div>
                ) : (
                  'Export Frame'
                )}
              </button>
            </div>

            {capturedFrame && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-200">Captured Frame</h3>
                
                {/* Frame metadata */}
                <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="bg-gray-800 p-2 rounded">
                    <span className="block text-gray-400">Dimensions</span>
                    <span className="font-mono">{capturedFrame.width} × {capturedFrame.height}</span>
                  </div>
                  <div className="bg-gray-800 p-2 rounded">
                    <span className="block text-gray-400">Timestamp</span>
                    <span className="font-mono">{formatTimestamp(capturedFrame.timestamp)}</span>
                  </div>
                  <div className="bg-gray-800 p-2 rounded">
                    <span className="block text-gray-400">Format</span>
                    <span className="font-mono">{exportFormat.toUpperCase()}</span>
                  </div>
                  <div className="bg-gray-800 p-2 rounded">
                    <span className="block text-gray-400">Resolution</span>
                    <span className="font-mono">{exportResolution}</span>
                  </div>
                </div>
                
                {/* Frame preview */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md border border-gray-600">
                  <Image
                    src={capturedFrame.dataUrl}
                    alt="Captured frame"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
