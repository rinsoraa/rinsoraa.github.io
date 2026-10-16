(function () {
  'use strict';
  var coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (coarse || /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent)) return;

  ['roomDrawer', 'roomDrawerSpacer', 'roomDrawerMount', 'roomHint', 'roomUp'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  // 房间位于主页【上方】，作为 body 第一个元素
  var section = document.createElement('section');
  section.id = 'roomSection';
  var mount = document.createElement('div');
  mount.id = 'roomDrawerMount';
  section.appendChild(mount);
  document.body.insertBefore(section, document.body.firstChild);

  // 页面底色改为深色：房间与主页衔接处不会再露出白底（夜间模式最明显）
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

  var roomH = function () { return section.offsetHeight || window.innerHeight; };
  var progress = 0, idleTimer = null, entering = false, hintSeen = false, ready = false;
  var STEP = 0.055, IDLE_MS = 1000;

  function atHomeTop() { return window.scrollY <= roomH() + 2; }
  function inRoom() { return window.scrollY < roomH() * 0.5; }

  // 开屏 / 欢迎页期间不允许进入房间（避免刚进站闪一次房间）
  function welcomeVisible() {
    var w = document.getElementById('welcomeScreen');
    if (w && !w.classList.contains('hidden')) return true;
    var b = document.getElementById('bootScreen') || document.querySelector('.boot-screen');
    if (b && !b.classList.contains('done') && getComputedStyle(b).display !== 'none') return true;
    return false;
  }

  function render() {
    hint.style.setProperty('--p', progress.toFixed(4));
    hint.classList.toggle('is-on', progress > 0.002);
    var room = inRoom();
    up.classList.toggle('is-on', room);
    document.body.classList.toggle('room-open', room);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { progress = 0; entering = false; render(); }, 780);
  }
  function seatHome() { window.scrollTo(0, roomH()); }
  function backToHome() { window.scrollTo({ top: roomH(), behavior: 'smooth' }); }

  // 先把滚动落到主页，再让房间显形（避免进站瞬间闪一次房间）
  function bootSeat() {
    seatHome();
    if (!ready) { ready = true; setTimeout(function () { section.classList.add('room-ready'); }, 120); }
  }
  if (document.readyState === 'complete') setTimeout(bootSeat, 40);
  else window.addEventListener('load', function () { setTimeout(bootSeat, 40); });
  setTimeout(bootSeat, 700);
  setTimeout(bootSeat, 1600);

  // 站点自身导航（环形导航 / 移动端导航）点击后，把滚动重新校准回主页位置，
  // 否则站点会把滚动拉回文档顶部——那正是房间，于是点导航会跳到房间里。
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document.body) {
      if (t.getAttribute && (t.getAttribute('data-target') || t.getAttribute('data-museum'))) {
        setTimeout(function () { window.scrollTo(0, roomH()); }, 90);
        setTimeout(function () { window.scrollTo(0, roomH()); }, 380);
        return;
      }
      t = t.parentNode;
    }
  }, true);

  window.addEventListener('wheel', function (e) {
    if (welcomeVisible()) return;
    if (inRoom()) { e.preventDefault(); return; }
    if (e.deltaY > 0) { if (progress > 0) { e.preventDefault(); bump(-STEP * 0.8); } return; }
    if (!atHomeTop()) return;
    e.preventDefault();
    bump(STEP);
  }, { passive: false });

  var lastY = null;
  window.addEventListener('touchstart', function (e) { lastY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (welcomeVisible()) return;
    if (inRoom()) { e.preventDefault(); return; }
    if (lastY == null || !atHomeTop()) return;
    var dy = e.touches[0].clientY - lastY;
    if (dy > 0) { e.preventDefault(); lastY = e.touches[0].clientY; bump(dy / 460); }
  }, { passive: false });
  window.addEventListener('touchend', function () { lastY = null; }, { passive: true });

  up.addEventListener('click', backToHome);
  window.addEventListener('scroll', render, { passive: true });
  window.addEventListener('resize', render, { passive: true });

  setTimeout(function () {
    if (hintSeen || welcomeVisible()) return;
    progress = 0.002; render();
    setTimeout(function () { reset(); hintSeen = true; }, 1600);
  }, 1600);

  window.addEventListener('room:hotspot', function (e) {
    var d = e.detail || {};
    if (d.id === 'music') {
      var mb = document.querySelector('[data-museum]');
      if (mb) { mb.click(); return; }
      if (d.url) location.href = d.url;
      return;
    }
    window.scrollTo(0, roomH());
    setTimeout(function () {
      var btn = document.querySelector('[data-target="' + d.id + '"]');
      if (btn) {
        btn.click();
        setTimeout(function () { window.scrollTo(0, roomH()); render(); }, 170);
        setTimeout(function () { window.scrollTo(0, roomH()); render(); }, 620);
        return;
      }
      if (d.url && d.url.charAt(0) === '#') {
        var el = document.querySelector(d.url);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
      setTimeout(function () { window.scrollTo(0, roomH()); render(); }, 300);
    }, 60);
  });

  render();
})();
