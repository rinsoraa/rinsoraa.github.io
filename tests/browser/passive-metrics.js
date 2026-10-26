/* Passive measurements: no geometry reads, DOM writes, API wrappers or rAF. */
(function(){const f=window.__fu={lcp:[],shifts:[],long:[],events:[]};const label=e=>e?e.id?'#'+e.id:e.tagName.toLowerCase()+(typeof e.className==='string'?'.'+e.className.trim().replace(/\s+/g,'.'):''):'null',rect=r=>({x:r.x,y:r.y,w:r.width,h:r.height});
for(const type of ['largest-contentful-paint','layout-shift','longtask'])try{new PerformanceObserver(list=>{for(const e of list.getEntries()){
if(type==='largest-contentful-paint')f.lcp.push({time:e.startTime,size:e.size,url:e.url||'',element:label(e.element),html:e.element?.outerHTML.slice(0,320)});
if(type==='layout-shift')f.shifts.push({time:e.startTime,value:e.value,hadRecentInput:e.hadRecentInput,sources:e.sources.map(s=>({node:label(s.node),before:rect(s.previousRect),after:rect(s.currentRect)}))});
if(type==='longtask')f.long.push({time:e.startTime,duration:e.duration});}}).observe({type,buffered:true});}catch(_){}
const attach=()=>{if(!document.documentElement)return false;new MutationObserver(list=>{for(const e of list)if(f.events.length<250)f.events.push({name:e.attributeName,value:document.documentElement.getAttribute(e.attributeName),time:performance.now()});}).observe(document.documentElement,{attributes:true,attributeFilter:['data-memory-load-state','data-lab-load-state','data-cover-controller','data-pre-section']});return true;};if(!attach()){const boot=new MutationObserver(()=>{if(attach())boot.disconnect();});boot.observe(document,{childList:true});}
window.__rh02Keys=[];addEventListener('keydown',e=>{if(e.ctrlKey&&e.key.toLowerCase()==='k')__rh02Keys.push(performance.now());},{capture:true});
const mark=name=>f.events.push({name,time:performance.now()});document.addEventListener('DOMContentLoaded',()=>mark('DOMContentLoaded'));addEventListener('load',()=>mark('load'));
})();
