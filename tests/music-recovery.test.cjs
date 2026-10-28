'use strict';const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const s=fs.readFileSync('music.js','utf8'),a=s.indexOf('  function createPlaybackRecovery('),z=s.indexOf('  /* playback-recovery:end */',a);assert(a>0&&z>a);const f=vm.runInNewContext(s.slice(a,z)+';({createPlaybackRecovery,playbackMime,playableAlternative})');
function fixture(){const requests=[],events=[],audio={src:'one.ogg',error:null,canPlayType:m=>m==='audio/mpeg'?'probably':'',play(){return new Promise((resolve,reject)=>requests.push({resolve,reject}));}},ui={clear:()=>events.push('clear'),failure:k=>events.push(k),mime:f.playbackMime};return{audio,requests,events,api:f.createPlaybackRecovery(audio,ui)};}
const tick=()=>new Promise(setImmediate);
(async()=>{
 for(const [name,code,expected]of [['NotAllowedError',0,'policy'],['NetworkError',2,'network'],['NotSupportedError',4,'unsupported']]){const h=fixture();h.api.play();h.audio.error={code};h.requests[0].reject({name});await tick();assert.equal(h.events.at(-1),expected);}
 {const h=fixture();h.audio.src='one.mp3';h.api.play();h.audio.error={code:4};h.requests[0].reject({name:'NotSupportedError'});await tick();assert.equal(h.events.at(-1),'unavailable','advertised support does not prove HTTP availability');}
 {const h=fixture();h.api.play();h.api.cancel();h.requests[0].reject({name:'NotSupportedError'});await tick();assert(h.events.every(x=>x==='clear'));}
 {const h=fixture();h.api.play();h.audio.src='two.mp3';h.api.play();h.requests[0].reject({name:'NotSupportedError'});h.requests[1].resolve();await tick();assert(h.events.every(x=>x==='clear'));}
 {const h=fixture();h.api.play({quiet:true});h.requests[0].reject({name:'NotAllowedError'});await tick();assert(h.events.every(x=>x==='clear'));}
 {const h=fixture();h.api.play();h.requests[0].resolve();await tick();h.audio.error={code:2};h.api.error();assert.equal(h.events.at(-1),'network');h.api.cancel();h.api.error();assert.equal(h.events.at(-1),'clear');}
 {const h=fixture();h.api.play();h.requests[0].reject({name:'AbortError'});await tick();assert(h.events.every(x=>x==='clear'));}
 assert.equal(f.playableAlternative([{src:'one.ogg'},{src:'two.mp3'},{src:'three.ogg'}],0,fixture().audio),1);
 assert.equal(f.playableAlternative([{src:'one.ogg'}],0,fixture().audio),-1);assert.equal(f.playbackMime('https://test.invalid/song.mp3?x=1'),'audio/mpeg');assert.equal(f.playbackMime('unknown.bin'),'');
 assert(!s.slice(a,z).includes('new Audio'));assert(!s.slice(a,z).includes('requestAnimationFrame'));assert(!s.slice(a,z).includes('setTimeout'));
 console.log('PASS exact playback recovery factory: codec/policy/network classification, retry epoch, late cancel/source changes, quiet resume, no audio duplication or loops');
})().catch(e=>{console.error(e);process.exitCode=1;});
