import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onTimeUpdate?: (currentTime: number) => void;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  title,
  onTimeUpdate,
  autoPlay = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const hideControlsTimeout = useRef<number | null>(null);

  // Initialize video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    
    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
    };
  }, [onTimeUpdate]);
  
  // Control autoplay and playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (playing) {
      video.play().catch(() => {
        setPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [playing]);
  
  // Control volume and mute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = volume;
    video.muted = muted;
  }, [volume, muted]);
  
  // Control playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = playbackRate;
  }, [playbackRate]);
  
  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    
    const resetTimer = () => {
      if (hideControlsTimeout.current) {
        window.clearTimeout(hideControlsTimeout.current);
      }
      
      hideControlsTimeout.current = window.setTimeout(() => {
        if (playing) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetTimer();
    
    return () => {
      if (hideControlsTimeout.current) {
        window.clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [showControls, playing]);
  
  const togglePlay = () => {
    setPlaying(!playing);
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progress = progressRef.current;
    const video = videoRef.current;
    if (!progress || !video) return;
    
    const rect = progress.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };
  
  const seekForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += 30;
  };
  
  const seekBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime -= 30;
  };
  
  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
  };
  
  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
  };
  
  return (
    <div 
      ref={playerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full"
        poster={`https://image.mux.com/${videoUrl.split('/').pop()}/thumbnail.jpg`}
        playsInline
        onClick={togglePlay}
      />
      
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03A9F4]"></div>
        </div>
      )}
      
      {/* Video Controls */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="h-1 bg-gray-600 rounded-full mb-4 cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="absolute h-full bg-[#03A9F4] rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
            <div 
              className="absolute h-3 w-3 bg-[#03A9F4] rounded-full -mt-1 transform -translate-y-[25%]"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-[#03A9F4] transition-colors"
              >
                {playing ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button 
                onClick={seekBackward}
                className="text-white hover:text-[#03A9F4] transition-colors"
              >
                <SkipBack size={20} />
              </button>
              
              <button 
                onClick={seekForward}
                className="text-white hover:text-[#03A9F4] transition-colors"
              >
                <SkipForward size={20} />
              </button>
              
              <div className="flex items-center">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-[#03A9F4] transition-colors mr-2"
                >
                  {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-[#03A9F4]"
                />
              </div>
              
              <div className="text-sm text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="text-white hover:text-[#03A9F4] transition-colors">
                  {playbackRate}x
                </button>
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button 
                      key={rate}
                      onClick={() => handleChangePlaybackRate(rate)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 ${
                        playbackRate === rate ? 'text-[#03A9F4]' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-[#03A9F4] transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Title overlay - only show when controls are hidden */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          !showControls && playing ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <h2 className="text-white text-lg font-medium">{title}</h2>
      </div>
      
      {/* Play/Pause overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={togglePlay}
            className="bg-[#03A9F4] bg-opacity-80 hover:bg-opacity-100 rounded-full p-5 transition-all transform hover:scale-105"
          >
            <Play size={32} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;