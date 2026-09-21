# 空凛 / Rinsora 个人主页

可直接部署到 GitHub Pages 的静态个人主页 + 博客。纯 HTML / CSS / JS，无构建步骤、无后端依赖。

## 目录结构

```
.
├── index.html              # 主页面：欢迎页 → 桌面态（关于我 / 博客 / 项目展示）+ 常驻音乐播放器
├── 404.html                # 自定义 404，GitHub Pages 会自动使用
├── .nojekyll               # 让 GitHub Pages 跳过 Jekyll 处理
├── favicon.ico             # 站点图标（内含 16 / 32 / 48 三个尺寸）
├── favicon-32.png          # 浏览器标签页备用图标
├── apple-touch-icon.png    # iOS「添加到主屏幕」图标（180×180）
├── style.css               # 全站视觉：马卡龙风、玻璃拟态、响应式、夜间模式
├── script.js               # 入场动画、径向导航、音乐 / LRC、主题记忆、hash 直达
│
│   ── 站内写作台（在网页里写文章 / 传图片 / 改删文章）──
├── editor.html             # 写作台页面（带 noindex，不会被搜索引擎收录）
├── editor.css              # 写作台 + 项目编辑台共用的样式
├── editor.js               # 写作台逻辑：Markdown 编辑与预览、图片上传、发布 / 更新 / 删除
├── gh-api.js               # GitHub Contents API 封装（读写仓库文件 + Token 本地存储）
├── blog-admin.js           # 博客管理入口：「＋ 写一篇」和卡片上的编辑 / 删除按钮
│
│   ── 项目展示（按大分类分组的树 + 项目编辑台）──
├── projects-data.js        # 项目数据源：分类列表 + 项目条目（唯一需要改的文件）
├── projects.js             # 渲染分类树；有令牌时挂上「＋ 加一个」和每行的编辑 / 删除
├── project-editor.html     # 项目编辑台页面（带 noindex，不会被搜索引擎收录）
├── project-editor.js       # 项目编辑台逻辑：自动识别链接、保存 / 删除
│
│   ── 本地工具（可选，网站不依赖）──
├── new-post.py             # 命令行写作脚本：生成文章页 + 更新首页卡片
├── new-post.cmd            # 双击运行 new-post.py（Windows）
├── assets/
│   ├── avatar.png          # 当前头像（换成自己的正方形图即可）
│   ├── avatar.svg          # 初版占位头像，备用保留
│   └── blog/               # 写作台上传的配图放这里（传过图后自动出现）
├── posts/
│   ├── post.css            # 文章页排版
│   ├── why-i-made-my-own-home.html
│   ├── ai-workflow.html
│   └── minecraft-server-log.html
└── music/
    ├── demo.wav            # 演示音频，可替换
    └── demo.lrc            # 演示歌词
```

## 本地预览

纯静态，双击 `index.html` 也能看；但为了和线上路径行为一致，建议起个本地服务：

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 部署到 GitHub Pages

1. 仓库已建好并命名为 `rinsoraa.github.io`（✅ 用户站，正好等于 `<用户名>.github.io`）
2. 把**本目录（`rinsora-home`）里面的全部内容**推到仓库**根目录**——注意不是把 `rinsora-home` 文件夹整个推上去
3. 仓库 Settings → Pages → Source 选 `Deploy from a branch`，Branch 选 `main`，目录选 `/ (root)`
4. 等一两分钟，访问 `https://rinsoraa.github.io/`

`.nojekyll` 已经在根目录里，不需要额外配置。

> ⚠️ **改名后要同步一处**：仓库现在叫 `rinsoraa.github.io`，写作台的默认配置就是这个值。
> 如果你之前配过令牌、且里面填的是旧仓库名 `rinsora.github.io`，去写作台「⚙ 设置」改成
> `rinsoraa.github.io` 再保存，否则会一直报 404。

### 如果部署成「项目站」而不是用户站

站点地址会变成 `https://你的用户名.github.io/<仓库名>/`，此时需要改两处：

- `404.html` 里的 `<base href="/">` → `<base href="/<仓库名>/">`
  （GitHub Pages 会对任意深层路径返回 404.html，相对路径会以原请求路径为基准而失效，所以这里必须用 `<base>` 固定基准）
- `index.html` 里的 `og:image` 相对路径 → 改成绝对地址

