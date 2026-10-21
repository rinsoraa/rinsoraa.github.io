# Rinsora Home — 代码审计与改造记录

> 审计对象：rinsoraa/rinsoraa.github.io，基线提交 5787f6d（2026-10-21）
> 方法：静态源码阅读 + 本地 HTTP 服务 + Edge/Playwright 桌面/移动回归 + 控制台与截图核对
> 结论：模块边界、降级路径和交互细节在纯静态个人站里明显高于平均水准；优先处理项是 3D 常驻层的运行时成本、构建产物可维护性、可访问性与资源体积。

---

## 1. 架构总览

```text
index.html
  ├─ style.css        设计令牌 / 主题 / 基础布局（同时是动态 DOM 的类名契约）
  ├─ v3.css           组件 / 页面转场 / 响应式
  ├─ v4.css           本次新增的视觉增强层（仅首页）
  ├─ posts/post.css   文章排版（首屏文章浮层复用）
  ├─ music-data.js → music.js → music-upload.js
  ├─ projects-data.js → projects.js
  ├─ moments-data.js → script.js
  ├─ blog-admin.js / gh-api.js
  ├─ room-drawer.js → room/room.js（按需 module，内含 Three.js 场景）
  └─ v4.js            本次新增的渐进增强层（视差 / 卡片柔光 / 房间控件）
```

### 优点

1. 静态数据与渲染分层明确：曲库、项目、碎碎念各自是纯数据文件。
2. 按需加载：音乐博物馆与 3D 房间不在首屏 HTML 里硬塞资源。
3. 降级路径完整：stubEl 空元素兜底、动画 setTimeout 兜底、prefers-reduced-motion 开关。
4. 主题系统可扩展：调色板与昼夜正交，data-theme + 旧 pal-* 双写。
5. 样式契约有文档：README 写清动态类名、z-index、animation-play-state 等坑。

### 风险与处理

| 优先级 | 问题 | 影响 | 本次处理 |
| --- | --- | --- | --- |
| P0 | 房间藏在 z-index:-1 视口层里，但 rAF 仍持续渲染 | 桌面首屏就持续占 GPU / 电量，即使从未进房间 | 已修：room-drawer 在 ready 后 pause，进入时 resume；实测隐藏 4 秒帧数从 159 降到 2 |
| P1 | room/room.js 是 870KB 构建产物，仓库内无源码 / 构建脚本 | 无法复现、升级 Three.js 或改模型细节 | 部分缓解：在独立源码工程改造后重新构建；建议后续把 src/ 纳入仓库并加 CI build |
| P1 | 3D 后处理固定 4x MSAA + GTAO + Bloom + DPR 2 | Retina / 低端 GPU 填充率过高 | 已优化：DPR 上限 1.75、PCFShadowMap、GTAO 0.12、Bloom 0.20 |
| P1 | script.js / style.css / music-museum.js 体量大，靠注释维护契约 | 修改一处可能影响其他模块 | 新增 v4.css / v4.js 独立命名空间；建议后续拆 ES module |
| P1 | 首页误加载 room/room.css，其 :root / body / h1 / .status-dot 是独立试玩页的全局样式 | 夜间根背景被钉成奶油色、首页状态点尺寸被改，主题切换看似失效 | 已修：首页不再加载 room/room.css；canvas 尺寸由 room.js + room-drawer.css 负责，body 保持透明让 3D 视口层可见 |
| P2 | 音频约 36MB，单曲最大 9.5MB | 移动流量 / 首播等待 | 建议转 96–128kbps Opus/Ogg，保留 MP3 fallback |
| P2 | GitHub Token 存 localStorage，Contents 写权限通常覆盖整仓 | XSS / 恶意扩展可写仓库 | 使用 fine-grained PAT，只授权该仓 Contents 读写 |
| P2 | 浅色玻璃上小字对比度偏低 | 可读性 / WCAG 风险 | V4 提高了 eyebrow 与辅助色对比；仍建议跑 axe/Lighthouse |
| P3 | 嵌入模式每次为 9 个不存在的可选元素打印 warning | 控制台噪声掩盖真实错误 | 建议改为 debug 或用 data-embed 关闭 |
| P3 | 无资源指纹 / cache busting | 用户可能拿到旧 CSS/JS | 建议文件名带内容 hash 或 query ?v= |

---

## 2. 本次代码层改造

### 2.1 运行时性能

