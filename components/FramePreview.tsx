'use client'
import Image from 'next/image'
import { FrameData } from '@/utils/frameUtils'

interface FramePreviewProps {
  frameData: FrameData | null
  exportFormat: 'png' | 'jpeg' | 'webp'
  exportResolution: 'original' | '720p' | '1080p'
}

const FramePreview = ({ frameData, exportFormat, exportResolution }: FramePreviewProps) => {
  // Format the timestamp as minutes:seconds.milliseconds
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const milliseconds = Math.floor((seconds % 1) * 1000)

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }

  if (!frameData) {
    return (
      <div className="mt-6 p-4 bg-gray-700 rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-400 text-center">
          No frame captured yet. <br />
          Use the "Capture Frame" button to capture a frame from the video.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-medium mb-3 text-gray-200">Captured Frame</h3>

      {/* Frame metadata */}
      <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div className="bg-gray-800 p-2 rounded">
          <span className="block text-gray-400">Dimensions</span>
          <span className="font-mono">{frameData.width} × {frameData.height}</span>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <span className="block text-gray-400">Timestamp</span>
          <span className="font-mono">{formatTimestamp(frameData.timestamp)}</span>
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
          src={frameData.dataUrl}
          alt="Captured frame"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}

export default FramePreview 