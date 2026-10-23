# 作品媒体约定

只放真实项目截图/封面，按 `assets/projects/<项目原始 id>/` 保存。UI-04A.2 接入小窝自身的真实浏览器截图，以及 DSH Pulse Rail 的可追溯历史资料；其余四个项目继续使用 CSS 作品身份封面，不应称为软件运行截图。

收到素材后先保留来源原件，生成 WebP/AVIF，记录实际尺寸和来源。通过 project-lab-data.js 的 cover / gallery 配置接入，例如：

```js
cover: { src: 'assets/projects/catoobot/cover.webp', width: 1440, height: 900,
         alt: '真实截图的文字描述', caption: '截图对应的版本与场景' }
```

示例不表示这些文件已存在。没有配置时不会请求猜测的文件。路径限制在对应 id 下，只接受本地 raster 图片、明确的正整数尺寸，不接受 SVG、远端地址、目录穿越或查询参数。外部项目入口只接受无凭据的 HTTPS URL。

封面可提供 `sources: [{src, width, height}]`：同项目目录、等比例的小尺寸版本。原生 picture 为窄屏 1× 选择小图，其余保留大图；创建 HTML 时 img 的备用地址与当前来源一致，避免暖缓存预请求另一尺寸。后续视口 / DPR 变化仍由 picture 处理。只有主打封面 eager/high，其他封面 lazy；没有媒体就不生成 img。图集只在当前详情打开时建立；有 gallery 时详情使用完整 gallery，避免重复展示缩略封面；点击放大复用同一 URL。

检查：`node tools/check-project-lab.cjs`，验证存在性、二进制格式、实际头部宽高、扩展名、响应式比例及路径。它不是完整图像解码器；生成时还要实际解码、浏览器检查 naturalWidth/naturalHeight 和人工看图。当前检查器支持 WebP/PNG/JPEG，AVIF 未启用。

可公开的来源、许可、历史版本、原始 PNG 与部署图片 SHA256、转换参数见 [SOURCES.md](SOURCES.md)。完整原件与浏览器测试日志仅保留于本地证据归档，不作为公开提交依赖。删除原项目后，孤立 enrichment 安全忽略，并由工具 WARN；编辑台只保存 projects-data.js，不重写补充文件。

## 精选主卡策略

媒体优先是明确的展示策略：存在封面时，以权威数据 newestFirst 中第一个有封面的项目作为主卡（多张封面时按日期新旧选择，同日则原数据中较后追加者优先）；再按 featuredRank / ID 补齐辅助卡，总计最多三项。没有封面时沿用精选序号。它不是“精选主卡永远固定”或“与日期无关”的规则。全部作品与首页最近作品继续各自沿用原日期排序。未来需要人工锁定主位时，应另行引入明确配置，不能静默改变当前含义。

## 可选动态体验（UI-04A.3）

`project-lab-data.js` 的 `experience` 是按原项目ID补充的单个对象，不管理身份、日期或分类。类型为 `video` 或 `compare`。两种都必须有 title、description，以及 source.method / captured（有效ISO日期）/ version / note / genuine:true。真实性必须有对应采集记录，schema中的布尔值本身不构成证明。无配置或非法配置时运行页面保留原图集；CI对非法配置报错。

视频字段：同ID目录的本地 `.webm` src、mime:`video/webm`、codec:`vp8`、width / height、duration（0–120秒）、audio布尔值和带明确尺寸/alt的本地poster。当前CI检查WebM EBML结构、真实轨道宽高/时长/编码/音轨与配置是否一致；它不是视频帧解码器，交付仍须真实浏览器解码播放。当前只启用已验证的WebM/VP8，不接受任意远程嵌入、data或未验证的MP4。

视频仅在当前详情创建，初始没有src/source，preload=none，点击才赋src并调用原生play。原生控件负责进度/暂停/重播，默认静音，独立静音按钮不会修改背景音乐；用户主动取消静音会与背景音乐同时播放。切换/关闭详情移除视频来源并load重置，页面隐藏暂停但不自动恢复，图片放大先暂停视频。无自动播放、播放器框架或常驻渲染循环。

对比字段：before / after两个同ID本地图片对象及source.alignment，宽高比例一致且须有人为核实的同场景来源。组件支持分割线指针拖动和有标签的原生range键盘控件；失败有静态提示。没有真实匹配素材时不配置，不将测试Fixture提交为项目媒体。

公开来源与动态资源哈希见SOURCES.md；普通UI-02及无Lab的Cover不加载体验媒体，画廊不请求视频或poster，含视频详情只先显示poster。


## 手动素材管理（UI-04A.4 Lite）

从项目编辑台进入 `project-media-editor.html`。无需Token即可选择、验证与预览 PNG/JPEG/WebP 和 WebM/VP8。图片等比例输出WebP（封面最长边1600、图集/对比2400、Poster1280；封面可附480px宽小图），原件请自行保留。图集最多12张；视频≤120秒/32MiB；所有草稿部署资源≤64MiB。选择文件不会上传。

管理器生成ZIP资源包，而不是直接写入站点或发布GitHub。先完整解压，再在项目根目录执行：

```sh
node tools/import-project-media.cjs "<解压后的rinsora-project-media-项目ID目录>"
node tools/import-project-media.cjs "<同一目录>" --apply
node tools/check-project-lab.cjs
python tools/check-site.py
```

第一条仅检查；`--apply` 是用户明确执行的本地导入。它核对媒体/补丁指纹与单项目基线，拒绝不同字节的同名文件和越界路径；已有相同字节只复用、不覆盖。文件先写入，最后替换纯JSON媒体配置；失败回收仅本次新建且指纹未变的文件，不删除旧资源。操作前请备份，导入后检查Git差异；这是本地单用户流程，不是多进程数据库事务。

`projects-data.js`仍是唯一身份源。`project-lab-data.js`保留故事、精选顺序及原媒体；`project-media-data.json`仅按同ID覆盖明确提供的cover/gallery/experience，provenance记录新文件的用户声明与SHA256。null可移除封面/体验引用，空数组移除图集引用，不删除文件。JSON仅在Lab模式读取，管理页/二进制检查/ZIP模块不进入公众首屏。所有配置由同一Schema和CI检查，不执行输入的JavaScript。

新体验标记 `source.verification: "user-declared"`；为兼容原Schema保留genuine字段，但它不构成独立真实性证明。公众详情明确说明用户来源声明；修改或新增的导入包不能自称runtime-evidence。原已核验网站录像保持原来源与标签。

远端发布为 **REMOTE_PUBLISH_DISABLED**，没有GitHub写入处理器。现有localStorage凭据仍有同源脚本风险，隐藏入口不是权限控制；导出不包含Token。未来只有在兼容分支、严格版本/冲突、非原子上传和部分失败恢复的独立测试通过后才可启用远端发布。
