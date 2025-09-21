// ==========  配置  ==========
const inspirationQuotes = [
    "每一次努力都不会白费 ✨", "相信自己，你比想象中更强大 💪", "梦想的路上，每一步都算数 🌟",
    "坚持就是胜利，永不放弃 🚀", "今天的付出，是明天的收获 🌈", "勇敢前行，美好就在前方 🌸",
    "用心生活，用爱创造 ❤️", "困难只是暂时的，坚持就是永恒 ⭐", "每一个开始都是成功的第一步 🎯",
    "相信自己，你正在创造奇迹 ✨", "生活因梦想而精彩 🌺", "努力的人运气都不会太差 🍀",
    "今天的汗水是明天的光芒 ☀️", "保持热爱，奔赴山海 🌊", "心若向阳，无畏悲伤 🌻",
    "路虽远行则将至，事虽难做则必成 🏔️", "不经历风雨，怎能见彩虹 🌈", "越努力，越幸运 🎊",
    "做最好的自己，遇见更好的生活 🌹", "星光不问赶路人，时光不负有心人 ✨"
];

// ==========  工具：淡入展开/收起  ==========
const toggleFade = (id, toggleId, label = '点击展开') => {
    const box = document.getElementById(id);
    const btn = document.getElementById(toggleId);
    const open = box.style.display !== 'none';
    box.style.display = open ? 'none' : 'block';
    box.style.animation = 'fadeIn .3s ease-in';
    btn.textContent = open ? label : '点击收回';
    if (Math.random() > .7) setTimeout(showInspirationQuote, 500);
};

// ==========  业务函数  ==========
function toggleAbout()      { toggleFade('aboutContent',    'aboutToggle'); }
function toggleCooperation(){ toggleFade('cooperationContent','cooperationToggle'); }

function showInspirationQuote() {
    if (window.innerWidth <= 768) return;                                    // 移动端跳过
    const quote = inspirationQuotes[Math.random() * inspirationQuotes.length | 0];
    const [side, vertical] = ['left top','left middle','left bottom','right top','right middle','right bottom']
                                [Math.random() * 6 | 0].split(' ');

    const el = document.querySelector('.inspiration-quote') || document.createElement('div');
    const isNew = !el.parentElement;

    el.classList.remove('show');                                           // 先淡出/保持隐藏
    setTimeout(() => {
        el.className = `inspiration-quote ${side} ${vertical}`;
        el.textContent = quote;
        if (isNew) document.body.appendChild(el);
        el.classList.add('show');
    }, isNew ? 0 : 600);                                                   // 旧框等 600 ms 淡出完成
}

function checkMusicPlayer() {
    const iframe = document.querySelector('iframe[src*="music.163.com"]');
    const fallback = document.getElementById('musicFallback');
    const player = document.getElementById('musicPlayer');
    if (!iframe) return;

    if (window.innerWidth <= 768) {                                        // 移动端简化
        iframe.width = '280'; iframe.height = '66';
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        fallback.innerHTML = isIOS
            ? `<div style="text-align:center;font-size:12px"><p style="margin:0 0 8px">🎵 iOS设备请点击播放音乐</p><button onclick="window.open('https://music.163.com/playlist?id=8271964710','_blank')" style="background:linear-gradient(45deg,#3498db,#2980b9);color:#fff;border:none;padding:8px 16px;border-radius:15px;cursor:pointer">打开网易云音乐</button></div>`
            : `<p style="margin:0;font-size:12px">🎵 点击播放音乐</p><a href="https://music.163.com/playlist?id=8271964710" target="_blank" style="color:#3498db;text-decoration:none;font-size:11px">网易云音乐</a>`;
        fallback.style.display = 'block';
        player.style.display = 'none';
        return;
    }

    setTimeout(() => {                                                      // 3 s 后检测加载失败
        if (iframe.offsetParent === null || iframe.offsetHeight === 0) {
            fallback.style.display = 'block';
            player.style.display = 'none';
        }
    }, 3000);
}

// ==========  初始化 & 交互彩蛋  ==========
window.addEventListener('load', () => {
    checkMusicPlayer();
    if (window.innerWidth > 768) {                                         // 仅桌面端
        showInspirationQuote();
        setInterval(showInspirationQuote, 5000);                           // 每 5 s 轮播
    }
});

/* 触摸/点击随机弹语录 */
document.addEventListener('touchstart', e => window.touchStart = Date.now(), { passive: true });
document.addEventListener('touchend', e => {
    if (Date.now() - window.touchStart < 300 && Math.random() > .9) setTimeout(showInspirationQuote, 300);
}, { passive: true });

document.addEventListener('click', e => {
    if (!e.target.closest('#musicPlayer') && !e.target.closest('#musicFallback') && Math.random() > .9)
        setTimeout(showInspirationQuote, 300);
});