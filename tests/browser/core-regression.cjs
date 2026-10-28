'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const H=require('./harness.cjs'),pw=H.playwright();
const BASE=H.arg('url'), OLD=H.arg('baseline'), OUT=H.arg('out'),engine=H.arg('browser')||'edge';if(!BASE||!OLD||!OUT)throw Error('--url --baseline --out required');H.freshOutput(OUT);fs.mkdirSync(OUT+'/screenshots');let stage='launch';
const result={harnessSHA256:require('node:crypto').createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),browser:'Installed Edge, isolated nonpersistent context; one browser process, serial operations',checks:[],errors:[],consoleErrors:[],intentionalFailures:[]};
let browser,context,p;
const check=(name,detail)=>{result.checks.push({name,status:'PASS',detail});console.log('PASS '+name);};
async function settle(){await p.waitForFunction(()=>!document.getAnimations().some(a=>a.playState==='running'&&a.effect?.getComputedTiming().endTime<Infinity&&a.effect?.target?.closest?.('#app,dialog')));}
async function goto(suffix,lab=true,base=BASE){stage='navigation';await p.goto(base+suffix);await p.waitForFunction(lab=>document.getElementById('app')?.classList.contains('visible')&&(!lab||document.documentElement.dataset.labLoadState==='ready'),lab);await settle();stage='assertion';}
async function open(id='catoobot'){await p.evaluate(id=>RinsoraHome.openLab(id),id);await p.waitForFunction(()=>document.getElementById('labDetail')?.open);await settle();}
async function closed(){await p.waitForFunction(()=>!document.getElementById('labDetail')?.open);await settle();}
async function screenshot(name,fullPage=false){await settle();await p.screenshot({path:OUT+'/screenshots/'+name+'.png',fullPage});}
async function snap(){return p.evaluate(()=>{
 const bounds=el=>{const b=el.getBoundingClientRect();return{x:b.x,y:b.y+scrollY,w:b.width,h:b.height};};
 return{hero:document.querySelector('.home-hero').textContent,recent:document.querySelector('#recentFeed').textContent,tree:document.querySelector('#projectTree').textContent,
   heroBounds:document.getElementById('about').classList.contains('active')?bounds(document.querySelector('.home-hero')):null,
   treeBounds:document.getElementById('projects').classList.contains('active')?bounds(document.querySelector('#projectTree')):null,heroSrc:new URL(document.querySelector('#homeHeroImage').currentSrc).pathname,
   recentLinks:[...document.querySelectorAll('#recentFeed a')].map(a=>a.getAttribute('href')),treeLinks:[...document.querySelectorAll('#projectTree .pt-link')].map(a=>a.getAttribute('href')),
   museum:[...document.querySelectorAll('#mmLoad,#mmScene')].map(el=>({display:getComputedStyle(el).display,boxes:el.getClientRects().length})),audio:document.querySelectorAll('audio').length};
 });}
