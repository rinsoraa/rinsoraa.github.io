'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('script.js','utf8'),start=source.indexOf('  function createSettingsFocusController('),end=source.indexOf('  /* settings-focus-controller:end */',start);
assert(start>0&&end>start);const create=vm.runInNewContext(source.slice(start,end)+';createSettingsFocusController');
function harness(){
 const listeners=new Map(),frames=new Map(),observers=[],microtasks=[],watches=[];let next=0,page='about',owner='',failFocus=false;
 const events=()=>({addEventListener(type,fn){const list=listeners.get(this)||{};(list[type]||=[]).push(fn);listeners.set(this,list);},emit(type,e={}){for(const fn of listeners.get(this)?.[type]||[])fn(e);}});
 const d={...events(),activeElement:null},w={...events(),queueMicrotask:fn=>microtasks.push(fn),getComputedStyle:()=>({visibility:'visible'}),requestAnimationFrame(fn){const id=++next;frames.set(id,fn);return id;},cancelAnimationFrame(id){frames.delete(id);},MutationObserver:class{constructor(fn){this.fn=fn;this.roots=[];observers.push(this);}observe(el){this.roots.push(el);}disconnect(){this.roots=[];}}};
 function node(tag='BUTTON',parent=null){const cls=new Set();const e={...events(),nodeType:1,tagName:tag,isConnected:true,parentElement:parent,children:[],inert:false,hidden:false,disabled:false,tabIndex:tag==='BUTTON'?0:-1,style:{overflow:''},scrollTop:0,attrs:{},classList:{add:c=>cls.add(c),remove:c=>cls.delete(c),contains:c=>cls.has(c)},setAttribute(k,v){this.attrs[k]=v;if(k==='tabindex')this.tabIndex=Number(v);},contains(other){for(let n=other;n;n=n.parentElement)if(n===this)return true;return false;},closest(selector=''){if(selector.includes('[role=')){for(let n=this;n;n=n.parentElement)if(n.attrs.role==='dialog'&&n.attrs['aria-modal']==='true')return n;return null;}for(let n=this;n;n=n.parentElement)if(n.inert||n.hidden)return n;return null;},matches(){return this.tagName==='BUTTON'||this.attrs.tabindex!==undefined;},getBoundingClientRect(){return this.rect||(this.tagName==='ASIDE'?{top:0,bottom:600}:{top:10,bottom:40});},getClientRects(){return this.hidden||!this.isConnected?[]:[{}];},focus(){if(failFocus||this.closest()||this.disabled||!this.isConnected)return;d.activeElement=this;d.emit('focusin',{target:this});},blur(){d.activeElement=body;}};parent?.children.push(e);return e;}
 const body=node('BODY');d.body=body;const app=node('MAIN',body),background=node('SECTION',app),trigger=node('BUTTON',background),fallback=node('H2',background),alreadyInert=node('DIV',body);alreadyInert.inert=true;
 const panel=node('ASIDE',app),mask=node('DIV',app),close=node('BUTTON',panel),tab=node('BUTTON',panel),last=node('BUTTON',panel);panel.inert=true;tab.classList.add('active');
 panel.querySelector=s=>s.includes('set-tab')?tab:close;panel.querySelectorAll=()=>[close,tab,last];d.activeElement=trigger;
 const api=create(w,d,panel,mask,{page:()=>page,owner:()=>owner,watch:fn=>{const rec={fn,active:true};watches.push(rec);return()=>rec.active=false;},fallback:()=>[fallback]});
 const key=(name,extra={})=>{const e={key:name,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extra};d.emit('keydown',e);return e;};
 return{api,w,d,app,background,node,observers,watches,flushMicrotasks(){while(microtasks.length)microtasks.shift()();},panel,mask,trigger,fallback,tab,last,close,alreadyInert,frames,key,setPage:x=>page=x,setOwner:x=>owner=x,fail:x=>failFocus=x,flush(){const list=[...frames.values()];frames.clear();list.forEach(fn=>fn());}};
}
{
 const h=harness();h.d.body.style.overflow='clip';h.api.open(h.trigger);assert.equal(h.d.activeElement,h.tab);assert(!h.app.inert&&!h.background.inert&&!h.panel.inert);assert(!h.panel.closest());assert.equal(h.panel.attrs['aria-hidden'],'false');assert.equal(h.d.body.style.overflow,'hidden');assert.equal(h.frames.size,0);
 h.last.focus();h.api.open(h.last);assert.equal(h.d.activeElement,h.last,'repeat open keeps current panel focus');h.api.close();assert.equal(h.d.activeElement,h.trigger,'original source survives repeat open');assert(!h.app.inert&&!h.background.inert&&h.alreadyInert.inert);assert(h.panel.inert);assert.equal(h.d.body.style.overflow,'clip');assert.equal(h.panel.attrs['aria-hidden'],'true');assert.equal(h.api.close(),false);
}
{
 const h=harness();h.api.open(h.trigger);h.close.focus();const tab=h.key('Tab',{shiftKey:true});assert(tab.prevented&&tab.stopped);assert.equal(h.d.activeElement,h.last);h.key('Tab');assert.equal(h.d.activeElement,h.close);h.key('k',{ctrlKey:true});h.key('Escape');assert.equal(h.d.activeElement,h.trigger);assert(!h.api.isOpen());
}
for(const change of ['disabled','hidden','removed']){
 const h=harness();h.api.open(h.trigger);if(change==='removed')h.trigger.isConnected=false;else h.trigger[change]=true;h.api.close();assert.equal(h.d.activeElement,h.fallback,change);assert.equal(h.fallback.attrs.tabindex,'-1');
}
{
 const h=harness();h.api.open(h.trigger);h.setPage('blog');h.api.close();assert.equal(h.d.activeElement,h.fallback,'changed page never restores stale source');
}
{
 const h=harness();h.api.open(h.trigger);h.api.close({restoreFocus:false});assert.equal(h.d.activeElement,h.d.body);assert(!h.app.inert);
 h.setOwner('old-dialog');const origin={page:'about',owner:'old-dialog'};h.setOwner('');h.api.open(h.trigger,origin);h.api.close();assert.equal(h.d.activeElement,h.fallback,'source overlay closed during open preparation');
}
{
 const h=harness();h.fail(true);h.api.open(h.trigger);assert.equal(h.frames.size,1);h.api.close({restoreFocus:false});h.fail(false);h.flush();assert.equal(h.frames.size,0);assert(!h.api.isOpen());
 h.api.open(h.trigger);h.d.emit('beforetoggle',{target:{tagName:'DIALOG'},newState:'open'});assert(!h.api.isOpen());assert.equal(h.d.activeElement,h.d.body);assert(!h.app.inert);
}
{
 const h=harness();h.api.open(h.trigger);h.d.activeElement=h.d.body;h.d.emit('focusin',{target:h.d.body});assert.equal(h.d.activeElement,h.tab);h.setOwner('museum');h.d.activeElement=h.d.body;h.d.emit('focusin',{target:h.d.body});assert(!h.api.isOpen());assert.equal(h.d.activeElement,h.d.body);h.api.open(h.trigger);h.w.emit('pagehide');assert(!h.api.isOpen());assert(!h.app.inert);
}
{
 const h=harness();h.api.open(h.trigger);
 for(const [target,blocked]of [[h.trigger,true],[h.tab,false],[h.mask,false]]){const e={target,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};h.d.emit('click',e);assert.equal(e.prevented,blocked);assert.equal(e.stopped,blocked);}
 h.api.close();const e={target:h.trigger,preventDefault(){throw Error('closed drawer must not intercept');},stopImmediatePropagation(){throw Error('closed drawer must not intercept');}};h.d.emit('click',e);
}
{
 const h=harness();h.api.open(h.trigger);h.d.activeElement=h.d.body;h.panel.emit('focusout');h.flushMicrotasks();assert.equal(h.d.activeElement,h.tab,'native focus clear with no focusin is repaired at the event boundary');
 h.d.activeElement=h.d.body;h.panel.emit('focusout');h.api.close({restoreFocus:false});h.flushMicrotasks();assert.equal(h.d.activeElement,h.d.body,'close cancels queued focus reclaim');
 h.api.open(h.trigger);h.d.activeElement=h.d.body;h.panel.emit('focusout');h.setOwner('new-modal');h.flushMicrotasks();assert(!h.api.isOpen(),'new owner cancels rather than stealing focus');
}
{
 const h=harness();h.api.open(h.trigger);h.last.rect={top:700,bottom:730};h.close.focus();h.key('Tab',{shiftKey:true});assert.equal(h.d.activeElement,h.last);assert.equal(h.panel.scrollTop,138,'only the internal panel scrolls to reveal focused controls');
}
assert(source.includes("!app?.classList.contains('visible') && !html.hasAttribute('data-pre-section')"));
{
 const h=harness();h.api.open(h.trigger);const old=h.watches[0];assert(old.active);h.setOwner('musicModal');old.fn();assert(!h.api.isOpen()&&!old.active);h.setOwner('');h.api.open(h.trigger);old.fn();assert(h.api.isOpen(),'stale ownership callback cannot close a newer session');h.api.close();assert(!h.watches.at(-1).active);
 h.api.open(h.trigger);const modal=h.node('DIV',h.d.body);modal.attrs.role='dialog';modal.attrs['aria-modal']='true';const input=h.node('INPUT',modal);input.focus();assert(!h.api.isOpen());assert.equal(h.d.activeElement,input,'another ARIA modal keeps its focus');
}
assert(!source.includes("addEventListener('transitionend', focusTrapGuard"));
assert(source.includes('closeSettings({ restoreFocus: false })'));
assert(/id="settingsPanel"[^>]*role="dialog"[^>]*aria-modal="true"/.test(fs.readFileSync('index.html','utf8')));
console.log('PASS settings focus: immediate source/context capture, modal mask/click/Tab containment, original-source return, invalid-source fallback, navigation/overlay cancellation, failed-focus one-frame retry, no transition dependency or late focus');
