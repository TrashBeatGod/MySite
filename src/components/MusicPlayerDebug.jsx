import React, { useState, useRef, useEffect } from 'react';

const MusicPlayerDebug = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const [networkStatus, setNetworkStatus] = useState('checking');
  const audioRef = useRef(null);

  const addDebugInfo = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setDebugInfo(prev => [...prev, logEntry]);
    console.log(`[MusicPlayer] ${message}`);
  };

  useEffect(() => {
    addDebugInfo('组件初始化，开始音频加载测试');
    
    // 检查网络连接
    checkNetworkConnection();
    
    // 检查音频URL
    const audioUrl = process.env.PUBLIC_URL + "/music/backgroundmusic.mp3";
    addDebugInfo(`音频URL: ${audioUrl}`);
    
    // 检查GitHub Pages环境
    const isGitHubPages = window.location.hostname.includes('github.io');
    addDebugInfo(`GitHub Pages环境: ${isGitHubPages}`);
    addDebugInfo(`当前域名: ${window.location.hostname}`);
    addDebugInfo(`PUBLIC_URL: ${process.env.PUBLIC_URL}`);
    
  }, []);

  const checkNetworkConnection = async () => {
    try {
      const audioUrl = process.env.PUBLIC_URL + "/music/backgroundmusic.mp3";
      addDebugInfo(`测试网络连接: ${audioUrl}`);
      
      const response = await fetch(audioUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        addDebugInfo(`网络连接成功: HTTP ${response.status}`);
        addDebugInfo(`文件大小: ${contentLength} bytes (${(contentLength / 1024 / 1024).toFixed(2)} MB)`);
        addDebugInfo(`内容类型: ${contentType}`);
        setNetworkStatus('connected');
      } else {
        addDebugInfo(`网络连接失败: HTTP ${response.status}`, 'error');
        setNetworkStatus('failed');
      }
    } catch (error) {
      addDebugInfo(`网络连接错误: ${error.message}`, 'error');
      setNetworkStatus('error');
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    addDebugInfo('音频元素已创建，开始设置事件监听器');

    const updateTime = () => setCurrentTime(audio.currentTime);
    
    const updateDuration = () => {
      addDebugInfo(`元数据加载成功，音频时长: ${audio.duration}秒`);
      setDuration(audio.duration);
      setIsLoaded(true);
      setError(null);
    };
    
    const handleLoadStart = () => {
      addDebugInfo('音频开始加载');
      setIsLoaded(false);
    };
    
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        addDebugInfo(`加载进度: ${bufferedEnd.toFixed(1)} / ${audio.duration.toFixed(1)}秒`);
      }
    };
    
    const handleCanPlay = () => {
      addDebugInfo('音频可以开始播放');
    };
    
    const handleCanPlayThrough = () => {
      addDebugInfo('音频可以完整播放（无需缓冲）');
    };
    
    const handleWaiting = () => {
      addDebugInfo('等待缓冲...');
    };
    
    const handlePlaying = () => {
      addDebugInfo('开始播放');
    };
    
    const handleEnded = () => {
      addDebugInfo('播放结束');
      setIsPlaying(false);
      audio.currentTime = 0;
    };
    
    const handleError = (e) => {
      const errorCode = audio.error?.code;
      const errorMessage = getErrorMessage(errorCode);
      addDebugInfo(`音频错误: ${errorMessage} (代码: ${errorCode})`, 'error');
      setError(`音频加载失败: ${errorMessage}`);
      setIsPlaying(false);
      
      // 详细错误分析
      if (errorCode === 2) {
        addDebugInfo('网络错误 - 可能是文件路径错误或网络问题', 'error');
        checkFileExists();
      } else if (errorCode === 4) {
        addDebugInfo('格式不支持 - 检查音频文件格式', 'error');
      }
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const checkFileExists = async () => {
    try {
      const audioUrl = process.env.PUBLIC_URL + "/music/backgroundmusic.mp3";
      addDebugInfo(`检查文件是否存在: ${audioUrl}`);
      
      const response = await fetch(audioUrl, { method: 'HEAD' });
      addDebugInfo(`文件检查响应: HTTP ${response.status}`);
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        addDebugInfo(`文件存在，大小: ${contentLength} bytes`);
      } else {
        addDebugInfo(`文件不存在或无法访问: ${response.status}`, 'error');
      }
    } catch (error) {
      addDebugInfo(`文件检查失败: ${error.message}`, 'error');
    }
  };

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) {
      addDebugInfo('无法播放: 音频未加载完成', 'warning');
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        addDebugInfo('暂停播放');
      } else {
        addDebugInfo('尝试开始播放...');
        await audio.play();
        setIsPlaying(true);
        setError(null);
        addDebugInfo('播放成功');
      }
    } catch (error) {
      addDebugInfo(`播放失败: ${error.message}`, 'error');
      setError(`播放失败: ${error.message}`);
      setIsPlaying(false);
      
      if (error.name === 'NotAllowedError') {
        addDebugInfo('播放被浏览器阻止 - 需要用户交互', 'error');
      }
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    addDebugInfo(`跳转到: ${newTime.toFixed(1)}秒`);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = e.target.value / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    addDebugInfo(`音量设置为: ${Math.round(newVolume * 100)}%`);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.7;
      setIsMuted(false);
      addDebugInfo('取消静音');
    } else {
      audio.volume = 0;
      setIsMuted(true);
      addDebugInfo('静音');
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const getErrorMessage = (code) => {
    switch(code) {
      case 1: return 'MEDIA_ERR_ABORTED - 用户中止';
      case 2: return 'MEDIA_ERR_NETWORK - 网络错误';
      case 3: return 'MEDIA_ERR_DECODE - 解码错误';
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - 格式不支持';
      default: return '未知错误';
    }
  };

  return (
    <div className="music-player-debug" style={{ 
      border: '2px solid #007bff', 
      borderRadius: '10px', 
      padding: '20px', 
      margin: '20px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🎵 音频播放器 (调试模式)</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>网络状态:</strong> 
        <span style={{ 
          color: networkStatus === 'connected' ? 'green' : 
                 networkStatus === 'failed' ? 'red' : 'orange' 
        }}>
          {networkStatus === 'connected' ? '✅ 已连接' : 
           networkStatus === 'failed' ? '❌ 连接失败' : 
           networkStatus === 'error' ? '⚠️ 连接错误' : '⏳ 检测中...'}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={process.env.PUBLIC_URL + "/music/backgroundmusic.mp3"}
        preload="metadata"
      />
      
      <div className="player-container">
        {error && (
          <div className="error-message" style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '10px'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <div className="player-main" style={{ marginBottom: '15px' }}>
          <button 
            className={`play-btn ${isPlaying ? 'playing' : ''} ${!isLoaded ? 'disabled' : ''}`}
            onClick={togglePlayPause}
            title={!isLoaded ? '加载中...' : isPlaying ? '暂停' : '播放'}
            disabled={!isLoaded}
            style={{ marginRight: '10px' }}
          >
            {!isLoaded ? '⏳' : isPlaying ? '⏸' : '▶'}
          </button>
          
          <div className="progress-container" style={{ display: 'inline-block', width: '300px' }}>
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
              style={{ width: '200px', margin: '0 10px' }}
            />
            <span className="time duration">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="player-controls" style={{ marginBottom: '15px' }}>
          <button 
            className={`volume-btn ${isMuted ? 'muted' : ''} ${!isLoaded ? 'disabled' : ''}`}
            onClick={toggleMute}
            title={isMuted ? '取消静音' : '静音'}
            disabled={!isLoaded}
            style={{ marginRight: '10px' }}
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
            style={{ width: '150px' }}
          />
        </div>

        <div style={{ 
          backgroundColor: '#e9ecef', 
          padding: '10px', 
          borderRadius: '5px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <strong>🔍 调试日志:</strong>
          {debugInfo.length === 0 ? (
            <div>等待日志...</div>
          ) : (
            debugInfo.map((log, index) => (
              <div key={index} style={{ fontSize: '12px', fontFamily: 'monospace', margin: '2px 0' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerDebug;