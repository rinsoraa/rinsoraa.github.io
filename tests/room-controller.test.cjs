'use strict';
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const source = fs.readFileSync('room-drawer.js', 'utf8');
function harness(mobile = true, search = '') {
  let now = 0, timers = [], modules = 0, paused = true;
  const observers = [];
  const elements = new Map();
  function element() {
    const classes = new Set(), properties = new Map();
    return { children: [], style: { setProperty(k, v) { properties.set(k, v); }, getPropertyValue(k) { return properties.get(k) || ''; } }, classList: {
      add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x),
      toggle(x, on) { if (on) classes.add(x); else classes.delete(x); }
    }, setAttribute() {}, addEventListener() {}, focus() {}, appendChild(e) { this.children.push(e); return e; } };
  }
  const body = element(), activeElement = element(), handlers = {};
  const document = { body, activeElement, head: { appendChild() { modules++; } },
    createElement: element, getElementById: id => elements.get(id) || body.children.find(e => e.id === id) || null,
    addEventListener() {}, querySelector() { return null; } };
  const sandbox = { document, navigator: { userAgent: mobile ? 'iPhone' : 'Desktop' }, URLSearchParams, location: { search, hash: '#about' },
    MutationObserver: class { constructor(fn) { observers.push(fn); } observe() {} },
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
    element, flushOwnership() { observers.forEach(fn => fn()); },
    wheel(deltaY = -120, extra = {}) {
      const event = { deltaY, deltaX: 0, cancelable: true, defaultPrevented: false, target: body,
        preventDefault() { this.defaultPrevented = true; }, ...extra };
      (handlers.wheel || []).forEach(fn => fn(event)); return event;
    },
    touch(type, y) { const e = { touches: [{ clientY: y }], defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
      (handlers[type] || []).forEach(fn => fn(e)); return e; },
    progress() { return Number(body.style.getPropertyValue('--p')); },
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
  // Exercise dispatched input, not only the ownership predicate. Browser tests
  // separately send real trusted wheel input into the full website.
  for (const hash of ['#about', '#projects', '#blog', '#moments']) {
    const legacy = harness(false); legacy.sandbox.scrollY = 0; legacy.sandbox.location.hash = hash;
    assert(legacy.wheel().defaultPrevented, 'retain non-Lab column contract: ' + hash);
    assert(legacy.progress() > 0); legacy.sandbox.RinsoraRoom.leave();
  }
  for (const search of ['?lab=1', '?ui02=0&lab=1']) {
    const legacy = harness(false, search); legacy.sandbox.scrollY = 0; legacy.sandbox.location.hash = '#projects';
    assert(legacy.wheel().defaultPrevented, 'Lab requires both opt-in flags');
  }
  const blockedOwners = [
    h => { h.body.classList.add('lab-detail-open'); },
    h => { const el=h.element(); el.open=true; h.elements.set('labDetail',el); },
    h => { const el=h.element(); el.open=true; h.elements.set('labLightbox',el); },
    h => { h.sandbox.location.hash='#projects'; },
    h => { h.sandbox.location.hash='#/lab/rinsoraa-rinsoraa-github-io'; },
    h => { h.sandbox.RinsoraHome={AppState:{currentPage:'projects'}}; },
    h => { const el=h.element(); el.classList.add('active'); h.elements.set('projects',el); },
    h => { h.body.classList.add('museum-open'); },
    h => { h.body.classList.add('spa-post-open'); },
    h => { const el=h.element(); el.classList.add('open'); h.elements.set('settingsPanel',el); }
  ];
  for (const setOwner of blockedOwners) {
    const lab=harness(false,'?ui02=1&lab=1'); lab.sandbox.scrollY=0;
    assert(lab.wheel().defaultPrevented); assert(lab.progress()>0);
    setOwner(lab); lab.flushOwnership();
    assert.equal(lab.progress(),0,'ownership transition clears partial progress before next input');
    for(let i=0;i<30;i++) assert.equal(lab.wheel().defaultPrevented,false,'Lab keeps upward wheel');
    assert.equal(lab.wheel(120).defaultPrevented,false,'Lab keeps downward wheel');
    lab.advance(4000); assert.equal(lab.progress(),0,'no late auto hint/reset residue');
    assert.equal(lab.modules,0,'blocked scrolling does not request room module');
    assert.equal(lab.sandbox.RinsoraRoom.isOpen(),false);
  }
  for(const closest of ['video','compare','image']) {
    const lab=harness(false,'?ui02=1&lab=1'); lab.sandbox.scrollY=0;
    assert.equal(lab.wheel(-120,{target:{closest:()=>({type:closest})}}).defaultPrevented,false);
    assert.equal(lab.progress(),0);
  }
  const desktopTouch=harness(false,'?ui02=1&lab=1'); desktopTouch.sandbox.scrollY=0;
  desktopTouch.touch('touchstart',0); assert(desktopTouch.touch('touchmove',80).defaultPrevented);
  desktopTouch.body.classList.add('lab-detail-open'); desktopTouch.flushOwnership();
  assert.equal(desktopTouch.touch('touchmove',160).defaultPrevented,false);
  assert.equal(desktopTouch.progress(),0);
  const mobileTouch=harness(true); mobileTouch.sandbox.scrollY=0;
  mobileTouch.touch('touchstart',0); assert.equal(mobileTouch.touch('touchmove',160).defaultPrevented,false);
  assert.equal(mobileTouch.wheel().defaultPrevented,false);
  const ignored=harness(false); ignored.sandbox.scrollY=0;
  for(const extra of [{ctrlKey:true},{deltaX:200},{cancelable:false},{defaultPrevented:true}]) {
    const event=ignored.wheel(-120,extra); assert.equal(event.defaultPrevented,!!extra.defaultPrevented);
    assert.equal(ignored.progress(),0);
  }
  const welcome=harness(false); welcome.sandbox.scrollY=0;
  welcome.elements.set('welcomeScreen',{classList:{contains:()=>false},getBoundingClientRect:()=>({width:100,height:900,bottom:900,top:0})});
  assert.equal(welcome.wheel().defaultPrevented,false);
  // A gesture awaiting readiness must be rejected when pushState opens Lab.
  const race=harness(false,'?ui02=1&lab=1'); race.sandbox.scrollY=0;
  for(let i=0;i<20;i++) race.wheel(); assert.equal(race.modules,1);
  race.body.classList.add('lab-detail-open'); race.flushOwnership();
  race.ready(); race.advance(500); assert.equal(race.sandbox.RinsoraRoom.isOpen(),false);
  assert.equal(race.progress(),0);
  // An explicit button can start a fresh request after cancellation, including
  // while Lab still owns scrolling; stale completion must not clear the new one.
  const intentional=race.sandbox.RinsoraRoom.enter(); assert.equal(await intentional,true);
  race.sandbox.RinsoraRoom.leave();
  for(let i=0;i<10;i++) {
    race.body.classList.remove('lab-detail-open'); race.flushOwnership();
    delete race.sandbox.__room; for(let j=0;j<20;j++) race.wheel();
    race.body.classList.add('lab-detail-open'); race.flushOwnership();
    race.ready(); race.advance(200); assert.equal(race.sandbox.RinsoraRoom.isOpen(),false);
    assert.equal(race.progress(),0);
  }
  const adopt=harness(false,'?ui02=1&lab=1'); adopt.sandbox.scrollY=0;
  for(let i=0;i<20;i++) adopt.wheel();
  const adopted=adopt.sandbox.RinsoraRoom.enter();
  adopt.body.classList.add('lab-detail-open'); adopt.flushOwnership();
  adopt.ready(); adopt.advance(100); assert.equal(await adopted,true,'explicit action adopts pending gesture');
  adopt.sandbox.RinsoraRoom.leave();
  for(const [query,blocked]of [['?memory=1',false],['?ui02=1',false],['?ui02=1&memory=1',true],['?ui02=1&lab=1&memory=1',true]]) {
    const memory=harness(false,query);memory.sandbox.scrollY=0;memory.sandbox.location.hash='#moments';
    for(let i=0;i<7;i++)assert.equal(memory.wheel().defaultPrevented,!blocked);
    if(blocked){assert.equal(memory.progress(),0);assert.equal(memory.modules,0);}
  }
  for(const owner of ['class','dialog','section']) {
    const memory=harness(false,'?ui02=1&memory=1');memory.sandbox.scrollY=0;
    for(let i=0;i<20;i++)memory.wheel();assert.equal(memory.modules,1);
    if(owner==='class')memory.body.classList.add('memory-detail-open');
    if(owner==='dialog'){const el=memory.element();el.open=true;memory.elements.set('memoryDetail',el);}
    if(owner==='section'){const el=memory.element();el.classList.add('active');memory.elements.set('moments',el);}
    memory.flushOwnership();memory.ready();memory.advance(400);
    assert.equal(memory.sandbox.RinsoraRoom.isOpen(),false);assert.equal(memory.progress(),0);
    assert.equal(memory.wheel().defaultPrevented,false);assert.equal(memory.wheel(120).defaultPrevented,false);
    assert.equal(await memory.sandbox.RinsoraRoom.enter(),true,'explicit room entry remains independent');
  }
  console.log('PASS dispatched wheel/touch: Lab list/detail/lightbox/media isolation, overlay ownership, legacy columns, cancellation and explicit entry');
  console.log('PASS room controller: desktop/mobile lazy load, deduplication, readiness, pause/resume, scroll restore, cancellation, timeout/retry, welcome guard');
})().catch(error => { console.error(error); process.exitCode = 1; });
