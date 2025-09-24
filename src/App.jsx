import React, { useState, useEffect } from 'react'
import './App.css'
// 音乐播放器已移除 // import MusicPlayer from './components/MusicPlayerFixed'

function App() {
  const [aboutVisible, setAboutVisible] = useState(false)
  const [cooperationVisible, setCooperationVisible] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(true)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // 切换合作内容显示
  const toggleCooperation = () => {
    setCooperationVisible(!cooperationVisible)
  }

  // 切换关于内容显示
  const toggleAbout = () => {
    setAboutVisible(!aboutVisible)
  }

  const toggleSection = (section) => {
    if (section === 'cooperation') {
      setCooperationVisible(!cooperationVisible)
      setAboutVisible(false)
      setWelcomeVisible(false)
    } else if (section === 'about') {
      setAboutVisible(!aboutVisible)
      setCooperationVisible(false)
      setWelcomeVisible(false)
    }
  }

  const hideWelcome = () => {
    const welcomePanel = document.querySelector('.welcome-panel')
    if (welcomePanel) {
      welcomePanel.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out'
      welcomePanel.style.opacity = '0'
      welcomePanel.style.transform = 'translate(-50%, -50%) scale(0.9)'
      
      setTimeout(() => {
        setWelcomeVisible(false)
      }, 800)
    }
  }



  // 切换侧边栏展开/收起
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  // 检查设备类型
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return (
    <div className="App">

      {/* 顶部横联 - 专注说唱混音三年 */}
      <div className="top-banner">
        <div className="banner-text">专注说唱混音三年</div>
      </div>

      <div className="main-layout">
        {/* 侧边栏展开/收起按钮 - 移出侧边栏 */}
        <button className={`sidebar-toggle ${sidebarExpanded ? 'expanded' : 'collapsed'}`} onClick={toggleSidebar}>
          <span className="toggle-icon">
            {sidebarExpanded ? '<' : '>'}
          </span>
        </button>
        
        {/* 侧边栏 */}
        <div className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-header">
            <h2>MOSHPIT</h2>
            <p>专业说唱混音</p>
          </div>
          
          <div className="sidebar-menu">
            {/* 混音作品集 */}
            <div className="menu-item">
              <button 
                className="menu-button"
                onClick={() => window.open('https://music.163.com/playlist?id=8271964710&uct2=U2FsdGVkX18KK8mXrFwu862BCJx4HMlW1UO3yPd1X4Q=', '_blank')}
              >
                <span className="menu-icon">🎧</span>
                <span className="menu-text">混音作品集</span>
                <span className="menu-icon">🎼</span>
              </button>
            </div>

            {/* 和我合作 */}
            <div className="menu-item">
              <button 
                className="menu-button"
                onClick={() => toggleSection('cooperation')}
              >
                <span className="menu-icon">🤝</span>
                <span className="menu-text">和我合作</span>
                <span className="expand-icon">
                  {cooperationVisible ? '<' : '>'}
                </span>
              </button>
            </div>

            {/* 关于MOSHPIT */}
            <div className="menu-item">
              <button 
                className="menu-button"
                onClick={() => toggleSection('about')}
              >
                <span className="menu-icon">📖</span>
                <span className="menu-text">关于MOSHPIT</span>
                <span className="expand-icon">
                  {aboutVisible ? '<' : '>'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className={`main-content ${sidebarExpanded ? 'with-sidebar' : 'full-width'}`}>
          {cooperationVisible && (
            <div className="detail-panel">
              <h3>🤝 和我合作</h3>
              <div className="detail-content">
                <p><strong>首单99</strong></p>
                <p><strong>日常 159</strong></p>
                <p className="contact-label">联系微信：</p>
                <p className="wechat-contact">MyBaeChenShiYi4L</p>
              </div>
            </div>
          )}

          {aboutVisible && (
            <div className="detail-panel">
              <h3>📖 关于MOSHPIT</h3>
              <div className="detail-content">
                <p>小楫轻舟 梦入芙蓉浦</p>
              </div>
            </div>
          )}

          {!cooperationVisible && !aboutVisible && welcomeVisible && (
            <div className="welcome-panel">
              <h2>欢迎来到 </h2>
              <h2>MOSHPIT'S WORLD</h2>
              <p>专业说唱混音，品质保证</p>
              <div className="welcome-decoration">
                <span>🎵</span>
                <span>🎤</span>
                <span>🎶</span>
              </div>
              <button className="welcome-close-btn" onClick={hideWelcome}>
                收到
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 自定义音乐播放器已移除 */}
      {/* <MusicPlayer /> */}
    </div>
  )
}

export default App