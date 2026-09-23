/* ============================================================
   空凛 · Rinsora 的小窝 —— 首页界面层（V3）
   ------------------------------------------------------------
   这一份脚本只负责「界面层」，不碰任何数据层。职责划分：

     AppState            当前分栏 / 上一个分栏 / 是否在转场中
     navigateTo(page)    唯一的分栏入口（转场也在这里编排）
     initTheme()         主题引擎（data-theme × 明暗 × 色相）
     initNavigation()    极坐标扇形导航 + hash 路由
     initMoments()       碎碎念时间线
     initClock()         世界时钟（今日 / 本周 / 本月 / 今年）
     initSettings()      设置抽屉（外观 / 特效 / 关于）
     initEffects()       星尘 / 光标 / 涟漪 / 卡片倾斜
     initReveal()        滚动进场（IntersectionObserver）
     initPageTransitions()  跨文档转场遮罩
     initA11y()          键盘与焦点
     initPage()          页面级初始化（跨文档转场后也调它）

   数据层仍在各自的文件里：
     播放器（音乐 + 歌词）→ music.js
     项目树               → projects.js
     添加音乐弹窗         → music-upload.js
     碎碎念数据           → moments-data.js
   通过 window.RinsoraHome 对外暴露少量接口。
   ============================================================ */
