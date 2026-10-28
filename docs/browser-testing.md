# 本机浏览器验收

本页描述可选开发测试，不参与网站运行。需要 Python 3、Node.js 20+ 和已安装的 Playwright 及对应浏览器；像素检查另需 Pillow。真实 Safari、物理手机、屏幕阅读器不能由自动化引擎替代。

启动正式数据服务（另开进程、另用端口加 `--fixture` 可提供隔离的 TEST FIXTURE）：

```sh
python tools/serve-browser-check.py --port 8910 --test-api --media-fixture --request-log local-results/requests.jsonl
```

服务仅绑定 127.0.0.1。诊断端点默认禁用；显式开启后提供公开源码身份、请求账本、受控媒体 503、内存恢复接口及同源合成 PCM。测试服务可读网站资产和房间 GLB，禁止路径越界和历史证据目录。用 Ctrl+C 停止。该服务及端点不部署到 GitHub Pages，不能用于公开托管或作为身份认证。

在新结果目录运行（例）：

```sh
node tests/browser/museum-exit.cjs --url http://127.0.0.1:8910/ --browser edge --out local-results/museum-run-001 --rounds 20
node tests/browser/mobile-lyric-nav.cjs --url http://127.0.0.1:8910/ --browsers edge,firefox,webkit --widths 390,430,768 --out local-results/touch-run-001
node tests/browser/focus-causality.cjs --url http://127.0.0.1:8910/ --browser webkit --out local-results/focus-run-001 --rounds 20 --cases article
node tests/browser/theme-contrast.cjs --url http://127.0.0.1:8910/ --browser webkit --out local-results/contrast-run-001 --widths 390,768,1440 --media-error
python tools/check-rendered-contrast.py local-results/contrast-run-001 --all
```

默认使用正常 Node 模块解析；也可用 `--playwright-module` 和 `--browser-cache` 显式选择已有安装。不得将凭据、浏览器 Profile、原始截图、测试 ZIP 或整个结果目录提交到公共仓库。

失败分为浏览器启动、服务身份、断言前导航、动作前置、产品断言、装置观察、清理和未执行。未执行不是通过，晚到的观察不能证明截止前通过。Museum 从可信的外层退出输入计时；内部面板须先关闭。触控每一步等待真实可见、稳定、命中条件，保留事件路径；不能用脚本 click 代替 touchscreen。

对比度截图的文字透明帧仅供测量，原始显示帧同时保留。焦点轮廓和选中轮廓独立分类。未知混合前景、配对不稳定及缺失状态不作通过；像素检查不能替代完整无障碍验收。历史性能门禁及平台不支持状态不会因这些测试通过而自动关闭。
