'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const H = require('./harness.cjs'), BASE = H.arg('url'), OUT = H.arg('out');
if (!BASE || !OUT) throw Error('--url and --out required'); H.freshOutput(OUT);
const engine = H.arg('browser') || 'edge', width = Number(H.arg('width') || 1440), motion = H.arg('motion') || 'normal';
const result = {engine, width, motion, checks: [], inputs: [], errors: [], harnessSHA256: require('node:crypto').createHash('sha256').update(fs.readFileSync(__filename)).digest('hex')}; let b, c, p;
const save = () => fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(result, null, 2));
async function run(name, fn) { const row = {name}; result.checks.push(row); try { row.detail = await fn(); row.status = 'PASS'; } catch (e) { row.status = 'FAIL'; row.error = e.stack; await p?.screenshot({path: path.join(OUT, 'FAIL-' + name + '.png'), timeout: 5000}).catch(() => {}); } save(); console.log(name, row.status); }
async function fresh() { await c?.close(); c = await b.newContext({viewport: {width, height: width === 390 ? 844 : width === 430 ? 932 : width === 1366 ? 768 : 900}, hasTouch: width <= 860, reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference', serviceWorkers: 'block'}); p = await c.newPage(); p.on('pageerror', e => result.errors.push(e.message)); await p.goto(BASE + '?releasePreview=1#about'); await p.waitForFunction(() => window.RinsoraHome && document.querySelector('#app.visible') && document.documentElement.dataset.coverController === 'ready'); if (motion === 'off') await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'}); }
async function armFrames(selector) { await p.evaluate(selector => {
  window.__drawerFramePromise = new Promise(resolve => document.querySelector(selector).addEventListener('click', event => {
    const frames = [], start = performance.now(); window.__drawerInputAt = start;
    function sample() {
      const e = settingsPanel, s = getComputedStyle(e), active = document.activeElement, r = active.getBoundingClientRect();
      const animations = e.getAnimations().filter(a => a.effect?.target === e).map(a => ({type: a.constructor.name, name: a.animationName || a.transitionProperty, time: a.currentTime, progress: a.effect.getComputedTiming().progress, duration: a.effect.getTiming().duration}));
      frames.push({at: performance.now() - start, trustedInput: event.isTrusted, transform: s.transform, opacity: s.opacity, clip: s.clipPath, animation: s.animationName, x: e.getBoundingClientRect().x, active: active.id || active.tagName, focusInViewport: r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight, animations});
      if (performance.now() - start < 850) requestAnimationFrame(sample); else resolve(frames);
    }
    sample();
  }, {once:true}));
}, selector); }
async function panelFrames() { return p.evaluate(() => window.__drawerFramePromise); }
async function settledOpen(frames) {
  const firstComplete = frames.find(f => f.at <= 1200 && f.opacity === '1' && f.focusInViewport);
  if (firstComplete) return {pass:true, at:firstComplete.at, observed:'first-completed-frame'};
  const final = await p.evaluate(async () => {
    while (performance.now() - window.__drawerInputAt <= 1200) {
      if (settingsPanel.classList.contains('open') && getComputedStyle(settingsPanel).opacity === '1') return {pass:true, at:performance.now()-window.__drawerInputAt, observed:'event-boundary-final'};
      await new Promise(requestAnimationFrame);
    }
    return {pass:false, at:performance.now()-window.__drawerInputAt};
  });
  assert(final.pass, 'Opening must settle within the absolute 1200ms input budget');
  return final;
}
function animated(frames, type) {
  assert(frames.every(f => f.trustedInput), 'Real click must start observation');
  assert(frames.some(f => f.animations.some(a => a.type === type && a.progress > 0 && a.progress < 1)), 'Actual animation must reach an intermediate progress');
  assert(new Set(frames.map(f => [f.transform, f.opacity, f.clip].join('|'))).size > 1, 'Animation must change rendered style');
}
(async () => { try {
  result.identity = await H.identity(BASE); const pw = H.playwright(); b = await (engine === 'edge' ? pw.chromium.launch({channel: 'msedge', headless: true}) : pw[engine].launch({headless: true})); result.version = b.version();
  await run('settings-opening', async () => { await fresh(); await armFrames('#settingsBtn'); await p.locator('#settingsBtn').click(); const frames = await panelFrames(); result.openFrames = frames; result.openFinal = await settledOpen(frames); await p.screenshot({path: path.join(OUT, 'settings-open.png')}); await p.locator('#settingsClose').screenshot({path: path.join(OUT, 'close-control.png')}); result.closeGeometry = await p.evaluate(() => { const b = settingsClose, q = b.getBoundingClientRect(), r = document.createRange(); r.selectNodeContents(b); const t = r.getBoundingClientRect(), s = getComputedStyle(b); return {button: q.toJSON(), contents: t.toJSON(), dx: t.x + t.width / 2 - q.x - q.width / 2, dy: t.y + t.height / 2 - q.y - q.height / 2, padding: s.padding, lineHeight: s.lineHeight, display: s.display, fontSize: s.fontSize}; }); if (motion === 'normal') animated(frames, 'CSSAnimation'); assert(frames.every(f => f.focusInViewport)); return frames; });
  await run('close-control-centered', async () => { const q = result.closeGeometry; assert(Math.abs(q.dx) < .75 && Math.abs(q.dy) < .75, 'Actual icon bounds must center in button'); return q; });
  await run('settings-closing', async () => { await armFrames('#settingsClose'); await p.locator('#settingsClose').click(); const frames = await panelFrames(); result.closeFrames = frames; if (motion === 'normal') animated(frames, 'CSSTransition'); assert(await p.evaluate(() => settingsPanel.inert && !settingsPanel.classList.contains('open') && !settingsPanel.contains(document.activeElement))); return frames; });
  if (H.arg('head') === 'yes') await run('real-room-head-limits', async () => { await fresh(); await p.locator('#heroRoom').click(); await p.waitForFunction(() => window.__room?.character?.children.length && document.body.classList.contains('room-open'), null, {timeout: 30000}); await p.evaluate(() => __eyeAnim.enable(true)); const points = [[720, 450], [80, 100], [1360, 100], [80, 450], [1360, 450], [80, 820], [720, 820], [1360, 820]]; const rows = [];
    for (const [x, y] of points) { await p.mouse.move(x, y); const row = await p.evaluate(() => new Promise(resolve => { let head; __room.character.traverse(n => { if (!head && /^Head/.test(n.name || '') && n.children.length) head = n; }); const start = performance.now(), samples = []; function sample() { const d = head.position.clone().set(0, 0, -1).applyQuaternion(head.quaternion).normalize(); samples.push({at: performance.now() - start, yaw: Math.atan2(-d.x, -d.z), pitch: Math.asin(d.y)}); if (performance.now() - start < 850) requestAnimationFrame(sample); else resolve({name: head.name, samples, final: samples.at(-1)}); } sample(); })); rows.push({x, y, ...row}); if (rows.length === 4 || rows.length === 5) await p.screenshot({path: path.join(OUT, 'room-pointer-' + rows.length + '.png')}); }
    result.headSamples = rows; assert(rows.every(r => Math.abs(r.final.yaw) <= 1.31 + .015 && Math.abs(r.final.pitch) <= .87 + .015), 'Actual GLB head rotates beyond original yaw/pitch threshold'); await p.locator('#roomUp').click(); return rows;
  });
} catch (e) { result.failure = e.stack; } finally { await c?.close(); await b?.close(); result.status = !result.failure && !result.errors.length && result.checks.length === (H.arg('head') === 'yes' ? 4 : 3) && result.checks.every(x => x.status === 'PASS') ? 'PASS' : 'FAIL'; save(); if (result.status !== 'PASS') process.exitCode = 1; } })();
