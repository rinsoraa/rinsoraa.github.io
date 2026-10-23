'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),start=html.indexOf('// Strict Lab opt-in:');
assert(start>=0);const code=html.slice(start,html.indexOf('</script>',start));
const flush=()=>new Promise(r=>setImmediate(r));
function fixture(search,network="ok",hash="#projects"){
 const nodes=[],hints=[],classes=new Set(),timers=new Map();let count=0,inits=0,routes=0,fetches=0;
 const root={dataset:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};
 const document={readyState:'complete',documentElement:root,body:{classList:{remove(){}}},getElementById:()=>null,
  createElement:tag=>({tag,setAttribute(){},remove(){this.removed=true;}}),head:{appendChild:n=>(n.rel==='preload'?hints:nodes).push(n)}};
 const window={RinsoraProjects:{read:()=>({items:[]})},RinsoraLabModel:{validateMediaDocument:doc=>doc?.schemaVersion===1?[]:['invalid']},RinsoraLab:{enabled:true,init(){inits++;return true;}},RinsoraHome:{routeHash(){routes++;},refreshRecent(){}}};
 vm.runInNewContext(code,{window,document,location:{search,hash},URLSearchParams,Promise,Error,fetch(){fetches++;return network==='error'?Promise.reject(Error('offline')):Promise.resolve({ok:true,json:async()=>network==='invalid'?{}:{schemaVersion:1,projects:{}}});},setTimeout(fn){timers.set(++count,fn);return count;},clearTimeout:id=>timers.delete(id)});
 return{nodes,hints,classes,root,window,timers,get fetches(){return fetches;},get inits(){return inits;},get routes(){return routes;}};
}
(async()=>{
 for(const q of ['','?lab=1','?ui02=1','?ui02=1&lab=0']){const f=fixture(q);assert.equal(f.nodes.length,0);assert.equal(f.hints.length,0);assert.equal(f.fetches,0);}
 for(const hash of ['#about','#/lab/catoobot'])assert.equal(fixture('?ui02=1&lab=1','ok',hash).hints.length,0);
 const ok=fixture('?ui02=1&lab=1');ok.nodes[0].onload();ok.nodes[1].onload();await flush();ok.nodes[2].onload();await flush();ok.nodes[3].onload();
 assert.equal(ok.hints.length,2);assert(ok.hints.every(n=>n.as==='script'&&n.fetchPriority==='low'));assert.equal(ok.fetches,1);assert.equal(await ok.window.RinsoraLabReady,true);assert.equal(ok.inits,1);assert.equal(ok.routes,1);assert.equal(ok.root.dataset.labLoadState,'ready');assert.equal(ok.timers.size,0);
 const optional=fixture('?ui02=1&lab=1');optional.nodes[0].onload();optional.nodes[1].onerror();await flush();optional.nodes[2].onload();await flush();optional.nodes[3].onload();assert.equal(await optional.window.RinsoraLabReady,true);assert.equal(Object.keys(optional.window.RINSORA_PROJECT_LAB).length,0);
 const bad=fixture('?ui02=1&lab=1');bad.nodes[0].onerror();assert.equal(await bad.window.RinsoraLabReady,false);assert(!bad.classes.has('lab-preview'));assert.equal(bad.inits,0);assert.equal(bad.window.RinsoraLab.enabled,false);
 const timeout=fixture('?ui02=1&lab=1');[...timeout.timers.values()][0]();assert.equal(await timeout.window.RinsoraLabReady,false);assert.equal(timeout.inits,0);assert(timeout.nodes[0].removed);
 // A late load must never revive the failed preview or run a second init.
 timeout.nodes[0].onload();timeout.nodes[1].onload();await flush();timeout.nodes[2].onload();await flush();timeout.nodes[3].onload();await flush();assert.equal(timeout.inits,0);assert.equal(timeout.root.dataset.labLoadState,'error');
 for(const network of ['error','invalid']){const f=fixture('?ui02=1&lab=1',network);f.nodes[0].onload();f.nodes[1].onload();await flush();f.nodes[2].onload();await flush();if(f.nodes[3])f.nodes[3].onload();assert.equal(await f.window.RinsoraLabReady,false);assert.equal(f.inits,0);}
 console.log('PASS actual Lab bootstrap strict no-resource gate, serial scripts, optional enrichment recovery, CSS failure, timeout and no late revival');
})().catch(e=>{console.error(e);process.exitCode=1;});
