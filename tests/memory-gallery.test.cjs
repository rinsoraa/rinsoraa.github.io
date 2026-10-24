'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {model,audit}=require('../tools/check-memory-gallery.cjs'),M=model();
const root=path.resolve('tests/fixtures/memory-gallery'),fixture=JSON.parse(fs.readFileSync(path.join(root,'memory-gallery-data.json'),'utf8'));
const copy=x=>JSON.parse(JSON.stringify(x)),allowed={allowFixtures:true};
const production=JSON.parse(fs.readFileSync('memory-gallery-data.json','utf8'));
// Real memories may be added by the manager. Production stays schema-valid and
// fixture-free, rather than being permanently required to contain zero items.
assert(production.items.length<=M.LIMITS.items);assert.notEqual(production.testFixture,true);assert.equal(M.validate(production).length,0);
assert(M.validate(fixture).length);assert.equal(M.validate(fixture,allowed).length,0);
for(const [search,enabled]of [['',false],['?memory=1',false],['?ui02=1',false],['?ui02=0&memory=1',false],['?ui02=1&memory=1',true],['?ui02=1&lab=1&cover=1&memory=1',true]])assert.equal(M.enabled(search),enabled);
for(const count of [0,1,2,3,7]){
 const doc=copy(fixture);doc.items=doc.items.slice(0,count);const before=JSON.stringify(doc),built=M.build(doc,allowed);
 assert.equal(built.items.length,count);assert.equal(JSON.stringify(doc),before,'input is not mutated');assert.equal(built.filter('not-present').length,0);
 assert.equal(built.featured?.id,count?'test-memory-01':undefined);
 for(let i=1;i<built.items.length;i++)assert(built.items[i-1].date>=built.items[i].date);
}
const sameDay=copy(fixture);sameDay.items.forEach(i=>i.date='2020-01-01');assert.equal(M.build(sameDay,allowed).items.length,7,'date is never a unique identity or Moments relationship');
const built=M.build(fixture,allowed);assert.equal(built.find('unknown'),null);assert.equal(built.filter('minecraft').length,3);assert.equal(built.filter('empty').length,0);
assert.equal(M.media(built.find('test-memory-01')).length,3);
const noFeatured=copy(fixture);noFeatured.items.forEach(i=>delete i.featuredRank);assert.equal(M.build(noFeatured,allowed).featured,null,'image presence never promotes a feature');
const tied=copy(fixture);tied.items[1].featuredRank=0;assert.equal(M.build(tied,allowed).featured.id,'test-memory-01','feature tie is stable by ID');
const invalid=[
 d=>d.items[0].id='../escape',d=>d.items.push(copy(d.items[0])),d=>d.items[0].date='2026-02-30',d=>d.items[0].date='2026.01.01',
 d=>d.items[0].title='',d=>d.items[0].title='x'.repeat(141),d=>d.items[0].story='x'.repeat(6001),d=>d.items[0].tags='wrong',d=>d.items[0].tags=[1],
 d=>d.items[0].cover.width=0,d=>d.items[0].cover.height=9000,d=>Object.assign(d.items[0].cover,{width:8192,height:8192}),d=>d.items[0].cover.alt='',
 d=>d.items[0].cover.src='javascript:alert(1)',d=>d.items[0].cover.src='data:image/png;base64,a',d=>d.items[0].cover.src='https://example.com/image.webp',
 d=>d.items[0].cover.src='assets/projects/test-memory-01/cover.webp',d=>d.items[0].cover.src='assets/memories/test-memory-01/../cover.webp',
 d=>d.items[0].cover.src='assets/memories/test-memory-01/%2e%2e.webp',d=>d.items[0].cover.src='assets/memories/test-memory-02/cover.webp',
 d=>d.items[0].cover.src='assets/memories/test-memory-01/cover.svg',d=>d.items[0].gallery=Array(13).fill(d.items[0].cover),
 d=>d.items[0].source.publicConfirmed=false,d=>delete d.items[0].source,d=>d.items[0].source.url='javascript:alert(1)',
 d=>d.items[0].source.url='https://user:password@example.com/',d=>d.items[0].source.kind='unknown',
 d=>delete d.testFixture,d=>d.items[0].category='not-in-categories',d=>d.categories.push(copy(d.categories[0])),
 d=>d.items[0].featuredRank=-1,d=>d.items[0].featuredRank=0.5,d=>d.items[0].projectId='not-a-project',d=>d.items=Array(121).fill(d.items[0])
];
for(const mutate of invalid){const doc=copy(fixture);mutate(doc);assert(M.validate(doc,allowed).length,'invalid fixture accepted: '+mutate);}
const xss=copy(fixture);xss.items[0].title='<img src=x onerror=alert(1)>';xss.items[0].cover.alt='<script>alert(1)</script>';assert.equal(M.validate(xss,allowed).length,0,'untrusted markup is safe text, rendering must use textContent');
const extraCategory=copy(fixture);extraCategory.categories.push({id:'another-kind',label:'未来分类'});assert.equal(M.build(extraCategory,allowed).categories.length,6);
assert.equal(audit(root,fixture,allowed).errors.length,0);
const missing=copy(fixture);missing.items[0].cover.src=missing.items[0].cover.src.replace('cover.webp','missing.webp');assert(audit(root,missing,allowed).errors.length);
const mismatch=copy(fixture);mismatch.items[0].cover.width++;assert(audit(root,mismatch,allowed).errors.some(e=>e.includes('dimensions mismatch')));
const fakeExt=copy(fixture);fakeExt.items[0].cover.src=fakeExt.items[0].cover.src.replace('.webp','.png');assert(audit(root,fakeExt,allowed).errors.length);
// Actual PNG/JPEG signatures and metadata, confined to our own temporary fixture.
const os=require('node:os'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'rinsora-memory-test-'));
try{
 const local=copy(fixture);local.items=local.items.slice(0,1);local.items[0].gallery=[];
 for(const extension of ['png','jpg']){
  const target='assets/memories/test-memory-01/format.'+extension,dest=path.join(temporary,target);
  fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync('tests/fixtures/media-manager/TEST-FIXTURE.'+extension,dest);
  const meta={src:target,width:960,height:540,alt:'TEST FIXTURE / '+extension};
  local.items[0].cover=meta;assert.equal(audit(temporary,local,allowed).errors.length,0);
 }
}finally{
 assert.equal(path.dirname(path.resolve(temporary)),path.resolve(os.tmpdir()));assert(path.basename(temporary).startsWith('rinsora-memory-test-'));
 fs.rmSync(temporary,{recursive:true,force:true});
}
// The independent model cannot alias or rewrite original text records.
const c={URL,URLSearchParams,window:{RINSORA_MOMENTS:{items:[{date:'2020.01.01',text:'same day / A'},{date:'2020.01.01',text:'same day / B'}]}}};
vm.runInNewContext(fs.readFileSync('memory-gallery-model.js','utf8'),c);const original=JSON.stringify(c.window.RINSORA_MOMENTS);c.window.RinsoraMemoryModel.build(fixture,allowed);assert.equal(JSON.stringify(c.window.RINSORA_MOMENTS),original);

