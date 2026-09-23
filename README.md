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
├── music-museum-data.js       window.RINSORA_MUSIC_MUSEUM = { version, spots{} }
│                              （只是**文案覆写**：键 = 曲目 id，值 = note / label。
│                                位置不写在这里 —— 由扇形几何按「离焦点的距离」算）
├── projects-data.js           window.RINSORA_PROJECTS = { version, categories[], items[] }
│
│   ── 渲染 / 逻辑层 ──
├── music.js                   播放器引擎 + 列表 + 歌词栏（两个播放器实例共用）
├── music-upload.js            「＋ 添加音乐」弹窗（写 assets/music/ + music-data.js）
├── music-museum.js            音乐博物馆场景（进馆 / 左侧扇形唱片导航 / 滚轮选择 / 右侧档案轨）
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
| `music-museum.js` | `.mm-load*`（含 `.leaving` 退场帘）`.mm-scene(.on .open .closing) .mm-depth .mm-floor .mm-stage .mm-disc(.sel .playing .is-current .is-paused) .mm-disc-plate(.playing) .mm-disc-gloss .mm-disc-art(.is-empty) .mm-hud .mm-hud-mid .mm-foot .mm-empty .mm-detail(.on) .mm-detail-* .mm-archive .mm-lyrics .mm-lyrics-kicker .mm-lyrics-slot .mm-lyrics-dash .mm-tag` |
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
  **层高（`z-index`）是同一套道理**：JS 写 inline 的 `--mm-z-data`（深度底值，焦点 100 / 最外 64），
  CSS 合成 `z-index:calc(var(--mm-z-data,1) + var(--mm-z-boost,0))`，状态只加 `--mm-z-boost`。
  **别改成 `style.zIndex = …`** —— 内联会把 hover 与焦点的抬层永久压死。
- **博物馆的自转用 `animation-play-state` 开关**，不是增删 `animation`：
  `.mm-disc-plate` 永远声明着 `mmSpin`，只是默认 `paused`；`.playing` 把它改成 `running`。
  **别改成「只在 `.playing` 里声明 animation」** —— 那样暂停时属性被移除、角度立刻回 0，
  视觉上是「一暂停就跳回起点」；用 play-state 才能真的「停在哪、继续时接着转」。
- **播放状态只认两个来源**，缺一不可：`RinsoraMusic.getState().index`（换曲目才变）
  和 `body.mp-playing`（播放/暂停才变）。读取口子是 `syncFromPlayer()`。
  **不要用「我上次点了什么」推断播放状态** —— 播放器那边切歌 / 暂停就会不同步。
- **唱片的「高光白条」必须被裁**：`.mm-disc-gloss` 自己是圆形裁剪壳（`inset:0` + `border-radius:50%`
  + `overflow:hidden`），扫光写在它的 `::after` 上（默认 `translateX(-130%)`）。
  **别把扫光直接写在 `.mm-disc-gloss` 上**，也别想靠 `.mm-disc-plate` 去裁 ——
  `plate` 有 `inset:-9px` 的圈和 `inset:-16%` 的呼吸光晕，**必须允许溢出**，一裁就掉。
  没有裁剪祖先时，`translateX(-130%)` 的扫光会**常驻停在唱片左边**（就是「唱片附近有条白杠」）。
- **退出展厅只有一条路径**：`#mmExit` / Esc 最后都要走 `state.hostExit`（由 `script.js` 注入的
  `exitMuseum`），**别在博物馆里自己收尾**。`script.js` 那边的 `body.museum-open`、
  `AppState.museumOpen`、`#museum` hash 才是「展厅开着」的唯一真相；
  博物馆的 `exit()` 只负责自己的场景层，收不掉宿主的三个状态 → 症状是
  **「点了退出，页面糊着一层，要再按一次 Esc 才正常」**。
- **曲库是唯一真相，`music-museum-data.js` 只是覆写表**：唱片由 `RINSORA_MUSIC.tracks[]`
  生成（一首歌 = 一张唱片），`spots{ id → {note?, label?} }` 只补这两个字段。
  上传一首新歌就多一张，**不需要动数据文件**；改完曲库靠 `syncData()` 的指纹自动重建。
- **位置不写在数据里，全部由「离焦点的距离」算出来**（`fanLayout`）：JS 每帧只内联写 6 个变量
  （`--mm-fx / --mm-fy / --mm-scale-data / --mm-op / --mm-blur / --mm-z-data`），
  `.mm-disc` 用 `translate / rotate / scale` 三个独立属性，其中**只有 `translate` 不进 transition**
  （它每帧都在变，进了过渡就会被二次平滑成一坨）。
  **别回到「每首歌手写 x/y」**：曲库一变大就一定会有人漏写，而漏写的症状是「唱片叠在一处」。
