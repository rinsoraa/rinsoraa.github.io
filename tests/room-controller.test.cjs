'use strict';
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const source = fs.readFileSync('room-drawer.js', 'utf8');
function harness(mobile = true, search = '') {
  let now = 0, timers = [], modules = 0, paused = true;
  const elements = new Map();
  function element() {
    const classes = new Set();
    return { children: [], style: { setProperty() {} }, classList: {
      add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x),
      toggle(x, on) { if (on) classes.add(x); else classes.delete(x); }
    }, setAttribute() {}, addEventListener() {}, focus() {}, appendChild(e) { this.children.push(e); return e; } };
  }
  const body = element(), activeElement = element(), handlers = {};
  const document = { body, activeElement, head: { appendChild() { modules++; } },
    createElement: element, getElementById: id => elements.get(id) || null,
    addEventListener() {}, querySelector() { return null; } };
  const sandbox = { document, navigator: { userAgent: mobile ? 'iPhone' : 'Desktop' }, URLSearchParams, location: { search },
    Date: { now: () => now }, Promise, getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
    setTimeout(fn, ms) { const item = { fn, at: now + ms }; timers.push(item); return item; },
    clearTimeout(item) { timers = timers.filter(x => x !== item); },
    setInterval() { return 1; }, clearInterval() {},
    matchMedia: () => ({ matches: mobile }), scrollY: 250, innerHeight: 900,
    scrollTo(options) { sandbox.scrollY = options.top; },
    addEventListener(type, fn) { (handlers[type] ||= []).push(fn); }
  };
  sandbox.window = sandbox;
  vm.runInNewContext(source, sandbox);
  return { sandbox, body, elements, handlers, get modules() { return modules; }, get paused() { return paused; },
    ready() { sandbox.__room = { character: { children: [{}] }, pause() { paused = true; }, resume() { paused = false; } }; },
    advance(ms) {
      const end = now + ms;
      for (;;) {
        timers.sort((a,b) => a.at-b.at);
        if (!timers.length || timers[0].at > end) break;
        const item = timers.shift(); now = item.at; item.fn();
      }
      now = end;
    }
  };
}
(async () => {
  const h = harness(), api = h.sandbox.RinsoraRoom;
  assert.equal(h.modules, 0, 'mobile scene must remain unloaded');
  const first = api.enter(); assert.equal(api.enter(), first, 'repeated entry shares pending promise');
  assert.equal(h.modules, 1); assert.equal(api.isOpen(), false);
  h.ready(); h.advance(100); assert.equal(await first, true); assert.equal(h.paused, false);
  h.sandbox.scrollY = 999; api.leave(); assert.equal(h.sandbox.scrollY, 250); assert.equal(h.paused, true);
  assert.equal(api.isOpen(), false);
  delete h.sandbox.__room;
  const cancelled = api.enter(); api.leave(); h.ready(); h.advance(100);
  assert.equal(await cancelled, false); assert.equal(api.isOpen(), false);
  delete h.sandbox.__room;
  const timeout = api.enter(); h.advance(20100); assert.equal(await timeout, false);
  h.ready(); assert.equal(await api.enter(), true, 'retry after timeout'); api.leave();
  h.elements.set('welcomeScreen', { classList: { contains: () => false }, getBoundingClientRect: () => ({width:100,height:900,bottom:900,top:0}) });
  assert.equal(await api.enter(), false, 'welcome screen blocks entry');
  const desktop=harness(false);assert.equal(desktop.modules,0,'desktop scene stays lazy until entry');
  const desktopEntry=desktop.sandbox.RinsoraRoom.enter();assert.equal(desktop.modules,1);desktop.ready();desktop.advance(100);assert.equal(await desktopEntry,true);desktop.sandbox.RinsoraRoom.leave();
  for (const [search, consumes] of [['', true], ['?ui02=1', true], ['?cover=1', true], ['?ui02=1&cover=1', false]]) {
    const gesture = harness(false, search); gesture.sandbox.scrollY = 0;
    let prevented = false;
    gesture.handlers.wheel[0]({ deltaY: -120, preventDefault() { prevented = true; } });
    assert.equal(prevented, consumes, 'room gesture ownership: ' + search);
    gesture.ready();
    assert.equal(await gesture.sandbox.RinsoraRoom.enter(), true, 'explicit entry is always preserved');
    gesture.sandbox.RinsoraRoom.leave();
  }
  console.log('PASS room controller: desktop/mobile lazy load, deduplication, readiness, pause/resume, scroll restore, cancellation, timeout/retry, welcome guard');
})().catch(error => { console.error(error); process.exitCode = 1; });
