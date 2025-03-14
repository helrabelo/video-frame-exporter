'use client'
import { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
  onVideoElementReady?: (videoElement: HTMLVideoElement) => void;
}

const VideoPlayer = ({ onVideoElementReady }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleLoadedData = () => {
    if (videoRef.current && onVideoElementReady) {
      onVideoElementReady(videoRef.current);
    }
  };

  // Format the timestamp as minutes:seconds.milliseconds
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
      
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
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
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <div>Status: {isPlaying ? 'Playing' : 'Paused'}</div>
        <div>Time: {formatTimestamp(currentTime)}</div>
      </div>
    </div>
  );
};

export default VideoPlayer;