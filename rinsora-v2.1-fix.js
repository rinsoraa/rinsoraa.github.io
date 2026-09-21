/*
  Rinsora Home V2.1 hot-fix / interaction layer
  ------------------------------------------------------------
  这份脚本设计成“后置补丁”：放在 index.html 的 script.js 后面即可。
  它不替换你现有的 music.js / projects.js / blog-admin.js / GH API。

  修复与增强：
  1. 进入小窝：头像轨迹飞入左侧，侧栏头像延迟揭示；右下播放器平滑上浮淡入。
  2. 管理按钮：夜间模式不再出现白框；项目管理按钮 hover/focus 更可靠。
  3. 项目分类：用捕获阶段接管 pt-head，确保折叠/展开可靠。
  4. 添加音乐：用捕获阶段接管 + 按钮，弹窗层级、滚动锁定、响应式统一加强。
  5. 左侧头像导航：导航项移出头像覆盖区，提升层级与可点击面积。
  6. 外观设置：补上可工作的主题面板、主题配色、特效开关、本地记忆。
  7. 星辰：用 Canvas 绘制更明显的星尘/闪烁粒子，响应窗口、减少动态效果与设置开关。
  8. 字体：整体提高中文正文、卡片、项目、导航、元数据的可读性。
  9. 额外稳定性：弹窗 ESC、滚动锁、移动端兼容、硬刷新缓存提示钩子。
*/
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, String(v)); } catch (_) {} }
  };
  const reducedMotion = () => {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; }
  };

  // ------------------------------------------------------------ CSS patch
  const STYLE_ID = 'rinsora-v3-fix-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
/* ========================= V3 interaction patch ========================= */
html,body{min-height:100%;}

/* 进入动画：欢迎页整体可以退场，但飞行动画本体固定在 viewport 上，不跟着 welcome 的 transform 走。 */
.v3-avatar-flight{
  position:fixed!important;left:0;top:0;width:1px;height:1px;z-index:10050!important;
  object-fit:contain!important;pointer-events:none!important;will-change:transform,opacity,filter;
  transform-origin:center center!important;border-radius:50%;
  user-select:none;-webkit-user-drag:none;
}
.v3-avatar-flight-glow{
  position:fixed;z-index:10049!important;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(255,177,209,.62) 0%,rgba(255,228,168,.30) 35%,transparent 72%);
  filter:blur(10px);mix-blend-mode:screen;opacity:.9;will-change:transform,opacity;
}
.v3-side-avatar-hidden{visibility:hidden!important;opacity:0!important;}
.v3-side-avatar-arrive{animation:v3SideAvatarArrive .62s cubic-bezier(.17,.86,.25,1.2) both!important;}
@keyframes v3SideAvatarArrive{
  0%{opacity:0;transform:scale(.74) rotate(-7deg);filter:blur(3px) drop-shadow(0 0 0 rgba(255,150,190,0));}
  62%{opacity:1;transform:scale(1.08) rotate(2deg);filter:blur(0) drop-shadow(0 16px 30px rgba(225,120,170,.30));}
  100%{opacity:1;transform:scale(1) rotate(0);filter:drop-shadow(0 12px 24px rgba(225,120,170,.18));}
}
#floatingPlayer{will-change:transform,opacity;}
#floatingPlayer.v3-pre-enter{opacity:0!important;transform:translate3d(0,70px,0) scale(.94)!important;pointer-events:none!important;}
#floatingPlayer.v3-float-in{opacity:1!important;transform:translate3d(0,0,0) scale(1)!important;pointer-events:auto!important;transition:opacity .72s cubic-bezier(.2,.8,.2,1),transform .82s cubic-bezier(.2,.8,.2,1)!important;}
body.v3-entering .welcome-card{will-change:opacity,transform;}
body.v3-entering #landingPlayer{will-change:opacity,transform,filter;}

/* 左侧半圆导航：提高层级，第一项移出头像覆盖区 */
.side-rail{overflow:visible!important;}
.avatar-nav-wrap{overflow:visible!important;z-index:20!important;}
.avatar-button{position:relative;z-index:4!important;}
.radial-nav{z-index:30!important;pointer-events:none!important;left:54px!important;top:-34px!important;width:300px!important;height:250px!important;overflow:visible!important;}
.radial-item{z-index:31!important;pointer-events:none;min-width:112px!important;height:58px!important;border-radius:20px!important;}
.avatar-nav-wrap:hover .radial-item,.avatar-nav-wrap.open .radial-item{pointer-events:auto!important;}
/* 将三个节点排成更清晰的弧形，完全避开头像主体 */
.avatar-nav-wrap:hover .radial-item:nth-child(1),
.avatar-nav-wrap.open .radial-item:nth-child(1){transform:translate(72px,-30px) rotate(-8deg) scale(1)!important;}
.avatar-nav-wrap:hover .radial-item:nth-child(2),
.avatar-nav-wrap.open .radial-item:nth-child(2){transform:translate(132px,54px) rotate(0deg) scale(1)!important;}
.avatar-nav-wrap:hover .radial-item:nth-child(3),
.avatar-nav-wrap.open .radial-item:nth-child(3){transform:translate(70px,140px) rotate(8deg) scale(1)!important;}
.avatar-nav-wrap.nav-closed .radial-item:nth-child(1),
.avatar-nav-wrap.nav-closed .radial-item:nth-child(2),
.avatar-nav-wrap.nav-closed .radial-item:nth-child(3){transform:translate(26px,54px) rotate(0) scale(.68)!important;}
.radial-item b{font-size:14px!important;line-height:1.2;}
.radial-item span{font-size:20px!important;}
.radial-item small{font-size:9px!important;letter-spacing:.08em;}

/* 管理按钮：夜间模式下绝不再使用亮白实心底 */
.card-tools{z-index:50!important;}
.blog-card:hover .card-tools,.card-tools:focus-within{opacity:1!important;transform:none!important;}
.pt-item:hover .pt-tools,.pt-tools:focus-within,.pt-tools:focus{opacity:1!important;transform:none!important;}
.card-tool{position:relative;z-index:51!important;width:31px!important;height:31px!important;border-radius:11px!important;
  background:rgba(255,255,255,.76)!important;color:#9d7190!important;border-color:rgba(255,255,255,.72)!important;
  box-shadow:0 9px 22px rgba(150,90,130,.20),inset 0 1px 0 rgba(255,255,255,.78)!important;
  font-size:13px!important;}