## 站内写作台（在网页里写文章）

网站自带一个「写作台」：不用 git、不用脚本，直接在浏览器里写 Markdown、传图片、发布 / 修改 / 删除文章。**对普通访客完全不可见**——只有在你自己配置过令牌的浏览器里，管理按钮才会出现。

> 原理：GitHub Pages 是纯静态托管，没有后端。写作台是借 GitHub 官方的 **Contents API**，用**只属于你自己的令牌**直接往仓库里写文件。令牌只存在你这台浏览器的 `localStorage` 里，不会发给任何第三方。

### 怎么打开写作台（第一次必看）

「＋ 写一篇」按钮**只有在配过令牌之后才会出现**。所以第一次得先想办法进到写作台去配令牌，一共三条路，**任选一条**：

| 方式 | 操作 | 说明 |
|---|---|---|
| **直接开网址** | 浏览器访问 `https://rinsoraa.github.io/editor.html` | 最直接，建议存成书签 |
| **地址栏加锚点** | `https://rinsoraa.github.io/#admin`（`#write`、`#editor` 也行） | 会自动跳到写作台 |
| **快捷键** | 在页面上按 `Ctrl + Shift + E`（Mac：`Cmd + Shift + E`） | 不用记网址 |
| **连点三下** | 鼠标连点三下博客小标题「博客 / 随笔」 | 忘了上面两条时的后路 |

这四条对访客**完全无害**：`editor.html` 本身不带令牌什么也做不了，只会显示一句「先填上 Token」。
进到写作台后，按下面的步骤配上令牌，再回首页，`＋ 写一篇` 和卡片上的编辑 / 删除按钮就都出来了。

### 一次性配置（每台设备只需做一次）

1. 打开 <https://github.com/settings/personal-access-tokens/new> —— 要 **Fine-grained** 令牌，不要用 Classic
2. **Token name** 随便写，例如 `rinsora-blog`
3. **Expiration** 建议选 90 天或 1 年（到期再生成一个换上就行）
4. **Repository access** 选 `Only select repositories`，只勾 `rinsoraa.github.io`
5. 展开 **Permissions → Repository permissions**，把 **Contents** 设成 `Read and write`
6. 点 `Generate token`，复制那串 `github_pat_...`（**只显示这一次，关掉就再也看不到**）
7. 打开写作台（见上一节任意一条入口），在「⚙ 设置」里填好：

   | 字段 | 填什么 |
   |---|---|
   | 用户名 / 组织 | `rinsoraa` |
   | 仓库名 | `rinsoraa.github.io` |
   | 分支 | `main` |
   | Personal Access Token | 刚才复制的 `github_pat_...` |

   保存。

保存后，这台浏览器就进入了「管理员模式」。这时再回首页，博客标题旁才会出现「＋ 写一篇」。

### 怎么用

- **写新的**：博客板块标题右边会出现「＋ 写一篇」按钮，点它进入写作台
- **改 / 删旧的**：鼠标移到任意一张文章卡片上，右上角浮出「编辑 ✎」「删除 ✕」两个小按钮
- **编辑器布局**：左边是已有文章列表，右边是 Markdown 编辑框；右上角可切「预览」，实时看排版效果
- **传图片**：把图片**拖进编辑框**、**直接粘贴截图**，或点工具栏的「图片」按钮选文件。图片会上传到 `assets/blog/`，并把 Markdown 图片语法自动插到光标处
- **保存**：`Ctrl / Cmd + S`，或点「发布」。它会**同时**写好文章页 `posts/<slug>.html` 和首页的摘要卡片，并自动按日期排序
- **换令牌 / 退出**：写作台顶部的「⚙ 设置」可以改令牌，点「忘记令牌」即退出管理员模式

### 几个要点

- 写作台页面带 `noindex`，不会被搜索引擎收录；但**链接本身是公开的**——别人打开也只是个空白页（没令牌就没有任何按钮）。安全全靠**令牌不泄露**。
- 令牌 = 仓库的写权限。别截图外发，别写进代码提交上去；一旦怀疑泄露，去 GitHub 立刻 `Revoke` 并重新生成。
- 如果改用「项目站」部署（见上一节），记得在「设置」里把**仓库名填成实际名字**。
- `localStorage` 不跨设备：换电脑 / 换浏览器，需要重新配一次令牌。

