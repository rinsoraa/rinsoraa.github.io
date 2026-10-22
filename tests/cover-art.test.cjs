'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const extract=marker=>{const start=html.indexOf(marker);assert(start>=0);return html.slice(start,html.indexOf('</script>',start));};
const hints=extract('    // Discover only the explicit Cover-home');
const art=extract('// Opt-in ambient image only');
for(const [search,hash,expected]of[['','#about',0],['?cover=1','#about',0],['?ui02=1','#about',0],['?ui02=1&cover=1','',0],['?ui02=1&cover=1','#projects',0],['?ui02=1&cover=1','#about',5]]){
 const nodes=[];vm.runInNewContext(hints,{document:{head:{appendChild:n=>nodes.push(n)},createElement:()=>({})},location:{search,hash},URLSearchParams});assert.equal(nodes.length,expected);
 if(expected){const images=nodes.filter(n=>n.as==='image');assert.equal(images.length,2);assert(images.every(n=>n.fetchPriority==='high'&&n.type==='image/webp'));assert.deepEqual(images.map(n=>n.media),['(max-width: 430px)','(min-width: 431px)']);assert(!nodes.some(n=>n.href.endsWith('.png')));}
}
function fixture(enabled=true){
 const nodes=[],values=new Set(),listeners=new Map();let resolveCSS;
 const image={currentSrc:'https://local/cover-bedroom-mobile.webp',addEventListener:(t,fn)=>listeners.set(t,fn),decode:()=>Promise.resolve()};
 const sources=[{},{}].map(n=>Object.assign(n,{removeAttribute(k){delete this[k];}}));
 const styles=new Map([['display','none']]);
 const stage={setAttribute(){},style:{setProperty:(k,v)=>styles.set(k,v),removeProperty:k=>styles.delete(k)},classList:{add:x=>values.add(x),remove:x=>values.delete(x)},querySelector:()=>image,querySelectorAll:()=>sources,dispatchEvent(){}};
 const doc={documentElement:{classList:{contains:()=>enabled},dataset:{}},body:{appendChild:n=>nodes.push(n)},createElement:()=>stage,querySelector:()=>({_rinsoraCoverReady:new Promise(r=>resolveCSS=r)})};
 const context={document:doc,window:{},location:{hash:'#about'},Event};vm.runInNewContext(art,context);
 return{nodes,values,styles,image,sources,listeners,resolveCSS,context};
}
(async()=>{
 assert.equal(fixture(false).nodes.length,0);
 const f=fixture();assert.equal(f.nodes.length,1);assert.equal(f.styles.get('display'),'none');assert(f.sources[0].srcset.endsWith('mobile.webp'));assert(f.sources[1].srcset.endsWith('desktop.webp'));
 f.resolveCSS(true);await Promise.resolve();assert(!f.styles.has('display'));
 await f.listeners.get('load')();assert(f.values.has('art-ready'));assert(f.styles.get('--cover-image').includes('mobile.webp'));
 f.listeners.get('error')();assert(f.sources.every(s=>!s.srcset));assert(f.image.src.endsWith('.png'));
 f.listeners.get('error')();assert(f.context.window.RinsoraCoverArt.failed);assert(!f.values.has('art-ready'));
 const bad=fixture();bad.resolveCSS(false);await Promise.resolve();assert.equal(bad.styles.get('display'),'none');
 console.log('PASS cover art: strict resource hints, exclusive media selection, CSS first-frame gate, decoded single surface and bounded PNG fallback');
})().catch(e=>{console.error(e);process.exitCode=1});
