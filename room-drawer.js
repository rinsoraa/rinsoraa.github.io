/* ===== Step 3：房间抽屉控制器（v2）=====
   ①只在桌面/平板启用；手机端整块取消，连 845KB 的 room.js 都不下载
   ②顶部下拉「跟手」：拉多少、房间露多少、主页下滑多少；松手未过阈值弹回，
     过了阈值自动把主页移出屏幕、房间展开（全走 CSS 过渡，丝滑）
   ③展开前先 resume()，画布有内容才展开，避免黑屏一下
   ④点热点：先收起（等撑开块归零）再滚动到目标区块，避免目标错位；
     唱片机直接触发站点自带的音乐博物馆入口，不再整页跳转先过主页开屏。 */
(function () {
  'use strict';
  var body = document.body;
  var drawer = document.getElementById('roomDrawer');
  var spacer = document.getElementById('roomDrawerSpacer');
  var mount = document.getElementById('roomDrawerMount');
  var closeBtn = document.getElementById('roomCloseBtn');
  var welcome = document.getElementById('welcomeScreen');
  if (!drawer || !mount || !spacer) return;

  function isMobile() {
    var coarse = false;
    try { coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches; } catch (e) {}
    return coarse || /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent);
  }
  if (isMobile()) {
    ['roomDrawer', 'roomCloseBtn', 'roomPullHint', 'roomRotateHint'].forEach(function (id) {
      var el = document.getElementById(id); if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    return;   // room.js 不会被注入，手机端零开销
  }

  window.__ROOM_OPTIONS__ = Object.assign(
    { embed: true, root: '#roomDrawerMount', embedClass: false },
    window.__ROOM_OPTIONS__ || {}
  );
  var tag = document.createElement('script');
  tag.type = 'module'; tag.src = 'room/room.js'; tag.async = true;
  document.head.appendChild(tag);

  var OPEN_AT = 0.42, WHEEL_FULL = 340, TOUCH_FULL = 230, DURATION = 460;
  var progress = 0, open = false, savedScrollY = 0;
  var wheelAcc = 0, wheelIdle = null, touch = null, resumed = false;

  function roomApi() { return window.__room || null; }
  function welcomeGone() { return !welcome || welcome.classList.contains('hidden'); }
  function atTop() { return (window.scrollY || document.documentElement.scrollTop || 0) <= 2; }
  function vh() { return window.innerHeight || 800; }

  function paint(p, animate) {
    p = Math.max(0, Math.min(1, p));
    progress = p;
    var px = Math.round(p * vh());
    var t = animate ? '' : 'none';
    drawer.style.transition = t;
    spacer.style.transition = t;
    drawer.style.height = px + 'px';
    spacer.style.height = px + 'px';
  }
  function warm() {
    if (resumed) return;
    var api = roomApi();
    if (api && api.resume) { api.resume(); resumed = true; }
  }
  function markOpen(v) {
    open = v;
    body.classList.toggle('room-open', v);
    drawer.setAttribute('aria-hidden', v ? 'false' : 'true');
  }
  function expand() {
    if (open) return;
    warm();
    savedScrollY = window.scrollY || 0;
    markOpen(true);
    paint(1, true);
    window.scrollTo(0, 0);
  }
  function collapse(opts) {
    var was = open || progress > 0;
    markOpen(false);
    paint(0, true);
    if (was) {
      var api = roomApi();
      setTimeout(function () { if (!open && api && api.pause) api.pause(); }, DURATION + 160);
    }
    if ((!opts || opts.restore !== false) && was && savedScrollY) window.scrollTo(0, savedScrollY);
  }
  window.__roomDrawer = { open: expand, close: collapse, isOpen: function () { return open; } };

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;
    if (!open) {
      if (!atTop() || !welcomeGone()) { wheelAcc = 0; return; }
      warm();
      wheelAcc += -e.deltaY;
      if (wheelAcc < 0) wheelAcc = 0;
      body.classList.add('room-pulling');
      paint(wheelAcc / WHEEL_FULL, false);
      clearTimeout(wheelIdle);
      wheelIdle = setTimeout(function () {
        wheelAcc = 0; body.classList.remove('room-pulling');
        if (progress > OPEN_AT) expand(); else collapse();
      }, 110);
    } else if (e.deltaY > 0 && mount.contains(e.target)) {
      wheelAcc += e.deltaY;
      if (wheelAcc > 200) { wheelAcc = 0; collapse(); }
    } else { wheelAcc = 0; }
  }, { passive: true });

  window.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { touch = null; return; }
    touch = { y: e.touches[0].clientY, open: open };
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (!touch || e.touches.length !== 1) return;
    var dy = e.touches[0].clientY - touch.y;
    if (!touch.open) {
      if (!atTop() || !welcomeGone()) { touch = null; return; }
      if (dy > 0) { warm(); body.classList.add('room-pulling'); paint(dy / TOUCH_FULL, false); }
      else paint(0, false);
    } else if (dy < 0 && mount.contains(e.target) && -dy > 200) {
      touch = null; collapse();
    }
  }, { passive: true });
  window.addEventListener('touchend', function () {
    if (!touch) return;
    var wasOpen = touch.open; touch = null;
    body.classList.remove('room-pulling');
    if (!wasOpen) { if (progress > OPEN_AT) expand(); else collapse(); }
  }, { passive: true });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) { e.preventDefault(); collapse(); }
  });
  if (closeBtn) closeBtn.addEventListener('click', function () { collapse(); });
  window.addEventListener('resize', function () { paint(open ? 1 : progress, false); syncTop(); });
  function syncTop() {
    if (!open && atTop() && welcomeGone()) body.classList.add('room-top');
    else body.classList.remove('room-top');
  }
  window.addEventListener('scroll', syncTop, { passive: true });
  syncTop(); setInterval(syncTop, 600);

  function onHotspot(id, url) {
    collapse();
    if (!url) return;
    if (url.charAt(0) === '#') {
      var sec = url.replace(/^#/, '');
      setTimeout(function () {
        // 站点的板块不是文档流滚动，而是它自己的导航系统（navigateTo / data-target）。
        var nav = document.querySelector('[data-target="' + sec + '"]');
        if (nav) { nav.click(); return; }
        var el = document.querySelector(url);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else location.hash = url;
      }, DURATION + 120);
    } else {
      var btn = document.querySelector('[data-museum]');
      if (btn) { btn.click(); return; }
      location.href = url;
    }
  }
  (function wire() {
    var api = roomApi();
    if (api && api.onHotspot) { api.onHotspot(onHotspot); return; }
    setTimeout(wire, 200);
  })();

  setTimeout(function () {
    var api = roomApi();
    if (api && api.pause && !open && progress === 0) api.pause();
  }, 8000);
})();
