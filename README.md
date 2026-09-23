# 空凛 · Rinsora 的小窝

> 一个纯静态的二次元个人主页 —— 马卡龙配色 + 亚克力玻璃材质，
> 带欢迎页、音乐播放器和浏览器内写作台。
> 没有构建步骤、没有后端、没有框架：`HTML + CSS + 原生 JS`，直接放 GitHub Pages 就能跑。

在线地址：<https://rinsora.dpdns.org>

---

## 1. 简述

打开站点会先看到一段开屏动画，然后停在「门口」欢迎页；点「进入小窝」后，
中央头像会飞到左侧栏的固定位置，页面同时切换到桌面态：左侧是头像导航栏，
右侧是三块主内容（主页 / 博客 / 项目展示），右下角常驻一个音乐播放器，
底部是一条常驻歌词栏。

所有「会写数据」的功能（写作台、项目编辑台、添加音乐）都不需要服务器 ——
它们在浏览器里用你在设置里填的 GitHub Token 直接调 GitHub Contents API 提交文件。

| 能力 | 说明 |
| --- | --- |
| 三个主板块 | 主页（简介 + 最近发布 + NOW 状态面板）、博客 / 随笔、项目展示 |
| 音乐播放器 | 双实例（欢迎页 + 右下角），支持顺序 / 随机 / 循环、LRC 歌词、底部常驻歌词栏 |
| 博客系统 | 卡片列表 + 分类筛选；文章页由 Markdown 生成 |
| 项目展示 | 按分类折叠的树；每项带状态徽章与外链 |
| 外观设置 | 4 套调色板 × 明暗，加色相微调与 4 个特效开关，只存在本地 |
| 后台三件套 | 写作台、项目编辑台、添加音乐面板（Token 鉴权，纯前端写仓库） |

---

## 2. 目录结构

```text
rinsora-home/                  ← 就是仓库根
├── index.html                 首页：开屏 + 欢迎页 + 桌面态三板块
├── style.css                  全站样式表（同时是各模块的「类名契约」，见 §4）
├── script.js                  首页交互层（开屏 / 主题 / 进场动画 / 路由 / 特效）
├── 404.html                   站内 404
├── CNAME                      rinsora.dpdns.org
├── .nojekyll                  关掉 Jekyll，保住下划线开头的文件
│
│   ── 数据层（三个纯数据文件，站点里唯一需要手改的内容源）──
├── music-data.js              window.RINSORA_MUSIC  = { version, tracks[] }
├── music-museum-data.js       window.RINSORA_MUSIC_MUSEUM = { version, records[] }
│                              （只存 musicId + 布局 x/y/scale/rotation/depth，
│                                一个字的歌曲信息都不复制 —— 改 music-data.js 博物馆自动跟着变）
├── projects-data.js           window.RINSORA_PROJECTS = { version, categories[], items[] }
│
│   ── 渲染 / 逻辑层 ──
├── music.js                   播放器引擎 + 列表 + 歌词栏（两个播放器实例共用）
├── music-upload.js            「＋ 添加音乐」弹窗（写 assets/music/ + music-data.js）
├── music-museum.js            音乐博物馆场景（进馆 / 唱片阵列 / 视差 / 选中 / 档案详情）
├── projects.js                项目树渲染 + 管理 UI；暴露 window.RinsoraProjects
├── blog-admin.js              首页卡片上的编辑 / 删除按钮，以及写作台入口
├── gh-api.js                  GitHub Contents API 封装（读 / 写 / 删 / 传二进制）
│
│   ── 后台页面 ──
├── editor.html / editor.css / editor.js        写作台：写 Markdown → 生成文章页 + 首页卡片
├── project-editor.html / project-editor.js     项目编辑台：表单式增删改 projects-data.js
├── new-post.py / new-post.cmd                  本地命令行版写作（Windows 可双击）
│
├── posts/                     文章页（*.html）+ post.css（文章页专属样式）
├── assets/                    avatar.png、blog/（文章配图）、music/（音频与封面）
├── music/                     早期示例音频与 LRC
├── favicon.ico / favicon-32.png / apple-touch-icon.png
└── README.md
```

### 页面之间的依赖

