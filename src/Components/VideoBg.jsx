// VideoBackground.js
import React from 'react';
import '../Styles/VideoBg.css';

const VideoBackground = () => {
  return (
    <video className="video-bg grain-effect" autoPlay loop muted>
      <source src="/backgrounds/bg01.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;