(async()=>{
 try{
  stage='identity';result.identity=await H.identity(BASE);stage='launch';result.baselineIdentity=await H.identity(OLD);browser=await (engine==='edge'?pw.chromium.launch({channel:'msedge',headless:true}):pw[engine].launch({headless:true}));result.version=browser.version();
  context=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});p=await context.newPage();p.on('pageerror',e=>result.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')result.consoleErrors.push(m.text().slice(0,500));});
  for(const mode of ['#about','?ui02=1#about','?ui02=1#projects']){
   await goto(mode,false,OLD);const before=await snap(),beforeScrollY=await p.evaluate(()=>scrollY);await goto(mode,false);const after=await snap(),afterScrollY=await p.evaluate(()=>scrollY);
   assert.deepEqual(after,before);assert.equal(await p.locator('#creativeLab,#labDetail').count(),0);
   const labRequests=await p.evaluate(()=>performance.getEntriesByType('resource').filter(x=>x.name.includes('project-lab')).length);assert.equal(labRequests,0);
   if(mode==='?ui02=1#projects')await screenshot('before-projects',true);
   check('Checkpoint-03 ordinary content/layout/links and cold museum hide: '+mode,{labRequests,beforeScrollY,afterScrollY});
  }
  for(const q of ['?lab=1#projects','?ui02=1&lab=0#projects']){await goto(q,false);assert.equal(await p.locator('#creativeLab').count(),0);check('strict non-Lab gate '+q);}
  await p.goto('about:blank');await p.goto(BASE+'?ui02=1&lab=1');await p.locator('#enterBtn:not([disabled])').waitFor();await p.locator('#enterBtn').click();await p.waitForFunction(()=>document.getElementById('app').classList.contains('visible')&&document.getElementById('about').classList.contains('active'));await settle();check('welcome screen enters the existing home app in Lab mode');
  await goto('?ui02=1&lab=1#projects');
  await p.locator('[data-lab-filter="Bot"]').click();assert.equal(await p.locator('.lab-grid .clab-card').count(),1);
  const link=p.locator('.lab-grid [href="#/lab/catoobot"]');await link.focus();const originalY=await p.evaluate(()=>scrollY);
  await link.press('Enter');await p.waitForFunction(()=>document.getElementById('labDetail').open);await settle();
  const capturedOriginY=await p.evaluate(()=>history.state.rinsoraLab.origin.y);
  assert.equal(await p.locator('#labDetailTitle').textContent(),'CatooBot');
  assert.equal(await p.evaluate(()=>getComputedStyle(document.body).overflowY),'hidden');
  for(let i=0;i<12;i++){await p.keyboard.press('Tab');assert(await p.evaluate(()=>document.getElementById('labDetail').contains(document.activeElement)));}
  await p.keyboard.press('Escape');await closed();assert(p.url().endsWith('#projects'));
  assert(Math.abs(await p.evaluate(()=>scrollY)-capturedOriginY)<2);assert.equal(await p.locator('[data-lab-filter="Bot"]').getAttribute('aria-pressed'),'true');
  assert(await p.evaluate(()=>document.activeElement?.getAttribute('href')==='#/lab/catoobot'));
  await p.goForward();await p.waitForFunction(()=>document.getElementById('labDetail').open);assert.equal(await p.locator('#labDetailTitle').textContent(),'CatooBot');
  await p.goBack();await closed();check('filter, keyboard modal containment, Escape, focus/scroll restore and same-document history',{preEnterFocusY:originalY,capturedOriginY,restoredY:await p.evaluate(()=>scrollY)});
  await p.goto('about:blank');await goto('?ui02=1&lab=1#/lab/dsh-pulse-rail');await p.waitForFunction(()=>document.getElementById('labDetail').open);
  assert.equal(await p.locator('#labDetailTitle').textContent(),'dsh-pulse-rail');await p.reload();await p.waitForFunction(()=>document.getElementById('labDetail')?.open);assert.equal(await p.locator('#labDetailTitle').textContent(),'dsh-pulse-rail');
  await p.locator('#labDetail [data-lab-close="list"]').click();await closed();assert(p.url().endsWith('#projects'));
  for(const id of ['not-a-project','%E0%A4%A','%3Cscript%3E']){await goto('?ui02=1&lab=1#/lab/'+id);await p.waitForFunction(()=>document.getElementById('labDetail').open);assert.equal(await p.locator('#labDetailTitle').textContent(),'这件作品暂时找不到');await p.keyboard.press('Escape');await closed();}
  check('direct detail, refresh, missing/malformed IDs and safe list fallback');
  await goto('?ui02=1&lab=1#projects');
  for(let i=0;i<12;i++)await p.evaluate(id=>RinsoraHome.openLab(id),i%2?'dsh-pulse-rail':'catoobot');
  assert.equal(await p.locator('#labDetail').count(),1);assert.equal(await p.locator('#labDetailTitle').textContent(),'dsh-pulse-rail');
  await p.keyboard.press('Escape');await closed();assert(p.url().endsWith('#projects'));
  await open();await p.mouse.click(3,3);await closed();check('rapid project replacement, singleton dialog and backdrop close');
  await open();await p.keyboard.press('3');await closed();assert(p.url().endsWith('#projects'));check('same-section keyboard navigation closes detail without leaving a stale Lab hash');
  await open();await p.evaluate(()=>RinsoraHome.enterMuseum());await p.locator('#mmScene.open.on').waitFor();assert.equal(await p.evaluate(()=>document.getElementById('labDetail').open),false);await p.locator('#mmExit').click();await p.waitForFunction(()=>!document.body.classList.contains('museum-open')&&getComputedStyle(document.getElementById('mmScene')).display==='none');check('museum entry from an open Lab detail clears modal and scroll lock');
  await goto('?ui02=1&cover=1&lab=1#about');
  const recent=await p.locator('#recentFeed .lab-recent').evaluateAll(nodes=>nodes.map(n=>n.dataset.projectId));
  const expected=await p.evaluate(()=>RinsoraProjects.newestFirst(RinsoraProjects.read().items).slice(0,3).map(p=>p.id));assert.deepEqual(recent,expected);
  assert.equal(await p.locator('#recentFeed .lab-recent > .lab-external').count(),3);assert.equal(await p.locator('#recentFeed .u2-post').count(),3);
  await p.locator('#floatingPlayer [data-act="play"]').press('Enter');await p.waitForFunction(()=>!document.getElementById('audio').paused&&document.getElementById('audio').currentTime>.15);
  const beforeAudio=await p.evaluate(()=>{window.__labOriginalAudio=document.getElementById('audio');return{src:__labOriginalAudio.currentSrc,time:__labOriginalAudio.currentTime};});
  await p.locator('#recentFeed .lab-recent-main').first().click();await p.waitForFunction(()=>document.getElementById('labDetail').open);await p.keyboard.press('Escape');await closed();await p.waitForFunction(()=>document.getElementById('about').classList.contains('active'));
  await p.locator('#heroProjects').click();await p.waitForFunction(()=>document.getElementById('projects').classList.contains('active'));
  await open();await p.locator('#labDetail [data-lab-close="list"]').click();await closed();
  await p.evaluate(()=>RinsoraHome.navigateTo('blog'));await settle();await p.locator('#blog a.card-title-link[href="posts/hello.html"]').click();await p.waitForFunction(()=>document.body.classList.contains('spa-post-open')&&document.querySelector('#spaPostBody .post-wrap'));
  await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.body.classList.contains('spa-post-open'));await settle();
  await p.evaluate(()=>RinsoraHome.navigateTo('about'));await settle();
  for(let round=1;round<=3;round++){
   assert.equal(await p.locator('#coverToggle,#coverControls').count(),0);await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.mouse.move(850,450);await p.mouse.wheel(0,-900);await p.waitForFunction(()=>document.documentElement.dataset.coverState==='REVEALED');
   await p.evaluate(()=>RinsoraHome.enterMuseum());await p.locator('#mmScene.open.on').waitFor();assert.equal(await p.evaluate(()=>document.documentElement.dataset.coverState),'CLOSED');
   await p.locator('#mmExit').click();await p.waitForFunction(()=>!document.body.classList.contains('museum-open')&&getComputedStyle(document.getElementById('mmScene')).display==='none'&&getComputedStyle(document.getElementById('mmLoad')).visibility==='hidden');
  }
  const afterAudio=await p.evaluate(()=>({same:__labOriginalAudio===document.getElementById('audio'),paused:__labOriginalAudio.paused,src:__labOriginalAudio.currentSrc,time:__labOriginalAudio.currentTime,count:document.querySelectorAll('audio').length}));
  assert(afterAudio.same&&!afterAudio.paused);assert.equal(afterAudio.src,beforeAudio.src);assert(afterAudio.time>beforeAudio.time);assert.equal(afterAudio.count,1);
  check('recent order/repository links, Hero, blog history and three museum cycles keep one continuous audio',{beforeAudio,afterAudio});
  await p.locator('#heroRoom').click();await p.locator('body.room-open').waitFor({timeout:30000});await p.locator('#roomLight').click();await screenshot('room-regression');await p.locator('#roomUp').click();await p.locator('body:not(.room-open)').waitFor();
  assert(await p.evaluate(()=>__labOriginalAudio===document.getElementById('audio')&&!__labOriginalAudio.paused));check('manual 3D room, light and exit preserve playback');
  await p.evaluate(()=>RinsoraHome.navigateTo('projects'));await settle();await open();await p.keyboard.press('Control+k');await p.locator('#settingsPanel.open').waitFor();assert.equal(await p.evaluate(()=>document.getElementById('labDetail').open),false);await p.locator('#settingsClose').click();
  await p.evaluate(()=>RinsoraHome.setNight(true));await open();await screenshot('1440-night-detail');await p.locator('#labDetail [data-lab-close="list"]').click();await closed();await screenshot('1440-night-lab',true);check('settings and night theme coexist with detail');
  await p.evaluate(()=>RinsoraHome.setNight(false));
  for(const [width,height]of [[320,740],[390,844],[430,932],[768,1024]]){
   await p.setViewportSize({width,height});await goto('?ui02=1&lab=1#projects');await p.locator('.lab-featured [href="#/lab/catoobot"]').press('Enter');await p.waitForFunction(()=>document.getElementById('labDetail').open);await settle();
   const bounds=await p.locator('#labDetail .lab-dialog-panel').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await p.locator('#labDetail .lab-dialog-panel').evaluate(el=>el.scrollTop=el.scrollHeight);await screenshot(width+'-detail-bottom');assert(await p.locator('#labDetail .lab-detail-footer .lab-external').isVisible());
   await p.goBack();await closed();assert(await p.locator('.mobile-nav').isVisible());await p.locator('.mobile-nav [data-target="moments"]').click();await p.waitForFunction(()=>document.getElementById('moments').classList.contains('active'));
   check('mobile/tablet detail bounds, footer access, browser back and bottom navigation '+width,{bounds});
  }
  await p.emulateMedia({reducedMotion:'reduce'});await goto('?ui02=1&lab=1#projects');await p.locator('.lab-featured [href="#/lab/catoobot"]').press('Enter');assert.equal(await p.locator('.lab-dialog-panel').evaluate(el=>el.getAnimations().length),0);await p.keyboard.press('Escape');await closed();check('reduced-motion and Enter/Escape');
  const storage=await context.storageState();assert(!storage.origins.some(x=>x.localStorage.some(y=>/token/i.test(y.name))));check('isolated profile contains no GitHub Token');
  assert.equal(result.errors.length,0);assert.equal(result.consoleErrors.length,0);result.status='PASS';
 }catch(e){result.status='FAIL';result.category=H.classify(stage,e);result.failure=e.stack;if(p){await p.screenshot({path:OUT+'/screenshots/regression-failure.png'}).catch(()=>{});result.state=await p.evaluate(()=>({url:location.href,body:document.body.className,state:history.state,active:document.activeElement?.outerHTML.slice(0,500),scrollY})).catch(()=>null);}fs.writeFileSync(OUT+'/browser-regression-failure-'+Date.now()+'.json',JSON.stringify(result,null,2));process.exitCode=1;}
 finally{await context?.close();await browser?.close();fs.writeFileSync(OUT+'/browser-regression.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
})();
