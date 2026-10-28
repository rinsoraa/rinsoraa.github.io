/* Requested only behind the strict inline opt-in gate. Failure leaves Moments intact. */
(function (w, d) {
  'use strict';
  const q = new URLSearchParams(location.search), root = d.documentElement;
  if (q.get('ui02') !== '1' || q.get('memory') !== '1' || root.dataset.memoryLoadState === 'error' || w.RinsoraMemoryReady) return;
  const controller = new AbortController(), nodes = [];
  let timer, active = true;
  const mark = name => { try { w.performance?.mark('memory:' + name); } catch (_) {} };
  mark('loader-start');
  function load(src) {
    return new Promise((resolve, reject) => {
      const s = d.createElement('script'); s.src = src;
      // Promises order our scripts without joining another module's ordered queue.
      s.async = true; nodes.push(s);
      s.onload = resolve; s.onerror = () => reject(new Error('Memory script unavailable')); d.head.appendChild(s);
    });
  }
  const css = d.createElement('link'); css.rel = 'stylesheet'; css.href = 'memory-gallery.css?v=ui04b2-1'; css.media = 'print'; nodes.push(css);
  const styled = new Promise((resolve, reject) => { css.onload = () => { css.media = 'all'; mark('css-ready'); resolve(); }; css.onerror = () => reject(new Error('Memory style unavailable')); });
  d.head.appendChild(css);
  const data = fetch('memory-gallery-data.json', { signal: controller.signal, cache: 'no-cache', credentials: 'same-origin' }).then(async r => {
    if (!r.ok || Number(r.headers.get('content-length')) > 2097152) throw new Error('Memory data unavailable/too large');
    const value = await r.text(); if (new TextEncoder().encode(value).length > 2097152) throw new Error('Memory data too large'); const doc = JSON.parse(value); mark('json-ready'); return doc;
  });
  data.catch(() => {});
  const scripts = load('memory-gallery-model.js?v=ui04b2-1').then(() => load('memory-gallery.js?v=rh02fu1-1')).then(() => mark('scripts-ready'));
  const dom = d.readyState === 'loading' ? new Promise(resolve => d.addEventListener('DOMContentLoaded', resolve, { once: true })) : Promise.resolve();
  // The album can render its validated content at its parser mount, before the
  // unrelated site startup finishes. Interaction waits for the existing router.
  const mounted = d.getElementById('memoryGalleryMount') ? Promise.resolve() :
    new Promise(resolve => d.addEventListener('rinsora:memory-mount', resolve, { once: true, signal: controller.signal }));
  const work = Promise.all([styled, scripts, data, mounted]).then(async values => {
    if (!active) return false;
    mark('dependencies-ready');
    if (!w.RinsoraMemory?.init(values[2])) throw new Error('Memory initialization failed');
    root.dataset.memoryRendered = '1'; mark('rendered');
    await dom;
    if (!active) return false;
    if (!w.RinsoraMemory.activate()) throw new Error('Memory router unavailable');
    root.dataset.memoryLoadState = 'ready'; mark('initialized'); return true;
  });
  const deadline = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Memory timeout')), 12000); });
  w.RinsoraMemoryReady = Promise.race([work, deadline]).catch(() => {
    active = false; controller.abort(); w.RinsoraMemory?.destroy(); nodes.forEach(n => n.remove());
    root.classList.remove('memory-preview'); delete root.dataset.memoryRendered; root.dataset.memoryLoadState = 'error';
    const host = d.getElementById('memoryGalleryMount'); if (host) host.hidden = true;
    return false;
  }).finally(() => { clearTimeout(timer); d.querySelector('[data-memory-boot-style]')?.remove(); });
})(window, document);
