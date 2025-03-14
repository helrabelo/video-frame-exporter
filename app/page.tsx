'use client'
import { useState, useEffect } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import FrameCapture from '@/components/FrameCapture'
import FramePreview from '@/components/FramePreview'
import ExportOptions, { ExportFormat, ExportResolution } from '@/components/ExportOptions'
import DownloadButton from '@/components/DownloadButton'
import VideoUpload from '@/components/VideoUpload'
import { FrameData } from '@/utils/frameUtils'

export default function Home() {
  // Video element reference
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // Captured frame data
  const [capturedFrame, setCapturedFrame] = useState<FrameData | null>(null)

  // Export options
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [exportResolution, setExportResolution] = useState<ExportResolution>('100%')

  // Custom video state
  const [customVideoSrc, setCustomVideoSrc] = useState<string | undefined>(undefined)
  const [customVideoType, setCustomVideoType] = useState<string>('video/mp4')
  const [videoName, setVideoName] = useState<string>('Default Video')
  
  // Clean up blob URLs when component unmounts or when a new video is uploaded
  useEffect(() => {
    return () => {
      if (customVideoSrc && customVideoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(customVideoSrc)
      }
    }
  }, [customVideoSrc])

  const handleVideoElementReady = (element: HTMLVideoElement) => {
    setVideoElement(element)
  }

  const handleFrameCapture = (frameData: FrameData) => {
    setCapturedFrame(frameData)
  }

  const handleVideoSelected = (videoSrc: string, videoType: string, fileName: string) => {
    // Clean up previous blob URL if it exists
    if (customVideoSrc && customVideoSrc.startsWith('blob:')) {
      URL.revokeObjectURL(customVideoSrc)
    }
    
    // Update video state
    setCustomVideoSrc(videoSrc)
    setCustomVideoType(videoType)
    setVideoName(fileName)
    
    // Reset captured frame when video changes
    setCapturedFrame(null)
  }

  const handleResetVideo = () => {
    // Clean up blob URL if it exists
    if (customVideoSrc && customVideoSrc.startsWith('blob:')) {
      URL.revokeObjectURL(customVideoSrc)
    }
    
    // Reset to default video
    setCustomVideoSrc(undefined)
    setCustomVideoType('video/mp4')
    setVideoName('Default Video')
    
    // Reset captured frame
    setCapturedFrame(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 py-8">
      <main className="w-full max-w-6xl px-4 flex flex-col gap-6">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Video Frame Exporter</h1>

        {/* Video Player - Top */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold text-gray-100">Video Player</h2>
            
            {customVideoSrc && (
              <button
                onClick={handleResetVideo}
                className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 transition-colors"
                aria-label="Reset to default video"
              >
                Reset to Default Video
              </button>
            )}
          </div>
          
          <VideoPlayer 
            onVideoElementReady={handleVideoElementReady}
            customVideoSrc={customVideoSrc}
            customVideoType={customVideoType}
            videoName={videoName}
          />
        </div>

        {/* Video Upload */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Upload Your Own Video</h2>
          <VideoUpload onVideoSelected={handleVideoSelected} />
        </div>

        {/* Actions and Export Options - Middle, side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Actions */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FrameCapture 
                videoElement={videoElement} 
                onCapture={handleFrameCapture} 
              />
              <DownloadButton
                frameData={capturedFrame}
                format={exportFormat}
                resolution={exportResolution}
              />
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Export Options</h2>
            <ExportOptions
              frameData={capturedFrame}
              format={exportFormat}
              resolution={exportResolution}
              onFormatChange={setExportFormat}
              onResolutionChange={setExportResolution}
            />
          </div>
        </div>

        {/* Preview - Bottom */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Preview</h2>
          <FramePreview 
            frameData={capturedFrame}
            exportFormat={exportFormat}
            exportResolution={exportResolution}
          />
        </div>
      </main>
    </div>
  )
}
