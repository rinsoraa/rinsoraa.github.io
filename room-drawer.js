(function () {
  'use strict';
  var coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (coarse || /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent)) return;

  ['roomDrawer', 'roomDrawerSpacer', 'roomDrawerMount', 'roomHint', 'roomUp'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  // 房间作为正常文档流区域，放在主页内容之后（.app 是正常流，滚动时它自然滑出屏幕）
  var section = document.createElement('section');
  section.id = 'roomSection';
  var mount = document.createElement('div');
  mount.id = 'roomDrawerMount';
  section.appendChild(mount);
  document.body.appendChild(section);

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
  up.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12.5V4M8 4L4 8M8 4l4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(up);

  var progress = 0, idleTimer = null, entering = false, hintSeen = false;
  var STEP = 0.055, IDLE_MS = 1000;

  function render() {
    hint.style.setProperty('--p', progress.toFixed(4));
    hint.classList.toggle('is-on', progress > 0.002);
    up.classList.toggle('is-on', window.scrollY > 8);
    document.body.classList.toggle('room-scrolled', window.scrollY > 8);
  }
  function reset() { progress = 0; render(); }

  function bump(d) {
    if (entering) return;
    progress = Math.max(0, Math.min(1, progress + d));
    render();
    if (progress >= 1) { enterRoom(); return; }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { reset(); hintSeen = true; }, IDLE_MS);
  }

  function enterRoom() {
    entering = true; hintSeen = true;
    clearTimeout(idleTimer);
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    setTimeout(function () { progress = 0; entering = false; render(); }, 780);
  }
  function backToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // 手势：只在页面顶端、【向上】滚轮（deltaY<0）时累积进度 → 主页向下滚出屏幕
  window.addEventListener('wheel', function (e) {
    if (window.scrollY > 2) return;
    if (e.deltaY > 0) { if (progress > 0) { e.preventDefault(); bump(-STEP * 0.8); } return; }
    e.preventDefault();
    bump(STEP);
  }, { passive: false });

  var lastY = null;
  window.addEventListener('touchstart', function (e) { lastY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (lastY == null || window.scrollY > 2) return;
    var dy = e.touches[0].clientY - lastY;      // 手指下滑 = 向上滚
    if (dy > 0) { e.preventDefault(); lastY = e.touches[0].clientY; bump(dy / 460); }
  }, { passive: false });
  window.addEventListener('touchend', function () { lastY = null; }, { passive: true });

  up.addEventListener('click', backToTop);
  window.addEventListener('scroll', render, { passive: true });

  setTimeout(function () {
    if (hintSeen) return;
    progress = 0.002; render();
    setTimeout(function () { reset(); hintSeen = true; }, 1600);
  }, 1400);

  // 热点：先把页面从下往上拉回主页（滚回顶部），再点站点自身的导航；音乐博物馆直接进浮层
  window.addEventListener('room:hotspot', function (e) {
    var d = e.detail || {};
    if (d.id === 'music') {
      var mb = document.querySelector('[data-museum]');
      if (mb) { mb.click(); return; }
      if (d.url) location.href = d.url;
      return;
    }
    backToTop();
    setTimeout(function () {
      var btn = document.querySelector('[data-target="' + d.id + '"]');
      if (btn) { btn.click(); return; }
      if (d.url && d.url.charAt(0) === '#') {
        var el = document.querySelector(d.url);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 700);
  });

  render();
})();