```text
index.html
  ├─ style.css
  ├─ music-data.js → music.js      → music-upload.js（按需）
  ├─ projects-data.js → projects.js
  ├─ blog-admin.js
  ├─ gh-api.js
  └─ script.js                     只做界面层，不含任何播放逻辑

posts/*.html
  └─ ../style.css + post.css        与首页共用设计变量，不加载任何 JS

editor.html / project-editor.html
  └─ style.css + editor.css + gh-api.js + 各自的 logic
```

---

## 3. 实现方法

### 3.1 整体思路：静态站的「两层数据」

站点里所有内容都归约成 **两个 JS 数据文件**，页面渲染 = 读数据 → 拼 DOM：

```js
// music-data.js
window.RINSORA_MUSIC = { version: 1, tracks: [
  { id, title, artist, cover, src, lrc, date }   // lrc 是内联的 LRC 文本
]};

// projects-data.js
window.RINSORA_PROJECTS = { version: 1, categories: [...], items: [
  { id, name, category, url, desc, tags: [], icon, date, status }
]};
```

博客没有独立数据文件 —— 它的「数据」直接就是 `index.html` 里的 `<article class="blog-card">` 卡片，
`script.js` 的 `buildRecent()` 与 `buildBlogFilter()` 都从卡片上读 `data-cat` / `data-min` 和文本。
好处是不引入第三份数据，坏处是**卡片模板必须带全这些属性**（写作台和 `new-post.py` 的模板已同步）。

### 3.2 写数据：浏览器 ↔ GitHub Contents API

`gh-api.js` 把 Contents API 包成 `GH.get / GH.put / GH.putBinary / GH.del / GH.hasToken`。
Token 只放在访问者的 `localStorage`（`rinsora-blog-token`），**永不进源码、永不进仓库**。

一次「保存文章」的完整链路：

```text
editor.js
  ├─ 把 Markdown 渲染成完整 HTML   → GH.put('posts/<slug>.html')
  └─ 在 index.html 里插入一张卡片  → GH.get → 字符串替换 → GH.put('index.html')
```

> ⚠️ Token 是按 **origin** 隔离的。换域名（`rinsoraa.github.io` → `rinsora.dpdns.org`）之后
> 需要在设置里重新填一次。

### 3.3 样式：CSS 变量 + 亚克力材质

设计令牌全集中在 `style.css` 的 `:root`，主题拆成两个互相独立的维度：

```text
主题 = 调色板（html.pal-candy / pal-sunset / pal-lilac / pal-mint）
     × 明暗（body.night）
```

调色板类**同时挂在 `<html>` 和 `<body>`** 上，`<head>` 末尾的一段内联脚本在首帧前就把
`pal-*` / `night` 写上去 —— 这样首屏配色不会先闪一下默认色。

玻璃 / 亚克力质感由四个要素组成，缺一就会退化成「普通半透明块」：

```css
background: var(--glass);                     /* 低透底 */
backdrop-filter: blur(var(--blur));           /* 真模糊 */
border: 1px solid var(--bd);                  /* 亮边 */
box-shadow: inset 0 1px 0 var(--hi);          /* 顶部内高光 ← 关键 */
```

版式只吃变量，改一处全套跟着走：`--rail`（侧栏宽 = 内容区 `margin-left`）、`--blur`、`--ease`、`--hue`。

### 3.4 交互：三个值得说的实现

**① 进场动画（欢迎页 → 桌面态）—— Room Reveal / 头像唤醒**
头像**不移动**：以中央头像为视觉中心，走「蓄力（scale/rotate/brightness）→ 光晕 `clip-path`/`radial-gradient` 扩散
（`#roomReveal`）→ 头像淡出 → 粒子引导线（`#entryParticles` Canvas，粉→黄→紫，跑完尺寸归零）→ 侧栏头像
`blur/scale` 显影 → 导航错峰展开 → 内容错峰浮现」，制造「头像化成光、唤醒小窝」的幻觉。
状态机是 `startRoomEntry()` / `finishRoomEntry()` + 自增 `entryToken`，动画由 `body.room-entering` 触发、
`animation-delay` 编排；`enterApp(true)`（instant）直接落到最终态、不播动画。

