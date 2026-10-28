'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const H=require('./browser/harness.cjs');
const tempRoot=fs.realpathSync(os.tmpdir());
const tmp=fs.mkdtempSync(path.join(tempRoot,'rinsora-browser-service-'));
fs.writeFileSync(path.join(tmp,'index.html'),'<!doctype html><title>TEST FIXTURE</title>');
fs.mkdirSync(path.join(tmp,'assets/music'),{recursive:true});fs.writeFileSync(path.join(tmp,'assets/music/test.mp3'),Buffer.from([1,2,3,4]));
fs.mkdirSync(path.join(tmp,'room/assets/models'),{recursive:true});fs.writeFileSync(path.join(tmp,'room/assets/models/test.glb'),Buffer.from('glTF'));
let processHandle;
async function start(flags){
 processHandle=cp.spawn(process.env.PYTHON||'python',[path.resolve('tools/serve-browser-check.py'),'--root',tmp,'--port','0',...flags],{windowsHide:true,stdio:['ignore','pipe','pipe']});
 return new Promise((resolve,reject)=>{let text='',error='';const timer=setTimeout(()=>reject(Error('server readiness timeout')),8000);processHandle.stderr.on('data',x=>error+=x);processHandle.once('error',reject);processHandle.once('exit',code=>{clearTimeout(timer);reject(Error('server exited '+code+' '+error));});processHandle.stdout.on('data',x=>{text+=x;if(text.includes('\n')){clearTimeout(timer);try{resolve(JSON.parse(text.split('\n')[0]).url);}catch(e){reject(e);}}});});
}
async function stop(){const p=processHandle;if(!p)return;await new Promise(resolve=>{p.once('exit',resolve);p.kill();});processHandle=null;}
(async()=>{try{
 let base=await start([]);assert.equal((await fetch(base+'__identity.json')).status,404);assert.equal((await fetch(base+'__test_recover?token=x')).status,404);assert.equal((await fetch(base+'__test_pcm.wav')).status,404);await stop();
 base=await start(['--test-api','--media-fixture','--request-log',path.join(tmp,'ledger.jsonl')]);
 const id=await H.identity(base);assert.equal(id.contract,'rinsora-browser-check-v1');assert.equal(id.files['index.html'].length,64);assert(!JSON.stringify(id).includes(tmp));
 let r=await fetch(base+'__test_pcm.wav',{headers:{Range:'bytes=0-3'}});assert.equal(r.status,206);assert.equal(Buffer.from(await r.arrayBuffer()).toString(),'RIFF');
 r=await fetch(base+'room/assets/models/test.glb');assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'model/gltf-binary');
 r=await fetch(base+'assets/music/test.mp3?fu3-offline=case1');assert.equal(r.status,503);
 assert.equal((await fetch(base+'__test_recover?token=case1')).status,200);
 assert.equal((await fetch(base+'assets/music/test.mp3?fu3-offline=case1')).status,200);
 const ledger=await(await fetch(base+'__requests.json')).json();assert(ledger.some(x=>x.status===503&&x.path.includes('case1')));assert(fs.readFileSync(path.join(tmp,'ledger.jsonl'),'utf8').includes('503'));
 assert.equal((await fetch(base+'docs/private.txt')).status,403);assert.equal((await fetch(base+'%2e%2e%2fsecret.txt')).status,403);
 assert((await(await fetch(base+'__requests.json')).json()).some(x=>x.status===403));
 assert.equal(H.classify('identity',Error()),'SERVER_IDENTITY_FAILURE');assert.equal(H.classify('navigation',Error()),'NAVIGATION_BEFORE_ASSERTION');assert.equal(H.classify('assertion',Object.assign(Error(),{code:'ERR_ASSERTION'})),'PRODUCT_ASSERTION_FAILURE');assert.equal(H.categories.size,8);
 console.log('PASS portable loopback service: disabled API, explicit contract, PCM/range, 503/recovery, durable ledger, traversal and mutually exclusive failure classes');
}finally{await stop();assert(path.resolve(tmp).startsWith(tempRoot+path.sep)&&path.basename(tmp).startsWith('rinsora-browser-service-'));fs.rmSync(tmp,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
