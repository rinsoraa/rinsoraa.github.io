(function () {
  'use strict';
  var coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (coarse || /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent)) return;

  ['roomDrawer', 'roomDrawerSpacer', 'roomDrawerMount', 'roomHint', 'roomUp'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  // 房间固定在视口里、层级低于主页各层 —— 主页整体下滑时露出来。
  // 关键：完全不改动文档滚动（不再插 100vh 的流内块），因此站点自身的滚动联动逻辑不受影响。
  var section = document.createElement('section');
  section.id = 'roomSection';
  var mount = document.createElement('div');
  mount.id = 'roomDrawerMount';
  section.appendChild(mount);
  document.body.appendChild(section);

  document.documentElement.style.background = '#0d0b12';

  window.__ROOM_OPTIONS__ = { embed: true, root: '#roomDrawerMount', embedClass: false };
  var mod = document.createElement('script');
  mod.type = 'module';
  mod.src = '/room/room.js';
  document.head.appendChild(mod);

  var hint = document.createElement('div');
  hint.id = 'roomHint';
  hint.innerHTML = '<span>SCROLL UP TO ENTER MY ROOM</span>';
  document.body.appendChild(hint);

  var up = document.createElement('button');
  up.id = 'roomUp';
  up.type = 'button';
  up.setAttribute('aria-label', '回到主页');
  up.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5V12M8 12l-4-4M8 12l4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(up);

  var progress = 0, idleTimer = null, open = false, hintSeen = false, ready = false;
  var STEP = 0.055, IDLE_MS = 1000;

  // 开屏 / 欢迎页期间：既不允许进入房间，也不显示进度
  function welcomeVisible() {
    var ids = ['welcomeScreen', 'bootScreen'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (!el) continue;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) continue;
      if (el.classList.contains('done') || el.classList.contains('hidden')) continue;
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) return true;
      if (r.height > window.innerHeight * 0.5) return true;
    }
    return false;
  }

  function render() {
    hint.style.setProperty('--p', progress.toFixed(4));
    hint.classList.toggle('is-on', progress > 0.002);
    document.body.style.setProperty('--p', progress.toFixed(4));
    up.classList.toggle('is-on', open);
  }
  function reset() { progress = 0; render(); }

  function bump(d) {
    progress = Math.max(0, Math.min(1, progress + d));
    render();
    if (progress >= 1) { enterRoom(); return; }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { reset(); hintSeen = true; }, IDLE_MS);
  }
  function enterRoom() {
    clearTimeout(idleTimer);
    open = true; hintSeen = true; progress = 0;
    document.body.classList.add('room-open');
    render();
  }
  function leaveRoom() {
    open = false;
    document.body.classList.remove('room-open');
    progress = 0; render();
  }

  // 手势：页面顶端（scrollY<=2）+ 向上滚 → 累积进度环 → 满则主页整体下滑露出房间
  window.addEventListener('wheel', function (e) {
    if (welcomeVisible()) return;                     // 欢迎页内绝对不能进房间
    if (document.body.classList.contains('museum-open')) return;  // 博物馆浮层内放行滚轮：.mm-detail-card 等要能滚
    if (open) { e.preventDefault(); return; }         // 房间内滚轮不返回
    if (e.deltaY > 0) { if (progress > 0) { e.preventDefault(); document.body.classList.remove('room-pulling'); bump(-STEP * 0.8); } return; }
    if (window.scrollY > 2) return;
    e.preventDefault();
    bump(STEP);
  }, { passive: false });

  var lastY = null;
  window.addEventListener('touchstart', function (e) { lastY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (welcomeVisible()) return;
    if (document.body.classList.contains('museum-open')) return;
    if (open) { e.preventDefault(); return; }
    if (lastY == null) return;
    var dy = e.touches[0].clientY - lastY;
    if (dy > 0 && window.scrollY <= 2) {
      e.preventDefault(); lastY = e.touches[0].clientY;
        bump(dy / 460);
    }
  }, { passive: false });
  window.addEventListener('touchend', function () { lastY = null; }, { passive: true });

  up.addEventListener('click', leaveRoom);

  // 站点导航点击：站点会把滚动拉回顶部。房间在层级下方且文档没有偏移，
  // 因此这里无需再做任何校准，也不会出现「进一半再弹回」。
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document.body) {
      if (t.getAttribute && t.getAttribute('data-target')) { leaveRoom(); return; }
      t = t.parentNode;
    }
  }, true);

  // 房间显形：等欢迎页真正离开后再显示，避免进站闪一次房间
  var tick = setInterval(function () {
    if (ready || welcomeVisible()) return;
    ready = true;
    section.classList.add('room-ready');
    clearInterval(tick);
  }, 200);
  setTimeout(function () { if (!ready) { ready = true; section.classList.add('room-ready'); clearInterval(tick); } }, 12000);

  setTimeout(function () {
    if (hintSeen || welcomeVisible()) return;
    // ⚠️ 必须 > 0.002：render() 的显隐判据是 progress > 0.002，写 0.002 时这段是死代码（环永不出现）。
    // 收回时若用户已经开始滚动（progress 已涨过 0.06），就不要清掉他的进度。
    progress = 0.06; render();
    setTimeout(function () { if (!open && progress <= 0.061) reset(); hintSeen = true; }, 1600);
  }, 1600);

  window.addEventListener('room:hotspot', function (e) {
    var d = e.detail || {};
    if (d.id === 'music') {
      var mb = document.querySelector('[data-museum]');
      if (mb) { mb.click(); return; }
      if (d.url) location.href = d.url;
      return;
    }
    leaveRoom();
    setTimeout(function () {
      var btn = document.querySelector('[data-target="' + d.id + '"]');
      if (btn) { btn.click(); return; }
      if (d.url && d.url.charAt(0) === '#') {
        var el = document.querySelector(d.url);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 620);
  });

  render();
})();
