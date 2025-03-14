'use client'
import { useState } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import FrameCapture from '@/components/FrameCapture'
import FramePreview from '@/components/FramePreview'
import ExportOptions, { ExportFormat, ExportResolution } from '@/components/ExportOptions'
import DownloadButton from '@/components/DownloadButton'
import { FrameData } from '@/utils/frameUtils'

export default function Home() {
  // Video element reference
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // Captured frame data
  const [capturedFrame, setCapturedFrame] = useState<FrameData | null>(null)

  // Export options
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [exportResolution, setExportResolution] = useState<ExportResolution>('100%')

  const handleVideoElementReady = (element: HTMLVideoElement) => {
    setVideoElement(element)
  }

  const handleFrameCapture = (frameData: FrameData) => {
    setCapturedFrame(frameData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 py-8">
      <main className="w-full max-w-6xl px-4 flex flex-col gap-6">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Video Frame Exporter</h1>

        {/* Video Player - Top */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Video Player</h2>
          <VideoPlayer onVideoElementReady={handleVideoElementReady} />
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