(() => {
  'use strict';

  /* ---------------------------------------------------- 小工具 ---- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const store = {
    get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) { /* 隐私模式下忽略 */ } }
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  const reduceMotion = () => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  };
  const rAF2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------------------------------------------- 元素引用 ---- */
  const html = document.documentElement;
  const body = document.body;
  const welcome = $('#welcomeScreen');
  const app = $('#app');
  const landingPlayer = $('#landingPlayer');
  const floatingPlayer = $('#floatingPlayer');
  const enterBtn = $('#enterBtn');
  const navWrap = $('#avatarNavWrap');
  const avatarButton = $('#avatarButton');
  const radialNav = $('#radialNav');
  const themeBtn = $('#themeBtn');
  const themeLabel = $('#themeLabel');
  const settingsPanel = $('#settingsPanel');
  const settingsMask = $('#settingsMask');
  const pageProgress = $('#pageProgress');
  const boot = $('#bootScreen');
  /* Room Reveal 入场动画的两件套：光晕扩散层 + 粒子轨迹画布。
     都挂在 body 上（.app 之外），绝不参与 .app 的层叠 / 包含块。 */
  const roomReveal = $('#roomReveal');
  const entryCanvas = $('#entryParticles');
  /* 站内看文章的浮层（不换文档 → 音乐不断），逻辑见下面「站内打开文章」一节 */
  const spaPost = $('#spaPost');
  const spaPostView = $('#spaPostView');
  const spaPostBody = $('#spaPostBody');

  const THEMES = ['candy', 'sunset', 'lavender', 'mint', 'night'];
  /* 旧代码 / 回归装置还在用 pal-xxx 这套类名，映射表负责两边都写 */
  const PALETTE_OF = { candy: 'candy', sunset: 'sunset', lavender: 'lilac', lilac: 'lilac', mint: 'mint' };
  const PALETTES = ['candy', 'sunset', 'lilac', 'mint'];

  /* 星尘实例稍后才创建；先用 null 占位，applyEffects() 里就能安全判空。
     （不能直接写 typeof starfield —— const 在 TDZ 里连 typeof 都会抛错。） */
  let starfield = null;

  /* ============================================================
     AppState —— 页面状态机
     ------------------------------------------------------------
     以前分栏切换就是「给旧的摘 .active、给新的加 .active」，
     一瞬间就切完了，没有任何状态可查，也没法阻止连点造成的错乱。
     现在把「当前在哪、从哪来、是不是正在转场」显式记下来。
     ============================================================ */
  const AppState = {
    currentPage: 'about',
    previousPage: null,
    isEntering: false,
    entered: false,
    isTransitioning: false,
    museumOpen: false,      /* 是否在「音乐博物馆」浮层里（见下面 enterMuseum 区块） */
    theme: 'candy',
    effects: {}
  };

  /* ---------------------------------------------------- 状态 ---- */
  const state = {
    section: 'about',
    museumOpen: false,      /* 与 AppState.museumOpen 同步维护，见 enterMuseum */
    night: store.get('rinsora-theme') === 'night',
    palette: (() => {
      const p = store.get('rinsora-palette', 'candy');
      return PALETTES.indexOf(p) === -1 ? 'candy' : p;
    })(),
    hue: Number(store.get('rinsora-hue', '0')) || 0,
    effects: {
      particles: store.get('rinsora-effect-particles', 'on') !== 'off',
      cursor: store.get('rinsora-effect-cursor', 'on') !== 'off',
      tilt: store.get('rinsora-effect-tilt', 'on') !== 'off',
      ripple: store.get('rinsora-effect-ripple', 'on') !== 'off',
      aurora: store.get('rinsora-effect-aurora', 'on') !== 'off',
      decor: store.get('rinsora-effect-decor', 'on') !== 'off'
    }
  };

  /* ---------------------------------------------------- 开屏 ---- */
  let bootPct = 0;
  const bootTimer = setInterval(() => {
    bootPct = Math.min(100, bootPct + (bootPct < 70 ? 9 : 5));
    const bar = $('#bootProgress'), pct = $('#bootPercent');
    if (bar) bar.style.width = bootPct + '%';
    if (pct) pct.textContent = bootPct + '%';
    if (bootPct >= 100) {
      clearInterval(bootTimer);
      setTimeout(() => boot && boot.classList.add('done'), 260);
    }
  }, 70);

  /* 走直达链接（#about / #blog / #projects / #moments）进来时，开屏整段跳过：
     停掉进度计时器 + 关掉过渡 + 立刻按掉。CSS 的 .no-boot 负责兜住第一帧，
     这里负责把还在跑的计时器收掉，免得它在后台把进度条推到 100%。 */
  function skipBoot() {
    clearInterval(bootTimer);
    if (!boot) return;
    boot.style.transition = 'none';
    boot.classList.add('done');
    setTimeout(() => { boot.style.display = 'none'; }, 20);
  }

  /* ============================================================
     initTheme —— 主题引擎
     ------------------------------------------------------------
     主题 = 调色板（candy / sunset / lavender / mint）× 明暗（day / night）
     两者独立存储，但对外只用**一个** data-theme 字符串表达最终结果：
       data-theme="candy" | "sunset" | "lavender" | "mint" | "night"
     夜间时 data-theme="night"（night 本身就是第 5 套配色，不是「叠加」）。
     旧的 .pal-x / .night 类名同步写上，老 CSS 和回归装置都不受影响。
     ============================================================ */
  function themeName() {
    if (state.night) return 'night';
    return ({ lilac: 'lavender' })[state.palette] || state.palette;
  }

  function applyTheme(persist) {
    const name = themeName();
    AppState.theme = name;
    html.setAttribute('data-theme', name);
    body.setAttribute('data-theme', name);
    /* 兼容层：老类名继续维护 */
    const legacy = PALETTE_OF[state.palette] || 'candy';
    PALETTES.forEach((p) => {
      html.classList.toggle('pal-' + p, p === legacy);
      body.classList.toggle('pal-' + p, p === legacy);
    });
    html.classList.toggle('night', state.night);
    body.classList.toggle('night', state.night);
    if (themeLabel) themeLabel.textContent = state.night ? '日间模式' : '夜间模式';
    if (themeBtn) themeBtn.title = state.night ? '切换日间模式' : '切换夜间模式';
    const ns = $('#nightSwitch');
    if (ns) ns.classList.toggle('on', state.night);
    /* 设置面板里 5 个主题按钮的高亮 + 「当前主题」文字 */
    $$('.theme-grid button').forEach((b) => {
      b.classList.toggle('active', (b.dataset.theme || b.dataset.palette) === name);
    });
    const nowLabel = $('#themeNow');
    if (nowLabel) nowLabel.textContent = name;
    /* 同步 <meta name="theme-color">，手机浏览器地址栏跟着变色 */
    const tc = $('meta[name="theme-color"]');
    if (tc) {
      const cs = getComputedStyle(html).getPropertyValue('--accent-primary').trim();
      if (cs) tc.setAttribute('content', cs);
    }
    if (persist) {
      store.set('rinsora-palette', state.palette);
      store.set('rinsora-theme', state.night ? 'night' : 'light');
    }
  }

  /* 只切换调色板（不含明暗） */
  function applyPalette(name, persist) {
    const next = PALETTES.indexOf(name) === -1 ? 'candy' : name;
    state.palette = next;
    applyTheme(persist);
  }

  function applyNight(night, persist) {
    state.night = !!night;
    applyTheme(persist);
  }

  function applyHue(deg, persist) {
    html.style.setProperty('--hue', deg + 'deg');
    const out = $('#hueValue');
    if (out) out.textContent = (deg > 0 ? '+' : '') + deg + '°';
    if (persist) { state.hue = deg; store.set('rinsora-hue', deg); }
  }

  /* 换了主题要重开一次视图过渡的「圆扩散」，从按钮位置揭出来。
     ① 更新回调里等两帧再 resolve —— 浏览器是等回调 resolve 之后才拍
        「新」快照的，太快 resolve 会拍到毛玻璃还没按新配色重新合成的
        那一帧，看起来就像「毛玻璃先消失 → 变色 → 毛玻璃再回来」。
     ② 外面再挂一个定时器兜底：万一某个环境里视图过渡的回调根本没执行
        （无头 / 虚拟时间的浏览器就是这样），至少主题要切过去。
     ③ 不支持 View Transition API 的浏览器直接换 —— 这就是 fallback。 */
  function withViewTransition(mutate) {
    if (!document.startViewTransition || reduceMotion()) { mutate(); return; }
    const r = themeBtn ? themeBtn.getBoundingClientRect() : null;
    const x = r ? r.left + r.width / 2 : innerWidth / 2;
    const y = r ? r.top + r.height / 2 : 0;
    const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 30;

    let applied = false;
    const once = () => { if (!applied) { applied = true; mutate(); } };

    const vt = document.startViewTransition(() => new Promise((done) => {
      once();
      rAF2(done);
      setTimeout(done, 180);
    }));
    vt.ready.then(() => {
      html.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${far}px at ${x}px ${y}px)`] },
        { duration: 680, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
    setTimeout(once, 220);
  }

  function toggleTheme() {
    const next = !state.night;
    withViewTransition(() => applyNight(next, true));
  }
  themeBtn && themeBtn.addEventListener('click', toggleTheme);

  /* ============================================================
     initEffects —— 特效开关
     ============================================================ */
  function applyEffects() {
    const fx = state.effects;
    AppState.effects = Object.assign({}, fx);
    body.classList.toggle('no-particles', !fx.particles);
    body.classList.toggle('no-ripple', !fx.ripple);
    body.classList.toggle('no-tilt', !fx.tilt);
    body.classList.toggle('no-aurora', !fx.aurora);
    body.classList.toggle('no-decor', !fx.decor);
    body.classList.toggle('cursor-on', fx.cursor && !reduceMotion());
    /* 只同步「特效开关」，夜间那个 .switch 没有 data-setting，不归这里管 */
    $$('.switch').forEach((b) => {
      if (b.dataset.setting) b.classList.toggle('on', !!fx[b.dataset.setting]);
    });
    if (starfield) starfield.sync();
  }

  /* ============================================================
     initNavigation —— 极坐标扇形导航
     ------------------------------------------------------------
     旧实现是 nth-child + 写死 translate，第 4 个节点就得手算一组新数字。
     现在按极坐标算：

       angle = startAngle + i * step         （i = 0..n-1）
       x     = cos(angle) * radius
       y     = sin(angle) * radius
       rot   = angle / 10                    （跟着弧线轻轻转，别太夸张）

     ⚠️ 下面这几个数不是「看着差不多」调出来的，是解出来的。
        扇形要同时避开四块东西，而侧栏只有 248px 宽（头像就占 132px）：

          · 头像      page (50.5,121)-(196.5,267)   半径 66，锚点就在它中心
          · 侧栏署名  page (39,316)-(208,405)       ← 在头像正下方
          · 联系方式  page (35.5,419)-(211.5,457)   ← 4 颗按钮一排
          · ONLINE    page (77.5,473)-(169.5,509)
          · 内容首栏  page x >= 300                 ← 硬边界（真的压住内容）
                                    x >= 248 是侧栏右缘，但 248~300 是
                                    .content 的 padding，探进去不压东西

        卡片绕头像摆一圈，靠手调是调不出来的：半径小了压头像（卡片内缘
        必须 >= 头像半径 66 + 8px 间隙），半径大了顶出侧栏。
        5 张卡（4 个分栏 + 音乐博物馆）比 4 张挤得多，所以整组参数用
        `_navfit.py` 重解过 —— 那个脚本把上面每块都写成了几何约束再搜。

        现行值：72x42 卡片、R=136、start=-128°、arc=148°（每 37° 一个）。
        这一组只在 **≥1151px** 生效；861~1150px 见下面的 NAV_CFG_COMPACT。

        ⚠️ 自转系数固定 **angle/10**（见下面 layoutRadialNav 里那行），
        这个不用搜 —— 卡片沿圆周切线取向，本来就该是极角本身。
        搜出来的是「位置」：把自转固定成 angle/10 之后，5 张卡刚好
        均匀铺在 148° 上（-128° / -91° / -54° / -17° / +20°），
        间距全部够宽，没有任何两张挨上（最近一对还留 6.2px）。

        ⚠️ 头像必须按**展开态**建模，不能按静态 132x132：
        `.avatar-nav-wrap.open .avatar-sidebar` 会加
        `translateY(-4px) scale(1.07) rotate(-2deg)`，真实 bbox 变成
        146x146、中心从 y=198 抬到 194。按静态值建模会让求解器
        「以为离头像 10.4px」，实测只有 3.1px —— 差的就是那 7%。
        改头像样式后请跑 `_navgeom.js` 看 zones.avatar 再同步。

        位置和自转必须一起想 —— 单独调其中任何一个都会撞。

        ⚠️ 搜索参数与生产参数**必须一致**：`_navfit.py` 里 PROD_ROT_K
        就是这里的 10。曾经求解器按 6 搜、生产用 10，于是「搜出来无重叠」
        的参数在线上是真叠的（blog/projects 叠 4.66px），而且不报错。
        改这里那行，务必同步改 PROD_ROT_K，再重跑求解器。

        ⚠️ 边界也别写错（踩过两次）：硬边界是「内容真正开始的地方」
        page x = 300；写成 248（侧栏右缘）会导致**全域无解**，
        写成 297.5 会卡在临界。`_navfit.py` 的 MAX_X / RAIL_SOFT 有详注。

        节点多的时候单圈会挤在一起，所以奇偶分两圈
        （内圈 / 外圈差 58px），相邻两项永远落在不同半径上，不会叠。
        参数都在下面 NAV_CFG 里，改一个数就能整圈变形 —— 但改完请重跑
        `_navfit.py` 与 `_navcheck.py`，别只靠眼睛。
        ============================================================ */
  const NAV_CFG = {
    startAngle: -128,  /* 一度为单位；-90 是正上方，0 是正右，90 是正下方 */
    arc: 148,          /* 扇形张开的总角度 → 5 个节点每 37° 一个 */
    radius: 136,       /* 内圈半径 */
    ringGap: 58,       /* 两圈之间的半径差（节点 >6 时才用） */
    twoRingAbove: 6    /* 超过这个数量就分两圈 */
  };

  /* ------------------------------------------------------------
     compact-radial —— 861~1150px 那一档
     ------------------------------------------------------------
     210px 的侧栏里塞不下 72×42 的文字卡（缺口约 100px），
     所以这一档整组换成 44px 圆点 + tooltip，参数**另解一组**。
     详情与求解过程写在 v3.css 第 21.b 节。

     ⚠️ 这三条必须和 v3.css 的 @media (min-width:861px) and
     (max-width:1150px) 一一对应：JS 负责把 --nx/--ny/--nr 写到
     极坐标位置，CSS 负责把节点画成 44px 圆；两边任一改动都要重跑
     `_navscan_sz.js` + `_navfit_soft.py`，改完再用
     `_compactfinal.js` 复核（跟宽屏那组的规矩一样）。

     ⚠️ navScale 不是在「缩放整个扇形」，而是把 .radial-nav 的
     transform 从宽屏档的 scale(.85) 明确**还原**成 scale(1)。
     别的档位靠残留的 .85 把半径和卡片一起缩，紧凑档的半径/尺寸
     本来就是按 210px 侧栏解出来的，再缩一层会把 44px 圆压到 37px。 */
  const NAV_CFG_COMPACT = {
    startAngle: -80,
    arc: 204,
    radius: 144,
    ringGap: 58,
    twoRingAbove: 6,
    navScale: 1
  };

  /* 唯一的口径：低于这个宽度就进紧凑档。
     必须写在 JS 里而不是每处 innerWidth 判断里 ——
     否则「解算用的断点」和「运行时用的断点」各写一份，早晚漂移。
     同一个数字在 CSS 里对应 v3.css 的两条 @media，改一处要同步三处。 */
  const COMPACT_MAX = 1150;

  function activeNavCfg() {
    return window.innerWidth <= COMPACT_MAX ? NAV_CFG_COMPACT : NAV_CFG;
  }

  function layoutRadialNav() {
    if (!radialNav) return;
    const items = $$('.radial-item', radialNav);
    if (!items.length) return;
    radialNav.classList.remove('no-js');

    const cfg = activeNavCfg();
    const n = items.length;
    const twoRing = n > cfg.twoRingAbove;
    const step = n > 1 ? cfg.arc / (n - 1) : 0;
    const start = cfg.startAngle;

    /* 档位缩放挂在 .radial-nav 上（宽屏 .85 / 紧凑 1），
       这样 resize 跨过断点时不需要重算任何极坐标。 */
    if (cfg.navScale != null) radialNav.style.transform = 'scale(' + cfg.navScale + ')';

    items.forEach((el, i) => {
      const angle = n === 1 ? start + cfg.arc / 2 : start + step * i;
      const rad = (angle * Math.PI) / 180;
      const radius = cfg.radius + (twoRing && i % 2 ? cfg.ringGap : 0);
      el.style.setProperty('--nx', (Math.cos(rad) * radius).toFixed(1) + 'px');
      el.style.setProperty('--ny', (Math.sin(rad) * radius).toFixed(1) + 'px');
      el.style.setProperty('--nr', (angle / 10).toFixed(1) + 'deg');
      /* 从左到右依次弹出，做出 stagger */
      el.style.setProperty('--d', (i * 42) + 'ms');
    });
  }

  /* ============================================================
     navigateTo —— 唯一的分栏入口
     ------------------------------------------------------------
     目标体验：旧内容先退出 → 转场 → 新内容进入。
     实现上有三个必须守住的点：

     ① 目标分栏的 .active 是**同步**写的。
        回归装置（_v2.py / _shot.py）在切换后只等 60ms 就去读
        .page-section.active 和几何，异步加类会让它们读到旧的。
        所以「旧的退场」用 .leaving（position:absolute + 播放完就摘），
        新分栏照常立刻上场 —— 视觉上是交叉淡出，语义上没有延迟。

     ② 不排「队列」、也不上「锁」。
        一开始写的是「转场期间锁 560ms，把后来的点击记进 pendingNav」，
        结果是：连着点两下，第二下要等半秒多才动 —— 手感很差，
        而且还会让回归里「切换 → 等 60ms → 量几何」全部读到旧分栏。
        现在改成**立即重定向**：新的目标当场接手，把上一个正在退场的
        收干净、preset 类重挂一次重启动画。连点 5 次也只是动画重播，
        状态永远只有一份，不会错乱（这才是「防止状态错乱」的正解）。
        真正防的不是「第二次点击」，而是「同一次转场被重入」——
        那用下面那个自增 token 兜底：过期的定时器一律不再动 DOM。

     ③ AppState.isTransitioning 仍然真实维护（对外可观察），
        但只用来描述「动画还在播」，不用来拒绝导航。
     ============================================================ */
  const TITLES = { about: '主页', blog: '博客 / 随笔', projects: '项目', moments: '碎碎念' };
  const WIDTHS = { about: 25, blog: 50, projects: 75, moments: 100 };

  /* 四套转场 preset：不是所有页面都用同一个 fade */
  const TRANSITIONS = {
    'about>blog': 'tr-slide-x',
    'blog>about': 'tr-slide-x',
    'blog>projects': 'tr-drop',
    'projects>blog': 'tr-drop',
    'projects>about': 'tr-blur',
    'about>projects': 'tr-drop',
    'blog>moments': 'tr-zoom',
    'moments>blog': 'tr-zoom',
    'about>moments': 'tr-zoom',
    'moments>about': 'tr-blur',
    'projects>moments': 'tr-zoom',
    'moments>projects': 'tr-drop'
  };
  const TR_CLASSES = ['tr-slide-x', 'tr-drop', 'tr-blur', 'tr-zoom'];

  let navToken = 0;
  let leavingTimer = 0;

  function sectionEl(id) { return document.getElementById(id); }

  function runTransition(from, to) {
    const out = from && from !== to ? sectionEl(from) : null;
    const into = sectionEl(to);
    if (!into) return;

    /* --- 退场：先把所有还在退场的收干净（连点时上一轮可能没播完） --- */
    $$('.page-section.leaving').forEach((s) => {
      if (s !== out) s.classList.remove('leaving');
    });
    if (out) {
      out.classList.remove('active');
      out.classList.add('leaving');
      clearTimeout(leavingTimer);
      leavingTimer = setTimeout(() => out.classList.remove('leaving'), 260);
    }

    /* --- 上场：先摘掉上一次的 preset，重排一次，再加新的 ---
       顺序很讲究：先把 preset 类摘掉并让 .active 生效，读一次 offsetWidth
       强制结算样式，最后才加 preset —— 否则（摘掉旧的、加上新的都在同一帧）
       浏览器会认为 animation 名没变，直接沿用上一轮的结束态，转场就不播了。
       连点同一个目标时 preset 会重挂，动画从头播一遍。 */
    TR_CLASSES.forEach((c) => into.classList.remove(c));
    into.classList.add('active');
    void into.offsetWidth;
    const preset = TRANSITIONS[from + '>' + to] || 'tr-slide-x';
    if (!reduceMotion()) {
      into.classList.add(preset);
      setTimeout(() => { if (into.classList.contains(preset)) into.classList.remove(preset); }, 700);
    }
  }

  function navigateTo(page, opts) {
    const o = opts || {};
    if (!TITLES[page]) page = 'about';
    /* 切分栏 = 退出音乐博物馆浮层。放在最前面（比「已经在目标分栏」的
       提前返回还早）：在博物馆里点键盘 1~4 想回小窝，如果先提前返回，
       展厅会一直盖在上面，看着像按键失灵。 */
    if (AppState.museumOpen) exitMuseum();

    if (page === AppState.currentPage && !o.force) {
      /* 已经在目标分栏：不用转场，但**必须**照样把首帧兜底交班，
         否则 #about 这类「目标就是初始分栏」的直达链接会被
         html[data-pre-section] 一直按着（欢迎页被 display:none）。 */
      html.removeAttribute('data-pre-section');
      hidePost();
      if (!o.silent) closeNav(true);
      syncA11y(page);
      return true;
    }

    const from = AppState.currentPage;

    hidePost();                                   /* 切分栏 = 退出文章浮层（浏览器后退也走这里） */
    html.removeAttribute('data-pre-section');     /* 首帧那层 CSS 兜底到此交班 */

    AppState.previousPage = from;
    AppState.currentPage = page;
    state.section = page;

    runTransition(from, page);

    $$('.radial-item').forEach((b) => b.classList.toggle('active', b.dataset.target === page));
    $$('.mobile-nav button').forEach((b) => b.classList.toggle('active', b.dataset.target === page));
    syncA11y(page);

    const title = $('#sectionTitle');
    if (title) title.textContent = TITLES[page];
    if (pageProgress) pageProgress.style.width = (WIDTHS[page] || 25) + '%';
    document.title = TITLES[page] + ' · 空凛 · Rinsora 的小窝';

    if (o.push !== false && history.replaceState) history.replaceState(null, '', '#' + page);

    const back = o.scrollY;
    window.scrollTo({
      top: back == null ? 0 : back,
      behavior: (back == null && !reduceMotion()) ? 'smooth' : 'auto'
    });

    /* 进入某个分栏时按需重新扫一遍滚动进场的目标 */
    observeReveal();

    /* 「动画进行中」只是一个对外可观察的状态，不参与决策。
       token 保证只有最新那一轮能把标记落回 false —— 过期的定时器不再动 DOM。 */
    const token = ++navToken;
    AppState.isTransitioning = true;
    setTimeout(() => {
      if (token !== navToken) return;
      AppState.isTransitioning = false;
    }, reduceMotion() ? 60 : 560);
    return true;
  }

  /* 兼容旧接口：showSection 就是 navigateTo，第二参沿用「是否写 hash」的语义 */
  function showSection(id, push) {
    return navigateTo(id, { push: push !== false });
  }

  /* -------------------------------------------------- 导航交互 --- */
  $$('.radial-item,.mobile-nav button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      /* 音乐博物馆那一项进的是 overlay 场景，不是分栏 ——
         它带 data-museum 而不是 data-target，所以不能走 navigateTo。
         （走 navigateTo 会被 TITLES 兜底成「主页」，正好是最糟的结果。） */
      if (btn.dataset.museum) { enterMuseum(); return; }
      if (!btn.dataset.target) return;
      navigateTo(btn.dataset.target);
      closeNav(true);
    });
  });

  function openNav(on) {
    if (!navWrap) return;
    navWrap.classList.toggle('open', on);
    navWrap.classList.remove('nav-closed');   /* 主动展开时清掉「已被显式收起」的抑制类 */
  }
  function closeNav(soft) {
    if (!navWrap) return;
    navWrap.classList.remove('open');
    /* soft=true：点空白收起，顺手压住 :hover 的自动展开；鼠标离开就复位 */
    navWrap.classList.toggle('nav-closed', !!soft);
  }
  avatarButton && avatarButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navWrap.classList.contains('open')) closeNav(true);
    else openNav(true);
  });
  navWrap && navWrap.addEventListener('mouseleave', () => navWrap.classList.remove('nav-closed'));
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('#avatarNavWrap')) closeNav(true);
  });

  /* -------------------------------------------------- hash 路由 --- */
  /* 直达链接：#about / #blog / #projects / #moments 跳过欢迎页，
     #museum / #musicmuseum 直达音乐博物馆，
     #/post/xxx.html 直达某一篇文章（站内打开的地址形式），
     #admin / #write / #editor / #project 跳后台页 */
  function routeHash() {
    const raw = (location.hash || '').replace(/^#/, '');
    const h = raw.toLowerCase();
    if (h === 'admin' || h === 'write' || h === 'editor') { location.href = 'editor.html'; return true; }
    if (h === 'project' || h === 'newproject') { location.href = 'project-editor.html'; return true; }
    /* 音乐博物馆：先进小窝（不然侧栏/播放器都没上场，退出来是一片欢迎页），
       再盖上展厅浮层。用 instant 进小窝 —— 这里已经在等一个加载动画了，
       再叠一层 Room Reveal 会很啰嗦。 */
    if (h === 'museum' || h === 'musicmuseum') {
      skipBoot(); enterApp(true);
      enterMuseum();
      return true;
    }
    /* 文章：先落回博客分栏（首帧 CSS 已经把欢迎页按住了），再盖上浮层 */
    const pm = /^\/post\/([^/?#]+\.html)$/i.exec(raw);
    if (pm) {
      skipBoot(); enterApp(true); navigateTo('blog', { push: false, silent: true });
      openPost('posts/' + pm[1], false);
      return true;
    }
    if (TITLES[h]) { skipBoot(); enterApp(true); navigateTo(h, { push: false, silent: true }); return true; }
    return false;
  }
  window.addEventListener('hashchange', () => {
    /* 没命中任何路由也要把浮层收掉：从「主页」的最近发布点进文章时，
       进站时的 hash 本来就是空的，后退回来只会把 hash 清掉，
       不在这里收就永远卡在文章上。 */
    if (!routeHash()) {
      hidePost();
      /* hash 被清掉（浏览器后退）时，博物馆也该跟着退场 —— 否则
         地址已经不是 #museum 了，展厅还盖在上面，进退两难。 */
      if (AppState.museumOpen && (location.hash || '') !== '#museum') exitMuseum();
    }
  });

  /* ============================================================
     initEntry —— 「进入小窝」（Room Reveal / 头像唤醒）
     ------------------------------------------------------------
     彻底废弃旧的「头像飞行」方案：那个方案会 cloneNode + 量两个头像的
     getBoundingClientRect，把一个头像 DOM 从欢迎页「飞」到侧栏 ——
     依赖两个不同元素之间的坐标转移，脆弱、难维护、还带着一堆旧
     fallback。本次不再修补它，直接删掉。

     新方案：头像不移动。以中央头像为视觉中心，用「蓄力 → 光晕扩散 →
     头像淡出 → 粒子引导 → 侧栏头像显影 → 导航错峰 → 内容错峰」，
     制造「头像化成光、唤醒整个小窝」的完整幻觉。

     时序（总长约 1.2s）：
       0ms    按钮禁用；body.room-entering 触发头像蓄力 + reveal 扩散
       0ms    welcome 大播放器向下淡出（landingPlayer.exit）
       430ms  .app 显示（侧栏头像 / 导航 / 内容各自入场）
       480ms  粒子轨迹从中央头像流向侧栏（纯装饰引导线，头像本身不动）
       520ms  welcome 整块淡出
       620ms  导航做一次「欢迎展开」（复用极坐标 + --d stagger）
       680ms  右下角播放器从下方向上淡入
       1250ms 收尾：导航收起、摘 room-entering、销毁粒子、状态落定

     状态由两个标记 + 一个自增 token 管：
       AppState.isEntering（动画中）、AppState.entered（已进入）
       entryToken 保证旧一轮的定时器不再动 DOM（连点 / 重入安全）。
     ⚠️ .app 上不能有 transform —— 侧栏/播放器都是 position:fixed。
     ============================================================ */

  let entered = false;
  let entryToken = 0;
  let entryRaf = 0;

  /* 粒子轨迹：一条从「中央头像」指向「侧栏头像」的粉→黄→紫光点流。
     纯视觉引导线，不移动任何头像；跑完自动清场。颜色读主题变量，
     换主题后入场粒子也跟着变。 */
  function spawnEntryParticles() {
    if (!entryCanvas) return;
    const from = $('.avatar-large', welcome);
    const to = $('.avatar-sidebar', app);
    if (!from || !to) return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    if (!a.width || !b.width) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const ctx = entryCanvas.getContext('2d');
    if (!ctx) return;
    entryCanvas.width = Math.round(innerWidth * dpr);
    entryCanvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sx = a.left + a.width / 2, sy = a.top + a.height / 2;
    const ex = b.left + b.width / 2, ey = b.top + b.height / 2;
    const count = innerWidth < 600 ? 12 : 26;
    const cs = getComputedStyle(body);
    const palette = [
      cs.getPropertyValue('--accent-primary').trim() || '#ff9dc6',
      cs.getPropertyValue('--accent-secondary').trim() || '#ffe294',
      cs.getPropertyValue('--accent-tertiary').trim() || '#d6c5ff',
      '#ffffff'
    ];
    const parts = [];
    for (let i = 0; i < count; i++) {
      parts.push({
        t: Math.random(),
        s: 1.5 + Math.random() * 2.6,
        p: palette[i % palette.length],
        o: .35 + Math.random() * .65,
        drift: (Math.random() - .5) * 60
      });
    }
    const t0 = performance.now();
    const dur = 620;

    function frame(now) {
      const k = Math.min(1, (now - t0) / dur);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(function (pt) {
        const tt = Math.max(0, Math.min(1, pt.t + k * .95));
        const ease = tt;
        const x = sx + (ex - sx) * ease + Math.sin(tt * 6 + pt.t * 10) * pt.drift * (1 - tt);
        const y = sy + (ey - sy) * ease + Math.cos(tt * 7 + pt.t * 9) * pt.drift * (1 - tt);
        ctx.globalAlpha = Math.max(0, Math.sin(tt * Math.PI) * pt.o);
        ctx.fillStyle = pt.p;
        ctx.beginPath();
        ctx.arc(x, y, pt.s * (1 - tt * .4), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (k < 1) entryRaf = requestAnimationFrame(frame);
      else clearEntryParticles();
    }
    entryRaf = requestAnimationFrame(frame);
  }

  function clearEntryParticles() {
    if (entryRaf) { cancelAnimationFrame(entryRaf); entryRaf = 0; }
    if (entryCanvas) {
      const ctx = entryCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, entryCanvas.width, entryCanvas.height);
      /* 尺寸归零，彻底释放这块显存（粒子只在入场那一小段用） */
      entryCanvas.width = 0;
      entryCanvas.height = 0;
    }
  }

  function finishRoomEntry() {
    AppState.isEntering = false;
    AppState.entered = true;
    if (body) body.classList.remove('room-entering');
    clearEntryParticles();
    if (enterBtn) { enterBtn.disabled = false; enterBtn.removeAttribute('aria-disabled'); }
    layoutRadialNav();
  }

  function startRoomEntry() {
    if (AppState.isEntering || AppState.entered) return;
    AppState.isEntering = true;
    const token = ++entryToken;
    try { window.RinsoraMusic && window.RinsoraMusic.collapse && window.RinsoraMusic.collapse(); } catch (e) {}

    /* reveal 光晕的中心 = 中央头像中心。这里只用于给光晕/粒子定位，
       头像本身原地不动 —— 这是和旧「头像飞行」方案的本质区别。 */
    const big = $('.avatar-large', welcome);
    if (big && roomReveal) {
      const r = big.getBoundingClientRect();
      if (r.width) {
        roomReveal.style.setProperty('--reveal-x', ((r.left + r.width / 2) / innerWidth * 100).toFixed(2) + '%');
        roomReveal.style.setProperty('--reveal-y', ((r.top + r.height / 2) / innerHeight * 100).toFixed(2) + '%');
      }
    }

    /* ① 按钮反馈 + 触发整套 CSS 动画（头像蓄力 / reveal 扩散 / 头像淡出） */
    if (enterBtn) { enterBtn.disabled = true; enterBtn.setAttribute('aria-disabled', 'true'); }
    body.classList.add('room-entering');

    /* ② welcome 大播放器向下淡出（独立状态，不跟头像飞绑定） */
    if (landingPlayer) landingPlayer.classList.add('exit');

    /* ③ 粒子引导线（头像淡出后启动，画完自毁；reduced-motion 不画） */
    if (!reduceMotion()) {
      setTimeout(() => { if (token === entryToken) spawnEntryParticles(); }, 480);
    }

    /* ④ .app 显示 —— 侧栏头像 / 导航 / 内容开始各自的入场动画 */
    setTimeout(() => {
      if (token !== entryToken) return;
      if (app) app.classList.add('visible');
    }, 430);

    /* ⑤ 导航做一次「欢迎展开」：复用极坐标 + --d stagger，之后收起 */
    setTimeout(() => {
      if (token !== entryToken) return;
      openNav(true);
    }, 620);

    /* ⑥ welcome 整块淡出（头像淡出后，文字/按钮/简介也一起隐去） */
    setTimeout(() => {
      if (token !== entryToken) return;
      if (welcome) { welcome.classList.add('hidden'); welcome.setAttribute('aria-hidden', 'true'); }
    }, 520);

    /* ⑦ 右下播放器从下方向上淡入（独立状态，不依赖头像飞行；双 rAF + 定时兜底） */
    setTimeout(() => {
      if (token !== entryToken) return;
      if (floatingPlayer) {
        void floatingPlayer.offsetHeight;
        rAF2(() => floatingPlayer.classList.add('visible'));
      }
    }, 680);
    setTimeout(() => { if (token === entryToken && floatingPlayer) floatingPlayer.classList.add('visible'); }, 940);

    /* ⑧ 收尾：导航收起、状态落定。主兜底 + 再兜一层，幂等，
       即便动画在后台标签页被降频，也保证最终状态完整。 */
    setTimeout(() => {
      if (token !== entryToken) return;
      closeNav(true);
      finishRoomEntry();
    }, 1250);
    setTimeout(() => { if (token === entryToken) finishRoomEntry(); }, 1600);
  }

  /* 兼容旧接口：回归装置 / 直达链接走 instant=true，直接落到最终态。
     instant 不播任何动画，但保证 welcome 隐藏、app 可见、
     侧栏头像 / 播放器都在位、导航几何量过。 */
  function enterApp(instant) {
    if (entered) return;
    if (instant) {
      entered = true;
      AppState.isEntering = false;
      AppState.entered = true;
      body.classList.remove('room-entering');
      clearEntryParticles();
      if (welcome) { welcome.classList.add('hidden'); welcome.setAttribute('aria-hidden', 'true'); }
      if (landingPlayer) landingPlayer.classList.add('exit');
      if (app) app.classList.add('visible');
      if (floatingPlayer) floatingPlayer.classList.add('visible');
      layoutRadialNav();
      return;
    }
    startRoomEntry();
  }
  enterBtn && enterBtn.addEventListener('click', () => startRoomEntry());

  /* ============================================================
     音乐博物馆 —— 页面入口 / 状态 / 开关
     ------------------------------------------------------------
     这个区块**只做接线**，一行场景逻辑都不写。分工：

       script.js（这里）               music-museum.js
       ────────────────────           ─────────────────────────
       页面入口（扇形导航 / 移动端底栏） 加载层进度
       页面状态（AppState.museumOpen）  资源预加载
       打开 / 关闭的时机                场景渲染与唱片对象
       与小窝淡出 / 路由 / Esc 的配合    点击唱片 → 复用现有播放器

     三条不变量（破坏了整个站就散架）：
       ① **绝不创建第二个 <audio>**。点唱片只是 RinsoraMusic.playIndex(i)，
          所以进博物馆时音乐一直在播、不断不重来。
       ② **绝不给 .app 或它的祖先加 transform / filter**。侧栏 / 悬浮播放器 /
          歌词栏都是 position:fixed，加了会把它们的包含块改掉推飞出屏。
          所以「小窝淡出」走的是**改子元素**（.side-rail / .content），
          不是给 .app 本身加 filter。
       ③ **不换文档**。这是站内浮层，location.href 一换 <audio> 就随旧文档销毁。
     ============================================================ */
  function enterMuseum(opts) {
    const o = opts || {};
    const M = window.RinsoraMuseum;
    if (!M) return Promise.resolve(false);

    closeNav(true);                 /* 导航先收，别压在加载层上 */
    hidePost();                     /* 文章浮层让位 */
    closeSettings();                /* 设置抽屉也收掉 */

    AppState.museumOpen = true;
    state.museumOpen = true;
    /* 小窝淡出：只作用于侧栏与内容这两块**子元素** ——
       .app 自己保持 opacity:1 / 无 filter（不变量 ②）。 */
    body.classList.add('museum-open');
    if (history.replaceState) history.replaceState(null, '', '#museum');

    return Promise.resolve(M.enter(o)).then((list) => {
      /* 加载层被 Esc 中途掐掉的情况：enter 的 token 会作废，
         这里跟着把状态摆正，别留下「museumOpen=true 但没进场景」。 */
      if (!M.isOpen() && !M.isEntering()) AppState.museumOpen = false;
      return list;
    });
  }

  function exitMuseum() {
    const M = window.RinsoraMuseum;
    if (!M) return false;
    const was = !!(AppState.museumOpen || M.isOpen());
    M.exit();
    AppState.museumOpen = false;
    state.museumOpen = false;
    body.classList.remove('museum-open');
    if (was && history.replaceState) {
      history.replaceState(null, '', '#' + (AppState.currentPage || 'about'));
    }
    return was;
  }

  /* 移动端底栏那一项也走同一个入口（上面的委托已经覆盖，这里只是兜底：
     万一将来节点结构变了，`data-museum` 仍然认得出来）。 */
  $$('[data-museum]').forEach((b) => {
    if (b.classList.contains('radial-item') || b.closest('.mobile-nav')) return;
    b.addEventListener('click', (e) => { e.stopPropagation(); enterMuseum(); });
  });

  /* ============================================================
     站内打开文章 —— 内容换掉，文档不换
     ------------------------------------------------------------
     博客卡片的 href 是真的 posts/xxx.html。直接点就是「换文档」，
     <audio> 会跟着旧文档一起销毁，音乐必然停 —— 这是「点进文章音乐
     就断」的根因。所以这里把站内点击接管下来：fetch 回文章页，
     只把 .post-wrap 搬进 #spaPost 浮层，地址记成 #/post/xxx.html。
     文档自始至终是同一个，播放器当然一直播。
     真链接一个没动：新标签页 / 中键 / Ctrl+点 / 无脚本访问 / SEO
     全都还是 posts/xxx.html 那个真页面。
     ============================================================ */
  const POST_HREF = /^posts\/[^/?#]+\.html$/i;
  let postUrl = '';          // 浮层里当前这篇（站内相对路径）
  let postPushed = false;    // 这条历史是自己 push 的（false = 直接开链接进来的）
  let postScrollY = 0;       // 进文章前列表滚到哪了
  let backScrollY = null;    // 退回列表时要把滚动位置还回去

  function postOf(a) {
    if (!a || !a.getAttribute) return '';
    const href = a.getAttribute('href') || '';
    return POST_HREF.test(href) ? href : '';
  }

  /* 只收起浮层，不碰路由 —— 给 navigateTo 用，避免两边互相调用 */
  function hidePost() {
    if (!postUrl) return;
    postUrl = '';
    postPushed = false;
    spaPost && spaPost.classList.remove('on');
    body.classList.remove('spa-post-open');
    /* 把滚动位置还给列表：navigateTo 会先把页面滚到顶，所以这里推到
       下一个 tick 再盖回去（behavior:auto 会顶掉那边还在跑的 smooth）。 */
    if (backScrollY != null) {
      const to = backScrollY;
      backScrollY = null;
      setTimeout(() => window.scrollTo({ top: to, behavior: 'auto' }), 0);
    }
    setTimeout(() => {
      if (postUrl || !spaPost) return;        /* 这中间又打开了别的文章 */
      spaPost.hidden = true;
      if (spaPostBody) spaPostBody.textContent = '';
    }, 320);
  }

  function openPost(url, push) {
    if (!spaPost || !spaPostBody) return false;
    if (url === postUrl) return true;

    closeSettings();                          /* 设置抽屉别压在文章上面 */
    hidePost();
    postUrl = url;
    postPushed = push !== false;
    postScrollY = window.pageYOffset || 0;

    spaPost.hidden = false;
    void spaPost.offsetHeight;                /* 先让 hidden 那帧提交过，transition 才会跑 */
    spaPost.classList.add('on');
    body.classList.add('spa-post-open');
    if (spaPostView) spaPostView.scrollTop = 0;
    if (postPushed && history.pushState) {
      history.pushState({ rsp: url }, '', '#/post/' + url.replace(/^posts\//i, ''));
    }

    fetch(url, { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then((text) => {
        if (postUrl !== url) return;           /* fetch 期间切走了 */
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const wrap = doc.querySelector('.post-wrap');
        if (!wrap) throw new Error('没有 .post-wrap');
        spaPostBody.textContent = '';
        spaPostBody.appendChild(document.importNode(wrap, true));
        const t = doc.querySelector('title');
        if (t && t.textContent) document.title = t.textContent;
      })
      .catch(() => { location.href = url; });  /* 取不到就老老实实走真链接 */
    return true;
  }

  /* 浮层里的「回到博客列表」：能退就退回上一条历史（连滚动位置一起还原），
     直接开链接进来的没有上一条，就换成博客分栏。 */
  function closePost() {
    if (!postUrl) return;
    if (postPushed && history.length > 1) {
      backScrollY = postScrollY;
      history.back();
      return;
    }
    hidePost();
    navigateTo('blog', { push: false });
  }

  /* 站内链接接管：文章卡片、浮层里的返回按钮都走这里 */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    /* 浮层内部的「回到博客列表 / 看更多文章」= 收起浮层，不要换文档 */
    if (postUrl && spaPost && spaPost.contains(a)) {
      if (/index\.html(#blog)?$/i.test(a.getAttribute('href') || '')) { e.preventDefault(); closePost(); }
      return;
    }
    const url = postOf(a);
    if (!url) return;
    e.preventDefault();
    openPost(url, true);
  });

  /* ============================================================
     initSettings —— 外观 / 特效 / 关于
     ============================================================ */
  function openSettings() {
    settingsPanel && settingsPanel.classList.add('open');
    settingsMask && settingsMask.classList.add('open');
    /* 遮罩是铺满整屏且吃指针事件的，底下那页还能滚就是明显的错位感
       （手机上尤其明显：手指在遮罩上划，背景内容在动）。
       锁在 <body> 上 —— 滚动容器是 body，锁 <html> 不管用。 */
    body.style.overflow = 'hidden';
    const tab = $('.set-tab.active');
    if (tab && tab.focus) tab.focus({ preventScroll: true });
  }
  function closeSettings() {
    const wasOpen = !!(settingsPanel && settingsPanel.classList.contains('open'));
    settingsPanel && settingsPanel.classList.remove('open');
    settingsMask && settingsMask.classList.remove('open');
    body.style.overflow = '';
    /* 焦点要还回去，否则键盘用户的焦点会掉在一个已经收起来的面板里 */
    const opener = $('.settings-open');
    if (wasOpen && opener && opener.focus) opener.focus({ preventScroll: true });
  }
  $$('.settings-open').forEach((b) => b.addEventListener('click', openSettings));
  $('#settingsClose') && $('#settingsClose').addEventListener('click', closeSettings);
  settingsMask && settingsMask.addEventListener('click', closeSettings);

  $$('.set-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.set-tab').forEach((x) => x.classList.remove('active'));
      $$('.set-pane').forEach((x) => x.classList.remove('active'));
      btn.classList.add('active');
      const pane = $('.set-pane[data-pane="' + btn.dataset.tab + '"]');
      pane && pane.classList.add('active');
    });
  });

  $$('.theme-grid button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.theme || btn.dataset.palette || 'candy';
      withViewTransition(() => {
        if (name === 'night') applyNight(true, true);
        else { state.night = false; applyPalette(PALETTE_OF[name] || name, true); }
      });
      toast('已换上「' + btn.textContent.trim().split('\n')[0] + '」 ✦');
    });
  });

  const hueRange = $('#hueRange');
  if (hueRange) {
    hueRange.value = state.hue;
    hueRange.addEventListener('input', (e) => applyHue(Number(e.target.value) || 0, true));
  }

  $$('.switch').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.setting;
      if (!k) return;                        /* 夜间开关走 toggleTheme，不在这里 */
      state.effects[k] = !state.effects[k];
      store.set('rinsora-effect-' + k, state.effects[k] ? 'on' : 'off');
      applyEffects();
    });
  });
  const nightSwitch = $('#nightSwitch');
  nightSwitch && nightSwitch.addEventListener('click', toggleTheme);

  /* ============================================================
     星尘（真 canvas，不是一堆 ✦）
     ============================================================ */
  starfield = (() => {
    const canvas = $('#starCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let dpr = 1, w = 0, h = 0, raf = 0, dots = [];
    const COLORS = [[255, 150, 194], [255, 213, 127], [195, 178, 255], [159, 225, 210], [154, 206, 255]];
    const rand = (a, b) => Math.random() * (b - a) + a;

    function resize() {
      if (!ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* 桌面 100~140、移动 50~80 —— 按面积插值，宽屏自动多一点 */
      const base = w <= 760 ? 56 : 108;
      const n = Math.round(base + Math.min(32, (w * h) / 40000));
      dots = Array.from({ length: n }, () => ({
        x: rand(0, w), y: rand(0, h),
        vx: rand(-.12, .12), vy: rand(-.10, .10),
        r: rand(.9, 2.4), a: rand(.34, .88),
        phase: rand(0, Math.PI * 2), speed: rand(.004, .012),
        star: Math.random() < .34,
        col: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
    }

    function star(p, pulse) {
      const rr = p.r * (1.2 + pulse * .55);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.phase);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = -Math.PI / 2 + i * Math.PI / 4;
        const rad = i % 2 === 0 ? rr : rr * .35;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(ang) * rad, Math.sin(ang) * rad);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${Math.min(.95, p.a * pulse)})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${Math.min(.6, p.a)})`;
      ctx.fill();
      ctx.restore();
    }

    function frame(t) {
      if (!state.effects.particles || reduceMotion()) { ctx.clearRect(0, 0, w, h); raf = 0; return; }
      ctx.clearRect(0, 0, w, h);
      for (const p of dots) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12; else if (p.y > h + 12) p.y = -12;
        const pulse = .72 + .28 * Math.sin(p.phase + t * p.speed * 60);
        if (p.star) { star(p, pulse); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${Math.min(.82, p.a * pulse)})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},.28)`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (!ctx) return;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (!state.effects.particles || reduceMotion()) { ctx.clearRect(0, 0, w, h); return; }
      raf = requestAnimationFrame(frame);
    }

    /* 特效开关变化时调用：开着就继续跑，关掉就立刻停手（不空转 rAF） */
    function sync() {
      if (!state.effects.particles || reduceMotion()) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (ctx) ctx.clearRect(0, 0, w, h);
      } else if (!raf) {
        start();
      }
    }

    if (ctx) {
      resize();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else start();
      });
      window.addEventListener('resize', () => { resize(); }, { passive: true });
    }
    return { start: ctx ? start : () => {}, sync: ctx ? sync : () => {} };
  })();

  /* ============================================================
     initClock —— 世界时钟
     ------------------------------------------------------------
     今日 / 本周 / 本月 / 今年 四条真实进度（按自然周期算，不是估算）。
     最后更新时间由 latestUpdate() 从博客卡片 ∪ 项目数据的最大日期取；
     一个都没有时回落到今天的日期 —— 绝不显示「Last update —」。
     ============================================================ */
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function pad(n) { return String(n).padStart(2, '0'); }

  /* 某个日期在当年的第几天（用于年进度） */
  function dayOfYear(d) {
    const start = new Date(d.getFullYear(), 0, 1);
    return Math.floor((d - start) / 86400000) + 1;
  }
  function daysInYear(y) {
    return ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 366 : 365;
  }
  /* 本周从周一算起 */
  function weekProgress(now) {
    const dow = (now.getDay() + 6) % 7;                        /* 周一 = 0 */
    const passed = dow * 86400000 + now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000;
    return (passed / (7 * 86400000)) * 100;
  }

  function updateClock() {
    const now = new Date();
    const clock = $('#liveClock'), date = $('#liveDate');
    if (clock) clock.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
    if (date) {
      date.textContent = now.getFullYear() + '.' + pad(now.getMonth() + 1) + '.' + pad(now.getDate()) +
        ' · ' + DAY_NAMES[now.getDay()];
    }

    const dayPct = ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400) * 100;
    const pctOfMonth = ((now.getDate() - 1) * 86400000 +
      (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000) /
      (new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() * 86400000) * 100;
    const yearPct = ((dayOfYear(now) - 1) * 86400000 +
      (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000) /
      (daysInYear(now.getFullYear()) * 86400000) * 100;

    const set = (id, v) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.width = Math.max(0, Math.min(100, v)).toFixed(2) + '%';
      const out = document.getElementById(id + 'Pct');
      if (out) out.textContent = Math.floor(v) + '%';
    };
    set('dayBar', dayPct);
    set('weekBar', weekProgress(now));
    set('monthBar', pctOfMonth);
    set('yearBar', yearPct);

    /* 兼容旧结构（那条单独的今日进度条） */
    const bar = $('#timeProgress'), label = $('#dayPercent');
    if (bar) bar.style.width = dayPct.toFixed(2) + '%';
    if (label) label.textContent = Math.floor(dayPct) + '%';

    /* 世界时钟那句「今天」 */
    const todayLine = $('#todayLine');
    if (todayLine) {
      todayLine.textContent = DAY_NAMES[now.getDay()] + ' · ' + now.getDate() + ' ' + MONTH_NAMES[now.getMonth()];
    }
    const zone = $('#timeZone');
    if (zone && !zone.dataset.done) {
      let tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
      const off = -now.getTimezoneOffset() / 60;
      zone.textContent = (tz ? tz + ' · ' : '') + 'UTC' + (off >= 0 ? '+' : '') + off;
      zone.dataset.done = '1';
    }
  }

  /* ============================================================
     initMoments —— 碎碎念
     ------------------------------------------------------------
     数据在 moments-data.js（window.RINSORA_MOMENTS）。首页 #about 里
     那三条「一点碎碎念」和独立分栏 #moments 读同一份数据，
     不在两处各写一份。
     ============================================================ */
  function momentItems() {
    const raw = window.RINSORA_MOMENTS;
    let list = [];
    if (raw && Array.isArray(raw.items)) list = raw.items.slice();
    if (!list.length) {
      /* 数据文件没加载（手滑删了 / CDN 挂了）时的兜底，不让页面空掉 */
      list = [{ date: '今天', text: '这里会慢慢记下一些小事情 ✦', mood: '✦', tags: [] }];
    }
    return list
      .map((m) => ({
        date: String(m.date || '').trim(),
        text: String(m.text || '').trim(),
        mood: String(m.mood || '✦').trim(),
        tags: Array.isArray(m.tags) ? m.tags.map(String).filter(Boolean) : []
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function renderMoments() {
    const list = momentItems();

    /* --- 独立分栏：时间线 --- */
    const host = $('#momentsGrid');
    if (host) {
      host.innerHTML = list.map((m, i) =>
        '<article class="moment-entry reveal" style="--rd:' + Math.min(i * 70, 420) + 'ms">' +
          '<div class="moment-card card">' +
            '<div class="moment-time"><i>' + esc(m.mood) + '</i>' + esc(m.date) + '</div>' +
            '<p class="moment-body">' + esc(m.text).replace(/\n/g, '<br>') + '</p>' +
            (m.tags.length
              ? '<div class="moment-tags">' + m.tags.map((t) => '<span>' + esc(t) + '</span>').join('') + '</div>'
              : '') +
            '<span class="moment-mood" aria-hidden="true">' + esc(m.mood) + '</span>' +
          '</div>' +
        '</article>').join('');

      const count = $('#momentsCount');
      if (count) count.textContent = list.length;
      const last = $('#momentsLast');
      if (last) last.textContent = list[0] ? list[0].date : '—';
    }

    /* --- 主页的「一点碎碎念」：取最新的三条 --- */
    const teaser = $('#momentsTeaser') || $('#about .moments-grid');
    if (teaser && teaser.id !== 'momentsGrid') {
      teaser.innerHTML = list.slice(0, 3).map((m) =>
        '<article class="moment-card card tilt-card">' +
          '<div class="moment-date">' + esc(m.date) + '</div>' +
          '<p>' + esc(m.text).replace(/\n/g, '<br>') + '</p>' +
          '<span class="moment-icon">' + esc(m.mood) + '</span>' +
        '</article>').join('');
    }
    observeReveal();
  }

  /* ============================================================
     最近发布 / 博客筛选
     ============================================================ */
  function readRecentPosts(limit) {
    return $$('#blog .blog-grid .blog-card').map((card) => {
      const a = $('.card-title-link', card), d = $('.date', card), p = card.querySelector('p');
      if (!a) return null;
      return { title: a.textContent.trim(), href: a.getAttribute('href') || '#', date: d ? d.textContent.trim() : '', desc: p ? p.textContent.trim() : '' };
    }).filter(Boolean).sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit || 3);
  }
  function readRecentProjects(limit) {
    const raw = window.RINSORA_PROJECTS || {};
    const items = Array.isArray(raw.items) ? raw.items.slice() : [];
    const sorter = (window.RinsoraProjects && window.RinsoraProjects.newestFirst) ||
      ((list) => list.sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))));
    return sorter(items).slice(0, limit || 3);
  }
  function latestUpdate() {
    const dates = [];
    $$('#blog .blog-grid .blog-card .date').forEach((x) => dates.push(x.textContent.trim()));
    ((window.RINSORA_PROJECTS || {}).items || []).forEach((x) => { if (x && x.date) dates.push(String(x.date)); });
    /* 碎碎念也算一次更新 —— 只写了碎碎念也是「在做事情」 */
    momentItems().forEach((m) => { if (m.date) dates.push(m.date); });
    dates.sort();
    if (dates.length) return dates[dates.length - 1];
    /* 什么都没写过时用今天，绝不显示「Last update —」 */
    const n = new Date();
    return n.getFullYear() + '.' + pad(n.getMonth() + 1) + '.' + pad(n.getDate());
  }
  function buildRecent() {
    const host = $('#recentFeed');
    if (!host) return;
    const posts = readRecentPosts(3);
    const projects = readRecentProjects(3);
    if (!posts.length && !projects.length) { host.innerHTML = ''; return; }

    /* ⚠️ 每个区块是「recent-grid-wrap > (recent-sub + recent-grid)」两层，
       结尾必须写两个 </div>。少写一个的话浏览器会把第二块解析成第一块的子元素
       （嵌套），于是「博客卡片 → 最新项目线」之间那段间距直接变成 0，
       而 .recent-grid-wrap 的 margin 只作用在整块之后 —— 改 CSS 怎么改都没反应。 */
    let out = '<div class="section-heading fancy-heading"><span>✧</span><h3>最近发布</h3><small>RECENT</small><span class="line"></span></div>';
    if (posts.length) {
      out += '<div class="recent-grid-wrap"><div class="recent-sub"><i></i>最新博客<span class="rt-line"></span></div><div class="recent-grid">' +
        posts.map((p) =>
          '<a class="recent-card" href="' + esc(p.href) + '">' +
            '<span class="rc-kind">BLOG</span>' +
            '<b class="rc-title">' + esc(p.title) + '</b>' +
            '<span class="rc-desc">' + esc(p.desc) + '</span>' +
            '<span class="rc-foot"><span>' + esc(p.date) + '</span><span>READ MORE ↗</span></span>' +
          '</a>').join('') + '</div></div>';
    }
    if (projects.length) {
      out += '<div class="recent-grid-wrap"><div class="recent-sub"><i class="k-proj"></i>最新项目<span class="rt-line"></span></div><div class="recent-grid">' +
        projects.map((p) => {
          const tag = p.url ? 'a' : 'div';
          const attr = p.url ? ' href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer"' : '';
          return '<' + tag + ' class="recent-card"' + attr + '>' +
            '<span class="rc-kind k-proj">PROJECT</span>' +
            '<b class="rc-title">' + esc(p.name || '未命名') + '</b>' +
            '<span class="rc-desc">' + esc(p.desc || '') + '</span>' +
            '<span class="rc-foot"><span>' + esc(p.date || '') + '</span><span>' + (p.url ? 'OPEN ↗' : '') + '</span></span>' +
          '</' + tag + '>';
        }).join('') + '</div></div>';
    }
    host.innerHTML = out;
  }

  function blogCards() { return $$('#blog .blog-grid .blog-card'); }
  function applyBlogFilter(cat) {
    let visible = 0;
    blogCards().forEach((card) => {
      const hit = !cat || (card.dataset.cat || '') === cat;
      card.hidden = !hit;
      if (hit) visible++;
    });
    const empty = $('#blogEmpty');
    if (empty) empty.hidden = visible > 0;
  }
  function buildBlogFilter() {
    const host = $('#blogFilter');
    if (!host) return;
    const cats = Array.from(new Set(blogCards().map((c) => (c.dataset.cat || '').trim()).filter(Boolean)));
    if (cats.length < 2) { host.innerHTML = ''; applyBlogFilter(''); return; }
    host.innerHTML = ['全部'].concat(cats).map((c, i) =>
      '<button class="bf-chip' + (i === 0 ? ' active' : '') + '" type="button" data-cat="' + esc(i ? c : '') + '">' + esc(c) + '</button>'
    ).join('');
    /* 事件委托：筛选条会随着新文章重新渲染，绑在 host 上才不会失效 */
    host.onclick = (e) => {
      const btn = e.target.closest('.bf-chip');
      if (!btn) return;
      $$('.bf-chip', host).forEach((x) => x.classList.remove('active'));
      btn.classList.add('active');
      applyBlogFilter(btn.dataset.cat || '');
    };
    applyBlogFilter('');
  }

  /* ============================================================
     initReveal —— 滚动进场（IntersectionObserver）
     ------------------------------------------------------------
     只有「当前不在视口里」的元素才加 .reveal（也就是才隐藏）。
     已经在首屏内的元素直接标 .in，从来不会被隐藏 ——
     这样即便 IO 完全不回调，首屏也一定是可见的。
     另外还有一条 1.2s 的兜底：到点把所有还没 .in 的都补上。
     ============================================================ */
  let revealIO = null;
  function observeReveal() {
    if (reduceMotion() || !('IntersectionObserver' in window)) return;
    if (!body.classList.contains('fx-reveal')) body.classList.add('fx-reveal');

    if (!revealIO) {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          revealIO.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    }

    const vh = innerHeight || 800;
    $$('.reveal:not(.in)').forEach((el) => {
      if (el.dataset.rv) return;
      el.dataset.rv = '1';
      const r = el.getBoundingClientRect();
      /* 首屏（含一点余量）内的不藏，直接算「已进场」 */
      if (r.top < vh * 1.15 && r.bottom > -40) {
        el.classList.add('in');
        return;
      }
      revealIO.observe(el);
    });

    clearTimeout(observeReveal._t);
    observeReveal._t = setTimeout(() => {
      $$('.reveal:not(.in)').forEach((el) => el.classList.add('in'));
    }, 1400);
  }

  /* ============================================================
     initEffects —— 鼠标：卡片倾斜 / 光晕 / 涟漪 / 心形爆开
     ============================================================ */
  const cursorDot = $('#cursorDot'), cursorRing = $('#cursorRing'), ambientGlow = $('#ambientGlow');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  let glowX = mx, glowY = my;
  let hoverCard = null;

  document.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (cursorDot) { cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; }

    /* 卡片倾斜：只写两个比例变量（-0.5 ~ 0.5），角度在 CSS 里算。
       这样「调手感」是改 CSS 的 --tilt-* ，不用动 JS。 */
    if (state.effects.tilt && !reduceMotion() && e.pointerType !== 'touch') {
      const card = e.target.closest && e.target.closest('.tilt-card');
      if (card) {
        const r = card.getBoundingClientRect();
        if (r.width && r.height) {
          card.style.setProperty('--tx', (((e.clientX - r.left) / r.width) - .5).toFixed(3));
          card.style.setProperty('--ty', (((e.clientY - r.top) / r.height) - .5).toFixed(3));
          hoverCard = card;
          return;
        }
      }
    }
    if (hoverCard) {
      hoverCard.style.removeProperty('--tx');
      hoverCard.style.removeProperty('--ty');
      hoverCard = null;
    }
  }, { passive: true });

  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest && e.target.closest('.tilt-card');
    if (!card) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    card.style.removeProperty('--tx');
    card.style.removeProperty('--ty');
    if (hoverCard === card) hoverCard = null;
  }, { passive: true });

  /* 光标环 + 环境光晕都用「目标点 → 缓动跟随」，mousemove 里不直接改 DOM */
  (function cursorLoop() {
    rx += (mx - rx) * .18;
    ry += (my - ry) * .18;
    glowX += (mx - glowX) * .07;
    glowY += (my - glowY) * .07;
    if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
    if (ambientGlow) { ambientGlow.style.left = glowX + 'px'; ambientGlow.style.top = glowY + 'px'; }
    requestAnimationFrame(cursorLoop);
  })();

  document.addEventListener('pointerover', (e) => {
    if (e.target.closest && e.target.closest('a,button,.card,.mp-btn,.mp-disc,.avatar-button,.radial-item,.bf-chip,input,textarea,select')) {
      body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest && e.target.closest('a,button,.card,.mp-btn,.mp-disc,.avatar-button,.radial-item,.bf-chip,input,textarea,select')) {
      body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (!state.effects.ripple || reduceMotion() || e.button !== 0) return;
    if (e.target.closest && e.target.closest('input,textarea,select')) return;

    const el = document.createElement('span');
    el.className = 'click-ripple';
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    body.appendChild(el);
    setTimeout(() => el.remove(), 650);

    /* 心形小爆开：6 个粒子、620ms 生命，不是拖尾 */
    if (!body.classList.contains('cursor-on')) return;
    for (let i = 0; i < 6; i++) {
      const sp = document.createElement('span');
      sp.className = 'cursor-burst';
      sp.textContent = i % 2 ? '♡' : '✦';
      const ang = (i / 6) * Math.PI * 2 + Math.random() * .5;
      const dist = 22 + Math.random() * 16;
      sp.style.setProperty('--bx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      sp.style.setProperty('--by', (Math.sin(ang) * dist).toFixed(1) + 'px');
      sp.style.left = e.clientX + 'px';
      sp.style.top = e.clientY + 'px';
      sp.style.animationDelay = (i * 18) + 'ms';
      body.appendChild(sp);
      setTimeout(() => sp.remove(), 800);
    }
  }, { passive: true });

  /* ============================================================
     提示条 / 键盘 / 无障碍
     ============================================================ */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'blog-toast';
      body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.className = 'blog-toast show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.className = 'blog-toast'; }, 2400);
  }

  /* 侧栏联系方式：GitHub / Bilibili 是真实 <a>（新标签打开，不用 JS），
     QQ / 邮箱走剪贴板复制 + toast 反馈。 */
  function copyText(text, label) {
    const ok = () => toast('已复制' + label + '：' + text);
    const no = () => toast('复制失败，请手动复制：' + text);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(no);
      return;
    }
    /* 旧浏览器 / 非安全上下文 fallback：textarea + execCommand */
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-999px;opacity:0';
      body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const done = document.execCommand('copy');
      body.removeChild(ta);
      done ? ok() : no();
    } catch (e) { no(); }
  }
  $$('.side-link[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => copyText(btn.dataset.copy, btn.dataset.label || ''));
  });

  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSettings(); return; }
    if (e.key === 'Escape') {
      /* Escape 的收口顺序：
         音乐博物馆 → 文章浮层 → 设置抽屉 → 导航 → 添加音乐弹窗。
         博物馆排最前：它是「最外面那一层」，Esc 应该先退它。
         两边都幂等，误调不会出事。 */
      if (AppState.museumOpen || (window.RinsoraMuseum && window.RinsoraMuseum.isOpen())) {
        exitMuseum();
        return;
      }
      if (postUrl) { closePost(); return; }
      closeSettings();
      closeNav(true);
      if (window.RinsoraMusicUpload && window.RinsoraMusicUpload.close) window.RinsoraMusicUpload.close();
      return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '1') navigateTo('about');
    if (e.key === '2') navigateTo('blog');
    if (e.key === '3') navigateTo('projects');
    if (e.key === '4') navigateTo('moments');
  });

  /* 设置抽屉打开时把焦点送进去，关上时还回来 —— 键盘用户不用盲找 */
  let lastFocus = null;
  function focusTrapGuard() {
    const on = settingsPanel && settingsPanel.classList.contains('open');
    if (on && !lastFocus) {
      lastFocus = document.activeElement;
      const close = $('#settingsClose');
      close && close.focus && close.focus();
    } else if (!on && lastFocus) {
      lastFocus.focus && lastFocus.focus();
      lastFocus = null;
    }
  }
  document.addEventListener('transitionend', focusTrapGuard, true);

  /* ============================================================
     initPageTransitions —— 跨文档转场
     ------------------------------------------------------------
     站内看文章走的是 #spaPost 浮层（不换文档）。真正会换文档的是：
       · 从文章页点「回到博客列表」→ index.html#blog
       · 文章之间互跳 / 直接打开某篇
       · 进后台页（editor / project-editor）
     这些没法不刷新，但可以把「白屏那一瞬」盖住：
     点下去 → 遮罩淡入（200ms）→ 真正跳转；
     新文档 <head> 里的内联脚本看到 sessionStorage 标记后挂 data-enter，
     由一条纯 CSS 动画把遮罩掀开（万一脚本没跑，fill:forwards 也会掀）。
     ============================================================ */
  const NAV_FLAG = 'rinsora-nav';
  function initPageTransitions() {
    /* 本页已经接管过就别重复绑 */
    if (html.dataset.navReady) return;
    html.dataset.navReady = '1';

    /* ⚠️ 这里**必须是冒泡阶段**，不能用捕获（第三个参数传 true 会踩坑）：
       文章浮层那套（openPost / closePost）是在 document 的冒泡监听里做的，
       而它注册得更早。挂捕获就会**抢在浮层之前**执行 —— 浮层里
       「回到博客列表」的 href 是 `../index.html#blog`，按「跨文档链接」
       一处理就把页面真的导航走了：<audio> 被销毁、音乐断掉，
       正好把浮层存在的意义抹掉（探针 ① 就是被这个打红的）。
       冒泡阶段 + 依赖 e.defaultPrevented，顺序就永远是确定的：
       浮层先处理，处理掉的自会 preventDefault，这里直接放行。 */
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      /* 兜底：浮层打开时，浮层内部的一切链接都归浮层管 */
      if (postUrl && spaPost && spaPost.contains(a)) return;
      const href = a.getAttribute('href') || '';
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;
      if (a.dataset.noSwup != null) return;                     /* 显式排除 */
      /* 站内文章已经由浮层接管，这里不再插手 */
      if (POST_HREF.test(href)) return;

      let target;
      try { target = new URL(a.href, location.href); } catch (err) { return; }
      if (target.origin !== location.origin) return;
      /* 同页只换 hash 的链接交给 hash 路由，不要遮罩 */
      if (target.pathname === location.pathname && target.hash) return;
      /* 文章页之间互跳：交给浮层的那条会走不到这里，剩下的才做遮罩 */
      if (reduceMotion()) return;

      e.preventDefault();
      session.set(NAV_FLAG, target.pathname);                    /* 给下一个文档留标记 */
      const cover = $('#pageCover');
      if (cover) cover.classList.add('on');
      setTimeout(() => { location.href = target.href; }, 210);
    });
  }

  /* ============================================================
     initA11y / initPage
     ============================================================ */
  /* 底栏 / 扇形导航都带 aria-current，读屏软件能报「当前在哪一栏」。
     写成独立函数（而不是关在 initA11y 里）是因为 navigateTo 也要调它 ——
     否则只有「鼠标点的」那次会更新，程序化切换（深链、后退、
     代码调用 API）之后 aria-current 会一直停在上一栏。
     函数声明会提升，navigateTo 里可以放心先引用。 */
  function syncA11y(page) {
    $$('.radial-item,.mobile-nav button').forEach((b) => {
      if (b.dataset.target === page) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  }

  function initA11y() {
    syncA11y(AppState.currentPage);
    document.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('.radial-item,.mobile-nav button');
      if (b) syncA11y(b.dataset.target);
    });
    /* 侧栏头像本身是个按钮，把状态说清楚 */
    if (avatarButton) {
      avatarButton.setAttribute('aria-expanded', 'false');
      navWrap && navWrap.addEventListener('mouseenter', () => avatarButton.setAttribute('aria-expanded', 'true'));
      navWrap && navWrap.addEventListener('mouseleave', () => avatarButton.setAttribute('aria-expanded', 'false'));
      avatarButton.addEventListener('click', () => {
        avatarButton.setAttribute('aria-expanded', navWrap.classList.contains('open') ? 'true' : 'false');
      });
    }
  }

  /* 页面级初始化：跨文档转场后（如果将来改成不刷新）也要能重跑一遍 */
  function initPage() {
    renderMoments();
    buildRecent();
    buildBlogFilter();
    updateClock();
    applyEffects();
    layoutRadialNav();
    observeReveal();
    const n = $('#nowUpdate');
    if (n) n.textContent = latestUpdate();
  }

  /* ============================================================
     对外接口 + 启动
     ============================================================ */
  window.RinsoraHome = {
    AppState,
    navigateTo,
    initPage,
    initApp,
    observeReveal,
    refreshRecent() {
      buildRecent();
      const n = $('#nowUpdate');
      if (n) n.textContent = latestUpdate();
      observeReveal();
    },
    refreshBlogFilter: buildBlogFilter,
    refreshMoments: renderMoments,
    layoutRadialNav,
    /* 扇形导航的展开 / 收起。暴露出来是为了让回归装置能走**真实入口** ——
       直接 classList.add('open') 会被别的路径挂上的 .nav-closed 压住
       （两条规则特异性相同、.nav-closed 写在后面），量出来还是收起态。 */
    openNav: () => openNav(true),
    closeNav: (soft) => closeNav(soft !== false),
    /* 音乐博物馆：入口在 script.js，场景在 music-museum.js。
       暴露出来是为了让回归装置能走**真实入口**，而不是直接改类名。 */
    enterMuseum,
    exitMuseum,
    showSection,
    enterApp,
    openSettings,
    closeSettings,
    setPalette: (p) => applyPalette(p, true),
    setTheme: (name) => {
      if (name === 'night') applyNight(true, true);
      else { state.night = false; applyPalette(PALETTE_OF[name] || name, true); }
    },
    setNight: (n) => applyNight(!!n, true),
    setEffect(k, on) {
      if (!(k in state.effects)) return;
      state.effects[k] = !!on;
      store.set('rinsora-effect-' + k, on ? 'on' : 'off');
      applyEffects();
    },
    state
  };

  /* ============================================================
     initApp —— 唯一的启动入口
     ------------------------------------------------------------
     顺序是有讲究的，别随手调换：

       1) 主题先落定      —— 首帧那份在 head 的内联脚本里跑，这里同步 JS 侧
                            状态（设置面板高亮、meta theme-color 等）
       2) 常驻 UI         —— 扇形导航布局 / 无障碍 / 时钟
       3) initPage()      内容层：最近发布 / 博客筛选 / 项目树 / Moments
       4) 动效层          —— 滚动进场 + 跨文档转场
       5) 深链兜底        —— 带 hash 进来时延后一点再路由，别和开屏抢帧

     这里**不放**任何「每次换页都要重做」的事 —— 那些归 initPage()。
     浏览器前进 / 后退走的是 hashchange → routeHash() → navigateTo()，
     不会重跑 initApp()，所以播放器 / 头像 / 主题这些常驻 UI 不会被重建
     （这正是「音乐不会因为翻页而断」的结构性保证）。
     ============================================================ */
  function initApp() {
    /* 1) 主题 */
    applyTheme(false);
    applyHue(state.hue, false);

    /* 2) 常驻 UI */
    layoutRadialNav();
    initA11y();
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(() => {
      /* 「最后更新」不用每秒算，但也不能只在加载时算一次 —— 每 60s 校一次，
         站长刚发完文章切回来就能看到数字变了。 */
      const n = $('#nowUpdate');
      if (n) n.textContent = latestUpdate();
    }, 60000);

    /* 3) 内容层 */
    initPage();

    /* 4) 动效层 */
    observeReveal();
    initPageTransitions();

    /* 5) 字体换完再量一次导航，否则字体落位后扇形会偏 */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => layoutRadialNav()).catch(() => {});
    }
    window.addEventListener('resize', () => layoutRadialNav(), { passive: true });

    /* 6) 深链兜底 */
    if (location.hash) setTimeout(routeHash, 50);
  }

  initApp();
})();
