# Checkpoint-01：累计成果提交审查

2026-10-23。**READY_FOR_LOCAL_COMMIT；尚未暂存、提交、推送或部署。**

基线为 main / `323e793e8ec147ce5eb59ed7088049588a090469`。当前相对本地 origin/main 为 0 ahead / 0 behind；本次没有刷新远端，不能据此保证远端此刻未变化。UI-01 至 UI-03F 仍是累计工作树，不是已经存在的阶段提交。

本审查不改变网站产品代码。只补充可移植检查入口 `tools/check-site.py` 和本检查点文档。138 项产品文件及 312 项 UI-03F 归档证据与交付时一致，现有交付 ZIP 的 SHA256 也再次匹配。原始素材、历史失败与未跟踪文件均保留。

## 提交方案与精确文件

机器可读白名单见 [checkpoint-01-files.json](checkpoint-01-files.json)。共 32 个路径，批准后才可逐组显式暂存。不得使用 `git add .`、`git add -A` 或整个 docs 目录。

### 1. chore(assets): preserve original illustrations and add responsive cover crop

9 项资产，先于引用它们的产品提交：

```text
assets/illustrations/character-pose.png
assets/illustrations/character-reference.png
assets/illustrations/cover-bedroom-desktop.png
assets/illustrations/cover-bedroom-desktop.webp
assets/illustrations/cover-bedroom-mobile.webp
assets/illustrations/hero-desktop.png
assets/illustrations/hero-desktop.webp
assets/illustrations/hero-mobile.png
assets/illustrations/hero-mobile.webp
```

5 份 PNG 共 8,945,144 字节，4 份 WebP 共 721,812 字节。PNG 是需保存的原始美术；WebP 是部署派生资产，不属于误存重复。角色参考图暂不渲染，但按需求保存。尺寸与 SHA256 见 [资产清单](../ui-03f/asset-manifest.json)。验证全部资产哈希、尺寸、可解码性与该阶段既有 CI；仅增加文件，不改变网站行为。

### 2. feat(home): integrate editorial home, museum repair and ambient cover

12 项完整累计产品集成：

```text
.gitignore
index.html
style.css
script.js
room-drawer.css
room-drawer.js
home-hero.css
home-hero.js
ui02.css
ui02.js
cover-stage.css
cover-stage.js
```

首页、博物馆宿主加载器、房间控制器和 Cover 共享 index/script 与入口接口。此组整体提交，避免缺配套样式、脚本或初帧隐藏规则的中间状态。音乐引擎、博物馆内部、Three.js 场景与内容数据不在累计修改范围。

访问路径使用相同站点根目录：`/#about` 为 UI-01；`/?ui02=1#about` 为 UI-02；`/?ui02=1&cover=1#about` 为 Cover；调试再加 `&coverDebug=1`。不修改默认发布入口。Cover 要求两个开关同时为 1；仅有 cover=1 不接管房间上拉。普通 UI-02 不请求 Cover 美术、CSS 和控制器。

验证该阶段既有 CI、9 项美术及 6 个新模块路径，随后检查欢迎进入、三种模式、博物馆冷启动隐藏、房间、音乐、历史、主题和移动导航。标题、about 和侧栏只做局部位移，不改变 app/mainContent 的 fixed 包含块。不能为缩小 diff 顺便统一混合换行。

### 3. test(home): establish portable loading and room regression gates

7 项测试与工具，CI 和其引用的测试同组：

```text
.github/workflows/site-check.yml
tests/cover-art.test.cjs
tests/cover-loading.test.cjs
tests/museum-loading.test.cjs
tests/room-controller.test.cjs
tests/ui02.test.cjs
tools/check-site.py
```

Node.js 20+ 和 Python 3 即可，无第三方包、浏览器或网站运行依赖。从仓库根目录执行：

```text
python tools/check-site.py
git diff --check
git diff --cached --check
```

Node 不在 PATH 时可用 NODE_BINARY 指定。工具从实际 CI 提取数据与 HTML/sitemap 检查；工作流格式不再匹配时明确失败。它同时检查根 JS 语法与 5 组 Node 回归，支持无 .git 的源码审查副本。原计划引用的 docs 内本机工具不随白名单提交，故提供此可移植入口。

这些 Node 测试含 VM/模拟 DOM，不冒充真实浏览器验收。每次未来改动仍需浏览器关键链路复核；云端 CI 尚未触发。

### 4. docs: record UI-03 checkpoint and remaining release risks

4 项精简审查文档：

```text
docs/checkpoints/checkpoint-01.md
docs/checkpoints/checkpoint-01-files.json
docs/ui-03f/risks.json
docs/ui-03f/asset-manifest.json
```

替代将旧阶段报告、备份路径和一次性工具整包提交的做法。前两份 UI-03E/F 计划继续原地保留作历史记录；旧计划引用的本地脚本不代表公共仓库依赖。risks.json 的证据名称指本地历史证据，不承诺原始 Trace 或截图随 Git 发布；本文件补充本次审查发现。

验证 32 路径存在、不重复、无秘密/本机路径/临时服务地址；JSON 可解析、文档相对链接可达，且与前三组的资产/接口一致。按 HEAD 的源码副本依次应用四组，仅做文件拷贝，再执行各组语法/CI/依赖检查；不创建实际 Git 提交。

## 验证证据口径

本轮重新运行：全部根 JavaScript 语法、5 组可移植测试、4 份数据形状、10 份 HTML、6 篇文章对应、7 条 sitemap、robots 与 Git 差异检查。历史浏览器结果使用再次校验过的 UI-03F 原始证据，不将本次源码检查写成新一轮实机测试。

