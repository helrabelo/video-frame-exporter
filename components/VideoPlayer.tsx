'use client'
import { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
  onVideoElementReady?: (videoElement: HTMLVideoElement) => void;
}

const VideoPlayer = ({ onVideoElementReady }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLoadedData = () => {
    if (videoRef.current && onVideoElementReady) {
      onVideoElementReady(videoRef.current);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="w-full h-auto"
        autoPlay
        loop
        controls
        onLoadedData={handleLoadedData}
      >
        <source src="/video_640_360_24fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="mt-2 text-sm text-gray-500">
        Status: {isPlaying ? 'Playing' : 'Paused'}
      </div>
    </div>
  );
};

export default VideoPlayer;