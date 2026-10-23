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