UI-03F 浏览器证据覆盖 24 次冷暖导航、7 个视口的 0/50/100%、普通模式隔离、连续音乐、博物馆三轮进出、3D 房间、历史、主题、失败降级及减少动效。原始 suite 的 effects-idle 曾失败，最终通过来源是等待实际坐标收敛后的 effects-idle.json；连续 locator.click 的主动滚动失败和片段位置差异也保留，不隐去失败。此次抽查历史桌面/手机展开截图，人物面部可见，标题/导航/主卡保留。

本轮不重新批量启动 Edge，避免在此前 Alt+Tab 异常未定位时再次制造大量测试窗口。新一轮完整浏览器、Lighthouse、真实手机和跨引擎验收均不在本轮 PASS 范围。

## 剩余风险与发布门槛

当前未发现 P0 或未处理 P1。以下是 P2 或明确证据缺口；均不阻塞保存本地检查点。正式发布须逐项完成动作或明确接受可接受的剩余风险，不能把本地提交资格当成发布批准。

| 项目 | 当前证据与状态 | 发布前动作 / 建议阶段 |
| --- | --- | --- |
| 移动 Cover LCP | F 同条件 5 轮中位 3.507s，范围 3.377–4.207s；理想 2.5s 未达 | 性能专项：生产等效传输与硬件重测；普通 UI-02 中位 3.181s 也未全达标 |
| 欢迎进场 CLS | F 真实点击后 UI-02 0.625、Cover 0.6306，直达页面低 CLS 不反驳它 | 发布前修复布局交班或明确接受；不在 UI-04A 混改 |
| 长任务 / 就绪 | F Cover 第 5 轮 TBT 2538ms，慢网控制器就绪约 5–6s | 性能专项定位主线程；TBT 不能当 INP |
| ARIA / 焦点 | 播放进度缺 aria-valuenow、部分对比度；隐藏设置/房间焦点修复已有证据 | 无障碍专项修复并重新键盘验收；现有隐藏控件回归不等于全站无障碍通过 |
| 片段定位 | 普通 UI-02 初始 scrollY 曾约 140/0，文档几何相同；归因未定 | 初始化专项确认浏览器锚点与资源时序 |
| 旧初始化超时 | UI-03D 一次 visible 等待缺现场，UNKNOWN / NOT_REPRODUCED | 保留诊断与复现窗口，不宣称已知根因 |
| 自动化点击滚动 | 新旧版动画中 locator.click 曾触发滚入视口；原始鼠标/键盘证据通过 | 测试工具专项保留失败、使用真实输入，不用改状态机掩盖 |
| 房间模块失败重试 | 源码 startModule 单次锁不在模块 error 后复位；现有测试只覆盖晚到 ready | 故障恢复专项：实际阻断 /room/room.js 后验证同页重试，修复并独立回归；正常进入不受此条否定 |
| Alt+Tab 异常 | 用户报告不可激活的重复网页条目；前次只读观察未发现对应活动窗口，归因 UNKNOWN | 开发工具专项排查浏览器与系统清理；本轮未重新复现，不认定为网站 bug 或已解决 |
| 真机触控 | NOT_TESTED；已有证据只来自浏览器移动模拟 | 发布前真机、触控板、下拉刷新及旋转验证 |
| 跨引擎 | Firefox/Safari NOT_TESTED | 发布前兼容性验证，重点 mask/玻璃/inert/锚点 |
| 线上 INP / 长期会话 | NOT_MEASURED / NOT_TESTED | 发布后受控观测与足量样本；上线前先验证实验室关键交互 |
| 生产 CI / 资源 | 云端 CI、实际压缩/缓存未在本轮运行 | 发布审批前最新构建、CI、生产资源、回滚验证 |

房间故障重试为本轮源码/VM 诊断发现，尚未实际浏览器注入该网络故障，不据此宣称浏览器故障验收通过。历史 3D 正常进入、灯光和退出通过与此边界缺口可同时成立。高 TBT 原因也未因同组 UI-02 偏高就断言为外部负载。

## 排除、恢复与回滚

正式清单不含原始截图、HAR、Lighthouse 报告/Trace、npm 工具、缓存、恢复 stage、ZIP、本地路径脚本或历史重放补丁。文件保留本地及既有归档，不删除。重复测试/源码出现在历史恢复副本中，不构成删除依据。.gitignore 已忽略主要大产物，但许多原始 JSON/脚本仍未跟踪；忽略规则不替代白名单。

文本秘密扫描未发现候选，不保证 ZIP、二进制或超大原始 Trace 内完全无秘密；这些不在拟提交范围。9 张新美术已核对格式/尺寸/元数据，无机器路径文本字段，未发现相同字节的重复美术。此轮未增加运行时包或包锁文件。

批准后每组提交前：核对本清单、实际暂存文件、diff、资产 SHA 与阶段验证；若工作树发生变化，重新审查。对新提交回滚应按 **4→3→2→1** 逆依赖逐个 git revert，替换为批准后真实提交 SHA，不重写原 main 历史。不可先撤资产留下仍引用它的页面。

未提交状态恢复使用经 SHA 校验的交付 ZIP，解压到新的审查目录，比较 manifest 后再决定恢复；不直接覆盖现有工作区。备份是文件检查点，不是 Git 历史提交。新审查文档另作清单归档，既有 ZIP 保持不变。

## UI-04A 前提

用户审批后可先在 `codex/home-2-checkpoint-01` 保存上述完整本地检查点；本轮不创建该分支。核对批准后的最终 SHA、检查通过且无新增 P0/P1 后，再从该提交创建 `codex/ui-04a-creative-lab`。UI-04A 保持三种模式隔离、原数据源、5 组回归与失败恢复边界；性能/无障碍发布事项单列，新增范围另行确认。不得从未获批准的远端 main 强制恢复工作树，也不得据此自动启用 Cover 或部署。
