'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),H=require('./harness.cjs');
const BASE=H.arg('url'),FIX=H.arg('fixture'),OUT=H.arg('out');if(!BASE||!FIX||!OUT)throw Error('--url --fixture --out required');H.freshOutput(OUT);
const result={checks:[],conditions:'Production zero, isolated TEST FIXTURE seven, abort CSS fallback; loader12s plus observation window13s unchanged'};const save=()=>fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(result,null,2));
(async()=>{const pw=H.playwright();result.identity=await H.identity(BASE);result.fixtureIdentity=await H.identity(FIX);
for(const engine of (H.arg('browser')||'edge,firefox,webkit').split(',')){
 let b,c,p;try{b=await(engine==='edge'?pw.chromium.launch({channel:'msedge',headless:true}):pw[engine].launch({headless:true}));
 for(const mode of ['production','fixture','abort-css']){
  const row={engine,version:b.version(),mode,stage:'navigation',errors:[],requests:[]};result.checks.push(row);
  try{c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,serviceWorkers:'block'});p=await c.newPage();p.on('pageerror',e=>row.errors.push(e.message));p.on('requestfailed',r=>row.requests.push({url:r.url(),failure:r.failure()}));await p.route('https://api.github.com/**',r=>r.abort());if(mode==='abort-css')await p.route('**/memory-gallery.css*',r=>r.abort());
   await p.goto((mode==='fixture'?FIX:BASE)+'?ui02=1&memory=1#moments',{waitUntil:'commit',timeout:10000});row.stage='observation';await p.waitForFunction(expected=>document.documentElement.dataset.memoryLoadState===expected,mode==='abort-css'?'error':'ready',{timeout:13000});await p.waitForFunction(()=>window.RinsoraHome&&app.classList.contains('visible'));
   row.state=await p.evaluate(()=>({load:document.documentElement.dataset.memoryLoadState,moments:document.querySelectorAll('#momentsGrid .moment-entry').length,memories:document.querySelectorAll('.memory-card').length,audio:document.querySelectorAll('audio').length,page:RinsoraHome.AppState.currentPage,app:app.classList.contains('visible'),preview:document.documentElement.classList.contains('memory-preview')}));row.stage='assertion';assert(row.state.app);assert.equal(row.state.page,'moments');assert.equal(row.state.moments,26);assert.equal(row.state.audio,1);assert.equal(row.state.memories,mode==='fixture'?7:0);assert.equal(row.state.preview,mode!=='abort-css');row.status='PASS';
  }catch(e){row.status='FAIL';row.category=H.classify(row.stage,e);row.error=e.stack;row.final=await H.diagnosticState(p).catch(()=>null);await p?.screenshot({path:path.join(OUT,engine+'-'+mode+'-FAIL.png'),timeout:3000}).catch(()=>{});}
  finally{await c?.close();p=null;c=null;save();console.log(engine,mode,row.status);}
 }
 }catch(e){result.checks.push({engine,status:'FAIL',category:'BROWSER_LAUNCH_FAILURE',error:e.stack});}finally{await b?.close();}
}result.status=result.checks.length===9&&result.checks.every(x=>x.status==='PASS')?'PASS':result.checks.every(x=>x.status==='PASS')?'PASS':'FAIL';save();if(result.status!=='PASS')process.exitCode=1;
})().catch(e=>{result.failure={category:H.classify('identity',e),error:e.stack};result.status='FAIL';save();process.exitCode=1;});