> ⚠️ 这里有个关键约束：**`.app` 不能带 `transform` / `filter`**。
> 一旦带了，它的 `position: fixed` 后代就会改以 `.app` 为包含块，
> 侧栏会被推出视口 —— 表现就是「头像往左下角飞」。同理 `.lyricbar` / `.mm-mask` / `.settings-panel`
> 必须是真正的 `position: fixed`。

**② 夜间切换（View Transitions）**
`document.startViewTransition()` + 在 `::view-transition-new(root)` 上跑一段 `clip-path: circle()` 扩散动画，
圆心取自按钮中心，于是看起来是「从按钮位置把整个页面刷成深色」。
更新回调要**等两帧**再 resolve，否则会拍到毛玻璃还没按新配色重新合成的那一帧（背景会闪一下消失）。
所有模糊层常驻 `will-change: backdrop-filter`。

**③ 交互状态一律「有兜底路径」**
这是这个项目反复踩出来的规矩，写进了代码里两处：

- `startRoomEntry()` 的收尾和右下播放器的淡入，**都另有一条 `setTimeout` 兜底** —— 因为
  `Animation.finished` 在后台标签页里可能永不 resolve，双 `rAF` 也可能被节流；
  只挂在动画回调上的话，头像会永远停在 `opacity: 0`。
- 写作台 / 项目编辑台 / 添加音乐的管理按钮**只在存过 Token 的浏览器里出现**，所以
  每个后台都留了一条**无条件入口**（`/editor.html`、`#admin`、`Ctrl+Shift+E`、连点三下标题……），
  否则站长自己也会进不去。

---

## 4. `style.css` 是「类名契约」

`music.js` / `music-upload.js` / `projects.js` / `blog-admin.js` 会**动态生成大量 DOM**，
它们依赖的类名必须在 `style.css` 里有对应样式，否则就会以各种奇怪的方式坏掉 ——
弹窗变成「没有格式的页面」、编辑按钮跑到页面下方、项目列表展不开，都是这么来的。

改动相关样式前请对照这份契约（`style.css` 顶部目录里也标了）：

| 生成方 | 关键类名 |
| --- | --- |
| `music.js` | `.mp-shell .mp-disc .mp-cover .mp-meta .mp-body .mp-progress .mp-btn .mp-eq .mp-track .lb-scroll .lb-line .lb-wrap .lb-base .lb-fill` |
| `music-upload.js` | `.mm-mask .mm-card .mm-field .mm-btn` |
| `music-museum.js` | `.mm-load* .mm-scene(.on .open .has-sel) .mm-stage .mm-disc(.sel .dim .playing .is-current .is-paused) .mm-disc-plate(.playing) .mm-disc-art .mm-disc-label .mm-hud .mm-foot .mm-empty .mm-detail(.on) .mm-detail-* .mm-tag` |
| `projects.js` | `.pt-group(.open) .pt-head .pt-body .pt-item .pt-foot .pt-status .pt-go .pt-cat-0..3` |
| `blog-admin.js` / `projects.js` | `.card-tools .card-tool .tool-edit .tool-del` |

其中两个最容易改坏的：

- **`.card-tools`**：必须 `position: absolute` 贴在卡片**右上角**，默认 `opacity: 0`，
  靠 `.blog-card:hover .card-tools` / `.pt-item:hover .card-tools` 显形。`projects.js` 生成时
  `className` 是 `card-tools pt-tools` —— **`card-tools` 不能少**。
- **项目树用 `.open` 表示展开**（不是 `.closed`）：`.pt-group:not(.open) .pt-body { display: none }`。
- **博物馆的缩放分两层**：JS 只写 inline 的 `--mm-scale-data`（基础值），样式表里的
  `.mm-disc{--mm-scale:var(--mm-scale-data,1)}` 兜底，hover / `:active` / 选中态只覆盖 `--mm-scale`。
  **别把基础值写回 `--mm-scale`** —— inline 会压死状态规则，症状是「hover 和选中都不放大」。
- **博物馆的自转用 `animation-play-state` 开关**，不是增删 `animation`：
  `.mm-disc-plate` 永远声明着 `mmSpin`，只是默认 `paused`；`.playing` 把它改成 `running`。
  **别改成「只在 `.playing` 里声明 animation」** —— 那样暂停时属性被移除、角度立刻回 0，
  视觉上是「一暂停就跳回起点」；用 play-state 才能真的「停在哪、继续时接着转」。
