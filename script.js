/* ============================================================
   空凛 · Rinsora 的小窝 —— 首页交互
   ------------------------------------------------------------
   这一份脚本负责「界面层」，不碰任何数据层：
     · 开屏进度
     · 主题（调色板 × 明暗）、夜间切换的圆形扩散过渡
     · 进入小窝：头像飞入左侧 + 右下播放器向上淡入
     · 径向导航 / 移动端导航 / hash 路由
     · 外观设置抽屉（配色、色相、特效开关）
     · 星尘 canvas、鼠标光晕、卡片倾斜、点击涟漪
     · 时钟、碎碎念、最近发布、博客分类筛选

   播放器（音乐 + 歌词栏）由 music.js 负责；
   项目树由 projects.js 负责；添加音乐弹窗由 music-upload.js 负责。
   这里只暴露 window.RinsoraHome 给它们回调。
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
  const reduceMotion = () => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  };
  const rAF2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

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
  const themeBtn = $('#themeBtn');
  const themeLabel = $('#themeLabel');
  const settingsPanel = $('#settingsPanel');
  const settingsMask = $('#settingsMask');
  const pageProgress = $('#pageProgress');
  const boot = $('#bootScreen');
  /* 站内看文章的浮层（不换文档 → 音乐不断），逻辑见下面「站内打开文章」一节 */
  const spaPost = $('#spaPost');
  const spaPostView = $('#spaPostView');
  const spaPostBody = $('#spaPostBody');

  const PALETTES = ['candy', 'sunset', 'lilac', 'mint'];

  /* ---------------------------------------------------- 状态 ---- */
  const state = {
    section: 'about',
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
      ripple: store.get('rinsora-effect-ripple', 'on') !== 'off'
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

  /* 走直达链接（#about / #blog / #projects）进来时，开屏加载页整段跳过：
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
     主题：调色板（配色）× 明暗（白天 / 夜间），两者独立
     ============================================================ */
  function applyPalette(name, persist) {
    const next = PALETTES.indexOf(name) === -1 ? 'candy' : name;
    PALETTES.forEach((p) => {
      const cls = 'pal-' + p;
      html.classList.toggle(cls, p === next);
      body.classList.toggle(cls, p === next);
    });
    $$('.theme-grid button').forEach((b) => b.classList.toggle('active', b.dataset.palette === next));
    if (persist) { state.palette = next; store.set('rinsora-palette', next); }
  }

  function applyNight(night, persist) {
    html.classList.toggle('night', night);
    body.classList.toggle('night', night);
    if (themeLabel) themeLabel.textContent = night ? '日间模式' : '夜间模式';
    if (themeBtn) themeBtn.title = night ? '切换日间模式' : '切换夜间模式';
    const ns = $('#nightSwitch');
    if (ns) ns.classList.toggle('on', night);
    if (persist) { state.night = night; store.set('rinsora-theme', night ? 'night' : 'light'); }
  }

  function applyHue(deg, persist) {
    html.style.setProperty('--hue', deg + 'deg');
    const out = $('#hueValue');
    if (out) out.textContent = (deg > 0 ? '+' : '') + deg + '°';
    if (persist) { state.hue = deg; store.set('rinsora-hue', deg); }
  }

  /* 夜间切换：从按钮位置扩散一个圆，把新配色「揭」出来。
     ① 更新回调里等两帧再 resolve —— 浏览器是等回调 resolve 之后才拍
        「新」快照的，太快 resolve 会拍到毛玻璃还没按新配色重新合成的
        那一帧，看起来就像「毛玻璃先消失 → 变色 → 毛玻璃再回来」。
     ② 外面再挂一个定时器兜底：万一某个环境里视图过渡的回调根本没执行
        （无头 / 虚拟时间的浏览器就是这样），至少主题要切过去。 */
  function toggleTheme() {
    const next = !state.night;
    if (!document.startViewTransition || reduceMotion()) { applyNight(next, true); return; }

    const r = themeBtn ? themeBtn.getBoundingClientRect() : null;
    const x = r ? r.left + r.width / 2 : innerWidth / 2;
    const y = r ? r.top + r.height / 2 : 0;
    const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 30;

    let applied = false;
    const once = () => { if (!applied) { applied = true; applyNight(next, true); } };

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
  themeBtn && themeBtn.addEventListener('click', toggleTheme);

  /* 初始化主题（不写存储，只把已存的读出来套上） */
  applyPalette(state.palette, false);
  applyNight(state.night, false);
  applyHue(state.hue, false);

  /* ============================================================
     进度条颜色 / 特效开关
     ============================================================ */
  function applyEffects() {
    const fx = state.effects;
    body.classList.toggle('no-particles', !fx.particles);
    body.classList.toggle('no-ripple', !fx.ripple);
    body.classList.toggle('no-tilt', !fx.tilt);
    body.classList.toggle('cursor-on', fx.cursor && !reduceMotion());
    /* 只同步「特效开关」，夜间那个 .switch 没有 data-setting，不归这里管 */
    $$('.switch').forEach((b) => {
      if (b.dataset.setting) b.classList.toggle('on', !!fx[b.dataset.setting]);
    });
  }

  /* ============================================================
     进入小窝
     ------------------------------------------------------------
     目标位置必须先量准。侧栏是 position:fixed，而 .app 不能带
     transform，否则它的定位基准会从「视口」变成 .app 本身 ——
     实测那会把整个侧栏推到首屏下面，头像于是往左下角飞。
     ============================================================ */
  function flyAvatar() {
    if (reduceMotion()) return false;
    const from = $('.avatar-glass .avatar-large', welcome) || $('.avatar-large', welcome);
    const to = $('.avatar-sidebar', app);
    if (!from || !to) return false;

    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    if (!a.width || !b.width) return false;

    const cx1 = a.left + a.width / 2, cy1 = a.top + a.height / 2;
    const cx2 = b.left + b.width / 2, cy2 = b.top + b.height / 2;
    const dx = cx2 - cx1, dy = cy2 - cy1;
    const scale = b.width / a.width;              /* 145px → 132px ≈ .91 */
    const lift = Math.min(48, Math.abs(dx) * .07); /* 中段轻轻上扬，看起来是「飞」而不是「滑」 */

    const clone = from.cloneNode(true);
    clone.removeAttribute('id');
    clone.className = 'avatar-flight';
    clone.style.left = a.left + 'px';
    clone.style.top = a.top + 'px';
    clone.style.width = a.width + 'px';
    clone.style.height = a.height + 'px';
    app.before(clone);                            /* 挂在 .app 之前，层级自然在欢迎页之上 */

    const glowSize = Math.max(a.width * 1.8, 200);
    const glow = document.createElement('div');
    glow.className = 'avatar-flight-glow';
    glow.style.cssText += `width:${glowSize}px;height:${glowSize}px;left:${cx1 - glowSize / 2}px;top:${cy1 - glowSize / 2}px`;
    app.before(glow);

    from.style.opacity = '0';
    to.style.opacity = '0';

    const anim = clone.animate([
      { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
      { transform: `translate3d(${dx * .34}px,${dy * .52 - lift}px,0) scale(1.09)`, opacity: 1, offset: .44 },
      { transform: `translate3d(${dx}px,${dy}px,0) scale(${scale})`, opacity: 1 }
    ], { duration: 960, easing: 'cubic-bezier(.42,.02,.22,1)', fill: 'forwards' });

    glow.animate([
      { transform: 'translate3d(0,0,0) scale(.7)', opacity: .8 },
      { transform: `translate3d(${dx * .45}px,${dy * .4 - lift * .6}px,0) scale(1.05)`, opacity: .42 },
      { transform: `translate3d(${dx}px,${dy}px,0) scale(.6)`, opacity: 0 }
    ], { duration: 960, easing: 'cubic-bezier(.42,.02,.22,1)', fill: 'forwards' });

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clone.remove();
      glow.remove();
      from.style.opacity = '';
      to.style.opacity = '';
      to.classList.remove('arriving');
      void to.offsetWidth;                        /* 强制重排，动画才会从 0 开始 */
      to.classList.add('arriving');
      setTimeout(() => to.classList.remove('arriving'), 720);
    };
    /* 收尾必须有一条「无条件」路径：动画的 finished 在页面被切到后台、
       或浏览器对 WAAPI 降频时可能永远不 resolve，那样 to.style.opacity
       会永远停在 0 —— 侧栏头像就彻底看不见了。finish 自身幂等，兜底无害。 */
    try { anim.finished.then(finish).catch(finish); } catch (e) { /* 老浏览器没有 finished */ }
    setTimeout(finish, 1080);
    return true;
  }

  let entered = false;
  function enterApp(instant) {
    if (entered) return;
    entered = true;
    try { window.RinsoraMusic && window.RinsoraMusic.collapse && window.RinsoraMusic.collapse(); } catch (e) {}

    const flying = !instant && flyAvatar();
    if (!flying && !instant) {
      const to = $('.avatar-sidebar', app);
      if (to) { to.style.opacity = ''; }
    }

    if (landingPlayer) landingPlayer.classList.add('exit');
    if (welcome) { welcome.classList.add('hidden'); welcome.setAttribute('aria-hidden', 'true'); }
    if (enterBtn) { enterBtn.disabled = true; enterBtn.setAttribute('aria-disabled', 'true'); }
    if (app) app.classList.add('visible');

    /* 右下播放器的淡入：必须等 .visible 这一帧真的提交过再切，
       然后隔一个定时器 + 双 rAF —— 同一帧里改两次类名会被合并，
       transition 不会触发，表现就是「直接出现」而不是「向上淡入」。 */
    if (floatingPlayer) {
      void floatingPlayer.offsetHeight;
      const at = instant ? 60 : (flying ? 700 : 220);
      setTimeout(() => {
        rAF2(() => floatingPlayer.classList.add('visible'));
      }, at);
      /* 同上：双 rAF 是为了「先让 .visible 那一帧提交过」，但如果 rAF 被
         节流（后台标签页 / 无头渲染）就永远等不到 —— 补一条定时兜底，
         保证最终一定会淡入，而不是一直停在 opacity:0。 */
      setTimeout(() => floatingPlayer.classList.add('visible'), at + 260);
    }
  }
  enterBtn && enterBtn.addEventListener('click', () => enterApp(false));

  /* ============================================================
     导航
     ============================================================ */
  const TITLES = { about: '主页', blog: '博客 / 随笔', projects: '项目' };
  const WIDTHS = { about: 33, blog: 66, projects: 100 };

  function showSection(id, push) {
    if (!TITLES[id]) id = 'about';
    hidePost();                                   /* 切分栏 = 退出文章浮层（浏览器后退也走这里） */
    html.removeAttribute('data-pre-section');     /* 首帧那层 CSS 兜底到此交班 */
    state.section = id;
    $$('.page-section').forEach((s) => s.classList.toggle('active', s.id === id));
    $$('.radial-item').forEach((b) => b.classList.toggle('active', b.dataset.target === id));
    $$('.mobile-nav button').forEach((b) => b.classList.toggle('active', b.dataset.target === id));
    const title = $('#sectionTitle');
    if (title) title.textContent = TITLES[id];
    if (pageProgress) pageProgress.style.width = (WIDTHS[id] || 33) + '%';
    document.title = TITLES[id] + ' · 空凛 · Rinsora 的小窝';
    if (push !== false && history.replaceState) history.replaceState(null, '', '#' + id);
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  $$('.radial-item,.mobile-nav button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSection(btn.dataset.target);
      closeNav();
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

  /* 直达链接：#about / #blog / #projects 直接跳过欢迎页，
     #/post/xxx.html 直达某一篇文章（站内打开的地址形式），
     #admin / #write / #editor / #project 跳后台页 */
  function routeHash() {
    const raw = (location.hash || '').replace(/^#/, '');
    const h = raw.toLowerCase();
    if (h === 'admin' || h === 'write' || h === 'editor') { location.href = 'editor.html'; return true; }
    if (h === 'project' || h === 'newproject') { location.href = 'project-editor.html'; return true; }
    /* 文章：先落回博客分栏（首帧 CSS 已经把欢迎页按住了），再盖上浮层 */
    const pm = /^\/post\/([^/?#]+\.html)$/i.exec(raw);
    if (pm) {
      skipBoot(); enterApp(true); showSection('blog', false);
      openPost('posts/' + pm[1], false);
      return true;
    }
    if (TITLES[h]) { skipBoot(); enterApp(true); showSection(h, false); return true; }
    return false;
  }
  window.addEventListener('hashchange', () => {
    /* 没命中任何路由也要把浮层收掉：从「主页」的最近发布点进文章时，
       进站时的 hash 本来就是空的，后退回来只会把 hash 清掉，
       不在这里收就永远卡在文章上。 */
    if (!routeHash()) hidePost();
  });

  /* ============================================================
     站内打开文章 —— 内容换掉，文档不换
     ------------------------------------------------------------
     博客卡片的 href 是真的 posts/xxx.html。直接点就是「换文档」，
     <audio> 会跟着旧文档一起销毁，音乐必然停 —— 这是「点进文章音乐
     就断」的根因，靠调音量/续播都绕不过去。所以这里把站内点击接管
     下来：fetch 回文章页，只把 .post-wrap 搬进 #spaPost 浮层，
     地址记成 #/post/xxx.html。文档自始至终是同一个，播放器当然一直播。
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

  /* 只收起浮层，不碰路由 —— 给 showSection 用，避免两边互相调用 */
  function hidePost() {
    if (!postUrl) return;
    postUrl = '';
    postPushed = false;
    spaPost && spaPost.classList.remove('on');
    body.classList.remove('spa-post-open');
    /* 把滚动位置还给列表：showSection 会先把页面滚到顶，所以这里推到
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
      .then((html) => {
        if (postUrl !== url) return;           /* fetch 期间切走了 */
        const doc = new DOMParser().parseFromString(html, 'text/html');
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
    showSection('blog', false);
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
     外观设置抽屉
     ============================================================ */
  function openSettings() {
    settingsPanel && settingsPanel.classList.add('open');
    settingsMask && settingsMask.classList.add('open');
  }
  function closeSettings() {
    settingsPanel && settingsPanel.classList.remove('open');
    settingsMask && settingsMask.classList.remove('open');
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
      applyPalette(btn.dataset.palette, true);
      toast('已换上「' + btn.textContent.trim() + '」 ✦');
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
      if (k === 'particles') starfield.start();
    });
  });
  const nightSwitch = $('#nightSwitch');
  nightSwitch && nightSwitch.addEventListener('click', toggleTheme);
  applyEffects();

  /* ============================================================
     星尘（真 canvas，不是一堆 ✦）
     ============================================================ */
  const starfield = (() => {
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
      const n = w <= 760 ? 60 : 110;
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

    if (ctx) {
      resize();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else start();
      });
      window.addEventListener('resize', () => { resize(); }, { passive: true });
    }
    return { start: ctx ? start : () => {} };
  })();
  starfield.start();

  /* ============================================================
     时钟 / 碎碎念 / 最近发布
     ============================================================ */
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function pad(n) { return String(n).padStart(2, '0'); }
  function updateClock() {
    const now = new Date();
    const clock = $('#liveClock'), date = $('#liveDate');
    if (clock) clock.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
    if (date) {
      date.textContent = now.getFullYear() + '.' + pad(now.getMonth() + 1) + '.' + pad(now.getDate()) +
        ' · ' + DAY_NAMES[now.getDay()];
    }
    const pct = ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400) * 100;
    const bar = $('#timeProgress'), label = $('#dayPercent');
    if (bar) bar.style.width = pct.toFixed(2) + '%';
    if (label) label.textContent = Math.floor(pct) + '%';
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* 碎碎念：直接改这个数组就行，越靠前越新 */
  const MOMENTS = [
    ['2026.09.22', '终于把小窝的 V2 认真规划起来了。现在开始研究，怎么把「网页」做得像一间房间。', '🌸'],
    ['2026.09.21', '又折腾了一晚上 AI Agent。很多东西其实没那么有用，但做出来的时候总是很开心。', '🤖'],
    ['2026.09.10', 'Minecraft 服务器又出现了新的问题。嗯……很正常。', '⛏']
  ];
  (function renderMoments() {
    const host = $('#momentsGrid');
    if (!host) return;
    host.innerHTML = MOMENTS.map((m) =>
      '<article class="moment-card card tilt-card">' +
        '<div class="moment-date">' + m[0] + '</div>' +
        '<p>' + esc(m[1]) + '</p>' +
        '<span class="moment-icon">' + m[2] + '</span>' +
      '</article>'
    ).join('');
  })();

  /* 最近发布：博客直接从首页卡片里读（不另存一份数据），项目读 RINSORA_PROJECTS */
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
    dates.sort();
    return dates.length ? dates[dates.length - 1] : '';
  }
  function buildRecent() {
    const host = $('#recentFeed');
    if (!host) return;
    const posts = readRecentPosts(3);
    const projects = readRecentProjects(3);
    if (!posts.length && !projects.length) { host.innerHTML = ''; return; }

    let out = '<div class="section-heading fancy-heading"><span>✧</span><h3>最近发布</h3><small>RECENT</small><span class="line"></span></div>';
    if (posts.length) {
      out += '<div class="recent-grid-wrap"><div class="recent-sub"><i></i>最新博客<span class="rt-line"></span></div><div class="recent-grid">' +
        posts.map((p) =>
          '<a class="recent-card" href="' + esc(p.href) + '">' +
            '<span class="rc-kind">BLOG</span>' +
            '<b class="rc-title">' + esc(p.title) + '</b>' +
            '<span class="rc-desc">' + esc(p.desc) + '</span>' +
            '<span class="rc-foot"><span>' + esc(p.date) + '</span><span>READ MORE ↗</span></span>' +
          '</a>').join('') + '</div>';
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
        }).join('') + '</div>';
    }
    host.innerHTML = out;
  }
  buildRecent();

  /* ============================================================
     博客分类筛选（分类从卡片上收集，加文章只要卡片带 data-cat）
     ============================================================ */
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
    if (cats.length < 2) { host.innerHTML = ''; return; }
    host.innerHTML = ['全部'].concat(cats).map((c, i) =>
      '<button class="bf-chip' + (i === 0 ? ' active' : '') + '" type="button" data-cat="' + esc(i ? c : '') + '">' + esc(c) + '</button>'
    ).join('');
    host.onclick = (e) => {
      const btn = e.target.closest('.bf-chip');
      if (!btn) return;
      $$('.bf-chip', host).forEach((x) => x.classList.remove('active'));
      btn.classList.add('active');
      applyBlogFilter(btn.dataset.cat || '');
    };
    applyBlogFilter('');
  }
  buildBlogFilter();

  /* ============================================================
     鼠标：卡片倾斜 / 光晕 / 涟漪
     ============================================================ */
  const cursorDot = $('#cursorDot'), cursorRing = $('#cursorRing'), ambientGlow = $('#ambientGlow');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  document.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (cursorDot) { cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; }
    if (ambientGlow) { ambientGlow.style.left = mx + 'px'; ambientGlow.style.top = my + 'px'; }

    const card = e.target.closest && e.target.closest('.tilt-card');
    if (card && state.effects.tilt && !reduceMotion() && e.pointerType !== 'touch') {
      const r = card.getBoundingClientRect();
      if (r.width && r.height) {
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(900px) rotateX(' + (-py * 3.4).toFixed(2) + 'deg) rotateY(' + (px * 4.2).toFixed(2) + 'deg) translateY(-3px)';
      }
    }
  }, { passive: true });

  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest && e.target.closest('.tilt-card');
    if (!card) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    card.style.transform = '';
  }, { passive: true });

  (function cursorLoop() {
    rx += (mx - rx) * .18;
    ry += (my - ry) * .18;
    if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
    requestAnimationFrame(cursorLoop);
  })();

  document.addEventListener('pointerover', (e) => {
    if (e.target.closest && e.target.closest('a,button,.card,.mp-btn,.mp-disc,.avatar-button,.radial-item,.bf-chip')) {
      body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest && e.target.closest('a,button,.card,.mp-btn,.mp-disc,.avatar-button,.radial-item,.bf-chip')) {
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
  }, { passive: true });

  /* ============================================================
     提示条 / 键盘
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

  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSettings(); return; }
    if (e.key === 'Escape') {
      closeSettings();
      if (window.RinsoraMusicUpload && window.RinsoraMusicUpload.close) window.RinsoraMusicUpload.close();
      return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '1') showSection('about');
    if (e.key === '2') showSection('blog');
    if (e.key === '3') showSection('projects');
  });

  /* ============================================================
     对外接口 + 初始化
     ============================================================ */
  window.RinsoraHome = {
    refreshRecent() {
      buildRecent();
      const n = $('#nowUpdate');
      if (n) n.textContent = latestUpdate() || '—';
    },
    refreshBlogFilter: buildBlogFilter,
    showSection,
    enterApp,
    openSettings,
    closeSettings,
    setPalette: (p) => applyPalette(p, true),
    setNight: (n) => applyNight(!!n, true),
    state
  };

  const nowUpdate = $('#nowUpdate');
  if (nowUpdate) nowUpdate.textContent = latestUpdate() || '—';

  if (location.hash) setTimeout(routeHash, 50);
})();
