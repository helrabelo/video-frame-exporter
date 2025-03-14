'use client'
import { useState } from 'react'
import VideoPlayer from '@/components/VideoPlayer'

type ExportFormat = 'png' | 'jpeg' | 'webp'
type ExportResolution = 'original' | '720p' | '1080p'

export default function Home() {
  // @TODO: Implement frame capture functionality using videoElement
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // @TODO: Update capturedFrame when a frame is captured from the video
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null)

  // @TODO: Apply selected format when exporting the captured frame
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')

  // @TODO: Apply selected resolution when capturing and exporting the frame
  const [exportResolution, setExportResolution] = useState<ExportResolution>('original')

  // @TODO: Add frame capture button and handler
  // @TODO: Add frame export button and handler
  // @TODO: Add error handling for video element operations

  const handleVideoElementReady = (element: HTMLVideoElement) => {
    setVideoElement(element)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main>
        <h1 className="text-3xl font-bold mb-6 text-center">Video Frame Exporter</h1>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Video Player</h2>
          <VideoPlayer onVideoElementReady={handleVideoElementReady} />

          <div className="mt-6 space-y-4">
            {/* @TODO: Add frame capture controls */}
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <select
                  value={exportResolution}
                  onChange={(e) => setExportResolution(e.target.value as ExportResolution)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="original">Original</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>
            </div>

            {/* @TODO: Add frame capture button */}
            {/* @TODO: Add frame export button */}

            {capturedFrame && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Captured Frame</h3>
                <img
                  src={capturedFrame}
                  alt="Captured frame"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
