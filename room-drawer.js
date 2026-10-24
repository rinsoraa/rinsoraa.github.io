(function () {
  'use strict';
  var coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  var mobile = coarse || /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent);
  // Explicit ownership: Cover preview owns home pull-up. Buttons still enter this room.
  var previewQuery = new URLSearchParams(location.search);
  var coverOwnsPull = previewQuery.get('ui02') === '1' && previewQuery.get('cover') === '1';
  var labPreview = previewQuery.get('ui02') === '1' && previewQuery.get('lab') === '1';
  var memoryPreview = previewQuery.get('ui02') === '1' && previewQuery.get('memory') === '1';

  ['roomDrawer', 'roomDrawerSpacer', 'roomDrawerMount', 'roomHint', 'roomUp', 'roomCloseBtn', 'roomPullHint', 'roomRotateHint'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  // 房间固定在视口里、层级低于主页各层 —— 主页整体下滑时露出来。
  // 关键：完全不改动文档滚动（不再插 100vh 的流内块），因此站点自身的滚动联动逻辑不受影响。
  var section = document.createElement('section');
  section.id = 'roomSection';
  section.inert = true;
  section.setAttribute('aria-hidden', 'true');
  var mount = document.createElement('div');
  mount.id = 'roomDrawerMount';
  section.appendChild(mount);
  document.body.appendChild(section);

  // 不再把 <html> 内联成固定深色：页面底色交给主题变量 / .scene，
  // 房间自己的 #roomSection 已有独立深色背景，离开房间时不会留下黑边。
  window.__ROOM_OPTIONS__ = { embed: true, root: '#roomDrawerMount', embedClass: false };
  var mod = document.createElement('script');
  mod.type = 'module';
  mod.src = '/room/room.js';
  mod.addEventListener('load', syncRoomLifecycle);
  // Mobile keeps the existing scene unloaded until the explicit Hero action.
  var moduleStarted = false, pendingEntry = null, entryGeneration = 0;
  function startModule() {
    if (moduleStarted) return;
    moduleStarted = true;
    document.head.appendChild(mod);
  }
  // The scene is invisible until entry. Both desktop and mobile use the same
  // existing readiness/retry path, avoiding its startup parse and texture cost.

  var hint = document.createElement('div');
  hint.id = 'roomHint';
  hint.innerHTML = '<span>SCROLL UP TO ENTER MY ROOM</span>';
  document.body.appendChild(hint);

  var up = document.createElement('button');
  up.id = 'roomUp';
  up.type = 'button';
  up.setAttribute('aria-label', '回到主页');
  up.tabIndex = -1;
  up.setAttribute('aria-hidden', 'true');
  up.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5V12M8 12l-4-4M8 12l4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(up);

  var progress = 0, idleTimer = null, open = false, hintSeen = false, ready = false, returnFocus = null, returnScrollY = 0;
  var STEP = 0.055, IDLE_MS = 1000;
  var hintTimer = null, hintResetTimer = null;

  // 3D 场景常驻在 z-index:-1 的视口层里；用户没进房间时它不应该继续 60fps 渲染。
  // 这里把「抽屉状态」翻译成 __room.pause()/resume()，等模块 ready 后执行一次初始暂停。
  function syncRoomLifecycle() {
    if (!window.__room || typeof window.__room.pause !== 'function') return false;
    if (open) window.__room.resume();
    else window.__room.pause();
    return true;
  }
  var lifecyclePoll = setInterval(function () {
    if (syncRoomLifecycle()) clearInterval(lifecyclePoll);
  }, 250);
  setTimeout(function () { clearInterval(lifecyclePoll); }, 15000);

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
    section.inert = !open;
    section.setAttribute('aria-hidden', String(!open));
    up.tabIndex = open ? 0 : -1;
    up.setAttribute('aria-hidden', String(!open));
  }
  function reset() { clearTimeout(idleTimer); idleTimer = null; progress = 0; render(); }

  // Lab owns list/detail/media scrolling, including before its async bootstrap
  // has finished. Do not change the legacy non-Lab column gesture contract.
  function otherInputOwner(event) {
    var memoryDetail = document.getElementById('memoryDetail');
    var moments = document.getElementById('moments');
    var detail = document.getElementById('labDetail');
    var lightbox = document.getElementById('labLightbox');
    var settings = document.getElementById('settingsPanel');
    var projects = document.getElementById('projects');
    var page = window.RinsoraHome && window.RinsoraHome.AppState;
    var hash = String(location.hash || '');
    if (document.body.classList.contains('memory-detail-open') || (memoryDetail && memoryDetail.open)) return true;
    if (memoryPreview && ((page && page.currentPage === 'moments') || (moments && moments.classList.contains('active')) || /^#moments$/i.test(hash))) return true;
    if (document.body.classList.contains('lab-detail-open') || (detail && detail.open) || (lightbox && lightbox.open)) return true;
    if (labPreview && ((page && page.currentPage === 'projects') || (projects && projects.classList.contains('active')) || /^#(?:projects|\/lab\/.*)$/i.test(hash))) return true;
    if (document.body.classList.contains('museum-open') || document.body.classList.contains('spa-post-open') || (settings && settings.classList.contains('open'))) return true;
    var target = event && event.target;
    return !!(target && target.closest && target.closest('#creativeLab, #labDetail, #labLightbox, #memoryGalleryMount, #memoryDetail, #settingsPanel, .spa-post, #mmScene'));
  }
  function gestureUnavailable(event) {
    return coverOwnsPull || mobile || otherInputOwner(event) || welcomeVisible();
  }
  function finishEntry(entry, result) {
    if (entry.done) return;
    entry.done = true; clearTimeout(entry.timer);
    if (pendingEntry === entry) {
      pendingEntry = null;
      if (!result && entry.source === 'gesture') reset();
    }
    entry.resolve(result);
  }
  function relinquishGesture() {
    clearTimeout(hintTimer); clearTimeout(hintResetTimer);
    hintTimer = hintResetTimer = null; hintSeen = true;
    if (pendingEntry && pendingEntry.source === 'gesture') {
      entryGeneration++; finishEntry(pendingEntry, false);
    }
    reset();
  }
  function syncGestureOwnership() {
    if (!open && gestureUnavailable()) relinquishGesture();
  }

  function bump(d) {
    progress = Math.max(0, Math.min(1, progress + d));
    render();
    if (progress >= 1) { enterRoom('gesture'); return; }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { reset(); hintSeen = true; }, IDLE_MS);
  }
  function revealRoom() {
    clearTimeout(idleTimer);
    returnFocus = document.activeElement;
    returnScrollY = window.scrollY;
    open = true; hintSeen = true; progress = 0;
    document.body.classList.add('room-open');
    syncRoomLifecycle();
    render();
    up.focus({ preventScroll: true });
  }
  function leaveRoom() {
    entryGeneration++;
    if (pendingEntry) finishEntry(pendingEntry, false);
    clearTimeout(idleTimer); idleTimer = null;
    var wasOpen = open;
    open = false;
    document.body.classList.remove('room-open');
    syncRoomLifecycle();
    progress = 0;
    if (wasOpen && returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
    render();
    if (wasOpen) window.scrollTo({ top: returnScrollY, behavior: 'instant' });
  }
  function enterRoom(source) {
    if (welcomeVisible() || document.body.classList.contains('museum-open')) return Promise.resolve(false);
    if (source === 'gesture' && gestureUnavailable()) { relinquishGesture(); return Promise.resolve(false); }
    if (open) return Promise.resolve(true);
    if (pendingEntry) {
      // A real button click can intentionally adopt an already-loading gesture.
      if (source !== 'gesture') pendingEntry.source = 'explicit';
      return pendingEntry.promise;
    }
    clearTimeout(idleTimer); idleTimer = null;
    var entry = { source: source === 'gesture' ? 'gesture' : 'explicit', generation: entryGeneration, timer: null, done: false };
    entry.promise = new Promise(function (resolve) { entry.resolve = resolve; });
    pendingEntry = entry;
    startModule();
    var started = Date.now();
    function check() {
      if (entry.done) return;
      if (entry !== pendingEntry || entry.generation !== entryGeneration || welcomeVisible() || document.body.classList.contains('museum-open') || (entry.source === 'gesture' && gestureUnavailable())) {
        finishEntry(entry, false); return;
      }
      if (window.__room && typeof window.__room.resume === 'function' && window.__room.character && window.__room.character.children.length) {
        section.classList.add('room-ready');
        revealRoom(); finishEntry(entry, true); return;
      }
      if (Date.now() - started > 20000) { finishEntry(entry, false); return; }
      entry.timer = setTimeout(check, 100);
    }
    check();
    return entry.promise;
  }
  window.RinsoraRoom = { enter: function () { return enterRoom('explicit'); }, leave: leaveRoom, isOpen: function () { return open; } };
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' || /^[1-4]$/.test(e.key)) leaveRoom(); });
  window.addEventListener('hashchange', leaveRoom);

  // 手势：页面顶端（scrollY<=2）+ 向上滚 → 累积进度环 → 满则主页整体下滑露出房间
  window.addEventListener('wheel', function (e) {
    if (gestureUnavailable(e)) { relinquishGesture(); return; }
    if (e.defaultPrevented || e.ctrlKey || e.cancelable === false || !e.deltaY || Math.abs(e.deltaX || 0) > Math.abs(e.deltaY)) return;
    if (open) { e.preventDefault(); return; }         // 房间内滚轮不返回
    if (e.deltaY > 0) { if (progress > 0) { e.preventDefault(); document.body.classList.remove('room-pulling'); bump(-STEP * 0.8); } return; }
    if (window.scrollY > 2) return;
    e.preventDefault();
    bump(STEP);
  }, { passive: false });

  var lastY = null;
  window.addEventListener('touchstart', function (e) { lastY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (gestureUnavailable(e)) { lastY = null; relinquishGesture(); return; }
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

  // pushState does not emit hashchange. Observe only the few ownership surfaces,
  // not the whole animated DOM, and cancel gesture requests before late readiness.
  if (typeof MutationObserver === 'function') {
    var ownershipObserver = new MutationObserver(syncGestureOwnership);
    [document.body, document.getElementById('projects'), document.getElementById('moments'), document.getElementById('settingsPanel')].forEach(function (el) {
      if (el) ownershipObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
  }

  // 站点导航点击：站点会把滚动拉回顶部。房间在层级下方且文档没有偏移，
  // 因此这里无需再做任何校准，也不会出现「进一半再弹回」。
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document.body) {
      if (t.getAttribute && (t.getAttribute('data-target') || t.getAttribute('data-museum'))) { leaveRoom(); return; }
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

  hintTimer = setTimeout(function () {
    hintTimer = null;
    if (gestureUnavailable()) { relinquishGesture(); return; }
    if (hintSeen) return;
    // ⚠️ 必须 > 0.002：render() 的显隐判据是 progress > 0.002，写 0.002 时这段是死代码（环永不出现）。
    // 收回时若用户已经开始滚动（progress 已涨过 0.06），就不要清掉他的进度。
    progress = 0.06; render();
    hintResetTimer = setTimeout(function () { hintResetTimer = null; if (!open && progress <= 0.061) reset(); hintSeen = true; }, 1600);
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
  syncGestureOwnership();
})();
