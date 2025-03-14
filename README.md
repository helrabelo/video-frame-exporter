# Video Frame Exporter

A modern web application that allows users to extract and export frames from videos in various formats and resolutions.

![Video Frame Exporter](https://via.placeholder.com/800x400?text=Video+Frame+Exporter)

## Features

- **Video Playback**: Play, pause, seek, and control volume of video content
- **Video Upload**: Upload your own videos with drag-and-drop or file selection
- **Frame Capture**: Capture frames at specific timestamps from the video
- **Export Options**: 
  - Multiple image formats (PNG, JPEG, WebP)
  - Various resolution options (100%, 75%, 50%, 25%)
- **Frame Preview**: Preview captured frames before downloading
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Metadata Display**: Shows frame dimensions, timestamp, and export settings

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with Tailwind CSS 4
- **Language**: TypeScript
- **Media Processing**: HTML5 Canvas API for frame capture and processing
- **File Handling**: Browser File API for video uploads
- **State Management**: React Hooks for local state management
- **Styling**: Tailwind CSS for responsive design

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/video-frame-exporter.git
   cd video-frame-exporter
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Load a Video**: 
   - The application comes with a default sample video
   - You can upload your own video using the upload section
   - Supported formats: MP4, WebM, OGG (max 100MB)

2. **Play the Video**: Use the video controls to play, pause, and seek to the desired frame.

3. **Capture a Frame**: Click the "Capture Frame" button to capture the current frame.

4. **Configure Export Options**: Select your desired format (PNG, JPEG, WebP) and resolution (100%, 75%, 50%, 25%).

5. **Download the Frame**: Click the "Download Frame" button to save the captured frame to your device.

6. **Switch Videos**: You can switch back to the default video at any time by clicking the "Reset to Default Video" button.

## Project Structure

```
video-frame-exporter/
├── app/                  # Next.js app router
│   └── page.tsx          # Main application page
├── components/           # React components
│   ├── DownloadButton.tsx    # Frame download functionality
│   ├── ExportOptions.tsx     # Format and resolution options
│   ├── FrameCapture.tsx      # Frame capture functionality
│   ├── FramePreview.tsx      # Frame preview display
│   ├── VideoPlayer.tsx       # Video playback component
│   └── VideoUpload.tsx       # Video upload component
├── public/               # Static assets
│   └── video_640_360_24fps.mp4  # Sample video
├── utils/                # Utility functions
│   └── frameUtils.ts     # Frame capture and processing utilities
└── ...                   # Configuration files
```

## Assumptions

- The application assumes modern browser support for HTML5 video, canvas APIs, and File APIs.
- The sample video is in MP4 format, but the application can work with any format supported by the browser.
- Frame capture works best with videos that have a consistent frame rate.
- The application processes frames client-side, so performance may vary based on device capabilities.
- Uploaded videos are processed entirely in the browser and are not sent to any server.

## Accessibility

- The application is fully keyboard navigable
- All interactive elements have appropriate ARIA attributes
- Error messages are clearly displayed and announced to screen readers
- Color contrast meets WCAG 2.1 AA standards
- Video controls are accessible with keyboard and screen readers

## Future Improvements

- **Multiple Video Support**: Allow users to manage a library of uploaded videos
- **Batch Frame Export**: Capture multiple frames at once
- **Advanced Export Options**: Additional formats, quality settings, and filters
- **Frame Navigation**: Frame-by-frame navigation controls
- **Timeline Markers**: Visual markers for captured frames on the video timeline
- **Cloud Integration**: Save frames to cloud storage services
- **Video Trimming**: Extract video clips in addition to single frames
- **Keyboard Shortcuts**: Improve accessibility and power user experience

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the excellent framework
- Tailwind CSS for the styling utilities
- The open-source community for inspiration and tools
