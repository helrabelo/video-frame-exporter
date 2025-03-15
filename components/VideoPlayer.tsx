'use client'
import { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
  onVideoElementReady?: (videoElement: HTMLVideoElement) => void;
  onVideoError?: (errorMessage: string) => void;
  customVideoSrc?: string;
  customVideoType?: string;
  videoName?: string;
}

const VideoPlayer = ({ 
  onVideoElementReady, 
  onVideoError,
  customVideoSrc, 
  customVideoType = 'video/mp4',
  videoName = 'Default Video'
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iOSDevice, setIOSDevice] = useState(false);
  
  // Detect iOS device
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIOSDevice(isIOS);
  }, []);
  
  // Reset video state when source changes
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setVideoError(null);
    setIsLoading(true);
  }, [customVideoSrc]);

  const handleLoadedData = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoError(null);
      setIsLoading(false);
      
      if (onVideoElementReady) {
        onVideoElementReady(videoRef.current);
      }
    }
  };

  const handleVideoError = () => {
    let errorMessage = '';
    
    if (customVideoType === 'video/quicktime' && !iOSDevice) {
      errorMessage = 'This MOV file may use a codec not supported by your browser. On desktop browsers, MP4 format is recommended.';
    } else if (customVideoSrc && customVideoSrc.startsWith('blob:')) {
      errorMessage = 'Error loading video. The file may be corrupted or use an unsupported format/codec.';
    } else {
      errorMessage = 'Error loading video. Please try another file or use the default video.';
    }
    
    setVideoError(errorMessage);
    setIsLoading(false);
    
    if (onVideoError) {
      onVideoError(errorMessage);
    }
  };

  // Format the timestamp as minutes:seconds.milliseconds
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          // Handle autoplay restrictions
          if (err.name === 'NotAllowedError') {
            setVideoError('Autoplay is not allowed. Please click play to start the video.');
          }
        });
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
      const handleDurationChange = () => setDuration(videoElement.duration);
      const handleVolumeChange = () => {
        setVolume(videoElement.volume);
        setIsMuted(videoElement.muted);
      };
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      const handleWaiting = () => {
        setIsLoading(true);
      };
      const handleCanPlay = () => {
        setIsLoading(false);
      };
      
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('durationchange', handleDurationChange);
      videoElement.addEventListener('volumechange', handleVolumeChange);
      videoElement.addEventListener('waiting', handleWaiting);
      videoElement.addEventListener('canplay', handleCanPlay);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('durationchange', handleDurationChange);
        videoElement.removeEventListener('volumechange', handleVolumeChange);
        videoElement.removeEventListener('waiting', handleWaiting);
        videoElement.removeEventListener('canplay', handleCanPlay);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, []);

  // Show a special message for iOS users
  const getIOSMessage = () => {
    if (iOSDevice && customVideoSrc) {
      return (
        <div className="mt-2 text-xs text-indigo-400 bg-indigo-900/20 p-2 rounded-md text-center">
          <p className="font-medium">iPhone/iPad User Detected</p>
          <p>For best results when uploading videos directly from your device, use the &quot;Upload from Files&quot; option after tapping &quot;Click to upload&quot;.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="video-container">
      {getIOSMessage()}
      
      <div className="relative rounded-lg overflow-hidden bg-black max-w-3xl mx-auto mt-2">
        {isLoading && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="mt-2 text-sm text-white">Loading video...</span>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          className="w-full h-auto"
          autoPlay
          playsInline
          muted={iOSDevice} // iOS usually requires muted for autoplay
          onLoadedData={handleLoadedData}
          onError={handleVideoError}
          aria-label={`Video player - ${videoName}`}
          key={customVideoSrc || 'default'}
        >
          {customVideoSrc ? (
            <source src={customVideoSrc} type={customVideoType} />
          ) : (
            <source src="/video_640_360_24fps.mp4" type="video/mp4" />
          )}
          Your browser does not support the video tag.
        </video>
        
        {/* Custom controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity opacity-90 hover:opacity-100 flex flex-col gap-2">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white font-mono">{formatTimestamp(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
              aria-label="Video progress"
              disabled={isLoading || !!videoError}
            />
            <span className="text-xs text-white font-mono">{formatTimestamp(duration)}</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={isLoading || !!videoError}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  disabled={isLoading || !!videoError}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
                  aria-label="Volume"
                  disabled={isLoading || !!videoError}
                />
              </div>
            </div>
            
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              disabled={isLoading || !!videoError}
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v4a1 1 0 01-1 1H1a1 1 0 010-2h1V5a3 3 0 013-3h4a1 1 0 010 2H5zm10 8h-1v3a1 1 0 01-1 1H9a1 1 0 010 2h4a3 3 0 003-3v-4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-400 text-center">
        {videoError ? (
          <div className="text-red-500">{videoError}</div>
        ) : (
          <>
            <div className="font-medium">{videoName}</div>
            <div>Current time: {formatTimestamp(currentTime)}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;