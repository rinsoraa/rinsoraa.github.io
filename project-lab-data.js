/* Optional editorial enrichment, keyed by projects-data.js IDs.
   Identity, category, date, status, links and tags belong ONLY to that source.
   Media must be verified local files with src/width/height/alt/caption.
   UI-04A.2 website media: actual local browser captures, not mock interfaces. */
window.RINSORA_PROJECT_LAB = {
  catoobot: {
    featuredRank: 1, portrait: 'bot',
    story: ['从 QQ Bot 出发，把沙盒生活系统与长期记忆放在一起。这是一个持续探索机器人与日常互动可能性的项目。'],
    highlights: ['QQ Bot', '沙盒生活系统', '长期记忆存储']
  },
  'dsh-pulse-rail': {
    featuredRank: 2, portrait: 'pulse',
    story: ['把 DeepSeek Harness 的轮次导航条变成音乐可视化。原本用于定位轮次的小小导航，也能承载一点音乐的节奏。'],
    highlights: ['DeepSeek Harness 插件', '轮次导航', '音乐可视化'],
    gallery: [
      { src: 'assets/projects/dsh-pulse-rail/screen-01.webp', width: 95, height: 467,
        alt: 'DSH Pulse Rail 原仓库 README 发布的导航条局部资料图',
        caption: '原仓库 README 的历史展示图（首次发布 0.2.2 所附）。仅有导航条局部，按原始 95 × 467 展示；不是本轮本机运行或音频律动验收。' },
      { src: 'assets/projects/dsh-pulse-rail/screen-02.webp', width: 350, height: 498,
        alt: 'DSH Pulse Rail 原仓库的导航条律动设置面板资料图',
        caption: '原仓库历史设置面板资料：长度、厚度与响应等控件。来自提交 f412cffe，保留原尺寸；不代表当前版本的现场状态。' }
    ]
  },
  trayhider: {
    featuredRank: 3, portrait: 'window',
    story: ['围绕 Windows 11 的系统托盘，整理隐藏与显示图标这件小事。用一个明确的小工具，照顾日常桌面里的细节。'],
    highlights: ['Windows 11', '隐藏 / 显示托盘图标', '桌面工具']
  },
  'markdown-reader': {
    portrait: 'document',
    story: ['让浏览器里的 Markdown 文件更适合阅读。自动渲染 .md 文件，并保留自定义 CSS 的空间。'],
    highlights: ['自动渲染 Markdown', '自定义 CSS', 'Manifest V3 浏览器扩展']
  },
  bilibili: {
    portrait: 'window',
    story: ['给双屏看直播留一块专门的弹幕空间。一块屏幕全屏观看直播，另一块屏幕独立显示同一直播间的实时弹幕。'],
    highlights: ['双屏观看', '独立弹幕画面', '浏览器扩展']
  },
  'rinsoraa-rinsoraa-github-io': {
    portrait: 'document',
    story: ['你正在逛的小窝，也是一件慢慢生长的作品。项目、博客和日常记录，都在这里相遇。'],
    highlights: ['个人网站', '创作记录', '项目与博客'],
    cover: {
      src: 'assets/projects/rinsoraa-rinsoraa-github-io/cover.webp', width: 960, height: 600,
      alt: 'Rinsora 小窝实际页面：封面完全展开，房间插画前悬浮着侧栏与主页卡片',
      caption: '本地页面实拍 / Cover Reveal 100%',
      sources: [{ src: 'assets/projects/rinsoraa-rinsoraa-github-io/cover-small.webp', width: 480, height: 300 }]
    },
    gallery: [
      { src: 'assets/projects/rinsoraa-rinsoraa-github-io/screen-01.webp', width: 1440, height: 900,
        alt: '小窝首页在 Cover Reveal 完全展开时的完整浏览器画面', caption: 'Cover Reveal · 实际本地页面，1440 × 900，无调试辅助线。' },
      { src: 'assets/projects/rinsoraa-rinsoraa-github-io/screen-02.webp', width: 1440, height: 900,
        alt: '创作实验室的介绍与精选作品画廊', caption: 'Creative Lab · UI-04A.1 的实际画廊。保留接入媒体前的页面记录。' },
      { src: 'assets/projects/rinsoraa-rinsoraa-github-io/screen-03.webp', width: 1440, height: 900,
        alt: '音乐博物馆的扇形唱片、档案和歌词区域', caption: 'Music Museum · 真实展厅页面。当前唱片没有歌词，展示页面原有空态。' }
    ]
  }
};