const html=fs.readFileSync('index.html','utf8'),inline=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes("loader.src = 'memory-gallery-loader.js"));assert(inline);
function gate(search,hash='#moments'){const listeners={},appended=[],classes=new Set(),mount={hidden:true},root={dataset:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};const d={documentElement:root,readyState:'loading',addEventListener:(name,fn)=>listeners[name]=fn,getElementById:()=>mount,dispatchEvent(){},createElement:()=>({dataset:{},remove(){}}),head:{appendChild:e=>appended.push(e)}};const box={document:d,location:{search,hash},URLSearchParams,Event:class Event{constructor(type){this.type=type;}},setTimeout:()=>1,clearTimeout(){}};vm.runInNewContext(inline,box);return{appended,root,mount,box,listeners};}
for(const search of ['', '?memory=1','?ui02=1'])assert.equal(gate(search).appended.length,0,'ordinary visits create no loader/style');
assert.equal(gate('?ui02=1&memory=1').appended.filter(n=>n.src).length,1);
const bodyReservation=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes("memoryGalleryMount').hidden = false"));assert(bodyReservation);
const reserved=gate('?ui02=1&memory=1');vm.runInNewContext(bodyReservation,reserved.box);assert.equal(reserved.mount.hidden,false,'remove hidden attribute during loading; global [hidden]!important otherwise defeats reservation');
reserved.appended.find(n=>n.src).onerror();assert.equal(reserved.mount.hidden,true,'outer loader failure restores original timeline with no placeholder');
const ordinary=gate('?memory=1');vm.runInNewContext(bodyReservation,ordinary.box);assert.equal(ordinary.mount.hidden,true);