- **播放状态只认两个来源**，缺一不可：`RinsoraMusic.getState().index`（换曲目才变）
  和 `body.mp-playing`（播放/暂停才变）。读取口子是 `syncFromPlayer()`。
  **不要用「我上次点了什么」推断播放状态** —— 播放器那边切歌 / 暂停就会不同步。

---

## 5. 交互一览

**桌面端**

| 操作 | 结果 |
| --- | --- |
| 打开站点 | 开屏动画（进度条走完自动进欢迎页） |
| 点「进入小窝」 | 头像飞入左侧、播放器从右下向上淡入 |
| 点头像 | 展开 / 收起半圆导航（点空白处也会收起） |
| `1` / `2` / `3` | 切换主页 / 博客 / 项目展示 |
| `Ctrl + K` | 打开外观设置抽屉 |
| `Esc` | 关闭设置抽屉 / 关闭添加音乐弹窗 |
| `Ctrl + Shift + E` | 进写作台 |
| `Ctrl + Shift + M` | 打开添加音乐 |
| `Ctrl + Shift + P` | 进项目编辑台 |
| 悬停博客卡片 | 右上角浮出编辑 / 删除按钮（仅管理员） |
| 点项目分类标题 | 折叠 / 展开该分类 |
| 点侧栏「音乐博物馆」 | 进音乐博物馆（加载层 → 唱片阵列场景） |
| 在博物馆里移动鼠标 | 整个阵列按景深做视差（远层动得少、近层动得多）；视口尺寸走缓存，滑动过程中不读布局 |
| 悬停唱片 | 放大、抬升、边缘发光，并高亮歌名 / 歌手 |
| 点唱片 | 打开该唱片的**档案详情**，并**自动播放**（被浏览器拦下时详情照常打开，点详情里的按钮即可） |
| 正在播放的唱片 | 缓慢匀速自转 + 外圈转环 + 边缘极淡呼吸光晕 |
| 暂停 | 自转与转环当场停住（停在哪就是哪），唱片留一圈静态柔光；再播接着转 |
| 右下角播放器切歌 | 博物馆里高亮的那张立刻跟着换（同一个音乐状态，双向同步） |
| 已在别处播放时进入博物馆 | 认得出是哪一首，把它标成 `PLAYING`；**不会**打断或换歌 |
| 点详情里的「播放这首」 | 走现有播放器播放（右下角播放器 / 歌词栏同步）；已是当前曲目时变成暂停 / 继续 |
| `Esc`（详情打开时） | 先关详情，**仍在**博物馆里（只退一层，不会一次退出整个展厅） |
| 点详情外的场景空白 | 只关详情，**不退**展厅 |
| `Esc`（未开详情） | 退出博物馆，回到小窝 |

**地址直达**：`#about` / `#blog` / `#projects` 会跳过欢迎页直接落到对应板块；
`#museum` 直接进音乐博物馆。

**移动端**：左侧导航改为底部三按钮，设置抽屉铺满宽度，播放器收成小胶囊，歌词栏整条贴底。

**可访问性 / 降级**：`prefers-reduced-motion` 下关掉飞行、涟漪、自动动画；
`backdrop-filter` 不被支持时退回实底色块。

---

## 6. 日常维护

### 发一篇新文章

方式一（推荐）：打开 `/editor.html`，填 Token → 写 Markdown → 保存。
会自动生成 `posts/<slug>.html` 并在 `index.html` 插入卡片。

方式二：本地跑脚本

```bash
python new-post.py                 # Windows 也可以直接双击 new-post.cmd
```

> 两处的 Markdown 规则（`#` → h2、`##` → h3）**必须保持一致**；
> 生成的卡片也必须带 `data-cat` / `data-min`，否则首页的分类筛选条认不出它。

### 加一首歌

`.mp-body` 右下角的「＋」（需 Token），或直接编辑 `music-data.js` 的 `tracks[]`：
音频放 `assets/music/<id>.<ext>`、封面 `<id>-cover.<ext>`，歌词作为 `lrc` 字符串内联。
单文件上限 45 MB（超过 20 MB 会警告）。