- **扇形几何是视口的连续函数，不是一组写死的数**：`size / rx / ry` 都由视口宽高算出再 `clamp`，
  窗口跨度固定 ±90°（`step = 90° / half`，随曲库规模自适应），并且有三条**构造性**约束：
  焦点盘不侵入右侧轨道、纵向极值不越出上下 band、最外圈不出左边界。
  改参数要跑 `_mmfan.js`（5 档视口 × 3 种曲库规模 = 1005 条），别只对着自己那块屏目测。
- **`selectedIndex` 是「陈列里的位置」，不是曲目表下标**：`rec.index → playIndex()`、
  `rec.order → 位置`；DOM 上是 `dataset.index`（下标）与 `dataset.at`（位置）。
  两者只在「曲目表里没有缺 id 的条目」时才恰好相等。**混用不会报错**，
  症状是「点 A 却选中了 B」，看起来完全像 `music-data.js` 的数据写错了。
- **滚轮只浏览，不出声**：`onWheel` 里**不许**出现 `play / playIndex` ——
  浏览与聆听是两个明确动作，出声只留给「点当前选中的那张」和右侧「播放」。
  事件处理是「累加器（42px）+ 冷却（180ms，冷却期内的增量直接丢）」，一次惯性滑动只切一格。
- **`.mm-stage` 必须带 `z-index:1`**（建层叠上下文）：唱片的 `z-index` 是 64~100，
  不隔离的话会盖住 HUD(5) 和右侧档案轨(20)。
- **唱片元素懒建 + 按 `musicId` 复用**（`state.pool`）：只建扇形窗口（±3 张 + 一圈淡出环）里的那几张，
  滚轮浏览**不重建 `<img>`**（分页时代一翻页就重建，现在每滚一格都重建会闪会卡）。
  所以「DOM 里的唱片数 ≤ 曲库数」是**正常的**，别再用「DOM 张数 == 曲库数」当判据。

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
| 滚轮 / 触控板 | 沿扇形上下浏览（**无限循环**：最后一首再往下回到第一首，首尾相接）；**只浏览，不出声** |
| `↑` / `↓` | 与滚轮同义（上一位 / 下一位） |
| 点一张**不是焦点**的唱片 | 把它转到扇形中央，右侧档案跟着换 —— **不出声** |
| 点**已经是焦点**的那张唱片 | 播放 / 暂停（浏览与聆听是两个动作，别把它们合成一个手势） |
| 在右侧档案里滚动 | 档案自己滚，扇形不抢事件；档案滚到顶 / 底之后再滚，才交回扇形 |
| 悬停唱片 | 微微放大、抬一层（几何位置不变 —— 焦点不会因为 hover 而跑） |
| 移动鼠标 | **不驱动画面**：扇形是导航器，几何只由「当前焦点」决定（视差已在第六轮整条删除） |
| 正在播放的唱片 | 缓慢匀速自转 + 外圈转环 + 边缘极淡呼吸光晕 |
| 暂停 | 自转与转环当场停住（停在哪就是哪），唱片留一圈静态柔光；再播接着转 |
| 右下角播放器切歌 | 博物馆里高亮的那张立刻跟着换（同一个音乐状态，双向同步） |
| 点唱片 / 切歌 | **新歌从 0:00 开始**（不从上一首接着放）；「恢复上次进度」只在**刚打开站点**时发生一次 |
| 已在别处播放时进入博物馆 | 认得出是哪一首，把它标成 `PLAYING`**并转到扇形中央**；**不会**打断或换歌 |
| 点详情里的「播放这首」 | 走现有播放器播放（右下角播放器 / 歌词栏同步）；已是当前曲目时变成暂停 / 继续 |
| `Esc`（详情打开时） | 先关详情，**仍在**博物馆里（只退一层，不会一次退出整个展厅） |
| 点详情外的场景空白 | 只关详情，**不退**展厅 |
| `Esc`（未开详情） | 退出博物馆，回到小窝（带一层「正在离开展厅」的退场帷幕） |
| 点右上角「退出展厅」 | 与 `Esc` **同一条路径**（都走 `exitMuseum()`）：场景、小窝淡出、URL 一起收拾干净 |
| 点场景空白 | 只收起右侧档案，**不退**展厅（会误关的 bug 踩过一次） |

