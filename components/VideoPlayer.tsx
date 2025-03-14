const VideoPlayer = () => {

  return (
    <div className="video-container">
      <video
        className="w-full h-auto"
        autoPlay
        loop
        controls
      >
        <source src="/video_640_360_24fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer;