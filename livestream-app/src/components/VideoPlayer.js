import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';  // Importing HLS.js for HLS stream handling
const hls = new Hls();

const VideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Check if HLS is supported natively by the browser
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'http://127.0.0.1:5000/hls/output.m3u8';  // Use your HLS stream URL
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('http://127.0.0.1:5000/hls/output.m3u8');  // Use your HLS stream URL
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else {
      console.error('HLS is not supported in this browser');
    }

    return () => {
      // Cleanup HLS when component unmounts
      if (Hls.isSupported()) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '500px'}}>
      <video ref={videoRef} controls muted style={{ width: '100%', height: '100%' }} />
    </div>

  );
};

export default VideoPlayer;
