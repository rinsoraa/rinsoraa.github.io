'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {audit}=require('../tools/check-project-lab.cjs'),{videoInfo}=require('../tools/project-media.cjs');
const c={window:{},URL,URLSearchParams,document:{readyState:'loading',addEventListener(){},querySelector(){return null;}}};
for(const file of ['projects-data.js','projects.js','project-lab-data.js','project-lab-model.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),c);
const M=c.window.RinsoraLabModel,RP=c.window.RinsoraProjects,extra=c.window.RINSORA_PROJECT_LAB;
const id='rinsoraa-rinsoraa-github-io',real=extra[id].experience,valid=M.experience(real,id);
assert(valid);assert.equal(valid.type,'video');assert.equal(valid.source.genuine,true);
const info=videoInfo(fs.readFileSync(real.src));assert.equal(info.width,1280);assert.equal(info.height,720);assert.equal(info.audio,false);assert.equal(info.codec,'vp8');assert(Math.abs(info.duration-real.duration)<.08);
for(const change of [x=>x.src='https://evil.example/video.webm',x=>x.src='data:video/webm,evil',x=>x.src='javascript:alert(1)',x=>x.src='assets/projects/other/demo.webm',x=>x.src='assets/projects/'+id+'/../demo.webm',x=>x.src='assets/projects/'+id+'/%2e%2e.webm',x=>x.src=real.src+'?token=x',x=>x.src=real.src.replace('.webm','.mp4'),x=>x.poster=null,x=>x.poster.src='https://evil/poster.webp',x=>delete x.source,x=>x.source.genuine=false,x=>x.source.version='',x=>x.source.captured='2026-02-30',x=>x.source.note='',x=>x.duration=Infinity,x=>x.duration=121,x=>x.width=0,x=>x.poster.height=20,x=>x.mime='video/unknown',x=>x.codec='h264',x=>delete x.audio]){
 const data=structuredClone(real);change(data);assert.equal(M.experience(data,id),null);
}
const before=JSON.stringify(RP.read()),ranked=M.build(RP.read(),extra,RP.newestFirst);
assert.equal(JSON.stringify(RP.read()),before);assert.equal(ranked.find('catoobot').experience,null);assert.equal(ranked.find('dsh-pulse-rail').experience,null);
assert.equal(ranked.showcase[0].id,id);assert.deepEqual(Array.from(ranked.featured,p=>p.id),['catoobot','dsh-pulse-rail','trayhider']);
const pair={type:'compare',title:'TEST FIXTURE <title>',description:'Not public project evidence',before:real.poster,after:real.poster,source:{...real.source,method:'TEST FIXTURE',alignment:'Identical test frames; no software outcome claim'}};
assert(M.experience(pair,id));assert.equal(M.experience({...pair,after:{...pair.after,height:10}},id),null);assert.equal(M.experience({...pair,source:{...pair.source,alignment:''}},id),null);
const hostile=M.experience({...real,title:'<img src=x onerror=alert(1)>',description:'<script>alert(1)</script>'},id);assert(hostile);assert(!M.esc(hostile.title).includes('<img'));assert(!M.esc(hostile.description).includes('<script>'));
for(const data of [Buffer.from('not a webm'),fs.readFileSync(real.poster.src),fs.readFileSync(real.src).subarray(0,200)])assert.throws(()=>videoInfo(data));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rinsora-experience-'));
try{
 const dir=path.join(temp,'assets/projects',id);fs.mkdirSync(dir,{recursive:true});fs.copyFileSync(real.src,path.join(dir,'demo-cover.webm'));fs.copyFileSync(real.poster.src,path.join(dir,'demo-cover-poster.webp'));
 const data={categories:[],items:[{id}]},enrich={[id]:{experience:structuredClone(real)}};
 assert.equal(audit(temp,data,enrich,M).errors.length,0);
 for(const change of [x=>x.src=x.src.replace('demo-cover','missing'),x=>x.duration=3,x=>x.width=640,x=>x.source=null]){
  const e=structuredClone(enrich);change(e[id].experience);assert(audit(temp,data,e,M).errors.length>0);
 }
 fs.writeFileSync(path.join(dir,'demo-cover.webm'),fs.readFileSync(real.poster.src));assert(audit(temp,data,enrich,M).errors.some(x=>x.includes('unsupported WebM')));
 fs.copyFileSync(real.src,path.join(dir,'demo-cover.webm'));fs.unlinkSync(path.join(dir,'demo-cover-poster.webp'));assert(audit(temp,data,enrich,M).errors.some(x=>x.includes('missing media')));
 assert.equal(audit(temp,data,{[id]:{experience:null}},M).errors.length,0);
}finally{
 const absolute=path.resolve(temp);assert(absolute.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(absolute).startsWith('rinsora-experience-'));fs.rmSync(absolute,{recursive:true,force:true});
}
console.log('PASS real WebM track metadata, safe experience paths/provenance/poster, format/truncation/missing/dimension/duration failures, compare alignment, no-demo fallback and unchanged authoritative ordering');
