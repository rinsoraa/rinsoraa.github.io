/* Read-only, no network: validate the independent memory document and actual raster files. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {imageSize}=require('./project-media.cjs');
function model(){const context={URL,URLSearchParams};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../memory-gallery-model.js'),'utf8'),context);return context.RinsoraMemoryModel;}
function audit(root,doc,{allowFixtures=false}={}){
 const M=model(),errors=Array.from(M.validate(doc,{allowFixtures})),files=[];
 if(Buffer.byteLength(JSON.stringify(doc),'utf8')>2097152)errors.push('Memory document exceeds 2 MiB');
 if(errors.length)return{errors,files};
 for(const item of doc.items)for(const m of M.media(item)){
  const target=path.resolve(root,m.src),owner=path.resolve(root,'assets/memories',item.id);
  try{
   if(!fs.statSync(target).isFile())throw Error('not a file');
   const relative=path.relative(owner,fs.realpathSync(target));
   if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('media escapes memory directory');
   const bytes=fs.statSync(target).size;if(bytes<1||bytes>M.LIMITS.bytes)throw Error('invalid resource size');
   const buffer=fs.readFileSync(target),actual=imageSize(buffer),extension=path.extname(target).slice(1).replace('jpg','jpeg');
   if(actual.width!==m.width||actual.height!==m.height||actual.format!==extension)throw Error('image format/dimensions mismatch');
   files.push({file:m.src,bytes,width:actual.width,height:actual.height,format:actual.format,sha256:crypto.createHash('sha256').update(buffer).digest('hex')});
  }catch(e){errors.push(m.src+': '+e.message);}
 }
 return{errors,files};
}
if(require.main===module){
 try{
  const args=process.argv.slice(2);if(args.length&&!(args.length===2&&args[0]==='--fixture'))throw Error('Usage: node tools/check-memory-gallery.cjs [--fixture <fixture-root>]');
  const root=args.length?path.resolve(args[1]):path.resolve(__dirname,'..'),input=fs.readFileSync(path.join(root,'memory-gallery-data.json'));if(input.length>2097152)throw Error('Memory document exceeds 2 MiB');const doc=JSON.parse(input.toString('utf8'));
  const r=audit(root,doc,{allowFixtures:args.length>0});if(r.errors.length)throw Error(r.errors.join('\n'));
  console.log('PASS '+(doc.testFixture?'TEST FIXTURE ':'')+'memory schema, source/public confirmation, path ownership and actual image metadata ('+doc.items.length+' memories / '+r.files.length+' images)');
 }catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={audit,model};
