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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <main className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Video Frame Exporter</h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Video Player</h2>
          <VideoPlayer onVideoElementReady={handleVideoElementReady} />

          <div className="mt-6 space-y-6">
            {/* Export options component */}
            <ExportOptions
              frameData={capturedFrame}
              format={exportFormat}
              resolution={exportResolution}
              onFormatChange={setExportFormat}
              onResolutionChange={setExportResolution}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Frame capture button */}
              <FrameCapture 
                videoElement={videoElement} 
                onCapture={handleFrameCapture} 
              />

              {/* Download button component */}
              <DownloadButton
                frameData={capturedFrame}
                format={exportFormat}
                resolution={exportResolution}
              />
            </div>

            {/* Frame preview component */}
            <FramePreview 
              frameData={capturedFrame}
              exportFormat={exportFormat}
              exportResolution={exportResolution}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