## 项目展示（按大分类分组的树 + 项目编辑台）

项目展示区**不再写死在 `index.html` 里**：数据放在 `projects-data.js`，由 `projects.js` 渲染成一棵
按大分类分组的树。

```
-- Github项目                                  ← 点分类标题可以折叠 / 展开
|
- Myspace      我的个人主页，用 Next.js 写的      [Next.js] [自用]
- MyBlog       随手写的东西                     […]
-- Minecraft
|
- MC 服务器    和朋友一起玩的整合包服务器          [Minecraft] [Forge]
-- Bot
|
- MaiBot 小助手 个人 AI Bot 实验场                [Python] [QQ]
```

- 大分类默认四个：**Github项目 / Minecraft / Bot / 其他**（在 `projects-data.js` 的 `categories` 里可增删改）
- **某个分类手下没有项目时，它不会出现在页面上**——所以「其他」空着就看不见，加进项目才会冒出来
- 折叠状态记在 `localStorage`（键名 `rinsora-projects-closed`），下次打开还是你上次的样子

### 怎么加一个项目

配过令牌后，项目展示的标题右边会出现「**＋ 加一个**」，点它进**项目编辑台**（`project-editor.html`）。

第一次进不去的话，和写作台一样有几条**不需要令牌**的入口：

| 方式 | 操作 |
|---|---|
| **直接开网址** | 访问 `https://rinsoraa.github.io/project-editor.html`（建议存书签） |
| **地址栏加锚点** | `https://rinsoraa.github.io/#project`（`#newproject` 也行） |
| **快捷键** | 在页面上按 `Ctrl + Shift + P`（Mac：`Cmd + Shift + P`） |
| **连点三下** | 鼠标连点三下「项目展示」小标题 |

进到编辑台之后：

1. **链接 URL** —— 粘贴项目地址（GitHub 仓库、自己的站、任何网页都行）
2. 点「**自动识别**」—— 它会按顺序试这几条路，成功一条就停：
   - `github.com/主人/仓库` → 走 **GitHub 官方 API**，拿到仓库名和 description（最准）
   - 其他网址 → **Microlink** 读出页面的标题 / 简介
   - 再不行 → **AllOrigins / CodeTabs** 两个公共抓取代理取回 HTML，自己在本地解析 `og:title`、`og:description`
   - 全失败 → 提示你手动填，不会卡住
   - 如果标题 / 简介里已经有你写的内容，会先问一句要不要覆盖
3. 标题、简介**随便改**；再选**大分类**、挑个**图标**、填**自定义小标签**（标签会显示在预览卡片上）
4. 右下方「在『项目展示』里的样子」是**实时预览**，用的就是首页那套样式，所见即所得
5. 点「**保存并发布**」

其他操作：

- **改 / 删已有项目**：鼠标移到首页任意一个项目行上，右上角浮出「编辑 ✎」「删除 ✕」；也可以进编辑台点左侧列表
- **新增分类**：编辑台里把「大分类」下拉拉到最底，点「＋ 新增一个分类…」，输入名字即可（会写进 `categories`，排在最后）
- 保存只会改 `projects-data.js` **一个文件**，所以提交历史很干净

### 手动改也行

直接编辑 `projects-data.js` 的 `items` 数组，就是普通 JSON：

```js
{
  "id": "myspace",              // 内部标识，加完就别改（删除 / 编辑靠它认人）
  "name": "Myspace",            // 项目名称
  "category": "Github项目",      // 必须等于 categories 里的某一个
  "url": "https://github.com/...",  // 点击跳转；留空则该行不可点
  "desc": "一句话简介",
  "tags": ["Next.js", "自用"],   // 小标签
  "icon": "✦",                  // 图标，一个字符
  "date": "2026.09.21"
}
```

> 改完记得别用脚本格式化掉注释头，`projects.js` 靠 `window.RINSORA_PROJECTS = {...};` 这一行找数据。

---

## 怎么改内容

### 换头像
直接替换 `assets/avatar.png`（建议正方形，透明底最佳）。
如果希望浏览器标签图标也跟着换，用同一张图重新导出这三个文件：`favicon.ico`（16/32/48）、`favicon-32.png`（32×32）、`apple-touch-icon.png`（180×180，iOS 不支持透明，建议合成到浅色底上）。

### 换音乐
把 `index.html` 中：

