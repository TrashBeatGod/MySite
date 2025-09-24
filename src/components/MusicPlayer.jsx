import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };
    const handleError = (e) => {
      console.error('音频加载失败:', e);
      setError('音频文件加载失败');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setError(null);
      }).catch(error => {
        console.error('播放失败:', error);
        setError('播放失败，请重试');
        setIsPlaying(false);
      });
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = e.target.value / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="music-player-custom">
      <audio
        ref={audioRef}
        src={process.env.PUBLIC_URL + "/music/backgroundmusic.mp3"}
        preload="metadata"
      />
      
      <div className="player-container">
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        
        <div className="player-main">
          <button 
            className={`play-btn ${isPlaying ? 'playing' : ''} ${!isLoaded ? 'disabled' : ''}`}
            onClick={togglePlayPause}
            title={!isLoaded ? '加载中...' : isPlaying ? '暂停' : '播放'}
            disabled={!isLoaded}
          >
            {!isLoaded ? '⏳' : isPlaying ? '⏸' : '▶'}
          </button>
          
          <div className="progress-container">
            <span className="time current">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="progress-bar"
              value={progressPercentage}
              onChange={handleProgressChange}
              min="0"
              max="100"
              step="0.1"
              disabled={!isLoaded}
            />
            <span className="time duration">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="player-controls">
          <button 
            className={`volume-btn ${isMuted ? 'muted' : ''} ${!isLoaded ? 'disabled' : ''}`}
            onClick={toggleMute}
            title={isMuted ? '取消静音' : '静音'}
            disabled={!isLoaded}
          >
            {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔉'}
          </button>
          
          <input
            type="range"
            className="volume-slider"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            min="0"
            max="100"
            step="1"
            disabled={!isLoaded}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;