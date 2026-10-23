'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm'),assert=require('node:assert/strict');
const {audit}=require('../tools/check-project-lab.cjs'),{imageSize}=require('../tools/project-media.cjs');
const c={window:{},URL,URLSearchParams};vm.runInNewContext(fs.readFileSync('project-lab-model.js','utf8'),c);const M=c.window.RinsoraLabModel;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rinsora-project-media-'));
try{
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXa8AAAAASUVORK5CYII=','base64');
 const folder=path.join(temp,'assets/projects/fixture');fs.mkdirSync(folder,{recursive:true});for(const name of ['cover.png','screen-01.png','screen-02.png'])fs.writeFileSync(path.join(folder,name),png);
 const image=name=>({src:'assets/projects/fixture/'+name,width:1,height:1,alt:'<img onerror="x"> & "alt"',caption:'<script>caption</script>'});
 const data={categories:['Other'],items:[{id:'fixture',name:'Actual project',category:'Other',tags:[],date:'2026.10.23'}]},extra={fixture:{featuredRank:1,cover:image('cover.png'),gallery:[image('screen-01.png'),image('screen-02.png')]}};
 assert.equal(audit(temp,data,extra,M).errors.length,0);assert.deepEqual(imageSize(png),{width:1,height:1,format:'png'});
 assert(audit(temp,data,{fixture:null},M).errors.some(x=>x.includes('invalid enrichment')));
 for(const mutate of [e=>e.fixture.cover.width=2,e=>e.fixture.gallery[0].src='assets/projects/fixture/missing.png',e=>e.fixture.cover.src='../private.png',e=>e.fixture.cover.sources=[{...image('cover.png'),height:2}],e=>e.fixture.name='Duplicated identity',e=>e.fixture.cover.src='assets/projects/other/cover.png']){
  const copy=structuredClone(extra);mutate(copy);assert(audit(temp,data,copy,M).errors.length>0);
 }
 fs.writeFileSync(path.join(folder,'truncated.png'),png.subarray(0,30));const broken=structuredClone(extra);broken.fixture.cover=image('truncated.png');assert(audit(temp,data,broken,M).errors.length>0);
 fs.writeFileSync(path.join(folder,'fake.webp'),png);const fake=structuredClone(extra);fake.fixture.cover=image('fake.webp');assert(audit(temp,data,fake,M).errors.some(x=>x.includes('extension/content')));
 const noCover=M.build(data,{},null).items[0];assert(!M.portrait(noCover).includes('<img'));assert.equal(M.detailMedia(noCover).length,0);
 const p=M.build(data,extra,null).items[0];assert.equal(M.detailMedia(p).length,2);assert(M.detailMedia(p).every(x=>!x.src.includes('cover.png')),'detail gallery replaces thumbnail rather than duplicating it');
 const poster=M.portrait(p,true,true);assert(poster.includes('&lt;img'));assert(!poster.includes('onerror="x"'));assert(poster.includes('loading="eager"'));assert(poster.includes('fetchpriority="high"'));
 assert(!M.portrait(p,true,true,true).includes('<img'),'direct detail background keeps a stable identity frame without downloading an obscured thumbnail');
 const withSources=structuredClone(extra);withSources.fixture.cover.sources=[image('screen-01.png')];assert.equal(audit(temp,data,withSources,M).errors.length,0);assert(M.portrait(M.build(data,withSources,null).items[0]).includes('srcset='));
 const responsive=M.build(data,{fixture:{cover:{src:'assets/projects/fixture/cover.webp',width:960,height:600,sources:[{src:'assets/projects/fixture/small.webp',width:480,height:300}]}}},null).items[0];
 c.window.matchMedia=()=>({matches:true});assert(M.portrait(responsive).includes('<img src="assets/projects/fixture/small.webp"'));
 c.window.matchMedia=()=>({matches:false});assert(M.portrait(responsive).includes('<img src="assets/projects/fixture/cover.webp"'));delete c.window.matchMedia;
 const malicious=M.media({...image('cover.png'),sources:[{...image('screen-01.png'),src:'https://invalid.example/x.webp'}]},'fixture');assert.equal(malicious.sources.length,0);
 const ranked={...extra,other:{featuredRank:1}},two={categories:['Other'],items:[...data.items,{id:'other',name:'Without media',category:'Other',tags:[]}]};assert.equal(M.build(two,ranked,null).showcase[0].id,'fixture');assert.equal(two.items.length,2);
 assert.equal(audit(temp,data,{orphan:{}},M).warnings.length,1);
 console.log('PASS actual media binary dimensions/formats, missing/truncated/mismatched files, safe paths, responsive aspect, text escaping, cover fallback, gallery boundaries and media-led showcase');
}finally{
 const resolved=path.resolve(temp),base=path.resolve(os.tmpdir())+path.sep;
 assert(resolved.startsWith(base)&&path.basename(resolved).startsWith('rinsora-project-media-'));fs.rmSync(resolved,{recursive:true,force:true});
}
