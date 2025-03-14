'use client'
import { useState, useEffect, useCallback } from 'react'
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
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false)
  const [videoLoadError, setVideoLoadError] = useState<string | null>(null)
  const [loadAttempts, setLoadAttempts] = useState<number>(0)
  
  // Clean up blob URLs when component unmounts or when a new video is uploaded
  useEffect(() => {
    return () => {
      if (customVideoSrc && customVideoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(customVideoSrc)
      }
    }
  }, [customVideoSrc])

  // Reset to default video if we've had multiple failed attempts
  useEffect(() => {
    if (loadAttempts >= 2 && customVideoSrc) {
      // Too many failed attempts, revert to default
      handleResetVideo();
      setVideoLoadError("Multiple loading failures. Reverting to default video.");
    }
  }, [loadAttempts]);

  const handleVideoElementReady = useCallback((element: HTMLVideoElement) => {
    setVideoElement(element)
    setIsVideoLoading(false)
    setVideoLoadError(null)
    setLoadAttempts(0) // Reset attempts counter on successful load
  }, []);

  const handleVideoError = useCallback((errorMessage: string) => {
    setVideoLoadError(errorMessage)
    setIsVideoLoading(false)
    setLoadAttempts(prev => prev + 1)
    
    // If there was an error loading the custom video and we've tried multiple times, revert to default
    if (customVideoSrc && loadAttempts >= 1) {
      handleResetVideo()
    }
  }, [customVideoSrc, loadAttempts]);

  const handleFrameCapture = useCallback((frameData: FrameData) => {
    setCapturedFrame(frameData)
  }, []);

  const handleVideoSelected = useCallback((videoSrc: string, videoType: string, fileName: string) => {
    // Set loading state
    setIsVideoLoading(true)
    setVideoLoadError(null)
    setLoadAttempts(0) // Reset attempts counter
    
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
  }, [customVideoSrc]);

  const handleResetVideo = useCallback(() => {
    // Set loading state
    setIsVideoLoading(true)
    setVideoLoadError(null)
    setLoadAttempts(0) // Reset attempts counter
    
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
  }, [customVideoSrc]);

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
                className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Reset to default video"
                disabled={isVideoLoading}
              >
                Reset to Default Video
              </button>
            )}
          </div>
          
          {videoLoadError && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 text-sm">
              <p className="font-medium">Error:</p>
              <p>{videoLoadError}</p>
              {customVideoSrc && (
                <button 
                  onClick={handleResetVideo}
                  className="mt-2 text-xs underline hover:text-red-300"
                >
                  Reset to default video
                </button>
              )}
            </div>
          )}
          
          <div className={isVideoLoading ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
            <VideoPlayer 
              onVideoElementReady={handleVideoElementReady}
              onVideoError={handleVideoError}
              customVideoSrc={customVideoSrc}
              customVideoType={customVideoType}
              videoName={videoName}
            />
          </div>
        </div>

        {/* Video Upload */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Upload Your Own Video</h2>
          <VideoUpload 
            onVideoSelected={handleVideoSelected} 
            isProcessing={isVideoLoading}
          />
          <p className="mt-4 text-xs text-gray-400">
            Note: Video processing happens entirely in your browser. No files are uploaded to any server.
          </p>
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
