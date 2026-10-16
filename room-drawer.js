/* ===== Step 3：房间抽屉控制器 ===== 
   职责：①以宿主身份挂载房间（room.js / room.css）②顶部上滚拉出、向下滚收回 
   ③热点跳转（页内平滑滚动 / 唱片机整页跳转）④移动端手势与竖屏提示 ⑤收起时暂停渲染。 */
(function () {
  'use strict';
  var body = document.body;
  var drawer = document.getElementById('roomDrawer');
  var mount = document.getElementById('roomDrawerMount');
  var hintBox = document.getElementById('roomPullHint');
  var closeBtn = document.getElementById('roomCloseBtn');
  var welcome = document.getElementById('welcomeScreen');
  if (!drawer || !mount) return;

  // ---- 1) 交给房间脚本的挂载配置（必须在 room.js 执行前设置） ----
  window.__ROOM_OPTIONS__ = Object.assign(
    { embed: true, root: '#roomDrawerMount', embedClass: false },
    window.__ROOM_OPTIONS__ || {}
  );

  var OPEN_PULL = 240;      // 桌面：滚轮累计上滚量阈值
  var OPEN_PULL_TOUCH = 130;// 移动：下拉累计阈值
  var CLOSE_PULL = 160;     // 展开后向下滚多少收回
  var open = false, pulling = 0, touchStart = null, savedScrollY = 0, everClosed = false;

  function roomApi() { return window.__room || null; }
  function welcomeGone() { return !welcome || welcome.classList.contains('hidden'); }
  function atTop() { return (window.scrollY || document.documentElement.scrollTop || 0) <= 2; }
  function isPortraitPhone() {
    return window.matchMedia('(orientation: portrait)').matches && window.innerWidth < 820;
  }

  // ---- 2) 打开 / 收起 ----
  function openDrawer() {
    if (open) return;
    if (isPortraitPhone()) { body.classList.add('room-need-landscape'); return; }
    open = true;
    savedScrollY = window.scrollY || 0;
    body.classList.add('room-open');
    body.classList.remove('room-pulling');
    drawer.setAttribute('aria-hidden', 'false');
    var api = roomApi();
    if (api && api.resume) api.resume();
    window.scrollTo(0, 0);
  }
  function closeDrawer(restore) {
    if (!open) return;
    open = false;
    body.classList.remove('room-open', 'room-need-landscape');
    drawer.setAttribute('aria-hidden', 'true');
    var api = roomApi();
    if (api && api.pause) api.pause();
    everClosed = true;
    if (restore !== false) window.scrollTo(0, savedScrollY || 0);
  }
  window.__roomDrawer = { open: openDrawer, close: closeDrawer, isOpen: function () { return open; } };

  // ---- 3) 桌面：滚轮 ----
  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;
    if (!open) {
      if (!atTop() || !welcomeGone()) { pulling = 0; return; }
      if (e.deltaY < 0) {
        pulling += -e.deltaY;
        body.classList.add('room-pulling');
        if (pulling >= OPEN_PULL) { pulling = 0; openDrawer(); }
      } else if (pulling > 0) {
        pulling = 0; body.classList.remove('room-pulling');
      }
    } else {
      // 展开状态下：在房间上向下滚 → 收回
      if (e.deltaY > 0 && e.target && mount.contains(e.target)) {
        pulling += e.deltaY;
        if (pulling >= CLOSE_PULL) { pulling = 0; closeDrawer(); }
      } else { pulling = 0; }
    }
  }, { passive: true });

  // ---- 4) 移动端：下拉手势 ----
  window.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { touchStart = null; return; }
    touchStart = { y: e.touches[0].clientY, mode: open ? 'close' : 'open' };
    pulling = 0;
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (!touchStart || e.touches.length !== 1) return;
    var dy = e.touches[0].clientY - touchStart.y;
    if (touchStart.mode === 'open') {
      if (!atTop() || !welcomeGone()) { touchStart = null; return; }
      if (dy > 0) {
        pulling = dy * 1.1;
        body.classList.add('room-pulling');
        if (pulling >= OPEN_PULL_TOUCH) { pulling = 0; touchStart = null; openDrawer(); }
      } else { pulling = 0; body.classList.remove('room-pulling'); }
    } else {
      if (dy < 0 && mount.contains(e.target)) {
        pulling = -dy;
        if (pulling >= CLOSE_PULL) { pulling = 0; touchStart = null; closeDrawer(); }
      } else { pulling = 0; }
    }
  }, { passive: true });
  window.addEventListener('touchend', function () {
    touchStart = null; pulling = 0; body.classList.remove('room-pulling');
  }, { passive: true });

  // ---- 5) Esc / 按钮 / 顶部标记 ----
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) { e.preventDefault(); closeDrawer(); }
  });
  if (closeBtn) closeBtn.addEventListener('click', function () { closeDrawer(); });
  function syncTop() {
    if (atTop() && welcomeGone()) body.classList.add('room-top');
    else body.classList.remove('room-top');
  }
  window.addEventListener('scroll', syncTop, { passive: true });
  window.addEventListener('resize', function () {
    if (body.classList.contains('room-need-landscape') && !isPortraitPhone()) {
      body.classList.remove('room-need-landscape');
      openDrawer();
    }
    syncTop();
  });
  syncTop(); setInterval(syncTop, 600);

  // ---- 6) 热点跳转 ----
  function onHotspot(id, url) {
    closeDrawer();
    if (!url) return;
    if (url.charAt(0) === '#') {
      var el = document.querySelector(url);
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 140);
      else location.hash = url;
    } else {
      location.href = url; // 唱片机 → 音乐博物馆（整页跳转）
    }
  }
  window.addEventListener('room:hotspot', function (e) {
    var d = e.detail || {};
    if (!window.__roomWired) onHotspot(d.id, d.url);
  });
  // 注册回调以「接管」跳转，从而不再触发房间自身的兜底跳转
  (function wire() {
    var api = roomApi();
    if (api && api.onHotspot) { api.onHotspot(onHotspot); window.__roomWired = true; return; }
    setTimeout(wire, 200);
  })();

  // ---- 7) 初始为收起状态：先让贴图/模型加载完，再暂停渲染省电 ----
  setTimeout(function () {
    var api = roomApi();
    if (api && api.pause && !open) api.pause();
  }, 6000);
})();
