/* UI-03E loader stability; retain UI-03D visuals and UI-03B's gesture/state contract. */
(() => {
  'use strict';
  const query = new URLSearchParams(location.search);
  if (query.get('ui02') !== '1' || query.get('cover') !== '1') return;
  const root = document.documentElement;
  if (root.dataset.coverLoadState === 'error') { root.dataset.coverController = 'error'; return; }
  if (root.dataset.coverController === 'loading' || root.dataset.coverController === 'ready') return;
  root.dataset.coverController = 'loading';
  root.classList.add('cover-preview');
  const existingStyles = document.querySelector('[data-cover-stage-styles]');
  const css = existingStyles || document.createElement('link');
  if (!existingStyles) { css.rel = 'stylesheet'; css.href = 'cover-stage.css?v=ui03f-1'; }
  // A failed CSS request can still expose a non-null, unusable sheet object.
  // The head bootstrap records load/error before either event can race this JS.
  const stylesReady = css._rinsoraCoverReady || new Promise(resolve => {
    if (css.dataset.coverStageState === 'ready') return resolve(true);
    if (css.dataset.coverStageState === 'error') return resolve(false);
    css.addEventListener('load', () => resolve(true), { once: true });
    css.addEventListener('error', () => resolve(false), { once: true });
  });
  if (!css.isConnected) document.head.appendChild(css);

  function init() {
    const about = document.getElementById('about');
    const rail = document.querySelector('.side-rail');
    const app = document.getElementById('app');
    const debug = query.get('coverDebug') === '1';
    const config = { contentOffset: 320, sidebarOffset: 240, snapThreshold: .45, positionX: 50, positionY: 30, imageHeight: 720, settleDuration: 480,
      hazeClosed: .46, hazeOpen: .12, blurClosed: 3, blurOpen: 1, particlesClosed: .55, particlesOpen: .7 };
    const mobile = matchMedia('(max-width: 860px), (pointer: coarse)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let progress = 0, settleTimer = 0, contentMax = 260, sidebarMax = 190, origin = 0, artHeight = 720;
    let awaitingDirectHome = location.hash.toLowerCase() === '#about' && !app.classList.contains('visible');
    let panel, output;

    // The ambient image can paint during parsing. Reuse that single visual
    // surface; waiting for the full app must not delay a downloaded LCP image.
    const art = window.RinsoraCoverArt;
    if (!art) throw new Error('Cover art bootstrap unavailable');
    const { stage, image } = art;
    if (debug) stage.insertAdjacentHTML('beforeend', '<div class="cover-visible-guide cover-guides">VISIBLE AREA <span>CONTENT OVERLAP ↓</span></div><div class="cover-guide-box" data-guide="head"><span>HEAD TOP / EARS</span></div><div class="cover-guide-box" data-guide="face"><span>FACE CENTER</span></div><div class="cover-guide-box" data-guide="body"><span>SHOULDERS / UPPER BODY</span></div>');
    about.querySelector('.home-hero-art figcaption').textContent = '创作工作台 / AT MY DESK';
    const prepareImage = highPriority => art.prepare(highPriority);
    if (debug) stage.addEventListener('coverartchange', updateReport);
    document.getElementById('enterBtn')?.addEventListener('pointerdown', () => prepareImage(true), { once: true });
    const controls = document.createElement('div');
    controls.id = 'coverControls';
    controls.innerHTML = '<button type="button" id="coverToggle" aria-controls="coverStage" aria-expanded="false">展开封面 ↑</button><span id="coverStatus" role="status" aria-live="polite"></span>';
    about.before(controls);
    const toggle = document.getElementById('coverToggle');
    const status = document.getElementById('coverStatus');
    toggle.addEventListener('pointerenter', () => prepareImage(true), { once: true });

    function homeVisible() {
      return about.classList.contains('active') && app.classList.contains('visible') &&
        !document.body.matches('.museum-open, .room-open, .spa-post-open') &&
        !document.getElementById('bootScreen')?.matches(':not(.done):not(.hidden)') &&
        (document.getElementById('welcomeScreen')?.classList.contains('hidden') || root.hasAttribute('data-pre-section'));
    }
    function homeAvailable() {
      return homeVisible() && !document.getElementById('settingsPanel')?.classList.contains('open');
    }
    // Only resize/initialization reads layout in normal mode. Wheel writes visual variables.
    function measure() {
      const h = innerHeight;
      contentMax = Math.max(0, Math.min(config.contentOffset, innerWidth <= 860 ? 260 : Infinity, h * .38, h - 300));
      const railHeight = rail.getBoundingClientRect().height;
      sidebarMax = innerWidth <= 860 ? 0 : Math.max(0, Math.min(config.sidebarOffset, contentMax * .78, h - railHeight - 48));
      // Use the untransformed layout origin (offsetTop is independent of reveal).
      let node = about, top = 0;
      while (node) { top += node.offsetTop; node = node.offsetParent; }
      origin = top;
      artHeight = Math.min(config.imageHeight, innerWidth <= 860 ? Math.min(620, h * .7) : h * .8);
      root.style.setProperty('--cover-origin', origin + 'px');
      root.style.setProperty('--cover-art-height', artHeight + 'px');
      root.style.setProperty('--cover-x', config.positionX + '%');
      root.style.setProperty('--cover-y', config.positionY + '%');
      root.style.setProperty('--cover-duration', reduced.matches ? '0ms' : config.settleDuration + 'ms');
      root.style.setProperty('--cover-blur-low', config.blurOpen + 'px');
      root.style.setProperty('--cover-blur-high', config.blurClosed + 'px');
      render();
    }
    function render() {
      root.style.setProperty('--cover-content-shift', (progress * contentMax).toFixed(2) + 'px');
      root.style.setProperty('--cover-rail-shift', (progress * sidebarMax).toFixed(2) + 'px');
      const blend = (closed, open) => (closed + (open - closed) * progress).toFixed(3);
      root.style.setProperty('--cover-haze', blend(config.hazeClosed, config.hazeOpen));
      root.style.setProperty('--cover-softness', (1 - progress).toFixed(3));
      root.style.setProperty('--cover-particles', blend(config.particlesClosed, config.particlesOpen));
      root.dataset.coverState = progress === 0 ? 'CLOSED' : progress === 1 ? 'REVEALED' : 'PEEKING';
      root.classList.toggle('cover-exposed', progress > 0);
      toggle.setAttribute('aria-expanded', String(progress > 0));
      toggle.textContent = progress > 0 ? '收起封面 · 继续阅读 ↓' : '展开封面 ↑';
      if (debug) updateReport();
    }
    function setProgress(value, animate = false) {
      clearTimeout(settleTimer);
      root.classList.toggle('cover-settling', animate);
      progress = Math.max(0, Math.min(1, value));
      if (progress > 0) prepareImage(true);
      render();
      if (animate) status.textContent = progress === 0 ? '封面已收起，可以继续阅读。' : progress === 1 ? '封面已展开，向下滚动或使用收起按钮继续阅读。' : `封面展开 ${Math.round(progress * 100)}%。`;
    }
    function close() { setProgress(0, false); }
    function interruptSettle() {
      if (!root.classList.contains('cover-settling')) return;
      // Read the current composited position once on a new input burst, so a
      // reversal continues from the visible position rather than the old target.
      const matrix = new DOMMatrixReadOnly(getComputedStyle(about).transform);
      progress = Math.max(0, Math.min(1, matrix.m42 / Math.max(1, contentMax)));
      root.classList.remove('cover-settling');
    }
    toggle.addEventListener('click', () => {
      if (!homeAvailable()) return;
      // Cancel a route/fragment smooth scroll even before its first movement.
      if (progress === 0) window.scrollTo({ top: 0, behavior: 'instant' });
      setProgress(progress > 0 ? 0 : 1, true);
    });
    function nestedScroll(target) {
      for (let el = target instanceof Element ? target : target.parentElement; el && el !== document.body; el = el.parentElement) {
        if (el.closest('#coverDebugPanel, #floatingPlayer, .lyricbar, .mobile-nav, .radial-nav, .settings-panel, .spa-post, #mmScene')) return true;
        const style = getComputedStyle(el);
        if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) return true;
        if (el.matches('input, textarea, select, [contenteditable="true"]')) return true;
      }
      return false;
    }
    window.addEventListener('wheel', event => {
      if (mobile.matches || event.ctrlKey || !homeAvailable() || nestedScroll(event.target) || !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      interruptSettle();
      if (!event.deltaY || (progress === 0 && (scrollY > 2 || event.deltaY > 0))) return;
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      const next = Math.max(0, Math.min(1, progress - pixels / Math.max(300, contentMax * 1.8)));
      // At the fully revealed limit there is no further progress to consume.
      if (next === progress) return;
      if (progress === 0) window.scrollTo({ top: 0, behavior: 'instant' });
      event.preventDefault();
      setProgress(next);
      settleTimer = setTimeout(() => {
        if (pixels > 0) setProgress(0, true);
        else if (progress >= config.snapThreshold) setProgress(1, true);
        else status.textContent = '封面部分展开。继续向上滚动展开，向下滚动收起。';
      }, 170);
    }, { passive: false });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && progress > 0 && homeAvailable()) { setProgress(0, true); toggle.focus({ preventScroll: true }); }
    });
    // Close synchronously before existing explicit route/room/overlay handlers run.
    document.addEventListener('click', e => {
      if (e.target.closest('[data-target], [data-museum], #heroRoom, .settings-open, a[href^="posts/"]')) close();
    }, true);
    window.addEventListener('hashchange', close);
    window.addEventListener('popstate', close);
    window.addEventListener('scroll', () => { if (scrollY > 2 && progress > 0) close(); }, { passive: true });
    function sync() {
      // Keep the direct-route first-paint geometry while the existing app starts.
      if (awaitingDirectHome && location.hash.toLowerCase() === '#about' && !app.classList.contains('visible')) return;
      const visible = homeVisible(), available = homeAvailable();
      const wasAvailable = root.classList.contains('cover-home');
      // Settings own input while open, but don't replace the room behind them.
      root.classList.toggle('cover-home', visible);
      if (!available && progress > 0) close();
      if (visible) prepareImage(true);
      if (visible && (!wasAvailable || awaitingDirectHome)) measure();
      awaitingDirectHome = false;
    }
    const observer = new MutationObserver(sync);
    [about, app, document.body, document.getElementById('settingsPanel'), document.getElementById('welcomeScreen'), document.getElementById('bootScreen')].filter(Boolean)
      .forEach(el => observer.observe(el, { attributes: true, attributeFilter: ['class'] }));
    window.addEventListener('resize', measure);
    reduced.addEventListener('change', measure);

    function report() {
      const bounds = (el) => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), width: +r.width.toFixed(1), height: +r.height.toFixed(1) }; };
      const box = bounds(image);
      const narrow = image.currentSrc.includes('cover-bedroom-mobile.webp');
      const sourceWidth = narrow ? 832 : 1672, sourceLeft = narrow ? 420 : 0;
      const scale = Math.max(box.width / sourceWidth, box.height / 941);
      const imageX = box.x + (box.width - sourceWidth * scale) * config.positionX / 100 - sourceLeft * scale;
      const imageY = box.y + (box.height - 941 * scale) * config.positionY / 100;
      const scaled = (x, y, w, h) => ({ x: +(imageX + x * scale).toFixed(1), y: +(imageY + y * scale).toFixed(1), width: +(w * scale).toFixed(1), height: +(h * scale).toFixed(1) });
      return { config: { ...config }, viewport: { width: innerWidth, height: innerHeight }, coverAspectRatio: innerWidth / innerHeight,
        state: root.dataset.coverState, progress, visibleRegion: { x: 0, y: 0, width: innerWidth, height: innerHeight },
        foreground: { title: bounds(document.querySelector('.topbar')), controls: bounds(controls), hero: bounds(about.querySelector('.home-hero')) },
        atmosphere: { haze: +(config.hazeClosed + (config.hazeOpen - config.hazeClosed) * progress).toFixed(3), fixedBlurLayers: [config.blurOpen, config.blurClosed], softLayerOpacity: +(1 - progress).toFixed(3), particles: +(config.particlesClosed + (config.particlesOpen - config.particlesClosed) * progress).toFixed(3) },
        image: { sourceSize: [1672, 941], selectedSourceSize: [sourceWidth, 941], cropLeft: sourceLeft, box, scale, imageX, imageY, currentSrc: image.currentSrc, decoded: stage.classList.contains('art-ready'), failed: art.failed },
        headSafeBounds: scaled(642, 84, 408, 320), faceSafeBounds: scaled(752, 226, 228, 184), faceCenter: scaled(850, 315, 0, 0), upperBodySafeBounds: scaled(580, 370, 450, 190), catBounds: scaled(1140, 550, 430, 180),
        contentMaxDisplacement: +contentMax.toFixed(1), sidebarMaxDisplacement: +sidebarMax.toFixed(1), reservedNavigationArea: { sidebar: mobile.matches ? null : bounds(rail), bottom: innerWidth <= 860 ? 180 : 110 }, contentOverlapStartsAt: +(origin + progress * contentMax).toFixed(1) };
    }
    function updateReport() {
      if (!output) return;
      const data = report();
      output.textContent = `${innerWidth} × ${innerHeight} · ${root.dataset.coverState} ${Math.round(progress * 100)}%\n实际位移 ${data.contentMaxDisplacement} / ${data.sidebarMaxDisplacement}px\n可见区域 0–${data.visibleRegion.height}px`;
      panel.querySelector('textarea').value = JSON.stringify(data);
      for (const [key, value] of [['head', data.headSafeBounds], ['face', data.faceSafeBounds], ['body', data.upperBodySafeBounds]]) {
        const guide = stage.querySelector(`[data-guide="${key}"]`);
        Object.assign(guide.style, { left: value.x + 'px', top: value.y + 'px', width: value.width + 'px', height: value.height + 'px' });
      }
    }
    if (debug) {
      root.classList.add('cover-debug');
      panel = document.createElement('aside'); panel.id = 'coverDebugPanel'; panel.setAttribute('aria-label', '封面构图调试');
      panel.innerHTML = `<details ${innerWidth > 860 ? 'open' : ''}><summary>ART-04 / 构图调试</summary><div class="cover-debug-fields"></div><div class="cover-debug-actions"><button data-progress="0">收起</button><button data-progress="0.25">25%</button><button data-progress="0.5">50%</button><button data-progress="0.75">75%</button><button data-progress="1">展开</button></div><output></output><label>构图 JSON<textarea readonly rows="3" aria-label="构图参数 JSON"></textarea></label><button id="coverCopy">复制 JSON</button></details>`;
      document.body.appendChild(panel); output = panel.querySelector('output');
      const fields = [['contentOffset', 'Content Offset', 120, 360, 1], ['sidebarOffset', 'Sidebar Offset', 60, 260, 1], ['snapThreshold', 'Snap Threshold', .25, .75, .01], ['positionX', 'Cover Position X', 0, 100, 1], ['positionY', 'Cover Position Y', 0, 100, 1], ['imageHeight', 'Image Height', 420, 900, 10],
        ['hazeClosed', 'Haze · closed', 0, .8, .01], ['hazeOpen', 'Haze · open', 0, .8, .01], ['blurClosed', 'Blur · closed', .5, 5, .1], ['blurOpen', 'Blur · open', .5, 5, .1], ['particlesClosed', 'Particles · closed', .1, 1, .05], ['particlesOpen', 'Particles · open', .1, 1, .05]];
      for (const [key, label, min, max, step] of fields) {
        const row = document.createElement('label');
        row.innerHTML = `<span>${label} <b>${config[key]}</b></span><input type="range" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${config[key]}">`;
        row.querySelector('input').addEventListener('input', e => { config[key] = Number(e.target.value); row.querySelector('b').textContent = config[key]; measure(); });
        panel.querySelector('.cover-debug-fields').appendChild(row);
      }
      panel.addEventListener('click', e => { const button = e.target.closest('[data-progress]'); if (button && homeAvailable()) setProgress(Number(button.dataset.progress), true); });
      panel.querySelector('#coverCopy').addEventListener('click', async e => {
        const text = panel.querySelector('textarea');
        try { await navigator.clipboard.writeText(text.value); e.target.textContent = '已复制'; }
        catch (_) { text.focus(); text.select(); e.target.textContent = '请复制已选中的 JSON'; }
      });
      about.addEventListener('transitionend', e => { if (e.target === about && e.propertyName === 'transform') updateReport(); });
    }
    // Report is measured only on explicit debug updates; no animation/render loop.
    sync(); measure();
    // The site's direct-about route starts at the top; keep style insertion from
    // preserving the old about anchor after the prototype adds its control row.
    if (location.hash === '#about' && scrollY <= origin + 2) window.scrollTo({ top: 0, behavior: 'instant' });
    function finishInitialAnchor() {
      // One frame after native fragment positioning, never a running rAF loop.
      requestAnimationFrame(() => {
        measure();
        if (location.hash === '#about' && scrollY <= origin + 2) window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
    if (document.readyState !== 'complete') window.addEventListener('load', finishInitialAnchor, { once: true });
    else finishInitialAnchor();
  }
  const domReady = document.readyState === 'loading' ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true })) : Promise.resolve();
  Promise.all([stylesReady, domReady]).then(([styled]) => {
    if (!styled || root.dataset.coverLoadState === 'error') {
      root.dataset.coverController = 'error';
      window.dispatchEvent(new Event('rinsora-cover-error'));
      return;
    }
    init();
    root.dataset.coverController = 'ready';
    root.dataset.coverLoadState = 'ready';
  }).catch(error => {
    console.error('Cover initialization failed', error);
    root.dataset.coverController = 'error';
    window.dispatchEvent(new Event('rinsora-cover-error'));
  });
})();
