'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('script.js','utf8');
const code=source.slice(source.indexOf('  let museumLoading = null;'),source.indexOf('  /* 移动端底栏那一项'));
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function harness(){
 const nodes=[],classes=new Set(),timers=new Map(),messages=[];let nextTimer=0;
 const c={window:{},document:{createElement(kind){return {kind,dataset:{},remove(){this.removed=true;}};},head:{appendChild(n){nodes.push(n);}}},
 body:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)}},AppState:{currentPage:'about',museumOpen:false},state:{museumOpen:false},location:{hash:'#about'},history:{replaceState(a,b,url){c.location.hash=url;}},
 innerWidth:1366,innerHeight:900,getComputedStyle:()=>({visibility:'visible',display:'block',opacity:'1'}),sectionEl:()=>null,closeNav(){},hidePost(){},closeSettings(){},toast:m=>messages.push(m),setTimeout(fn){const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
 const attrs=new Map();c.app={getAttribute:k=>attrs.get(k)||null,setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k)};
 const trigger={tagName:'BUTTON',isConnected:true,disabled:false,tabIndex:0,closest:()=>null,getClientRects:()=>[{}],getBoundingClientRect:()=>({width:100,height:40,left:10,right:110,top:10,bottom:50}),setAttribute(){},focus(){c.document.activeElement=this;}};
 const fallback={...trigger,tagName:'H2',focus(){c.document.activeElement=this;}};c.document.body={...trigger,tagName:'BODY'};c.window.scrollTo=()=>{};c.document.activeElement=trigger;c.document.querySelector=()=>null;c.avatarButton=trigger;c.$=s=>s==='#sectionTitle'?fallback:trigger;
 vm.runInNewContext(code+'\nglobalThis.api={enterMuseum,exitMuseum,status:()=>({entry:!!museumEntry,loading:!!museumLoading})};',c);
 const M={open:false,entering:false,token:0,calls:0,waiting:[],records:()=>['record'],isOpen(){return this.open;},isEntering(){return this.entering;},onExitRequest(fn){this.hostExit=fn;},enter(){this.calls++;this.entering=true;const token=++this.token;return new Promise(resolve=>this.waiting.push(()=>{if(token===this.token){this.open=true;this.entering=false;}resolve(['record']);}));},closed:[],exit(o){this.token++;this.open=false;this.entering=false;if(o?.onClosed)this.closed.push(o.onClosed);return true;}};
 function node(src){return nodes.filter(n=>!n.removed&&(n.src||n.href)===src).at(-1);}
 return {c,M,trigger,fallback,nodes,timers,messages,classes,api:c.api,node,async ok(src){if(src==='music-museum.js')c.window.RinsoraMuseum=M;node(src).onload();await flush();},async error(src){node(src).onerror();await flush();},async assets(){await this.ok('music-museum.css');await this.ok('music-museum-data.js');await this.ok('music-museum.js');},async complete(){M.waiting.shift()();await flush();}};
}
(async()=>{
 const h=harness(),a=h.api.enterMuseum();assert.equal(h.api.enterMuseum(),a);assert.equal(h.nodes.length,1);assert.equal(h.c.AppState.museumOpen,false);
 await h.ok('music-museum.css');assert.equal(h.nodes.length,2);await h.ok('music-museum-data.js');assert.equal(h.nodes.length,3);await h.ok('music-museum.js');assert.equal(h.M.calls,1);await h.complete();assert.notEqual(await a,false);assert.equal(h.c.location.hash,'#museum');
 assert.equal(h.c.app.getAttribute('aria-hidden'),'true');
 const trigger=h.c.document.activeElement;
 await h.api.enterMuseum();assert.equal(h.M.calls,1);h.api.exitMuseum();assert.equal(h.c.AppState.museumOpen,false);assert(!h.classes.has('museum-open'));
 assert.equal(h.c.app.getAttribute('aria-hidden'),null);assert.equal(h.c.document.activeElement,trigger);
 const reenter=h.api.enterMuseum();await flush();h.api.exitMuseum();await h.complete();assert.equal(await reenter,false);assert.equal(h.api.status().entry,false);
 const f=harness(),bad=f.api.enterMuseum();await f.error('music-museum.css');assert.equal(await bad,false);assert.equal(f.api.status().loading,false);assert(f.nodes[0].removed);const retry=f.api.enterMuseum();await f.assets();await f.complete();assert.notEqual(await retry,false);
 const j=harness(),jsBad=j.api.enterMuseum();await j.ok('music-museum.css');await j.ok('music-museum-data.js');await j.error('music-museum.js');assert.equal(await jsBad,false);const jsRetry=j.api.enterMuseum();await flush();assert.equal(j.nodes.filter(n=>(n.src||n.href)==='music-museum.css').length,1);assert.equal(j.nodes.filter(n=>n.src==='music-museum-data.js').length,1);await j.ok('music-museum.js');await j.complete();assert.notEqual(await jsRetry,false);assert.equal(j.nodes.filter(n=>!n.removed).length,3);
 const cancel=harness(),old=cancel.api.enterMuseum();cancel.api.exitMuseum();const latest=cancel.api.enterMuseum();await cancel.assets();assert.equal(await old,false);assert.equal(cancel.M.calls,1);assert.equal(cancel.api.status().entry,true);await cancel.complete();assert.notEqual(await latest,false);
 cancel.c.location.hash='#blog';cancel.api.exitMuseum();assert.equal(cancel.c.location.hash,'#blog');
 const timeout=harness(),waiting=timeout.api.enterMuseum();[...timeout.timers.values()][0]();await flush();assert.equal(await waiting,false);assert.equal(timeout.api.status().loading,false);assert(timeout.nodes[0].removed);
 const direct=harness();direct.c.document.activeElement=direct.c.document.body;const dp=direct.api.enterMuseum();await direct.assets();await direct.complete();await dp;direct.api.exitMuseum();assert.equal(direct.c.document.activeElement,direct.c.document.body,'return waits for the real curtain callback');direct.M.closed.shift()();assert.equal(direct.c.document.activeElement,direct.fallback,'BODY is never an accepted source');assert.equal(direct.c.location.hash,'#about');
 const explicit=harness();explicit.c.document.activeElement=explicit.c.document.body;const ep=explicit.api.enterMuseum({trigger:explicit.trigger});await explicit.assets();await explicit.complete();await ep;explicit.api.exitMuseum();explicit.M.closed.shift()();assert.equal(explicit.c.document.activeElement,explicit.trigger,'explicit pointer source survives native BODY focus');
 const handoff=harness();handoff.c.document.activeElement=handoff.c.document.body;const hp=handoff.api.enterMuseum();await handoff.assets();await handoff.complete();await hp;handoff.api.exitMuseum();handoff.c.document.querySelector=()=>({id:'settingsPanel'});handoff.M.closed.shift()();assert.equal(handoff.c.document.activeElement,handoff.c.document.body,'a new modal cancels the old focus return');
 const late=harness();late.c.document.activeElement=late.c.document.body;const lp=late.api.enterMuseum();await late.assets();await late.complete();await lp;late.api.exitMuseum();const oldReturn=late.M.closed.shift();const newEntry=late.api.enterMuseum();await flush();oldReturn();assert.equal(late.c.document.activeElement,late.c.document.body,'new entry invalidates old return');late.api.exitMuseum({restoreFocus:false});await late.complete();await newEntry;
 console.log('PASS production loader: CSS-before-data-before-JS, entry coalescing, no duplicate assets, CSS/JS failure retry, CSS timeout, pending cancellation, rapid reentry, stale promise isolation, explicit hash preservation');
})().catch(e=>{console.error(e);process.exitCode=1;});
