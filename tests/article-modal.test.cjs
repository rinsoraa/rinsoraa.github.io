'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const text=fs.readFileSync('script.js','utf8'),a=text.indexOf('  function createArticleModalController('),z=text.indexOf('  /* article-modal-controller:end */',a);assert(a>0&&z>a);
const create=vm.runInNewContext(text.slice(a,z)+';createArticleModalController');
function fixture(){
 const events=new Map(),micro=[],requests=[],observers=[],frames=new Map();let page='blog',owner='',url='';
 function eventful(obj){obj.addEventListener=(n,f)=>{const es=events.get(obj)||{};(es[n]||=[]).push(f);events.set(obj,es);};obj.emit=(n,e={})=>{for(const f of events.get(obj)?.[n]||[])f(e);};return obj;}
 const d=eventful({activeElement:null,title:''});
 function node(tag='DIV',parent){const names=new Set(),attrs={};const e=eventful({tagName:tag,children:[],parentElement:parent||null,isConnected:true,inert:false,hidden:false,disabled:false,tabIndex:['BUTTON','A'].includes(tag)?0:-1,textContent:'',scrollTop:0,className:'',classList:{add:n=>names.add(n),remove:n=>names.delete(n),contains:n=>names.has(n)},getAttribute:n=>Object.hasOwn(attrs,n)?attrs[n]:null,setAttribute(n,v){attrs[n]=String(v);if(n==='tabindex')this.tabIndex=Number(v);},removeAttribute:n=>delete attrs[n],contains(other){for(let x=other;x;x=x.parentElement)if(x===this)return true;return false;},closest(){for(let x=this;x;x=x.parentElement)if(x.inert||x.hidden||x.getAttribute('aria-hidden')==='true')return x;return null;},getClientRects(){return this.closest()?[]:[{}];},getBoundingClientRect(){return this.rect||{top:10,bottom:50,left:10,right:100,width:90,height:40};},focus(){if(this.closest()||this.disabled||!this.isConnected)return;d.activeElement=this;d.emit('focusin',{target:this});},append(...xs){for(const x of xs){this.children.push(x);x.parentElement=this;x.isConnected=true;}},replaceChildren(...xs){for(const x of this.children){x.parentElement=null;x.isConnected=false;}this.children=[];this.append(...xs);},querySelector(s){return s==='h1'?this.heading:null;},querySelectorAll(){return[];}});parent?.children.push(e);return e;}
 d.documentElement=node('HTML');d.body=node('BODY',d.documentElement);const app=node('DIV',d.body),main=node('MAIN',app),trigger=node('A',main),fallback=node('H2',main),panel=node('DIV',app),view=node('DIV',panel),body=node('DIV',view),close=node('BUTTON',panel),label=node('H2',panel),status=node('P',panel),alreadyHidden=node('DIV',app),audio=node('AUDIO',d.body);alreadyHidden.setAttribute('aria-hidden','true');panel.hidden=panel.inert=true;trigger.setAttribute('href','posts/hello.html');view.tabIndex=0;
 panel.querySelector=s=>({'[data-post-close]':close,'#spaPostTitle':label,'#spaPostStatus':status}[s]);panel.querySelectorAll=()=>[close,view,...body.children.flatMap(x=>x.tagName==='DIV'?x.children:[])];d.querySelectorAll=()=>[];d.createElement=tag=>node(tag.toUpperCase());d.importNode=x=>x;
 let frameId=0;const w=eventful({requestAnimationFrame:fn=>{const id=++frameId;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id),innerWidth:1440,innerHeight:900,scrollY:150,location:{hash:'#blog'},getComputedStyle:()=>({display:'block',visibility:'visible'}),queueMicrotask:f=>micro.push(f),scrollTo:o=>{w.scrollY=o.top;},AbortController,fetch:(u,o)=>new Promise((resolve,reject)=>requests.push({url:u,signal:o.signal,resolve,reject})),DOMParser:class{parseFromString(t){const wrap=node('ARTICLE');wrap.heading=node('H1');wrap.heading.textContent=t;return{title:'Title '+t,querySelector:()=>t==='MISSING'?null:wrap};}},MutationObserver:class{constructor(fn){this.fn=fn;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}}});
 let state={unrelated:true};const calls=[];w.history={get state(){return state;},length:99,pushState(s,_,h){state=s;w.location.hash=h;calls.push('push');},replaceState(s,_,h){state=s;w.location.hash=h;calls.push('replace');},back(){calls.push('back');}};
 const api=create(w,d,panel,view,body,{page:()=>page,owner:()=>owner,state:x=>url=x,navigate:p=>page=p,links:()=>[trigger],fallback:()=>[fallback]});d.activeElement=trigger;
 return{api,w,d,app,main,trigger,fallback,panel,view,body,close,label,status,alreadyHidden,audio,calls,requests,observers,node,frame(){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn());},get pendingFrames(){return frames.size;},get url(){return url;},setOwner:x=>owner=x,setPage:x=>page=x,flush:()=>{while(micro.length)micro.shift()();},key(name,shiftKey=false){const e={key:name,shiftKey,prevented:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};d.emit('keydown',e);return e;}};
}
const tick=()=>new Promise(setImmediate),respond=(r,t='Hello',status=200)=>r.resolve({ok:status===200,status,text:()=>Promise.resolve(t)});
(async()=>{
 for(const bad of ['https://evil/x.html','posts/../x.html','posts/%2e%2e.html','posts/a.html?x','posts/x\\a.html','javascript:x']){const h=fixture();assert.equal(h.api.open(bad,{push:true}),false);assert.equal(h.requests.length,0);}
 {
  const h=fixture();h.api.open('posts/hello.html',{push:true,trigger:h.trigger});assert.equal(h.d.activeElement,h.close);assert.equal(h.main.getAttribute('aria-hidden'),'true');assert.equal(h.app.getAttribute('aria-hidden'),null);assert(!h.app.inert&&!h.main.inert);assert.equal(h.calls[0],'push');assert(h.w.history.state.rinsoraPost.back);assert.equal(h.panel.getAttribute('aria-hidden'),'false');
  assert(h.key('Tab').prevented);assert.equal(h.d.activeElement,h.view);h.key('Tab');assert.equal(h.d.activeElement,h.close);h.key('Tab',true);assert.equal(h.d.activeElement,h.view);
  const event={target:h.trigger,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};h.d.emit('click',event);assert(event.prevented&&event.stopped);
  respond(h.requests[0]);await tick();assert.equal(h.d.activeElement,h.view,'async load does not steal focus');assert.equal(h.label.textContent,'Hello');
  h.key('Escape');assert(h.requests[0].signal.aborted,'cancel aborts before the history event');assert.equal(h.api.open('posts/other.html',{push:true}),false,'closing owns the pending history transition');h.key('Escape');assert.equal(h.calls.filter(x=>x==='back').length,1,'repeated Esc cannot traverse unrelated history');
  const ticket=h.api.hide();h.api.restore(ticket,'blog');h.flush();assert.equal(h.d.activeElement,h.trigger);assert.equal(h.w.scrollY,150);assert.equal(h.main.getAttribute('aria-hidden'),null);assert.equal(h.alreadyHidden.getAttribute('aria-hidden'),'true');assert(h.panel.inert&&h.panel.hidden);assert(!h.d.body.classList.contains('spa-post-open'));assert(h.observers[0].disconnected);
 }
 {
  const h=fixture();h.w.location.hash='#/post/hello.html';h.api.open('posts/hello.html',{push:false});h.api.close();h.flush();assert(!h.calls.includes('back'));assert.equal(h.w.location.hash,'#blog');assert.equal(h.d.activeElement,h.fallback);assert(h.requests[0].signal.aborted);
 }
 {
  const old=fixture();old.api.open('posts/hello.html',{push:true});const state=old.w.history.state;const h=fixture();h.w.history.replaceState(state,'','#/post/hello.html');h.api.open('posts/hello.html',{push:false});h.api.close();h.flush();assert(!h.calls.includes('back'),'reloaded document never trusts another document history owner');assert.equal(h.w.location.hash,'#blog');
 }
 for(const invalid of ['disabled','removed','offscreen']){
  const h=fixture();h.api.open('posts/hello.html',{push:true});if(invalid==='disabled')h.trigger.disabled=true;if(invalid==='removed')h.trigger.isConnected=false;if(invalid==='offscreen')h.trigger.rect={top:-100,bottom:-60,left:0,right:100};const t=h.api.hide();h.api.restore(t,'blog');h.flush();assert.equal(h.d.activeElement,h.fallback,invalid);
 }
 {
  const h=fixture();h.api.open('posts/hello.html',{push:true});const first=h.requests[0];h.api.open('posts/other.html',{push:true});assert(first.signal.aborted);assert.equal(h.calls.join(','),'push,replace');respond(h.requests[1],'New');await tick();respond(first,'Old');await tick();assert.equal(h.label.textContent,'New');assert.equal(h.url,'posts/other.html');
  h.api.hide();first.reject(Error('late failure'));await tick();assert(!h.url);assert(h.panel.hidden);
 }
 {
  const h=fixture();h.api.open('posts/hello.html',{push:true});const first=h.requests[0],t=h.api.hide();h.api.restore(t,'blog');h.api.open('posts/hello.html',{push:true});h.flush();first.reject(Error('stale same-url failure'));await tick();assert.equal(h.d.activeElement,h.close);assert.equal(h.status.textContent,'正在打开文章…');respond(h.requests[1],'Current');await tick();assert.equal(h.label.textContent,'Current');
 }
 for(const type of ['http','missing','network']){
  const h=fixture();h.api.open('posts/hello.html',{push:false});if(type==='network')h.requests[0].reject(Error('offline'));else respond(h.requests[0],type==='missing'?'MISSING':'x',type==='http'?500:200);await tick();assert.equal(h.label.textContent,'文章暂时没有打开');assert.equal(h.body.getAttribute('aria-busy'),'false');assert.equal(h.body.children[0].children[2].href,'posts/hello.html');assert.equal(h.body.children[0].children[2].target,'_blank');assert.equal(h.w.location.hash,'#blog');h.api.close();h.flush();assert(h.panel.hidden);
 }
 {
  const h=fixture();h.api.open('posts/hello.html',{push:true});h.main.setAttribute('aria-hidden','false');h.setOwner('room');const other=h.node('BUTTON',h.d.body);other.focus();assert(!h.api.isOpen());assert.equal(h.d.activeElement,other);assert.equal(h.main.getAttribute('aria-hidden'),'false','external ownership not overwritten');assert.equal(h.w.location.hash,'#blog');respond(h.requests[0],'late');await tick();assert.equal(h.d.activeElement,other);
 }
 {
  const h=fixture();h.api.open('posts/hello.html',{push:true});h.w.emit('pagehide');assert(!h.api.isOpen());assert(h.requests[0].signal.aborted);respond(h.requests[0],'late pagehide');await tick();assert(h.panel.hidden);assert.equal(h.main.getAttribute('aria-hidden'),null);
 }
 // Native history/fragment scroll can land after the restoration microtask.
 {
  const h=fixture();h.api.open('posts/hello.html',{push:true,trigger:h.trigger});const t=h.api.hide();h.api.restore(t,'blog');h.flush();
  assert.equal(h.d.activeElement,h.trigger);assert.equal(h.pendingFrames,1);h.w.scrollY=730;h.frame();assert.equal(h.w.scrollY,150);assert.equal(h.d.activeElement,h.trigger);
  h.w.scrollY=900;h.frame();assert.equal(h.w.scrollY,150);assert.equal(h.pendingFrames,0,'exactly two bounded paint checks');h.w.scrollY=400;h.frame();assert.equal(h.w.scrollY,400,'no lasting scroll interception');
 }
 for(const cancel of ['owner','page','hash','input','reopen','hide','pagehide','focus']){
  const h=fixture();h.api.open('posts/hello.html',{push:true});const t=h.api.hide();h.api.restore(t,'blog');h.flush();
  const next=h.node('BUTTON',h.d.body);
  if(cancel==='owner')h.setOwner('settings');if(cancel==='page')h.setPage('moments');if(cancel==='hash')h.w.location.hash='#other';if(cancel==='input')h.d.emit('wheel',{});if(cancel==='reopen')h.api.open('posts/other.html',{push:true});if(cancel==='hide')h.api.hide();if(cancel==='pagehide')h.w.emit('pagehide');if(cancel==='focus')next.focus();
  h.w.scrollY=500;h.frame();assert.equal(h.w.scrollY,500,cancel+' must cancel stale scroll');assert.equal(h.pendingFrames,0,cancel+' releases frame');if(cancel==='focus')assert.equal(h.d.activeElement,next);
 }
 {
  const h=fixture();h.trigger.isConnected=false;h.w.scrollY=73;h.fallback.getBoundingClientRect=()=>({top:57-h.w.scrollY,bottom:96-h.w.scrollY,left:0,right:100,width:100,height:39});
  h.api.open('posts/hello.html',{push:true});const t=h.api.hide();h.api.restore(t,'blog');h.flush();assert.equal(h.d.activeElement,h.fallback);assert(h.fallback.getBoundingClientRect().top>=0);h.w.scrollY=140;h.frame();h.frame();assert(h.fallback.getBoundingClientRect().top>=0);assert.equal(h.pendingFrames,0);
 }
 {
  const h=fixture();h.w.location.hash='#/post/hello.html';h.api.open('posts/hello.html',{push:false});h.api.close();h.flush();assert.equal(h.d.activeElement,h.fallback,'same Escape does not cancel its own return');h.frame();h.frame();assert.equal(h.pendingFrames,0);
 }
 console.log('PASS actual article factory: source/return focus, sibling ARIA guards, Tab/Esc/pointer, history ownership, direct URL replacement, fetch epochs/abort/same URL, HTTP/network/missing recovery and overlay handoff');
})().catch(e=>{console.error(e);process.exitCode=1;});