// Header resources are discovered before blocking styles; default visits keep zero requests.
assert(html.indexOf("loader.src = 'memory-gallery-loader.js") < html.indexOf('href="style.css'));
assert(html.includes("loader.fetchPriority = critical ? 'high' : 'low'"));
const noncritical=gate('?ui02=1&memory=1','#about');
assert.equal(noncritical.appended.filter(n=>n.src||n.rel==='preload').length,0,'hidden album must not compete with Cover startup');
noncritical.listeners.DOMContentLoaded();
assert.equal(noncritical.appended.filter(n=>n.src).length,1);
assert.equal(noncritical.appended.find(n=>n.src).fetchPriority,'low');
assert(html.includes('html.memory-preview #moments{scroll-margin-block-start:100svh}'),'native direct hash preserves header without changing layout height');
assert(html.includes("dispatchEvent(new Event('rinsora:memory-mount'))"));
assert(loaderSourceSafety());
function loaderSourceSafety(){
 const v=fs.readFileSync('memory-gallery-loader.js','utf8');
 return v.includes("signal: controller.signal") && v.includes("await dom") && v.includes("activate()");
}
const loader=fs.readFileSync('memory-gallery-loader.js','utf8');
async function loaderCase(failure){
 const nodes=[],classes=new Set(['memory-preview']),mount={hidden:false};let init=0,destroy=0,timer;
 const root={dataset:{memoryLoadState:'loading'},classList:{remove:x=>classes.delete(x)}};
 const d={readyState:'complete',documentElement:root,getElementById:()=>mount,dispatchEvent(){},createElement:()=>({remove(){this.removed=true;}}),head:{appendChild:n=>nodes.push(n)},querySelector:()=>({remove(){}})};
 const box={document:d,location:{search:'?ui02=1&memory=1'},URLSearchParams,AbortController,TextEncoder,Promise,
  fetch:async()=>({ok:failure!=='data',headers:{get:()=>null},text:async()=>JSON.stringify(production)}),
  setTimeout:fn=>{timer=fn;return 1;},clearTimeout(){},RinsoraMemory:{init(){init++;return true;},activate(){return true;},destroy(){destroy++;}}};box.window=box;
 vm.runInNewContext(loader,box);
 const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};await flush();
 if(failure==='timeout')timer();else{
  const css=nodes.find(n=>n.rel==='stylesheet');if(failure==='css')css.onerror();else css.onload();
  const first=nodes.find(n=>n.src);if(failure==='script')first.onerror();else first.onload();await flush();
  const second=nodes.filter(n=>n.src)[1];if(second)second.onload();
 }
 const result=await box.RinsoraMemoryReady;
 if(!failure){const count=nodes.length;vm.runInNewContext(loader,box);assert.equal(nodes.length,count,'singleton loader must not create more resources');}
 assert.equal(result,!failure);assert.equal(root.dataset.memoryLoadState,failure?'error':'ready');assert.equal(init,failure?0:1);
 if(failure){assert.equal(mount.hidden,true);assert.equal(destroy,1);assert(!classes.has('memory-preview'));nodes.forEach(n=>{if(n.onload)n.onload();});await flush();assert.equal(init,0,'late loader events must not revive gallery');}
}
async function phaseCase(timeout){
 let init=0,activated=0,destroyed=0,deadline;const listeners={},nodes=[],mount={hidden:false};
 const root={dataset:{memoryLoadState:'loading'},classList:{remove(){}}};
 const d={readyState:'loading',documentElement:root,getElementById:()=>mount,querySelector:()=>({remove(){}}),addEventListener:(name,fn)=>listeners[name]=fn,createElement:()=>({remove(){}}),head:{appendChild:n=>nodes.push(n)}};
 const box={document:d,location:{search:'?ui02=1&memory=1'},URLSearchParams,AbortController,TextEncoder,Promise,
 fetch:async()=>({ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(production)}),
 setTimeout:fn=>{deadline=fn;return 1;},clearTimeout(){},
 RinsoraMemory:{init(){init++;return true;},activate(){activated++;return true;},destroy(){destroyed++;}}};
 box.window=box;vm.runInNewContext(loader,box);
 const flush=async()=>{for(let i=0;i<25;i++)await Promise.resolve();};
 await flush();nodes.find(n=>n.rel==='stylesheet').onload();nodes.find(n=>n.src).onload();await flush();nodes.filter(n=>n.src)[1].onload();await flush();
 assert.equal(init,1,'validated album renders before unrelated DOMContentLoaded');
 assert.equal(root.dataset.memoryRendered,'1');assert.equal(activated,0,'router-dependent interaction waits');
 if(timeout){deadline();assert.equal(await box.RinsoraMemoryReady,false);listeners.DOMContentLoaded();await flush();assert.equal(activated,0);assert.equal(destroyed,1);assert.equal(mount.hidden,true);}
 else{listeners.DOMContentLoaded();assert.equal(await box.RinsoraMemoryReady,true);assert.equal(activated,1);}
}
(async()=>{await phaseCase(false);await phaseCase(true);for(const failure of [null,'css','script','data','timeout'])await loaderCase(failure);console.log('PASS memory: strict/no-request gate, counts, sort/filter/explicit feature, stable IDs, source/privacy, safe media/URLs/text, actual missing/dimension gates, independent Moments, loader failures/timeouts/late events');})().catch(e=>{console.error(e);process.exitCode=1;});
