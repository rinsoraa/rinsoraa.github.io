/* Local/CI enrichment audit; no network, credentials, or writes. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {imageSize}=require('./project-media.cjs');
function audit(root,data,extra,M) {
 const errors=[],warnings=[],files=[];
 for(const [id,value]of Object.entries(extra)){
  if(!data.items.some(p=>p.id===id)){warnings.push('orphan Lab enrichment: '+id);continue;}
  if(!value||typeof value!=='object'||Array.isArray(value)){errors.push('invalid enrichment object: '+id);continue;}
  for(const key of ['id','name','category','date','status','url','tags'])if(Object.hasOwn(value,key))errors.push('duplicated authoritative field: '+id+'.'+key);
  if(value.gallery!=null&&(!Array.isArray(value.gallery)||value.gallery.length>12))errors.push('invalid gallery: '+id);
  for(const image of [value.cover,...(Array.isArray(value.gallery)?value.gallery:[])].filter(Boolean)){
   const primary=M.media(image,id);
   if(image.sources!=null&&(!Array.isArray(image.sources)||image.sources.length>6))errors.push('invalid responsive sources: '+id);
   for(const raw of [image,...(Array.isArray(image.sources)?image.sources:[])]){
    const normalized=M.media(raw,id,false);
    if(!normalized){errors.push('invalid media path/dimensions: '+id);continue;}
    if(primary&&Math.abs(normalized.width/normalized.height-primary.width/primary.height)>=.01)errors.push('responsive aspect mismatch: '+normalized.src);
    const file=path.resolve(root,normalized.src);
    if(!fs.existsSync(file)){errors.push('missing media: '+normalized.src);continue;}
    const relative=path.relative(path.resolve(root,'assets/projects',id),fs.realpathSync(file));
    if(relative.startsWith('..')||path.isAbsolute(relative)){errors.push('media escapes project directory: '+id);continue;}
    try{
     const size=imageSize(fs.readFileSync(file)),extension=path.extname(file).slice(1).toLowerCase();
     if(size.width!==normalized.width||size.height!==normalized.height)throw Error('dimension mismatch: '+size.width+'x'+size.height+' vs '+normalized.width+'x'+normalized.height);
     if((extension==='jpg'?'jpeg':extension)!==size.format)throw Error('extension/content mismatch');
     files.push({file:normalized.src,...size,bytes:fs.statSync(file).size});
    }catch(e){errors.push(normalized.src+': '+e.message);}
   }
  }
 }
 return {errors,warnings,files};
}
if(require.main===module){
 const root=path.resolve(__dirname,'..'),c={window:{},document:{readyState:'loading',addEventListener(){},querySelector(){return null;}},URL,URLSearchParams};
 for(const f of ['projects-data.js','projects.js','project-lab-data.js','project-lab-model.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
 const result=audit(root,c.window.RinsoraProjects.read(),c.window.RINSORA_PROJECT_LAB||{},c.window.RinsoraLabModel);
 for(const message of result.warnings)console.log('WARN '+message);
 for(const message of result.errors)console.log('BAD '+message);
 if(!result.errors.length)console.log('PASS Lab metadata, existing media, binary dimensions/formats and responsive variants ('+result.files.length+' entries); no authoritative duplication');
 process.exitCode=result.errors.length?1:0;
}
module.exports={audit};
