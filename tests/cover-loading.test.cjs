'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('  // Load Cover Reveal resources');
const bootstrap=html.slice(start,html.indexOf('</script>',start));
const controller=fs.readFileSync('cover-stage.js','utf8');
function fixture(search='?ui02=1&cover=1'){
 const nodes=[],ids=new Map(),timers=new Map(),classes=new Set(),events=new Map();let next=0,reloads=0;
 function element(tag){const listeners=new Map();return{tag,dataset:{},classList:{add:x=>classes.add(x),remove:(...xs)=>xs.forEach(x=>classes.delete(x)),contains:x=>classes.has(x)},setAttribute(){},remove(){this.removed=true;},addEventListener(t,fn){listeners.set(t,fn);},emit(t){listeners.get(t)?.();}};}
 const root=element('html'),about={before(n){ids.set(n.id,n);}},doc={documentElement:root,readyState:'complete',createElement:element,querySelector(){return{setAttribute(){}};},getElementById:id=>id==='about'?about:ids.get(id),head:{appendChild:n=>nodes.push(n)},addEventListener(t,fn){events.set(t,fn);}};
 const context={document:doc,location:{search,hash:'#about',reload(){reloads++;}},window:{addEventListener(t,fn){events.set(t,fn);}},URLSearchParams,Promise,Event,console,setTimeout(fn,ms){const id=++next;timers.set(id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(bootstrap,context);
 return{context,doc,root,nodes,ids,timers,events,get reloads(){return reloads;}};
}
(async()=>{
 for(const mode of ['','?ui02=1','?cover=1'])assert.equal(fixture(mode).nodes.length,0);
 const ok=fixture(),[css,js]=ok.nodes;css.emit('load');js.emit('load');assert.equal(await css._rinsoraCoverReady,true);assert.equal(css.dataset.coverStageState,'ready');assert.equal(ok.timers.size,0);
 const bad=fixture();bad.nodes[0].emit('error');assert.equal(await bad.nodes[0]._rinsoraCoverReady,false);assert.equal(bad.root.dataset.coverLoadState,'error');assert(!bad.root.classList.contains('cover-home'));assert(bad.ids.has('coverRetry'));bad.ids.get('coverRetry').emit('click');assert.equal(bad.reloads,1);
 // Failed CSS must stay failed even if a late success event arrives.
 bad.nodes[0].emit('load');assert.equal(bad.nodes[0].dataset.coverStageState,'error');assert.equal(bad.ids.size,1);
 const script=fixture();script.nodes[1].emit('error');assert(script.ids.has('coverRetry'));assert.equal(script.root.dataset.coverLoadState,'error');
 const hanging=fixture();[...hanging.timers.values()][0].fn();assert.equal(await hanging.nodes[0]._rinsoraCoverReady,false);assert(hanging.nodes[0].removed);assert(hanging.ids.has('coverRetry'));
 const duplicate=fixture();duplicate.root.dataset.coverController='ready';const count=duplicate.nodes.length;vm.runInNewContext(controller,duplicate.context);assert.equal(duplicate.nodes.length,count);
 const alreadyFailed=fixture();alreadyFailed.root.dataset.coverLoadState='error';vm.runInNewContext(controller,alreadyFailed.context);assert.equal(alreadyFailed.root.dataset.coverController,'error');
 console.log('PASS cover bootstrap: strict gate, explicit CSS readiness, CSS/JS error recovery, bounded pending request, late events, retry and singleton guard');
})().catch(e=>{console.error(e);process.exitCode=1;});