⚠️ **退出展厅只有一条路径**：`music-museum.js` 的退出按钮**不自己收尾**，
它通过 `onExitRequest` 请 `script.js` 的 `exitMuseum()` 来关。
自己关的后果是只关了场景层，「小窝淡出」的 `body.museum-open` 和 URL 里的
`#museum` 会留下 —— 表现就是「退出来了但页面一直糊着，要再按一次 Esc」。

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

**不用管** —— 加歌走播放器的「＋ 添加音乐」就行，博物馆会自动跟着变。

博物馆的内容来自 `music-data.js`（歌名/歌手/封面/音频/歌词）。
**「一首歌 = 一张唱片」，这是引擎按 `tracks[]` 自己生成的**：
加一首就多一张、删一首就少一张，不需要在任何地方补条目。

只想给某几首**补一句自己的话**时，才写进 `music-museum-data.js` 的 `spots`：

```js
spots: {
  "shelter": { note: "进门第一首", label: "空凛" }
}
```

- 键（`shelter`）必须对得上 `music-data.js` 里的 `id`；**对不上的键会被忽略**。
- 只有两个字段可用：`note`（**这一处陈列**的附注，写进档案的 `NOTE` 一行）
  与 `label`（覆写档案里的署名，默认取 `artist`）。
- ⚠️ **第六轮起 `x` / `y` / `scale` / `rotation` / `depth` 全部作废**：
  位置不再写在数据里，而是由「离焦点的距离」算出来（见下）。
  旧字段写在 `spots` 里**不会被读**（引擎照样原样收下，不吃掉你的数据）。
- ⚠️ **同一首歌只会有一张唱片**。写重了也不会多出一张
  （用户反馈过「3 首歌却看到 5 张唱片」）。
- 点唱片**不会播放**：点「不是焦点」的那张 = 只看；点「已经是焦点」的那张 = 播放 / 暂停；
  右侧档案里的按钮也能播。全程复用右下角那个播放器，博物馆**不新建** `<audio>`。

### 扇形是怎么排的（几何模型）

唱片按**椭圆弧**排布。`offset` = 这张离焦点的距离，屏内是 `-3 … +3` 那 7 张：

```
theta = offset × step        step = 90° / half      half = min(3, ⌊(曲库数-1)/2⌋)
x = cx + rx·cos(theta)       y = cy + ry·sin(theta)
```

- 视觉中心**明显偏左**：扇形包络（含最外那一圈）的右边界在 1440×900 与 1152×720 下
  都落在 **45% 左右**，右边 55% 留给常驻的档案轨。
- 近大远小：`offset 0 → 1.14`、`±1 → 0.86`、`±2 → 0.70`、`±3 → 0.55`，越远越淡、越糊、层越低。
- `size / rx / ry` **不是写死的数**：由视口宽高算出来再 `clamp`，并且满足三条**构造性**约束
  （焦点盘不侵入右侧轨道 / 纵向极值不越出上下 band / 最外圈不出左边界）。
  所以 1920×1080 与 1152×720 走的是同一套代码，不是两组参数。

### 唱片多了会怎样（可拓展性）

| 曲库规模 | 博物馆的行为 |
| --- | --- |
| 任何规模 | **不分页**。扇形窗口固定显示焦点 ± 3 张（+ 一圈淡出环），再多也只是「弧上更密」 |
| 2 首 | 窗口自动缩到 `half = 1`，两张之间 90° —— 仍然是扇形，不是一条竖排列表 |
| 7 首以上 | 屏上可见张数不变（最多 7 张清晰 + 2 张渐隐），**不换展区** |
| 滚到第一首再往下滚 | 回到最后一首；最后一首往上滚回到第一首（首尾逻辑相接） |
| 换曲目 / 换封面 / 上传新歌 | 进厅时或 1s 内自动重建（指纹比对，不做无谓重建），新歌自己上墙 |
| 当前在播的歌不在窗口里 | 进厅时自动把扇形转到它，并展开它的档案 |

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

`note`（写在 `music-museum-data.js` 的 `spots` 条目上）优先于曲目的 `description`。

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
- **音乐博物馆的数据源只有一个**：`music-data.js` 的 `tracks[]`。
  `music-museum-data.js` 只是**可选覆写表**，别往里加歌曲条目（加了也不会多出唱片）。
- **改 `music-museum.js` 时守住三条不变量**：① 整站只有一个 `<audio>`（博物馆一律走
  `RinsoraMusic.playIndex()`，不新建播放器、不改 `src`）；② 退出展厅只能走宿主注入的
  `exitMuseum()`（别在博物馆里自己收尾）；③ 唱片摆位必须确定性（用 `hash(id)`，**不能用
  `Math.random`**，否则每次刷新角度都变）。
