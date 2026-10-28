'use strict';
const fs = require('node:fs');
const arg = key => { const i = process.argv.indexOf('--' + key); return i < 0 ? undefined : process.argv[i + 1]; };
if (arg('playwright-module')) process.env.PLAYWRIGHT_MODULE = arg('playwright-module');
if (arg('browser-cache')) process.env.PLAYWRIGHT_BROWSERS_PATH = arg('browser-cache');
const categories = new Set(['BROWSER_LAUNCH_FAILURE', 'SERVER_IDENTITY_FAILURE', 'NAVIGATION_BEFORE_ASSERTION', 'ACTION_PRECONDITION_FAILURE', 'PRODUCT_ASSERTION_FAILURE', 'HARNESS_OBSERVATION_FAILURE', 'CLEANUP_FAILURE', 'NOT_EXECUTED']);
function classify(stage, error) {
  if (categories.has(error?.category)) return error.category;
  if (stage === 'identity') return 'SERVER_IDENTITY_FAILURE';
  if (stage === 'launch') return 'BROWSER_LAUNCH_FAILURE';
  if (stage === 'navigation' || stage === 'app-ready') return 'NAVIGATION_BEFORE_ASSERTION';
  if (stage === 'precondition') return 'ACTION_PRECONDITION_FAILURE';
  if (stage === 'cleanup') return 'CLEANUP_FAILURE';
  return error?.code === 'ERR_ASSERTION' ? 'PRODUCT_ASSERTION_FAILURE' : 'HARNESS_OBSERVATION_FAILURE';
}
function playwright() { return require(arg('playwright-module') || process.env.PLAYWRIGHT_MODULE || 'playwright'); }
async function diagnosticState(page) { return page.evaluate(() => {
  const e=document.activeElement,r=e?.getBoundingClientRect(),q=document.getElementById('mmLoad'),s=q&&getComputedStyle(q);
  return {at:performance.now(),ready:document.readyState,url:location.href,focus:{id:e?.id,tag:e?.tagName,rect:r?.toJSON()},app:document.querySelector('#app')?.className,curtain:s?{class:q.className,opacity:s.opacity,visibility:s.visibility,pointer:s.pointerEvents,display:s.display}:null,room:{open:window.RinsoraRoom?.isOpen(),status:document.getElementById('heroRoomStatus')?.textContent,module:document.documentElement.dataset.roomModule,entry:document.documentElement.dataset.roomEntry,characterChildren:window.__room?.character?.children?.length},audioCount:document.querySelectorAll('audio').length};
}); }
async function roomAsset(base) { const r=await fetch(new URL('room/assets/models/rinsoraneko.glb',base),{method:'HEAD',signal:AbortSignal.timeout(5000)});if(!r.ok||!r.headers.get('content-type')?.includes('model/gltf-binary')){const e=Error('Required Room GLB unavailable from test service: '+r.status);e.category='ACTION_PRECONDITION_FAILURE';throw e;}return{status:r.status,mime:r.headers.get('content-type')}; }
async function identity(base) {
  const u = new URL(base); if (!['127.0.0.1', 'localhost', '[::1]'].includes(u.hostname)) throw Error('Tests require an explicit loopback URL');
  const response = await fetch(new URL('__identity.json', base), { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw Error('Start serve-browser-check.py --test-api');
  const value = await response.json(); if (value.contract !== 'rinsora-browser-check-v1') throw Error('Unknown test-service contract'); return value;
}
async function touch(page, selector, label, inputs) {
  const point = await page.evaluate(async selector => {
    const begin = performance.now(); let last, same = 0;
    while (performance.now() - begin < 8000) {
      const el = document.querySelector(selector); if (el) {
        const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
        const hit = document.elementFromPoint(x, y), s = getComputedStyle(el); let opacity=1,hidden=false;
        for(let n=el;n;n=n.parentElement){const css=getComputedStyle(n);opacity*=+css.opacity;hidden ||= css.visibility==='hidden'||css.display==='none';}
        const usable = !hidden && opacity>=.9 && r.width > 0 && r.height > 0 && x >= 0 && x < innerWidth && y >= 0 && y < innerHeight && !el.disabled && !el.closest('[inert],[hidden],[aria-hidden="true"]') && s.visibility !== 'hidden' && (hit === el || el.contains(hit));
        same = usable && last && Math.abs(x - last.x) < .25 && Math.abs(y - last.y) < .25 ? same + 1 : 0;
        last = { x, y }; if (same >= 3) return { x, y, at: performance.now(), waited: performance.now() - begin, hit: hit.id || hit.className, target: el.id || el.className };
      }
      await new Promise(requestAnimationFrame);
    }
    return null;
  }, selector);
  if (!point) { const e = Error('Control not visible, stable and hit-testable: ' + selector); e.category = 'ACTION_PRECONDITION_FAILURE'; throw e; }
  inputs.push({ label, selector, point }); await page.touchscreen.tap(point.x, point.y);
}
function freshOutput(out) { if (fs.existsSync(out) && fs.readdirSync(out).length) throw Error('Refusing to overwrite evidence: ' + out); fs.mkdirSync(out, { recursive: true }); }
async function bounded(promise, ms, label) { let timer; try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(label)), ms); })]); } finally { clearTimeout(timer); } }
module.exports = { arg, classify, playwright, identity, touch, freshOutput, categories, bounded, diagnosticState, roomAsset };