```html
<audio id="audio" preload="metadata" src="music/demo.wav"></audio>
```

的 `src` 改成自己的文件，例如 `music/my-song.mp3`，并上传对应文件即可。
也可以进入网页后通过右下角播放器加载本地音乐和 LRC，仅对当前浏览器会话生效。

### 新增一篇文章

四种方式，挑一种。

#### 方式一：站内写作台（在网页里写，最省事）

配置一次令牌后，网站博客板块会出现「＋ 写一篇」。点进去写 Markdown、传图片、点发布即可，**首页卡片会自动更新**。详细步骤见上面的「[站内写作台](#站内写作台在网页里写文章)」一节。

#### 方式二：跑脚本（本地写，不想开网页时用）

双击 `new-post.cmd`，或者在 `rinsora-home` 目录下：

```bash
python new-post.py
```

它会依次问你标题、日期、摘要、标签，正文可以直接粘贴 Markdown（粘完在新的一行输入 `EOF` 结束），然后自动：

- 生成 `posts/<文件名>.html`
- 把摘要卡片按日期倒序插进 `index.html`（同一天的话，新写的排最前）

不想被逐条问，就一次给全：

```bash
python new-post.py "标题" --slug my-post --summary "一句话摘要" --tags "随笔,折腾"
python new-post.py "标题" --md draft.md     # 正文直接读 Markdown 文件
python new-post.py "标题" --dry-run         # 只预览，不写任何文件
```

正文支持这些 Markdown：一到六级 `#` 标题（`#` 渲染成正文里最大的章节标题 h2，依次往下）、`-` 与 `1.` 列表、`>` 引用、三个反引号围起来的代码块、行内代码、`**粗体**`、`*斜体*`、`[文字](网址)`、`![说明](图片)`、`---` 分隔线。

#### 方式二：在 GitHub 网页上写（不用装任何东西）

1. 打开仓库，进入 `posts/` 目录
2. 点开任意一篇旧文章，右上角 `Copy raw contents` 复制它
3. `Add file` → `Create new file`，文件名写 `my-post.html`
4. 粘贴，改标题 / 日期 / 正文，点 `Commit changes`
5. 等一分钟，Pages 会自动重新部署

脚本会顺手更新首页卡片，这一步在网页上得自己写。

#### 方式四：纯手工

1. 复制 `posts/` 里任意一个 `.html`，改成新文件名
2. 改 `<title>`、`<meta name="description">`、`.post-kicker` 小标题、`.post-title`、`.post-meta` 里的日期、`.post-body` 正文、`.post-tags` 标签
3. 在 `index.html` 的 `.blog-grid` 里加一张卡片，把 `.card-title-link` 的 `href` 指向 `posts/新文件.html`

#### 修改 / 删除已有文章

- **在网页里改**：鼠标移到首页对应卡片，右上角点「编辑 ✎」进写作台改，或点「删除 ✕」直接删（删掉会同时移除文章页和首页卡片）。前提是这台浏览器配过令牌。
- **在本地改**：直接编辑 `posts/` 下对应的文件，`.post-body` 就是正文区。改了日期记得同步 `index.html` 卡片里的日期。

> `new-post.py` / `new-post.cmd` 只是本地写作工具，网站运行不依赖它们。不想让它们出现在线上仓库的话，推送前不提交（或加进 `.gitignore`）即可——代价是换电脑后要重新拷一份。

### 新增 / 修改项目

见上面的「[项目展示](#项目展示按大分类分组的树--项目编辑台)」一节：
配好令牌后点项目展示标题右边的「＋ 加一个」，

- **在网页里加 / 改 / 删**：项目编辑台填链接 → 自动识别 → 改标题简介 → 保存
- **在本地改**：直接编辑 `projects-data.js` 的 `items` 数组（分类写在 `categories` 里）

### 夜间模式
点右上角 ☾ 切换。选择会记在 `localStorage`（键名 `rinsora-theme`），文章页会自动跟随，不用重复切换。

### 直达链接
`index.html#about`、`index.html#blog`、`index.html#projects` 会跳过欢迎页，直接落到对应板块——文章页的「回到博客列表」用的就是这个。

另外 `index.html#admin` 会跳到写作台，`index.html#project` 会跳到项目编辑台（这两个是为了「还没配令牌时也能进去配置」而留的口子）。
