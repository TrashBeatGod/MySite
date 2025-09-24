import React, { useState, useRef, useEffect } from 'react';

const MusicPlayerFixed = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

  const addDebugInfo = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setDebugInfo(prev => [...prev, logEntry]);
    console.log(`[MusicPlayerFixed] ${message}`);
  };

  // 确定正确的音频URL
  useEffect(() => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    let url;
    if (isGitHubPages) {
      // GitHub Pages 环境 - 使用完整的绝对路径
      url = 'https://trashbeatgod.github.io/music/backgroundmusic.mp3';
      addDebugInfo(`GitHub Pages环境，使用完整URL: ${url}`);
    } else if (isLocalhost) {
      // 本地开发环境
      url = '/music/backgroundmusic.mp3';
      addDebugInfo(`本地开发环境，使用路径: ${url}`);
    } else {
      // 其他环境
      url = process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/music/backgroundmusic.mp3' : '/music/backgroundmusic.mp3';
      addDebugInfo(`其他环境，使用路径: ${url}`);
    }
    
    setAudioUrl(url);
    addDebugInfo(`最终音频URL: ${url}`);
    
    // 立即测试URL
    testAudioUrl(url);
  }, []);

  const testAudioUrl = async (fullUrl) => {
    try {
      addDebugInfo(`测试音频URL可访问性: ${fullUrl}`);
      
      const response = await fetch(fullUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        addDebugInfo(`✅ URL可访问！HTTP ${response.status}`);
        addDebugInfo(`文件大小: ${(contentLength / 1024 / 1024).toFixed(2)} MB`);
        addDebugInfo(`内容类型: ${contentType}`);
      } else {
        addDebugInfo(`❌ URL不可访问: HTTP ${response.status}`, 'error');
        
        // 尝试替代路径
        if (fullUrl.includes('/MySite/')) {
          addDebugInfo('尝试替代路径...', 'warning');
          const altUrl = fullUrl.replace('/MySite/music/', '/music/');
          testAlternativeUrl(altUrl);
        }
      }
    } catch (error) {
      addDebugInfo(`❌ 网络错误: ${error.message}`, 'error');
      
      // 尝试不同的路径策略
      addDebugInfo('尝试不同的路径策略...', 'warning');
      const currentPath = window.location.pathname;
      const relativePath = currentPath.endsWith('/') ? 
        'music/backgroundmusic.mp3' : 
        './music/backgroundmusic.mp3';
      addDebugInfo(`尝试相对路径: ${relativePath}`);
    }
  };

  const testAlternativeUrl = async (altUrl) => {
    try {
      addDebugInfo(`测试替代URL: ${altUrl}`);
      const response = await fetch(altUrl, { method: 'HEAD' });
      
      if (response.ok) {
        addDebugInfo(`✅ 替代URL可用！`);
        setAudioUrl(altUrl.replace(window.location.origin, ''));
      } else {
        addDebugInfo(`❌ 替代URL也不可用: HTTP ${response.status}`, 'error');
      }
    } catch (error) {
      addDebugInfo(`替代URL测试失败: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    if (!audioUrl) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    addDebugInfo('设置音频元素事件监听器');

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
    
    const handleError = (e) => {
      const errorCode = audio.error?.code;
      const errorMessage = getErrorMessage(errorCode);
      addDebugInfo(`音频错误: ${errorMessage} (代码: ${errorCode})`, 'error');
      setError(`音频加载失败: ${errorMessage}`);
      setIsPlaying(false);
      
      // 详细的错误处理
      handleAudioError(errorCode);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const handleAudioError = (errorCode) => {
    if (errorCode === 2) {
      addDebugInfo('网络错误 - 可能是404或网络连接问题', 'error');
      
      // 尝试使用不同的路径策略
      addDebugInfo('尝试路径修正策略...', 'warning');
      
      // 策略1: 尝试相对路径
      const currentPath = window.location.pathname;
      const relativePath = currentPath.includes('MySite') ? 
        '../music/backgroundmusic.mp3' : 
        './music/backgroundmusic.mp3';
      
      addDebugInfo(`尝试相对路径: ${relativePath}`);
      
      // 策略2: 尝试不同的基础路径
      setTimeout(() => {
        const altPaths = [
          '/music/backgroundmusic.mp3',
          './music/backgroundmusic.mp3',
          '../music/backgroundmusic.mp3',
          'music/backgroundmusic.mp3'
        ];
        
        altPaths.forEach((path, index) => {
          setTimeout(() => {
            testAlternativePath(path);
          }, index * 1000);
        });
      }, 2000);
    }
  };

  const testAlternativePath = async (path) => {
    try {
      const fullUrl = window.location.origin + path;
      addDebugInfo(`测试替代路径: ${path}`);
      
      const response = await fetch(fullUrl, { method: 'HEAD' });
      
      if (response.ok) {
        addDebugInfo(`✅ 找到可用路径: ${path}`);
        setAudioUrl(path);
        setError(null);
      } else {
        addDebugInfo(`❌ 路径不可用: ${path} (HTTP ${response.status})`);
      }
    } catch (error) {
      addDebugInfo(`路径测试错误: ${error.message}`);
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

  const getErrorMessage = (code) => {
    switch(code) {
      case 1: return 'MEDIA_ERR_ABORTED - 用户中止';
      case 2: return 'MEDIA_ERR_NETWORK - 网络错误(404或连接问题)';
      case 3: return 'MEDIA_ERR_DECODE - 解码错误';
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - 格式不支持';
      default: return '未知错误';
    }
  };

  return (
    <div className="music-player-fixed" style={{ 
      border: '2px solid #28a745', 
      borderRadius: '10px', 
      padding: '20px', 
      margin: '20px 0',
      backgroundColor: '#f8fff8'
    }}>
      <h3>🎵 音频播放器 (404修复版)</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>当前音频URL:</strong> 
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {window.location.origin + audioUrl}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
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
          backgroundColor: '#e8f4f8', 
          padding: '10px', 
          borderRadius: '5px',
          maxHeight: '150px',
          overflowY: 'auto',
          fontSize: '11px'
        }}>
          <strong>🔍 调试信息:</strong>
          {debugInfo.length === 0 ? (
            <div>等待日志...</div>
          ) : (
            debugInfo.map((log, index) => (
              <div key={index} style={{ fontFamily: 'monospace', margin: '1px 0' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerFixed;