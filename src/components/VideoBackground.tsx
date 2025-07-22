'use client';

import React, { useState, useEffect, useRef } from 'react';

const VideoBackground: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    '/assets/Videoplayback1.mp4',
    '/assets/Videoplayback2.mp4',
    '/assets/Videoplayback3.mp4'
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleEnded = () => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videos.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.src = videos[currentVideo];
      video.load();
    }
  }, [currentVideo, videos]);

  return (
    <div className="absolute inset-0 z-0">
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/60 animate-pulse" />
      )}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-60' : 'opacity-0'
        }`}
        preload="metadata"
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
};

export default VideoBackground; 