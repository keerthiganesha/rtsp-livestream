// src/App.js

import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import Overlay from './components/Overlay';

function App() {
  const streamUrl = ''; // Replace with your actual stream URL

  return (
    <div className="App">
      <h1>Livestream with Draggable Overlays</h1>
      
      {/* Wrapping the video and overlay in a relative container */}
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        <VideoPlayer streamUrl={streamUrl} />
        <Overlay />
      </div>
      
    </div>
  );
}

export default App;
