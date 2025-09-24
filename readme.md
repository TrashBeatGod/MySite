# MOSHPIT'S WORLD - Vite + React

## 项目升级说明

已成功从 Create React App (CRA) 升级到 Vite + React，保留了所有原始功能：

### 保留的功能
- ✅ XP风格窗口设计
- ✅ 折叠/展开功能（合作报价、关于简介）
- ✅ 励志语录彩蛋（随机显示中国古诗词）
- ✅ 网易云音乐播放器集成
- ✅ 移动端适配（iOS/Android）
- ✅ 响应式布局

### 升级优化
- 🚀 使用Vite替代CRA，构建速度更快
- 📦 移除了react-scripts依赖，减少包体积
- 🔧 简化了代码结构，移除了不必要的复杂逻辑
- 🎯 优化了设备检测逻辑
- 🎨 保持了原有的UI设计和动画效果

### 开发命令
```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
```

### 项目结构
```
majr/
├── index.html          # Vite入口HTML
├── vite.config.js      # Vite配置
├── package.json        # 项目配置
├── src/
│   ├── index.jsx       # 应用入口
│   ├── App.jsx         # 主组件
│   ├── App.css         # 组件样式
│   └── index.css       # 全局样式
└── public/             # 静态资源
```

访问 http://localhost:3001 查看网站效果