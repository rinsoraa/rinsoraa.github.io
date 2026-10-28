'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),H=require('./harness.cjs');
const {arg}=H,BASE=arg('url'),OUT=arg('out'),engine=arg('browser')||'edge';
if(!BASE||!OUT)throw Error('--url and --out required');H.freshOutput(OUT);
const result={engine,harnessSHA256:require('node:crypto').createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),contract:'Actual trusted outer exit input to first usable focus <=1500ms; independent cold contexts; no chained deadline.',checks:[]};
const save=()=>fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(result,null,2));
let b,c,p,stage='identity';
async function state(){return p.evaluate(()=>window.__museumProbe?.snapshot());}
async function probe(){await p.evaluate(()=>{
 const out=window.__museumProbe={events:[],frames:[],longTasks:[],callbacks:[],start:null,first:null};const visual=e=>{let opacity=1,hidden=false;for(let n=e;n;n=n.parentElement){const c=getComputedStyle(n);opacity*=+c.opacity;hidden ||= c.display==='none'||c.visibility==='hidden';}return{opacity,hidden};};
 const snapshot=()=>{const e=document.activeElement,r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2),q=document.getElementById('mmLoad'),s=q&&getComputedStyle(q),scene=document.getElementById('mmScene');const v=visual(e);return{at:performance.now(),active:e.id||e.tagName,visual:v,rect:r.toJSON(),hit:hit?.id||hit?.className,usable:!v.hidden&&v.opacity>=.9&&e!==document.body&&e!==document.documentElement&&!e.disabled&&!e.closest('[hidden],[inert],[aria-hidden="true"]')&&r.width>0&&r.height>0&&r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth&&(hit===e||e.contains(hit)),curtain:s?{class:q.className,opacity:+s.opacity,visibility:s.visibility,pointer:s.pointerEvents,display:s.display}:null,scene:{class:scene.className,opacity:+getComputedStyle(scene).opacity,inert:scene.inert},token:window.__museumTokenRead?.()??null,hostToken:window.__museumHostRead?.()??null,owner:{museum:RinsoraMuseum.isOpen(),room:window.RinsoraRoom?.isOpen(),settings:settingsPanel.classList.contains('open'),article:!spaPost.hidden,lab:!!document.getElementById('labDetail')?.open,memory:!!document.getElementById('memoryDetail')?.open},hash:location.hash,audio:{count:document.querySelectorAll('audio').length,same:audio===window.__savedAudio}};};
 out.snapshot=snapshot;
 function clear(s){return !s.curtain||s.curtain.display==='none'||(s.curtain.visibility==='hidden'&&s.curtain.opacity<=.01&&s.curtain.pointer==='none');}
 try{new PerformanceObserver(list=>out.longTasks.push(...list.getEntries().map(e=>({at:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});}catch{}
 const original=RinsoraMuseum.exit;RinsoraMuseum.exit=function(options){const o={...options},callback=o.onClosed;o.onClosed=function(){out.callbacks.push({at:performance.now(),event:'onClosed',snapshot:snapshot()});return callback?.apply(this,arguments);};return original.call(this,o);};
 for(const type of ['focusin','focusout','transitionrun','transitionend','transitioncancel'])document.addEventListener(type,e=>{if(type.startsWith('focus')||['mmScene','mmLoad'].includes(e.target.id))out.events.push({type,at:performance.now(),id:e.target.id,property:e.propertyName});},true);
 const recordInput=e=>{if(!out.armed||out.start!==null||!e.isTrusted)return;if(e.type==='keydown'&&!['Escape','Enter'].includes(e.key))return;if(e.type==='click'&&!e.target.closest('#mmExit'))return;out.start=performance.now();out.input={type:e.type,key:e.key,target:e.target.id,trusted:e.isTrusted};out.done=new Promise(resolve=>setTimeout(()=>resolve(snapshot()),1500));let previous=out.start;function frame(){const begin=performance.now(),s=snapshot();out.frames.push({at:s.at,gap:s.at-previous,overhead:performance.now()-begin,active:s.active,curtain:s.curtain,scene:s.scene,owner:s.owner});previous=s.at;if(s.usable&&clear(s)&&!s.owner.museum&&out.first===null)out.first=s; if(performance.now()-out.start<1600)requestAnimationFrame(frame);}requestAnimationFrame(frame);};
 document.addEventListener('keydown',recordInput,true);document.addEventListener('click',recordInput,true);
});}
(async()=>{try{
 result.identity=await H.identity(BASE);stage='launch';const pw=H.playwright();b=await(engine==='edge'?pw.chromium.launch({channel:'msedge',headless:true}):pw[engine].launch({headless:true}));result.version=b.version();
 for(let round=1;round<=Number(arg('rounds')||20);round++)for(const name of (arg('cases')||'direct').split(',')){
  const row={round,name,stage:'navigation',errors:[],requests:[]};result.checks.push(row);
  try{
   c=await b.newContext({viewport:{width:Number(arg('width')||1366),height:768},serviceWorkers:'block',reducedMotion:name==='reduced'?'reduce':'no-preference'});p=await c.newPage();p.setDefaultTimeout(8000);await p.route('https://api.github.com/**',r=>r.abort());p.on('pageerror',e=>row.errors.push(e.message));p.on('requestfailed',r=>row.requests.push({url:r.url(),failure:r.failure()}));
   if(arg('diagnostic'))for(const file of ['music-museum.js','script.js'])await p.route('**/'+file+'*',async route=>{const response=await route.fetch(),source=await response.text(),marker=file==='music-museum.js'?'const tk = state.token;':'function exitMuseum(options) {';assert.equal(source.split(marker).length,2);const extra=file==='music-museum.js'?' window.__museumTokenRead=()=>state.token;':' window.__museumHostRead=()=>museumEntryToken;';const body=source.replace(marker,marker+extra);(row.readOnlyInstrumentation||=[]).push({file,originalSHA256:require('node:crypto').createHash('sha256').update(source).digest('hex'),servedSHA256:require('node:crypto').createHash('sha256').update(body).digest('hex')});await route.fulfill({response,body});});
   await p.goto(BASE+'?ui02=1&lab=1&memory=1#'+(name==='source'?'about':'museum'),{waitUntil:'domcontentloaded',timeout:8000});
   await p.waitForFunction(()=>window.RinsoraHome&&app.classList.contains('visible'));row.stage='precondition';
   if(name==='source')await p.locator('[data-museum]').first().click();
   await p.waitForFunction(()=>window.RinsoraMuseum?.isOpen()&&+getComputedStyle(mmScene).opacity>.99&&getComputedStyle(mmLoad).visibility==='hidden');
   if(await p.evaluate(()=>RinsoraMuseum.detailOpen())){await p.keyboard.press('Escape');await p.waitForFunction(()=>RinsoraMuseum.isOpen()&&!RinsoraMuseum.detailOpen());row.innerPanelClosed=true;}
   await p.evaluate(()=>window.__savedAudio=audio);await probe();
   if(name==='no-waapi')await p.evaluate(()=>mmLoad.getAnimations=undefined);
   if(name==='pending-finished')await p.evaluate(()=>{const f=mmLoad.getAnimations.bind(mmLoad);mmLoad.getAnimations=()=>f().map(a=>({effect:a.effect,playState:a.playState,finished:new Promise(()=>{})}));});
   await p.locator('#mmExit').focus();await p.evaluate(()=>__museumProbe.armed=true);row.stage='assertion';
   if(name==='button')await p.locator('#mmExit').click();else await p.keyboard.press(round%2?'Enter':'Escape');
   if(name==='cancel-animation')await p.evaluate(()=>mmLoad.getAnimations?.().forEach(a=>a.cancel()));
   if(name==='handoff-settings')await p.keyboard.press('Control+k');
   if(name==='handoff-lab')await p.evaluate(()=>RinsoraHome.openLab('catoobot'));
   if(name==='reenter')await p.evaluate(()=>RinsoraHome.enterMuseum());
   const final=await p.evaluate(()=>__museumProbe.done);row.timeline=await p.evaluate(()=>{const {snapshot,done,...x}=__museumProbe;return x;});row.final=final;
   assert(row.timeline.start!==null,'Outer exit input must be recorded');
   if(name==='reenter'){assert(final.owner.museum);assert(final.active!=='BODY');}
   else{assert(row.timeline.first,'A usable focus must occur by the exit deadline');row.focusLatency=row.timeline.first.at-row.timeline.start;assert(row.focusLatency<=1500,'Focus restored after 1500ms: '+row.focusLatency);assert(final.usable,'Terminal focus must remain usable');assert.equal(final.audio.count,1);assert(final.audio.same);assert(!final.owner.museum);if(name==='handoff-settings')assert(final.owner.settings);else if(name==='handoff-lab')assert(final.owner.lab);else assert.equal(final.hash,'#about');}
   row.status='PASS';
  }catch(e){row.status='FAIL';row.category=H.classify(row.stage,e);row.error=e.stack;if(p){row.failureState=await H.diagnosticState(p).catch(()=>null);row.final=await state().catch(()=>null);row.timeline=await p.evaluate(()=>{const {snapshot,done,...x}=window.__museumProbe||{};return x;}).catch(()=>null);await p.screenshot({path:path.join(OUT,'FAIL-'+name+'-'+round+'.png'),timeout:3000}).catch(e=>row.captureError=String(e));}}
  finally{try{await c?.close();}catch(e){row.cleanupError=String(e);row.cleanupCategory='CLEANUP_FAILURE';}c=null;p=null;save();console.log(engine,name,round,row.status,row.category||'',row.focusLatency||'');}
 }
}catch(e){result.failure={stage,category:H.classify(stage,e),error:e.stack};}finally{await b?.close();result.status=!result.failure&&result.checks.length&&result.checks.every(x=>x.status==='PASS'&&!x.cleanupError)?'PASS':'FAIL';save();if(result.status!=='PASS')process.exitCode=1;}})();
