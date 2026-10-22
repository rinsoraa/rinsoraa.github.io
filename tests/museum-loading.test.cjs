'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('script.js','utf8');
const code=source.slice(source.indexOf('  let museumLoading = null;'),source.indexOf('  /* 移动端底栏那一项'));
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function harness(){
 const nodes=[],classes=new Set(),timers=new Map(),messages=[];let nextTimer=0;
 const c={window:{},document:{createElement(kind){return {kind,dataset:{},remove(){this.removed=true;}};},head:{appendChild(n){nodes.push(n);}}},
 body:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},AppState:{currentPage:'about',museumOpen:false},state:{museumOpen:false},location:{hash:'#about'},history:{replaceState(a,b,url){c.location.hash=url;}},
 closeNav(){},hidePost(){},closeSettings(){},toast:m=>messages.push(m),setTimeout(fn){const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(code+'\nglobalThis.api={enterMuseum,exitMuseum,status:()=>({entry:!!museumEntry,loading:!!museumLoading})};',c);
 const M={open:false,entering:false,token:0,calls:0,waiting:[],records:()=>['record'],isOpen(){return this.open;},isEntering(){return this.entering;},onExitRequest(fn){this.hostExit=fn;},enter(){this.calls++;this.entering=true;const token=++this.token;return new Promise(resolve=>this.waiting.push(()=>{if(token===this.token){this.open=true;this.entering=false;}resolve(['record']);}));},exit(){this.token++;this.open=false;this.entering=false;}};
 function node(src){return nodes.filter(n=>!n.removed&&(n.src||n.href)===src).at(-1);}
 return {c,M,nodes,timers,messages,classes,api:c.api,node,async ok(src){if(src==='music-museum.js')c.window.RinsoraMuseum=M;node(src).onload();await flush();},async error(src){node(src).onerror();await flush();},async assets(){await this.ok('music-museum.css');await this.ok('music-museum-data.js');await this.ok('music-museum.js');},async complete(){M.waiting.shift()();await flush();}};
}
(async()=>{
 const h=harness(),a=h.api.enterMuseum();assert.equal(h.api.enterMuseum(),a);assert.equal(h.nodes.length,1);assert.equal(h.c.AppState.museumOpen,false);
 await h.ok('music-museum.css');assert.equal(h.nodes.length,2);await h.ok('music-museum-data.js');assert.equal(h.nodes.length,3);await h.ok('music-museum.js');assert.equal(h.M.calls,1);await h.complete();assert.notEqual(await a,false);assert.equal(h.c.location.hash,'#museum');
 await h.api.enterMuseum();assert.equal(h.M.calls,1);h.api.exitMuseum();assert.equal(h.c.AppState.museumOpen,false);assert(!h.classes.has('museum-open'));
 const reenter=h.api.enterMuseum();await flush();h.api.exitMuseum();await h.complete();assert.equal(await reenter,false);assert.equal(h.api.status().entry,false);
 const f=harness(),bad=f.api.enterMuseum();await f.error('music-museum.css');assert.equal(await bad,false);assert.equal(f.api.status().loading,false);assert(f.nodes[0].removed);const retry=f.api.enterMuseum();await f.assets();await f.complete();assert.notEqual(await retry,false);
 const j=harness(),jsBad=j.api.enterMuseum();await j.ok('music-museum.css');await j.ok('music-museum-data.js');await j.error('music-museum.js');assert.equal(await jsBad,false);const jsRetry=j.api.enterMuseum();await flush();assert.equal(j.nodes.filter(n=>(n.src||n.href)==='music-museum.css').length,1);assert.equal(j.nodes.filter(n=>n.src==='music-museum-data.js').length,1);await j.ok('music-museum.js');await j.complete();assert.notEqual(await jsRetry,false);assert.equal(j.nodes.filter(n=>!n.removed).length,3);
 const cancel=harness(),old=cancel.api.enterMuseum();cancel.api.exitMuseum();const latest=cancel.api.enterMuseum();await cancel.assets();assert.equal(await old,false);assert.equal(cancel.M.calls,1);assert.equal(cancel.api.status().entry,true);await cancel.complete();assert.notEqual(await latest,false);
 cancel.c.location.hash='#blog';cancel.api.exitMuseum();assert.equal(cancel.c.location.hash,'#blog');
 const timeout=harness(),waiting=timeout.api.enterMuseum();[...timeout.timers.values()][0]();await flush();assert.equal(await waiting,false);assert.equal(timeout.api.status().loading,false);assert(timeout.nodes[0].removed);
 console.log('PASS production loader: CSS-before-data-before-JS, entry coalescing, no duplicate assets, CSS/JS failure retry, CSS timeout, pending cancellation, rapid reentry, stale promise isolation, explicit hash preservation');
})().catch(e=>{console.error(e);process.exitCode=1;});
