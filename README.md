# Rinsora Home V2

这是基于 `rinsoraa/rinsoraa.github.io` 现有站点的 **V2 视觉/交互覆盖包**。

核心方向：
- Candy / Anime / Acrylic 玻璃质感
- 开屏加载动画
- 欢迎页 → 小窝桌面态的头像飞行动画
- 左侧头像半圆导航
- 动态背景：Aurora / 星尘 / 网格 / 鼠标光晕
- 卡片 3D 悬停倾斜与点击涟漪
- 右下角常驻音乐播放器 + 原站 LRC 歌词引擎
- 外观设置抽屉：主题 / 色相 / 粒子 / 光晕 / 3D / 涟漪
- 博客筛选、最新内容、碎碎念、时间进度
- 文章页统一成 V2 视觉
- `CNAME` / `.nojekyll` 保留
- 手机端三按钮底部导航

## 使用方式

这个包**不是删除你原站数据的重建包**，而是为了最大限度保留你当前博客、项目、音乐、写作台和项目编辑台，建议直接覆盖以下文件：

```text
index.html
style.css
script.js
posts/post.css
404.html
CNAME
.nojekyll
```

然后保留原仓库里的以下文件和目录：

```text
assets/
music/
posts/*.html
gh-api.js
music-data.js
music.js
music-upload.js
projects-data.js
projects.js
blog-admin.js
editor.html
editor.css
editor.js
project-editor.html
project-editor.js
new-post.py
new-post.cmd
favicon.ico
favicon-32.png
apple-touch-icon.png
```

### 方式 A：本地 Git 仓库

把本 ZIP 解压后，将包里的文件复制到你的仓库根目录，允许覆盖同名文件：

```text
D:\rinsoraa.github.io\
```

然后：

```bash
git add .
git commit -m "feat: Rinsora Home V2"
git push
```

### 方式 B：GitHub 网页上传

直接把本包解压，把上述文件拖进 `rinsoraa.github.io` 仓库根目录。

## 现有功能兼容

V2 的 `index.html` 保留了你现有脚本所依赖的 DOM 契约：

- `#landingPlayer` / `#floatingPlayer` / `#audio`
- `#projectTree`
- `#blog .blog-grid .blog-card`
- `#blogFilter` / `#blogEmpty`
- `#recentFeed`
- `#about` / `#blog` / `#projects`
- `.section-heading`
- `window.RinsoraHome.refreshRecent()`
- 站内写作台 `#admin` / `editor.html`
- 项目编辑台 `#project` / `project-editor.html`

因此现有音乐播放、LRC 歌词、音乐上传、博客管理、项目管理等 JS 不需要重写。

## 你的域名

当前 `CNAME` 为：

```text
rinsora.dpdns.org
```

GitHub Pages 里继续使用：

```text
Custom domain:
rinsora.dpdns.org
```

## V2 交互

桌面端：
- 打开站点 → 开屏
- 欢迎页点击「进入小窝」
- 头像从中央飞到左侧头像位
- 欢迎页播放器向下淡出
- 右下角常驻播放器从底部淡入
- 鼠标移动到左侧头像 → 半圆形导航出现
- 1 / 2 / 3 可切换三个主板块
- `Ctrl + K` / `Cmd + K` 打开设置
- `Esc` 关闭设置
- 点击空白区域收起头像导航

移动端：
- 左侧导航改为底部三按钮
- 音乐播放器适配手机宽度
- 设置面板改为右侧抽屉

## 替换头像

继续使用你仓库已有的：

```text
assets/avatar.png
```

V2 也准备了 `assets/avatar.svg` 作为 fallback。

## 注意

不要把 GitHub Personal Access Token 写进网页源码；你现有写作台/音乐上传功能把令牌放在浏览器 localStorage 中，这一设计继续保留。
