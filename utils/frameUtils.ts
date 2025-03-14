export interface FrameData {
  dataUrl: string;
  width: number;
  height: number;
  timestamp: number;
  originalFormat: string;
}

/**
 * Captures the current frame from a video element with metadata
 * @param videoElement The HTML video element to capture from
 * @param format The format to use for the data URL (png, jpeg, webp)
 * @param quality The quality to use for jpeg and webp formats (0-1)
 * @returns A FrameData object containing the frame data URL and metadata
 */
export const captureVideoFrame = (
  videoElement: HTMLVideoElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): FrameData | null => {
  if (!videoElement) return null;

  try {
    // Create a canvas element with the same dimensions as the video
    const canvas = document.createElement('canvas');
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // Draw the current video frame to the canvas
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    context.drawImage(videoElement, 0, 0, width, height);

    // Get the mime type based on the format
    const mimeType = `image/${format}`;
    
    // Convert the canvas to a data URL with the specified format and quality
    const dataUrl = format === 'png' 
      ? canvas.toDataURL(mimeType) 
      : canvas.toDataURL(mimeType, quality);

    // Return the frame data with metadata
    return {
      dataUrl,
      width,
      height,
      timestamp: videoElement.currentTime,
      originalFormat: 'video/mp4', // Assuming mp4, could be made dynamic
    };
  } catch (error) {
    console.error('Error capturing frame:', error);
    return null;
  }
};

/**
 * Resizes a frame data URL to the specified resolution
 * @param frameData The original frame data
 * @param resolution The target resolution ('100%', '75%', '50%', '25%')
 * @param format The output format
 * @param quality The quality for jpeg and webp formats
 * @returns A new FrameData object with the resized image
 */
export const resizeFrame = (
  frameData: FrameData,
  resolution: '100%' | '75%' | '50%' | '25%',
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): Promise<FrameData> => {
  return new Promise((resolve, reject) => {
    if (resolution === '100%') {
      // If original resolution, just change format if needed
      if (format === 'png' && frameData.dataUrl.includes('image/png')) {
        resolve(frameData);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = frameData.width;
        canvas.height = frameData.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const mimeType = `image/${format}`;
        const dataUrl = format === 'png' 
          ? canvas.toDataURL(mimeType) 
          : canvas.toDataURL(mimeType, quality);
        
        resolve({
          ...frameData,
          dataUrl
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
      img.src = frameData.dataUrl;
      return;
    }
    
    // Calculate new dimensions based on percentage
    const percentage = parseInt(resolution.replace('%', '')) / 100;
    const targetWidth = Math.round(frameData.width * percentage);
    const targetHeight = Math.round(frameData.height * percentage);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the image with the new dimensions
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to the specified format
      const mimeType = `image/${format}`;
      const dataUrl = format === 'png' 
        ? canvas.toDataURL(mimeType) 
        : canvas.toDataURL(mimeType, quality);
      
      resolve({
        dataUrl,
        width: targetWidth,
        height: targetHeight,
        timestamp: frameData.timestamp,
        originalFormat: frameData.originalFormat
      });
    };
    
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = frameData.dataUrl;
  });
};

/**
 * Downloads a frame as an image file
 * @param frameData The frame data to download
 * @param filename The filename to use (without extension)
 * @param format The format to use (png, jpeg, webp)
 */
export const downloadFrame = (
  frameData: FrameData,
  filename: string,
  format: 'png' | 'jpeg' | 'webp'
): void => {
  // Create a link element
  const link = document.createElement('a');
  
  // Set the href to the data URL
  link.href = frameData.dataUrl;
  
  // Set the download attribute with the filename and extension
  link.download = `${filename}.${format}`;
  
  // Append the link to the document
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Remove the link from the document
  document.body.removeChild(link);
}; 