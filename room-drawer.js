(function () {
  'use strict';
  var coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (coarse || /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent)) return;

  // 兼容 v2：移除遗留的抽屉节点，避免同名挂载点冲突
  ['roomDrawer', 'roomDrawerSpacer', 'roomDrawerMount', 'roomHint', 'roomUp'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

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
  hint.innerHTML = '<span>SCROLL TO ENTER MY ROOM</span>';
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
    entering = true; clearTimeout(idleTimer); hintSeen = true;
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    setTimeout(function () { progress = 0; entering = false; render(); }, 760);
  }
  function backToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  window.addEventListener('wheel', function (e) {
    if (window.scrollY > 2) return;
    if (e.deltaY <= 0) { if (progress > 0) { e.preventDefault(); bump(-STEP * 0.75); } return; }
    e.preventDefault();
    bump(STEP);
  }, { passive: false });

  var lastY = null;
  window.addEventListener('touchstart', function (e) { lastY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (lastY == null || window.scrollY > 2) return;
    var dy = lastY - e.touches[0].clientY;
    if (dy > 0) { e.preventDefault(); lastY = e.touches[0].clientY; bump(dy / 420); }
  }, { passive: false });
  window.addEventListener('touchend', function () { lastY = null; }, { passive: true });

  up.addEventListener('click', backToTop);
  window.addEventListener('scroll', render, { passive: true });

  setTimeout(function () {
    if (hintSeen) return;
    progress = 0.002; render();
    setTimeout(function () { reset(); hintSeen = true; }, 1500);
  }, 1400);

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
