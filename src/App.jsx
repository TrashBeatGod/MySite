import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [aboutVisible, setAboutVisible] = useState(false);
  const [cooperationVisible, setCooperationVisible] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSection = (section) => {
    if (section === "cooperation") {
      setCooperationVisible(!cooperationVisible);
      setAboutVisible(false);
      setPortfolioVisible(false);
      setWelcomeVisible(false);
    } else if (section === "about") {
      setAboutVisible(!aboutVisible);
      setCooperationVisible(false);
      setPortfolioVisible(false);
      setWelcomeVisible(false);
    } else if (section === "portfolio") {
      setPortfolioVisible(!portfolioVisible);
      setCooperationVisible(false);
      setAboutVisible(false);
      setWelcomeVisible(false);
    }
  };

  const hideWelcome = () => {
    const welcomePanel = document.querySelector(".welcome-panel");
    if (welcomePanel) {
      welcomePanel.style.transition =
        "opacity 0.8s ease-out, transform 0.8s ease-out";
      welcomePanel.style.opacity = "0";
      welcomePanel.style.transform = "translate(-50%, -50%) scale(0.9)";

      setTimeout(() => {
        setWelcomeVisible(false);
      }, 800);
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // 设备类型检测与响应式处理
  useEffect(() => {
    // 检查当前设备是否为移动端
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768; // 以768px为移动端分界点
      setIsMobile(mobile); // 更新移动端状态
    };

    checkDevice(); // 组件挂载时立即检测一次

    // 监听窗口大小变化，实时响应设备切换
    window.addEventListener("resize", checkDevice);

    // 清理函数：组件卸载时移除事件监听器，防止内存泄漏
    return () => window.removeEventListener("resize", checkDevice);
  }, []); // 空依赖数组：只在组件挂载和卸载时执行

  return (
    <div className="App">
      {/* 顶部横联 - 专注说唱混音三年 */}
      <div className="top-banner">
        <div className="banner-text">专注说唱混音三年</div>
      </div>

      {/* 顶部导航栏 - 移动端常驻显示，大屏幕端侧边栏模式 */}
      <div className={`top-nav-bar ${isMobile ? 'mobile-fixed' : sidebarExpanded ? 'expanded' : ''}`}>
        <div className="nav-header">
          <h2>MOSHPIT</h2>
          <p>专业说唱混音</p>
        </div>
        
        {/* 移动端直接显示完整菜单，大屏幕端根据展开状态显示 */}
        <div className={`nav-menu ${isMobile ? 'mobile-visible' : sidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="menu-item">
            <button
              className="menu-button"
              onClick={() => toggleSection("portfolio")}
            >
              <span className="menu-icon">🎧</span>
              <span className="menu-text">混音作品集</span>
              <span className="expand-icon">
                {portfolioVisible ? "▲" : "▼"}
              </span>
            </button>
          </div>

          <div className="menu-item">
            <button
              className="menu-button"
              onClick={() => toggleSection("cooperation")}
            >
              <span className="menu-icon">🤝</span>
              <span className="menu-text">和我合作</span>
              <span className="expand-icon">
                {cooperationVisible ? "▲" : "▼"}
              </span>
            </button>
          </div>

          <div className="menu-item">
            <button
              className="menu-button"
              onClick={() => toggleSection("about")}
            >
              <span className="menu-icon">📖</span>
              <span className="menu-text">关于MOSHPIT</span>
              <span className="expand-icon">{aboutVisible ? "▲" : "▼"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 展开/收起按钮 - 桌面端显示 */}
      {!isMobile && (
        <button className="nav-toggle" onClick={toggleSidebar}>
          {sidebarExpanded ? "◀" : "▶"}
        </button>
      )}

      <div className="main-layout">

        {/* 主内容区 */}
        <div className={`main-content ${sidebarExpanded ? 'with-sidebar' : 'full-width'}`}>
          {cooperationVisible && (
            <div className="detail-panel">
              <h3>🤝 和我合作</h3>
              <div className="detail-content">
                <p>
                  <strong>首单99</strong>
                </p>
                <p>
                  <strong>日常 159</strong>
                </p>
                <p className="contact-label">联系微信：</p>
                <p className="wechat-contact">MyBaeChenShiYi4L</p>
              </div>
            </div>
          )}

          {portfolioVisible && (
            <div className="detail-panel">
              <h3>🎧 混音作品集</h3>
              <div className="detail-content">
                <div className="music-player-container">
                  <iframe
                    frameBorder="no"
                    border="0"
                    marginWidth="0"
                    marginHeight="0"
                    width="330"
                    height="450"
                    src="//music.163.com/outchain/player?type=0&id=8271964710&auto=1&height=430"
                    title="网易云音乐播放器"
                  />
                </div>
                <p
                  style={{ marginTop: "20px", fontSize: "14px", color: "#ccc" }}
                >
                  网易云音乐精选作品集
                </p>
              </div>
            </div>
          )}

          {aboutVisible && (
            <div className="detail-panel">
              <h3>📖 关于MOSHPIT</h3>
              <div className="detail-content">
                <p>
                  <a 
                    href="https://space.bilibili.com/335136709" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bilibili-link"
                  >
                    🎬 哔哩哔哩主页
                  </a>
                </p>
              </div>
            </div>
          )}

          {!cooperationVisible &&
            !aboutVisible &&
            !portfolioVisible &&
            welcomeVisible && (
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
    </div>
  );
}

export default App;