### 把一首歌摆进音乐博物馆

博物馆的**内容**来自 `music-data.js`（歌名/歌手/封面/音频/歌词），
`music-museum-data.js` 只负责**摆在哪**。加一条：

```js
{ musicId: "shelter", x: 50, y: 33, scale: 0.98, rotation: 6, depth: 0.28 }
```

- `musicId` 必须对得上 `music-data.js` 里的 `id`；**对不上的条目会被静默跳过**，
  所以删歌不会让整个展厅挂掉。
- `x` / `y` 是 %（相对可视区），`depth` 0~1 越大越远（越淡、越糊、移动越少）。
- **同一个 `musicId` 可以出现多次**（同一张唱片摆两处陈列）。
- 可选 `note`：**这一处陈列**的附注（写进详情的 `NOTE` 一行）。
- 点唱片 = 打开档案详情 **+ 尝试播放**；被浏览器自动播放策略拦下时详情照常打开，
  点详情里的按钮即可。全程复用右下角那个播放器，博物馆**不新建** `<audio>`。

### 档案详情里能显示哪些字段

固定显示的四件套：**封面 / 歌名 / 歌手 / 档案编号（NN / NN）+ 收录日期**。
下面这些**可选字段写在 `music-data.js` 的曲目上**，有就渲染、没有整块不出现
（不会留空框、空行、空标签）：

| 字段 | 位置 | 类型 |
| --- | --- | --- |
| `album` | 资料表 `ALBUM` 行 | 字符串 |
| `genre` | 资料表 `GENRE` 行 | 字符串 |
| `source` | 资料表 `SOURCE` 行 | 字符串 |
| `description` | 出一段描述文字（最多 5 行，超出省略） | 字符串 |
| `tags` | 出一排标签胶囊（自动去重） | 数组，或空格 / 逗号分隔的字符串 |

```js
{ id: "shelter", title: "Shelter", artist: "Porter Robinson & Madeon",
  album: "Shelter", genre: "Electronic", source: "原创",
  description: "动画短片《Shelter》的配乐。",
  tags: ["electronic", "animation"] }
```

`note`（写在 `music-museum-data.js` 的陈列条目上）优先于曲目的 `description`。

### 加一个项目

`/project-editor.html`（需 Token），或直接编辑 `projects-data.js` 的 `items[]`。
**空分类不会渲染**；分类之间的先后顺序由 `categories` 数组决定；
同一个分类内部一律「最新在最上」，由 `RinsoraProjects.newestFirst()` 统一负责。

### 换头像

替换 `assets/avatar.png`，然后同步重导浏览器图标：
`favicon.ico`（16 / 32 / 48 三帧）、`favicon-32.png`、`apple-touch-icon.png`（180×180，iOS 不支持透明，需合成浅色底）。
像素风缩放一律用最近邻插值。

---

## 7. 部署

仓库：`rinsoraa/rinsoraa.github.io`，分支 `main`，GitHub Pages 直接服务仓库根。

- 自定义域名写在根目录 `CNAME`：`rinsora.dpdns.org`
- `.nojekyll` 必须保留，否则 Jekyll 会忽略下划线开头的文件
- 外链分享卡片用到的 `og:url` / `og:image` **必须写绝对地址**，相对路径在 QQ / 微信里抓不到图
- 建议在仓库 `Settings → Pages` 里勾上 **Enforce HTTPS**

```bash
git add .
git commit -m "更新说明"
git push
```

推完等一两分钟，Pages 构建完成即生效。

---

## 8. 注意

- **不要把 GitHub Personal Access Token 写进任何源码文件。** 所有写操作都在浏览器里、
  用访问者自己 `localStorage` 中的 Token 完成。
- `gh-api.js` 里的 `DEFAULTS.repo` 必须与仓库名一致，改仓库名时记得同步。
- 本地开发时如果 `git push` 被代理挡掉（`CONNECT tunnel failed`），
  可以改走 REST API 推送（`push_via_api.py`）—— 但**不要用 GitHub MCP 的 `push_files`**，
  它只接受字符串，会把 `assets/` 下的 PNG / MP3 等二进制文件写坏。
