'use client'
import { useState } from 'react'
import Image from 'next/image'
import VideoPlayer from '@/components/VideoPlayer'
import FrameCapture from '@/components/FrameCapture'

type ExportFormat = 'png' | 'jpeg' | 'webp'
type ExportResolution = 'original' | '720p' | '1080p'

export default function Home() {
  // Video element reference
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // Captured frame data
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null)

  // Export options
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [exportResolution, setExportResolution] = useState<ExportResolution>('original')

  // @TODO: Add frame export button and handler
  // @TODO: Add error handling for video element operations

  const handleVideoElementReady = (element: HTMLVideoElement) => {
    setVideoElement(element)
  }

  const handleFrameCapture = (frameDataUrl: string) => {
    setCapturedFrame(frameDataUrl)
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

              {/* @TODO: Add frame export button */}
              <button
                className="flex-1 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!capturedFrame}
              >
                Export Frame
              </button>
            </div>

            {capturedFrame && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-200">Captured Frame</h3>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md border border-gray-600">
                  <Image
                    src={capturedFrame}
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