- room-drawer.js：新增 syncRoomLifecycle()，250ms 轮询等待 window.__room 后按抽屉状态 pause/resume；初始隐藏即暂停。
- room-drawer.css：房间打开时 overflow:hidden，新增暗角 / 颗粒层与入场镜头动画。
- 首页移除 room/room.css：它只属于独立试玩页，加载到首页会把 :root 背景、状态点、h1 等全局样式一起带进来；嵌入模式不需要它。
- room.js：DPR 上限 1.75；PCFSoftShadowMap → PCFShadowMap（r186 已移除前者）；用 performance.now() 替代 deprecated 的 THREE.Clock。
- script.js：开屏进度条增加 7 秒硬兜底，任何字体 / 音频 metadata 卡住都不会让用户永远停在 90%。

### 2.2 3D 场景

- 默认夜晚照明重构：冷色 hemi + 月光点光 + 镜头侧 fill + 显示器背光 + 角色前暖补光；夜晚曝光 0.8 → 0.86，暗角 0.6 → 0.38。
- 后处理：Bloom 0.26 → 0.20，GTAO 0.20 → 0.12，夜晚 lift 0.030 → 0.042。
- 新增建模细节：窗前双色布帘与帘杆（缓慢摆动）；后墙 13 颗暖色灯串（悬链线 + 导线 + 呼吸闪烁 + 局部点光）；窗外两层星屑 Points；床尾奶油猫玩偶（身体 / 头 / 耳 / 眼 / 鼻 / 尾 / 爪 + 呼吸）；角色坐姿朝向 / 腿摆幅微调与呼吸；96 粒 shader 点精灵尘埃（逐粒大小 / 相位 / 冷暖色，不再每帧改 CPU buffer）。
- 新增 #roomLight 玻璃按钮与左下角场景标题；支持夜灯 / 日光切换，并同步 3D 内墙面按钮触发的 room:night 事件。
- 根据实机反馈做了第二轮修正：关闭抽屉时 #roomSection 完全 opacity/visibility 隐藏（不再透到主页背景）；角色恢复上一版的朝右前坐姿，并保留头部 base quaternion 的鼠标朝向；台灯 / 灯串 / 屏幕 / 角色补光与 Bloom 全部下调（Bloom 0.34 → 0.20），屏幕 hover 不再过曝。

### 2.3 首页视觉层

- v4.css：可呼吸 conic 极光、漂移光尘、偶发流星；欢迎卡内描边与阴影层次、头像轨道视差与呼吸光；顶栏渐变细线、进度条流光、侧栏边缘高光、头像导航轨道；卡片指针柔光、玻璃边缘增亮、标题渐变、博客卡 hover 下划线、在线状态呼吸灯；手机端减少模糊并增加底部安全留白。
- v4.js：用 CSS 变量驱动背景 / 头像视差（rAF 缓动）；卡片柔光跟随指针（事件委托，动态卡片生效）；注入流星和房间控件；全部动画尊重 prefers-reduced-motion。

---

## 3. 建议的下一轮（未实现）

1. 把 3D 源码纳入仓库：room-src/ + package.json + CI npm run build:lib，避免 870KB 构建产物成为唯一真相。
2. 把 script.js 拆成 theme.js / router.js / effects.js / a11y.js，用 ES module 显式 import 替代全局函数顺序依赖。
3. 引入资源版本清单：构建时给 CSS/JS 加内容 hash；至少给 v4.css、room.js 加 ?v=YYYYMMDD。
4. 音频转码管线：MP3 转 Opus 64–96kbps，封面统一 WebP，预计减少 60–75% 音频体积。
5. 可访问性回归：axe-core 扫首页 / 文章页 / 编辑器，重点检查玻璃小字、焦点顺序、aria-expanded 和自定义光标的键盘等价操作。
6. 质量档位：3D 增加 high / balanced / low 三档（DPR、GTAO、Bloom、阴影分辨率），按 deviceMemory / hardwareConcurrency / 帧时间自动降级。
7. Token 安全：README 明确 fine-grained PAT，仅给当前仓库 Contents 读写；考虑把管理端迁移到独立域名或本地工具。

---

## 4. 回归清单

- [x] node --check：v4.js、room-drawer.js 通过
- [x] 桌面 1440×900：欢迎页 / 主页 / 房间夜灯 / 房间日光截图
- [x] 移动 390×844：欢迎页 / 主页无横向溢出
- [x] 房间隐藏时 __room.isPaused() === true，进入后 false，帧数正常推进
- [x] 房间灯光按钮可切换 nightTarget，room:night 事件可反向同步 UI
- [x] 抽屉关闭时 3D 层 opacity=0 / visibility=hidden，不参与主页视觉
- [x] 夜间台灯、灯串、显示器 hover、角色补光逐项截图复核
- [x] 控制台无脚本异常；嵌入模式 warning 属于既有降级路径
- [ ] GitHub Actions site-check（推送后由远端执行）