.card-tool:hover{background:rgba(255,255,255,.94)!important;color:#d86d9b!important;}
.card-tool.tool-del:hover{color:#d45d7b!important;}
body.night .card-tool{background:rgba(45,34,56,.90)!important;color:#e0c4d7!important;border-color:rgba(255,255,255,.13)!important;
  box-shadow:0 10px 24px rgba(5,2,10,.45),inset 0 1px 0 rgba(255,255,255,.08)!important;}
body.night .card-tool:hover{background:rgba(71,52,82,.96)!important;color:#ffadd0!important;}
body.night .card-tool.tool-del:hover{color:#ff96b3!important;}
body.blog-admin .card-tools{gap:7px!important;}
@media (pointer:coarse){
  body.blog-admin .card-tools,body.blog-admin .pt-tools{opacity:1!important;transform:none!important;}
}

/* 项目折叠按钮：确保没有透明层挡住，点击区域覆盖整个标题 */
.pt-head{position:relative!important;z-index:4!important;pointer-events:auto!important;min-height:44px!important;}
.pt-head *{pointer-events:none!important;}
.pt-body{position:relative!important;z-index:2!important;overflow:hidden;}
.pt-group.open .pt-body{display:block!important;visibility:visible!important;max-height:2200px!important;opacity:1!important;}
.pt-group:not(.open) .pt-body{display:none!important;}

/* 添加音乐按钮 / 弹窗：强制成为最高层的独立模态 */
.mp-addbtn{position:relative!important;z-index:8!important;}
.mm-mask{z-index:20000!important;isolation:isolate!important;}
.mm-card{position:relative!important;z-index:20001!important;opacity:1!important;visibility:visible!important;}
.mm-mask.open{display:flex!important;visibility:visible!important;}
body.v3-modal-lock{overflow:hidden!important;}
body.v3-modal-lock .mm-mask{overscroll-behavior:contain!important;}
.mm-field input,.mm-field button,.mm-btn,.mm-x,.mm-coverbox{position:relative;z-index:3;}
@media (max-width:760px){
  .mm-mask{padding:max(12px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom))!important;}
  .mm-card{width:100%!important;max-height:calc(100vh - 24px)!important;}
  .mm-foot{position:sticky;bottom:0;padding-top:12px;background:linear-gradient(180deg,transparent,var(--acr-solid) 35%);}
}

/* 字体放大：正文优先，英文标签保持克制 */
body{font-size:16px!important;}
.section-sub{font-size:15px!important;line-height:1.82!important;}
.intro-card p:not(.section-kicker),.mini-card dd,.now-list .now-val{font-size:15px!important;line-height:1.85!important;}
.intro-card .lead{font-size:18px!important;line-height:1.9!important;}
.tag-row span{font-size:12px!important;padding:6px 10px!important;}
.blog-card h4,.blog-card h4 a{font-size:18px!important;line-height:1.52!important;}
.blog-card p{font-size:15px!important;line-height:1.78!important;}
.bm-cat{font-size:11px!important;}.bm-min{font-size:11px!important;}
.pt-title{font-size:18px!important;}.pt-name{font-size:17px!important;}.pt-desc{font-size:15px!important;line-height:1.72!important;}.pt-tags span{font-size:11px!important;padding:5px 9px!important;}.pt-date,.pt-status{font-size:11px!important;}
.now-label{font-size:12px!important;}.now-live{font-size:11px!important;}
.radial-item b{font-size:14px!important;}
.section-heading h3{font-size:21px!important;}
.topbar h2{font-size:38px!important;}

/* 更明显的亚克力 / 夜间对比度 */
body.night .section-sub,body.night .blog-card p,body.night .pt-desc,body.night .rc-desc{color:#d2c2d2!important;}
body.night .blog-card,body.night .recent-card,body.night .pt-group,body.night .now-panel,body.night .intro-card,body.night .mini-card{box-shadow:0 22px 58px rgba(7,3,12,.42),inset 0 1px 0 rgba(255,255,255,.08)!important;}

/* ----------------------------- V3 theme palette */
body.v3-theme-candy{--pink:#ff8fbd;--pink2:#ffd3e4;--yellow:#ffe48d;--yellow2:#fff4c8;--peach:#ffb995;--lav:#d8c7ff;--mint:#bdeee2;
  background:radial-gradient(circle at 18% 8%,rgba(255,174,208,.55),transparent 26%),radial-gradient(circle at 84% 22%,rgba(255,229,142,.48),transparent 24%),linear-gradient(135deg,#fff7fb,#fff7e7 49%,#f3edff)!important;}
body.v3-theme-sunset{--pink:#ff9f9f;--pink2:#ffd4c8;--yellow:#ffd984;--yellow2:#fff0c7;--peach:#ffb08d;--lav:#d8c2ff;--mint:#cbe8de;
  background:radial-gradient(circle at 10% 12%,rgba(255,162,138,.56),transparent 28%),radial-gradient(circle at 82% 20%,rgba(255,219,124,.42),transparent 24%),linear-gradient(135deg,#fff8f4,#fff0df 52%,#efe8ff)!important;}
body.v3-theme-lilac{--pink:#d9a7ff;--pink2:#efd9ff;--yellow:#ffe2a6;--yellow2:#fff6d6;--peach:#ffbfd2;--lav:#bda7ff;--mint:#c9eaf3;
  background:radial-gradient(circle at 14% 16%,rgba(206,173,255,.56),transparent 26%),radial-gradient(circle at 85% 20%,rgba(170,220,255,.42),transparent 25%),linear-gradient(135deg,#fbf7ff,#f4f0ff 50%,#edf6ff)!important;}
body.v3-theme-mint{--pink:#8adcc5;--pink2:#cff5e8;--yellow:#ffe69a;--yellow2:#fff7d6;--peach:#ffc9a6;--lav:#cfc8ff;--mint:#98ead0;
  background:radial-gradient(circle at 14% 10%,rgba(147,236,211,.54),transparent 26%),radial-gradient(circle at 82% 20%,rgba(255,225,157,.40),transparent 25%),linear-gradient(135deg,#f5fffb,#fff9ea 50%,#eef6ff)!important;}
body.v3-theme-dream{background:radial-gradient(circle at 15% 12%,rgba(213,177,255,.24),transparent 26%),radial-gradient(circle at 86% 18%,rgba(127,205,255,.22),transparent 26%),linear-gradient(135deg,#21192d,#30233f 52%,#1e2c37)!important;}
body.v3-theme-dream .side-status span{box-shadow:0 0 0 4px rgba(113,236,183,.10),0 0 20px rgba(255,145,195,.36)!important;}
body.v3-theme-dream .section-heading h3{color:#fff5fb!important;}

/* ----------------------------- V3 settings UI */
.v3-settings-mask{position:fixed;inset:0;z-index:18000;background:rgba(45,26,52,.30);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);opacity:0;pointer-events:none;transition:opacity .34s var(--ease);}
.v3-settings-mask.open{opacity:1;pointer-events:auto;}
.v3-settings-panel{position:fixed;right:22px;top:22px;bottom:22px;width:min(420px,calc(100vw - 28px));z-index:18001;overflow:auto;padding:24px;border-radius:30px;background:var(--acr-solid);border:1px solid var(--acr-bd);box-shadow:0 35px 90px rgba(85,45,90,.34),inset 0 1px 0 var(--acr-hi);backdrop-filter:blur(28px) saturate(1.35);-webkit-backdrop-filter:blur(28px) saturate(1.35);transform:translateX(110%);transition:transform .56s var(--ease);}
.v3-settings-panel.open{transform:none;}
.v3-settings-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.v3-settings-kicker{margin:0 0 4px;font-size:10px;font-weight:1000;letter-spacing:.18em;color:#d57fa3;}
.v3-settings-title{margin:0;font-size:28px;line-height:1.1;color:var(--ink);}
.v3-settings-x{width:34px;height:34px;border-radius:12px;border:1px solid var(--acr-bd2);background:var(--acr-2);color:var(--ink);font-size:20px;display:grid;place-items:center;}
.v3-settings-tabs{display:flex;gap:6px;margin:18px 0 6px;padding:5px;border-radius:15px;background:rgba(255,255,255,.16);}
.v3-settings-tab{flex:1;border:0;border-radius:11px;padding:9px 8px;background:transparent;color:var(--muted);font-size:12px;font-weight:900;cursor:pointer;}
.v3-settings-tab.active{background:var(--acr-h);color:#7d5a70;box-shadow:0 8px 20px rgba(160,100,140,.12);}
.v3-settings-section{display:none;padding:6px 0 8px;}.v3-settings-section.active{display:block;}
.v3-set-block{padding:17px 0;border-bottom:1px dashed rgba(180,145,166,.24);}
.v3-set-label{display:flex;justify-content:space-between;gap:12px;font-size:13px;font-weight:1000;color:var(--muted);margin-bottom:11px;}
.v3-theme-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;}
.v3-theme-tile{position:relative;display:flex;align-items:center;gap:10px;padding:11px;border-radius:16px;background:rgba(255,255,255,.20);border:1px solid rgba(255,255,255,.32);cursor:pointer;transition:transform .2s var(--ease),background .2s,border-color .2s,box-shadow .2s;color:var(--ink);text-align:left;}
.v3-theme-tile:hover{transform:translateY(-2px);background:rgba(255,255,255,.34);box-shadow:0 12px 28px rgba(160,105,140,.12);}
.v3-theme-tile.active{background:rgba(255,255,255,.42);border-color:rgba(237,141,180,.55);box-shadow:0 0 0 2px rgba(237,141,180,.12);}
.v3-swatch{width:42px;height:30px;border-radius:11px;flex:0 0 auto;box-shadow:inset 0 1px 0 rgba(255,255,255,.7);}
.v3-sw-candy{background:linear-gradient(135deg,#ff9fc7,#ffe58e);}.v3-sw-sunset{background:linear-gradient(135deg,#ffb096,#ffd580);}.v3-sw-lilac{background:linear-gradient(135deg,#d9b0ff,#9edaff);}.v3-sw-mint{background:linear-gradient(135deg,#9fe6d0,#ffe5a1);}.v3-sw-dream{background:linear-gradient(135deg,#7e6abf,#6cc6f4);}
.v3-theme-name{font-size:12px;font-weight:1000;}.v3-theme-desc{display:block;margin-top:3px;font-size:10px;color:var(--muted);}
.v3-set-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 0;}.v3-set-row b{font-size:13px;color:var(--ink);}.v3-switch{width:42px;height:24px;border-radius:999px;background:rgba(150,120,145,.24);border:1px solid rgba(255,255,255,.34);position:relative;cursor:pointer;transition:background .22s,box-shadow .22s;flex:0 0 auto;}.v3-switch:after{content:"";position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(80,50,80,.20);transition:transform .25s var(--ease);}.v3-switch.on{background:linear-gradient(90deg,#f38eb8,#ffc85f);box-shadow:0 6px 18px rgba(239,146,180,.24);}.v3-switch.on:after{transform:translateX(18px);}
.v3-hue{width:100%;accent-color:#f197bb;}.v3-hue-value{font-size:11px;color:#c1809d;}
.v3-settings-note{margin:15px 0 0;font-size:11px;line-height:1.8;color:var(--muted);}
body.night .v3-settings-mask{background:rgba(7,4,12,.48);}
body.night .v3-settings-panel{background:rgba(31,24,42,.92);border-color:rgba(255,255,255,.14);box-shadow:0 35px 90px rgba(0,0,0,.52),inset 0 1px 0 rgba(255,255,255,.08);}
body.night .v3-settings-title,body.night .v3-set-row b{color:#f7edf6;}
body.night .v3-theme-tile{color:#f7edf6;background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.10);}
body.night .v3-settings-tab{color:#b9a6b8;}body.night .v3-settings-tab.active{color:#f6dce9;background:rgba(255,255,255,.12);}
@media (max-width:760px){.v3-settings-panel{right:12px;top:12px;bottom:12px;width:calc(100vw - 24px);padding:18px;}.v3-theme-grid{grid-template-columns:1fr 1fr;}}

/* ----------------------------- Dynamic theme backdrop */
#v3ThemeBackdrop{position:fixed;inset:0;z-index:.5!important;pointer-events:none;overflow:hidden;opacity:1;transition:background 1s ease,filter .5s ease;}
#v3ThemeBackdrop::before,#v3ThemeBackdrop::after{content:"";position:absolute;border-radius:50%;pointer-events:none;filter:blur(42px);opacity:.48;will-change:transform;}
#v3ThemeBackdrop::before{width:46vw;height:46vw;left:-14vw;top:-18vw;background:radial-gradient(circle,rgba(255,145,195,.48),transparent 68%);animation:v3OrbA 18s ease-in-out infinite alternate;}
#v3ThemeBackdrop::after{width:42vw;height:42vw;right:-12vw;bottom:-20vw;background:radial-gradient(circle,rgba(255,224,133,.42),transparent 68%);animation:v3OrbB 22s ease-in-out infinite alternate;}
@keyframes v3OrbA{0%{transform:translate3d(0,0,0) scale(.92)}100%{transform:translate3d(10vw,8vh,0) scale(1.08)}}
@keyframes v3OrbB{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(-9vw,-7vh,0) scale(.88)}}
body.v3-theme-candy #v3ThemeBackdrop{background:radial-gradient(circle at 18% 8%,rgba(255,174,208,.35),transparent 25%),radial-gradient(circle at 82% 20%,rgba(255,229,142,.28),transparent 24%),linear-gradient(135deg,rgba(255,247,251,.96),rgba(255,247,231,.92) 49%,rgba(243,237,255,.94));}
body.v3-theme-sunset #v3ThemeBackdrop{background:radial-gradient(circle at 10% 12%,rgba(255,162,138,.38),transparent 28%),radial-gradient(circle at 82% 20%,rgba(255,219,124,.28),transparent 24%),linear-gradient(135deg,rgba(255,248,244,.96),rgba(255,240,223,.93) 52%,rgba(239,232,255,.95));}
body.v3-theme-lilac #v3ThemeBackdrop{background:radial-gradient(circle at 14% 16%,rgba(206,173,255,.40),transparent 26%),radial-gradient(circle at 85% 20%,rgba(170,220,255,.30),transparent 25%),linear-gradient(135deg,rgba(251,247,255,.96),rgba(244,240,255,.93) 50%,rgba(237,246,255,.95));}
body.v3-theme-mint #v3ThemeBackdrop{background:radial-gradient(circle at 14% 10%,rgba(147,236,211,.38),transparent 26%),radial-gradient(circle at 82% 20%,rgba(255,225,157,.28),transparent 25%),linear-gradient(135deg,rgba(245,255,251,.96),rgba(255,249,234,.94) 50%,rgba(238,246,255,.95));}
body.v3-theme-dream #v3ThemeBackdrop{background:radial-gradient(circle at 15% 12%,rgba(213,177,255,.20),transparent 26%),radial-gradient(circle at 86% 18%,rgba(127,205,255,.18),transparent 26%),linear-gradient(135deg,rgba(30,23,43,.96),rgba(47,34,63,.95) 52%,rgba(28,42,53,.96));}
.v3-ripple-off .click-ripple{display:none!important;}
.v3-no-tilt .card,.v3-no-tilt .recent-card,.v3-no-tilt .pt-link{transform:none!important;}
.blog-card,.pt-item{position:relative!important;}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC",sans-serif!important;-webkit-font-smoothing:antialiased!important;-moz-osx-font-smoothing:grayscale!important;text-rendering:optimizeLegibility!important;}
/* ----------------------------- Canvas stars */
#v3Particles{position:fixed;inset:0;width:100vw;height:100vh;z-index:2!important;pointer-events:none;display:block;opacity:.96;}
.bg-decor{z-index:0!important;}
.bg-frost{z-index:0!important;background:rgba(255,255,255,.02)!important;backdrop-filter:blur(28px) saturate(1.32)!important;-webkit-backdrop-filter:blur(28px) saturate(1.32)!important;}
.welcome-screen,.app,.settings-panel,.mm-mask,.lyricbar,.top-actions{position:relative;z-index:auto;}
.welcome-screen{z-index:30!important;}.app{z-index:5!important;}.side-rail{z-index:18!important;}.mplayer-float{z-index:25!important;}.lyricbar{z-index:24!important;}
.v3-particle-disabled #v3Particles{display:none!important;}

/* 更明显的背景色雾 */
.blob{opacity:.62!important;filter:blur(12px)!important;}
.spark{font-size:28px!important;text-shadow:0 0 18px currentColor,0 0 34px rgba(255,154,198,.42)!important;}
@keyframes v3SparkPulse{0%,100%{opacity:.32;transform:scale(.75) rotate(0)}50%{opacity:1;transform:scale(1.22) rotate(12deg)}}
.spark{animation:v3SparkPulse 3.6s ease-in-out infinite!important;}

/* 更清晰的鼠标光晕 */
.ambient-glow{width:260px!important;height:260px!important;filter:blur(14px)!important;opacity:.0;}
body.cursor-on .ambient-glow{opacity:1!important;}
.cursor-ring{width:44px!important;height:44px!important;border-width:2px!important;box-shadow:0 0 0 7px rgba(255,170,205,.06),0 0 28px rgba(255,170,205,.18)!important;}

/* Reduced Motion */
@media (prefers-reduced-motion:reduce){
  .v3-avatar-flight,.v3-avatar-flight-glow{display:none!important;}
  #floatingPlayer{transition:none!important;}
  .v3-settings-panel,.v3-settings-mask{transition:none!important;}
}
`;
    document.head.appendChild(style);
  }

  // ------------------------------------------------------------ Enter animation
  const welcome = $('#welcomeScreen');
  const app = $('#app');
  const enterBtn = $('#enterBtn');
  const landingPlayer = $('#landingPlayer');
  const floatingPlayer = $('#floatingPlayer');
  const fromAvatar = () => $('.mascot-wrap .avatar-large', welcome) || $('.avatar-large', welcome);
  const sideAvatar = () => $('.side-rail .avatar-sidebar') || $('.avatar-sidebar');
  let entering = false;
  let entered = false;

  function prepareFloat() {
    if (!floatingPlayer) return;
    floatingPlayer.classList.remove('visible', 'v3-float-in');
    floatingPlayer.classList.add('v3-pre-enter');
  }

  function showFloat(delay = 560) {
    if (!floatingPlayer) return;
    window.setTimeout(() => {
      floatingPlayer.classList.remove('v3-pre-enter');
      // 给一个额外的下一帧，让 CSS transition 确实从隐藏态开始。
      requestAnimationFrame(() => floatingPlayer.classList.add('v3-float-in', 'visible'));
    }, delay);
  }

  function finishEnter({ instant = false } = {}) {
    entered = true;
    if (welcome) {
      welcome.classList.add('hidden');
      welcome.setAttribute('aria-hidden', 'true');
    }
    if (app) app.classList.add('visible');
    if (landingPlayer) landingPlayer.classList.add('exit');
    if (sideAvatar()) {
      const side = sideAvatar();
      side.classList.remove('v3-side-avatar-hidden');
      side.style.visibility = 'visible';
      side.style.opacity = '1';
      side.classList.remove('v3-side-avatar-arrive');
      // requestAnimationFrame 确保动画从 0 状态开始。
      requestAnimationFrame(() => side.classList.add('v3-side-avatar-arrive'));
    }
    if (enterBtn) {
      enterBtn.disabled = true;
      enterBtn.setAttribute('aria-disabled', 'true');
    }
    prepareFloat();
    showFloat(instant ? 80 : 540);
    document.body.classList.remove('v3-entering');
  }

  function simpleEnter() {
    const side = sideAvatar();
    if (side) { side.classList.remove('v3-side-avatar-hidden'); side.style.visibility = 'visible'; side.style.opacity = '1'; }
    finishEnter({ instant: true });
  }

  function runEnterAnimation() {
    if (entered || entering) return;
    entering = true;
    document.body.classList.add('v3-entering');

    const mobile = window.innerWidth <= 760;
    const from = fromAvatar();
    const to = sideAvatar();
    prepareFloat();
    if (to) { to.classList.add('v3-side-avatar-hidden'); }

    if (mobile || reducedMotion() || !from || !to || !from.getBoundingClientRect) {
      finishEnter({ instant: mobile || reducedMotion() });
      entering = false;
      return;
    }

    // 先让 app 出现（仅内容/布局层淡入），侧头像保持不可见；这样目标 rect 已经稳定。
    app?.classList.add('visible');
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();

    const clone = from.cloneNode(true);
    clone.className = 'v3-avatar-flight';
    clone.removeAttribute('id');
    clone.style.left = `${a.left}px`;
    clone.style.top = `${a.top}px`;
    clone.style.width = `${a.width}px`;
    clone.style.height = `${a.height}px`;
    clone.style.opacity = '1';
    document.body.appendChild(clone);

    const startCx = a.left + a.width / 2;
    const startCy = a.top + a.height / 2;
    const dx = (b.left + b.width / 2) - startCx;
    const dy = (b.top + b.height / 2) - startCy;
    const scale = Math.max(.45, Math.min(1.08, b.width / a.width));

    const glow = document.createElement('div');
    glow.className = 'v3-avatar-flight-glow';
    const glowSize = Math.max(a.width * 1.7, 180);
    glow.style.width = `${glowSize}px`;
    glow.style.height = `${glowSize}px`;
    glow.style.left = `${startCx - glowSize / 2}px`;
    glow.style.top = `${startCy - glowSize / 2}px`;
    document.body.appendChild(glow);

    from.style.opacity = '0';
    from.style.visibility = 'hidden';
    if (enterBtn) enterBtn.disabled = true;

    welcome?.classList.add('hidden');
    landingPlayer?.classList.add('exit');

    const avatarAnim = clone.animate([
      { transform:'translate3d(0,0,0) scale(1) rotate(0deg)', opacity:1, filter:'drop-shadow(0 16px 20px rgba(170,100,145,.22))' },
      { transform:`translate3d(${dx*.24}px,${dy*.08 - 26}px,0) scale(1.14) rotate(-7deg)`, opacity:1, filter:'drop-shadow(0 24px 34px rgba(225,120,170,.34))' },
      { transform:`translate3d(${dx*.62}px,${dy*.36 - 8}px,0) scale(${scale*1.05}) rotate(-3deg)`, opacity:1, filter:'drop-shadow(0 22px 30px rgba(225,120,170,.32))' },
      { transform:`translate3d(${dx}px,${dy}px,0) scale(${scale}) rotate(0deg)`, opacity:1, filter:'drop-shadow(0 15px 26px rgba(225,120,170,.24))' }
    ], { duration:1080, easing:'cubic-bezier(.17,.82,.22,1)', fill:'forwards' });

    glow.animate([
      { transform:'translate3d(0,0,0) scale(.65)', opacity:.78 },
      { transform:`translate3d(${dx*.30}px,${dy*.14 - 18}px,0) scale(1.08)`, opacity:.46 },
      { transform:`translate3d(${dx*.65}px,${dy*.42}px,0) scale(.85)`, opacity:.28 },
      { transform:`translate3d(${dx}px,${dy}px,0) scale(.55)`, opacity:0 }
    ], { duration:1080, easing:'cubic-bezier(.17,.82,.22,1)', fill:'forwards' });

    showFloat(610);

    const done = () => {
      clone.remove(); glow.remove();
      const side = sideAvatar();
      if (side) {
        side.classList.remove('v3-side-avatar-hidden');
        side.style.visibility = 'visible';
        side.style.opacity = '1';
        side.classList.remove('v3-side-avatar-arrive');
        requestAnimationFrame(() => side.classList.add('v3-side-avatar-arrive'));
      }
      app?.classList.add('visible');
      document.body.classList.remove('v3-entering');
      entered = true;
      entering = false;
    };

    if (avatarAnim.finished && typeof avatarAnim.finished.then === 'function') {
      avatarAnim.finished.then(done).catch(done);
    } else {
      window.setTimeout(done, 1150);
    }
  }

  if (enterBtn) {
    // 捕获阶段早于现有 script.js 的 click handler，因此可以接管旧的“瞬移”逻辑。
    document.addEventListener('click', (e) => {
      if (e.target && e.target.closest && e.target.closest('#enterBtn')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        runEnterAnimation();
      }
    }, true);
  }

  // hash 直达也用 V3 的进入流程，避免 #blog / #projects 触发旧瞬移。
  window.addEventListener('hashchange', (e) => {
    const h = (location.hash || '').replace(/^#/, '').toLowerCase();
    if (!['about','blog','projects'].includes(h) || entered) return;
    e.stopImmediatePropagation();
    runEnterAnimation();
  }, true);

  // ------------------------------------------------------------ Project folding
  function persistClosed(groupName, closed) {
    try {
      const key = 'rinsora-projects-closed';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const next = Array.isArray(list) ? list.filter(x => x !== groupName) : [];
      if (closed) next.push(groupName);
      localStorage.setItem(key, JSON.stringify(next));
    } catch (_) {}
  }
  const projectTree = $('#projectTree');
  if (projectTree) {
    projectTree.addEventListener('click', (e) => {
      const head = e.target?.closest?.('.pt-head');
      if (!head || !projectTree.contains(head)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const group = head.closest('.pt-group');
      if (!group) return;
      const isOpen = group.classList.toggle('open');
      head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      persistClosed(group.getAttribute('data-cat') || '', !isOpen);
    }, true);
  }

  // ------------------------------------------------------------ Music add modal
  document.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('.mp-addbtn');
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const api = window.RinsoraMusicUpload;
    if (api && typeof api.open === 'function') {
      try { api.open(); } catch (err) { showToast('音乐面板打开失败：' + (err?.message || err)); }
    } else {
      showToast('添加音乐模块还没有加载完成，请刷新一次页面。');
    }
  }, true);

  const observeModals = () => {
    const sync = () => {
      const musicOpen = !!$('#musicModal.open');
      const settingsOpen = !!$('.v3-settings-mask.open');
      document.body.classList.toggle('v3-modal-lock', musicOpen || settingsOpen);
    };
    const mo = new MutationObserver(sync);
    mo.observe(document.body, {subtree:true, attributes:true, attributeFilter:['class']});
    sync();
  };
  if (window.MutationObserver) observeModals();

  // ------------------------------------------------------------ Settings
  let v3Theme = store.get('rinsora-v3-theme', store.get('rinsora-theme') === 'night' ? 'dream' : 'candy');
  const fx = {
    particles: store.get('rinsora-v3-particles', 'on') !== 'off',
    cursor: store.get('rinsora-effect-cursor', 'on') !== 'off',
    tilt: store.get('rinsora-effect-tilt', 'on') !== 'off',
    ripple: store.get('rinsora-effect-ripple', 'on') !== 'off'
  };
  let hue = Number(store.get('rinsora-v3-hue', '0')) || 0;

  function showToast(msg) {
    let el = $('#v3Toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'v3Toast';
      el.className = 'blog-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'blog-toast show';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { el.className = 'blog-toast'; }, 2200);
  }

  function applyV3Theme(theme, persist = true) {
    const themes = ['candy','sunset','lilac','mint','dream'];
    document.body.classList.remove(...themes.map(x => `v3-theme-${x}`));
    document.body.classList.add(`v3-theme-${themes.includes(theme) ? theme : 'candy'}`);
    const night = theme === 'dream';
    document.body.classList.toggle('night', night);
    document.documentElement.classList.toggle('night', night);
    if (persist) {
      v3Theme = theme;
      store.set('rinsora-v3-theme', theme);
      store.set('rinsora-theme', night ? 'night' : 'light');
    }
    $$('.v3-theme-tile').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
    $$('.theme-grid button[data-theme]').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
    const label = $('#themeLabel');
    if (label) label.textContent = night ? '日间模式' : '夜间模式';
  }

  function applyEffects() {
    document.body.classList.toggle('v3-particle-disabled', !fx.particles);
    document.body.classList.toggle('cursor-on', fx.cursor && !reducedMotion());
    document.body.classList.toggle('v3-no-tilt', !fx.tilt);
    if (fx.ripple) document.body.classList.remove('v3-ripple-off'); else document.body.classList.add('v3-ripple-off');
    $$('.v3-switch').forEach(b => b.classList.toggle('on', !!fx[b.dataset.effect]));
  }

  function createSettingsUI() {
    let mask = $('#v3SettingsMask');
    let panel = $('#v3SettingsPanel');
    if (!mask || !panel) {
      mask = document.createElement('div');
      mask.className = 'v3-settings-mask';
      mask.id = 'v3SettingsMask';
      document.body.appendChild(mask);
      panel = document.createElement('aside');
      panel.className = 'v3-settings-panel';
      panel.id = 'v3SettingsPanel';
      panel.setAttribute('aria-label','空凛小窝外观设置');
      panel.innerHTML = `
        <div class="v3-settings-head">
          <div><p class="v3-settings-kicker">RINSORA LAB · LOOKS</p><h2 class="v3-settings-title">小窝设置</h2></div>
          <button type="button" class="v3-settings-x" id="v3SettingsClose" aria-label="关闭">×</button>
        </div>
        <div class="v3-settings-tabs">
          <button type="button" class="v3-settings-tab active" data-tab="theme">外观</button>
          <button type="button" class="v3-settings-tab" data-tab="fx">特效</button>
          <button type="button" class="v3-settings-tab" data-tab="about">说明</button>
        </div>
        <section class="v3-settings-section active" data-section="theme">
          <div class="v3-set-block">
            <div class="v3-set-label"><span>主题配色</span><span>存储于本机</span></div>
            <div class="v3-theme-grid">
              <button class="v3-theme-tile" data-theme="candy" type="button"><span class="v3-swatch v3-sw-candy"></span><span><strong class="v3-theme-name">糖果粉黄</strong><small class="v3-theme-desc">默认 · 软萌马卡龙</small></span></button>
              <button class="v3-theme-tile" data-theme="sunset" type="button"><span class="v3-swatch v3-sw-sunset"></span><span><strong class="v3-theme-name">蜜桃晚霞</strong><small class="v3-theme-desc">暖橙 · 黄昏感</small></span></button>
              <button class="v3-theme-tile" data-theme="lilac" type="button"><span class="v3-swatch v3-sw-lilac"></span><span><strong class="v3-theme-name">梦幻紫蓝</strong><small class="v3-theme-desc">清透 · 幻想感</small></span></button>
              <button class="v3-theme-tile" data-theme="mint" type="button"><span class="v3-swatch v3-sw-mint"></span><span><strong class="v3-theme-name">薄荷汽水</strong><small class="v3-theme-desc">轻快 · 清新感</small></span></button>
              <button class="v3-theme-tile" data-theme="dream" type="button"><span class="v3-swatch v3-sw-dream"></span><span><strong class="v3-theme-name">梦幻夜景</strong><small class="v3-theme-desc">夜间 · 紫蓝霓虹</small></span></button>
            </div>
          </div>
          <div class="v3-set-block">
            <div class="v3-set-label"><span>主题色相微调</span><span id="v3HueValue" class="v3-hue-value">0°</span></div>
            <input class="v3-hue" id="v3Hue" type="range" min="-22" max="22" step="1" value="0" aria-label="主题色相">
          </div>
        </section>
        <section class="v3-settings-section" data-section="fx">
          <div class="v3-set-block">
            <div class="v3-set-row"><b>星辰粒子</b><button type="button" class="v3-switch" data-effect="particles" aria-label="星辰粒子"></button></div>
            <div class="v3-set-row"><b>鼠标光晕</b><button type="button" class="v3-switch" data-effect="cursor" aria-label="鼠标光晕"></button></div>
            <div class="v3-set-row"><b>卡片倾斜</b><button type="button" class="v3-switch" data-effect="tilt" aria-label="卡片倾斜"></button></div>
            <div class="v3-set-row"><b>点击涟漪</b><button type="button" class="v3-switch" data-effect="ripple" aria-label="点击涟漪"></button></div>
          </div>
        </section>
        <section class="v3-settings-section" data-section="about">
          <div class="v3-set-block">
            <div class="v3-set-row"><b>空凛 · Rinsora Home V3</b><span>♡</span></div>
            <p class="v3-settings-note">主题、特效、导航和播放器的视觉层都在这里统一管理。设置只保存在当前浏览器，不会写进 GitHub 仓库。</p>
            <p class="v3-settings-note">当前版本重点修复进入动画、项目折叠、管理按钮、音乐弹窗与粒子可见性，并提高中文字号。</p>
          </div>
        </section>`;
      document.body.appendChild(panel);
    }

    // 触发按钮：优先复用已有 settings-open / settingsBtn，否则创建。
    let trigger = $('#settingsBtn') || $('.settings-open');
    if (!trigger) {
      const host = $('.top-actions') || document.body;
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'soft-btn dock-btn v3-settings-trigger';
      trigger.id = 'v3SettingsBtn';
      trigger.setAttribute('aria-label','打开外观设置');
      trigger.title = '打开外观设置';
      trigger.innerHTML = '<span class="dock-ic" aria-hidden="true">⚙</span><span class="dock-label">外观</span>';
      host.appendChild(trigger);
    }

    const open = () => {
      $('#v3SettingsMask')?.classList.add('open');
      $('#v3SettingsPanel')?.classList.add('open');
      document.body.classList.add('v3-modal-lock');
    };
    const close = () => {
      $('#v3SettingsMask')?.classList.remove('open');
      $('#v3SettingsPanel')?.classList.remove('open');
      document.body.classList.remove('v3-modal-lock');
    };
    // 捕获，避免已有旧设置逻辑和新面板抢事件。
    document.addEventListener('click',(e)=>{
      if (e.target?.closest?.('#v3SettingsBtn,.settings-open,#settingsBtn')) {
        e.preventDefault(); e.stopImmediatePropagation(); open();
      }
    },true);
    $('#v3SettingsClose')?.addEventListener('click', close);
    $('#v3SettingsMask')?.addEventListener('click', close);
    document.addEventListener('keydown',(e)=>{
      if (e.key === 'Escape') {
        if ($('#v3SettingsPanel.open')) close();
        else if ($('#musicModal.open') && window.RinsoraMusicUpload?.close) window.RinsoraMusicUpload.close();
      }
    });
    $$('.v3-settings-tab').forEach(btn=>btn.addEventListener('click',()=>{
      $$('.v3-settings-tab').forEach(x=>x.classList.remove('active'));
      $$('.v3-settings-section').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      $(`.v3-settings-section[data-section="${btn.dataset.tab}"]`)?.classList.add('active');
    }));
    $$('.v3-theme-tile').forEach(btn=>btn.addEventListener('click',()=>{
      applyV3Theme(btn.dataset.theme,true);
      showToast(`已换上「${btn.querySelector('.v3-theme-name')?.textContent || btn.dataset.theme}」 ✦`);
    }));
    $('#v3Hue')?.addEventListener('input',(e)=>{
      hue = Number(e.target.value || 0);
      document.documentElement.style.setProperty('--v3-hue', `${hue}deg`);
      const backdrop = $('#v3ThemeBackdrop'); if (backdrop) backdrop.style.filter = `hue-rotate(${hue}deg)`;
      $('#v3HueValue').textContent = `${hue > 0 ? '+' : ''}${hue}°`;
      store.set('rinsora-v3-hue', hue);
    });
    $$('.v3-switch').forEach(btn=>btn.addEventListener('click',()=>{
      const k = btn.dataset.effect;
      fx[k] = !fx[k];
      store.set('rinsora-v3-'+k, fx[k] ? 'on' : 'off');
      applyEffects();
    }));
    $('#v3Hue').value = hue;
    $('#v3HueValue').textContent = `${hue > 0 ? '+' : ''}${hue}°`;
    const backdrop = $('#v3ThemeBackdrop'); if (backdrop) backdrop.style.filter = `hue-rotate(${hue}deg)`;
  }

  // 覆盖旧的夜间按钮：确保点击一定改变主题，并且动画不会因为旧 listener 抢先而失效。
  document.addEventListener('click', (e) => {
    if (e.target?.closest?.('#themeBtn') && !e.target.closest('#v3SettingsPanel')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      applyV3Theme(document.body.classList.contains('night') ? 'candy' : 'dream', true);
      showToast(document.body.classList.contains('night') ? '切到梦幻夜景 ✦' : '回到糖果白日 ♡');
    }
  }, true);

  // ------------------------------------------------------------ Theme backdrop
  function createThemeBackdrop() {
    if (!document.getElementById('v3ThemeBackdrop')) {
      const el = document.createElement('div');
      el.id = 'v3ThemeBackdrop';
      el.setAttribute('aria-hidden','true');
      document.body.insertBefore(el, document.body.firstChild);
    }
  }

  // ------------------------------------------------------------ Particles
  function createParticles() {
    if (document.getElementById('v3Particles')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'v3Particles';
    canvas.setAttribute('aria-hidden','true');
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let particles = [];
    let raf = 0;
    const count = () => window.innerWidth <= 760 ? 62 : 112;
    const palette = [
      [255,150,194],[255,213,127],[195,178,255],[159,225,210],[154,206,255]
    ];
    const rand = (a,b) => Math.random()*(b-a)+a;
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr);
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      particles = Array.from({length:count()},()=>({
        x:rand(0,w),y:rand(0,h),vx:rand(-.12,.12),vy:rand(-.10,.10),
        r:rand(.85,2.35),a:rand(.34,.88),phase:rand(0,Math.PI*2),speed:rand(.004,.012),
        star:Math.random()<.36,col:palette[Math.floor(Math.random()*palette.length)]
      }));
    }
    function drawStar(p,t){
      const pulse = .65 + .35*Math.sin(p.phase+t*p.speed*60);
      const rr = p.r*(1.2+pulse*.55);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(t*p.speed*.2+p.phase);
      ctx.beginPath();
      for(let i=0;i<8;i++){
        const ang=-Math.PI/2+i*Math.PI/4; const rad=i%2===0?rr:rr*.35;
        const x=Math.cos(ang)*rad,y=Math.sin(ang)*rad;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.fillStyle=`rgba(${p.col[0]},${p.col[1]},${p.col[2]},${Math.min(.95,p.a*pulse)})`;
      ctx.shadowBlur=15;ctx.shadowColor=`rgba(${p.col[0]},${p.col[1]},${p.col[2]},${Math.min(.65,p.a)})`;
      ctx.fill();ctx.restore();
    }
    function frame(t){
      if (!fx.particles || reducedMotion()) { ctx.clearRect(0,0,w,h); raf=0; return; }
      ctx.clearRect(0,0,w,h);
      for(const p of particles){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10;
        if(p.y<-10)p.y=h+10;if(p.y>h+10)p.y=-10;
        const pulse=.72+.28*Math.sin(p.phase+t*p.speed*60);
        if(p.star){drawStar(p,t);} else {
          ctx.beginPath();ctx.arc(p.x,p.y,p.r*pulse,0,Math.PI*2);
          ctx.fillStyle=`rgba(${p.col[0]},${p.col[1]},${p.col[2]},${Math.min(.82,p.a*pulse)})`;
          ctx.shadowBlur=12;ctx.shadowColor=`rgba(${p.col[0]},${p.col[1]},${p.col[2]},.28)`;ctx.fill();
        }
      }
      raf=requestAnimationFrame(frame);
    }
    resize();window.addEventListener('resize',resize,{passive:true});
    const start=()=>{if(raf===0&&!reducedMotion())raf=requestAnimationFrame(frame);};
    document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else start();});
    start();
    window.RinsoraV3Particles={start,resize};
  }

  createThemeBackdrop();
  document.documentElement.style.setProperty('--v3-hue', `${hue}deg`);
  applyV3Theme(v3Theme,false);
  applyEffects();
  createParticles();

  // ------------------------------------------------------------ Rebind tilt + ripple so feature switches really respond
  document.addEventListener('pointermove',(e)=>{
    const card=e.target?.closest?.('.card,.recent-card,.pt-link');
    if(!fx.tilt || reducedMotion() || !card || e.pointerType==='touch') return;
    const r=card.getBoundingClientRect();
    if(!r.width||!r.height)return;
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    if(card.dataset.v3TiltBound!=='1') card.dataset.v3TiltBound='1';
    card.style.transform=`perspective(900px) rotateX(${(-y*3.2).toFixed(2)}deg) rotateY(${(x*4.0).toFixed(2)}deg) translateY(-3px)`;
  },{passive:true});
  document.addEventListener('pointerout',(e)=>{
    const card=e.target?.closest?.('.card,.recent-card,.pt-link');
    if(card && e.relatedTarget && card.contains(e.relatedTarget))return;
    if(card)card.style.transform='';
  },{passive:true});

  document.addEventListener('pointerdown',(e)=>{
    if(!fx.ripple||reducedMotion()||e.button!==0||e.target?.closest?.('input,textarea,select'))return;
    const el=document.createElement('span');
    el.className='click-ripple';el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';el.style.zIndex='10040';
    document.body.appendChild(el);setTimeout(()=>el.remove(),650);
  },{passive:true});

  // 当前脚本可能把“最近发布”在初始化时生成一次；在 project 数据加载后稍等再刷新。
  window.setTimeout(()=>{
    try { window.RinsoraHome?.refreshRecent?.(); } catch (_) {}
  }, 900);

  // 给当前版本打一枚可见的调试钩子，方便未来排查。
  window.RinsoraV3 = {
    version:'2.1.0-fix',
    theme:()=>v3Theme,
    effects:()=>({...fx}),
    enter:runEnterAnimation,
    setTheme:(t)=>applyV3Theme(t,true),
    settings:()=>$('#v3SettingsPanel')?.classList.contains('open')
  };
})();
