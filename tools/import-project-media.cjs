/* Import an extracted, reviewed local package. Dry run by default. No Git/API calls. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const A=require('../project-media-manager.js'),B=require('./project-media.cjs'),{audit}=require('./check-project-lab.cjs');
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
function confined(base,relative){
 if(typeof relative!=='string'||relative.includes('\\')||relative.startsWith('/')||path.isAbsolute(relative)||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe relative path');
 const root=path.resolve(base),resolved=path.resolve(root,relative);if(!resolved.startsWith(root+path.sep))throw Error('Path escapes root');
 let current=root;for(const part of relative.split('/')){current=path.join(current,part);if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw Error('Symlink/reparse paths are not allowed: '+relative);}return resolved;
}
function json(base,file){const p=confined(base,file);if(fs.statSync(p).size>2*1024*1024)throw Error('Metadata exceeds 2 MiB');return A.safe(JSON.parse(fs.readFileSync(p,'utf8')));}
function context(root){const c={window:{},URL,URLSearchParams,document:{readyState:'loading',addEventListener(){},querySelector(){return null;}}};for(const f of ['projects-data.js','projects.js','project-lab-data.js','project-lab-model.js'])vm.runInNewContext(fs.readFileSync(confined(root,f),'utf8'),c,{timeout:1500});return c.window;}
async function importPackage(folder,root,{apply=false}={}){
 folder=path.resolve(folder);root=path.resolve(root);const w=context(root),data=w.RinsoraProjects.read(),M=w.RinsoraLabModel,base=w.RINSORA_PROJECT_LAB||{},doc=json(root,'project-media-data.json');
 const previous=fs.readFileSync(confined(root,'project-media-data.json')),docErrors=M.validateMediaDocument(doc,data);if(docErrors.length)throw Error(docErrors.join('; '));
 const manifest=json(folder,'manifest.json'),patch=json(folder,'media-patch.json');
 if(manifest.schemaVersion!==1||manifest.projectId!==patch.projectId||manifest.patch!=='media-patch.json'||!Array.isArray(manifest.files)||manifest.files.length>100||Object.keys(manifest).some(k=>!['schemaVersion','projectId','patch','files'].includes(k)))throw Error('Invalid package manifest');
 const refs=A.validatePatch(patch,M,data),id=patch.projectId;
 if(await A.hash(A.canonical(A.effective(base,doc,id)))!==patch.baseMediaHash||await A.hash(A.canonical(doc.projects[id]||null))!==patch.baseOverlayHash)throw Error('Project media baseline conflict; reopen manager and review latest data');
 if(patch.media.experience&&A.canonical(patch.media.experience)!==A.canonical(A.effective(base,doc,id).experience)&&patch.media.experience.source?.verification!=='user-declared')throw Error('Changed experience must be user-declared, not independently verified');
 const seen=new Set(),verified=[],reuse=[];let total=0;
 for(const row of manifest.files){
  A.assetPath(row.path,id);if(seen.has(row.path)||!refs.includes(row.path)||!/^[a-f0-9]{64}$/.test(row.sha256||'')||!Number.isInteger(row.bytes)||row.bytes<1)throw Error('Duplicate, unreferenced or invalid package file');seen.add(row.path);total+=row.bytes;if(total>A.LIMITS.totalBytes)throw Error('Package exceeds 64 MiB');
  const input=confined(folder,row.path),target=confined(root,row.path);if(fs.statSync(input).size!==row.bytes)throw Error('File size mismatch');const buffer=fs.readFileSync(input);if(digest(buffer)!==row.sha256)throw Error('File hash mismatch');
  const info=A.inspect(buffer,path.basename(row.path));if(info.format!==row.format||info.width!==row.width||info.height!==row.height||(info.kind==='video'&&(!Number.isFinite(row.duration)||Math.abs(info.duration-row.duration)>.08||info.codec!==row.codec||info.audio!==row.audio)))throw Error('File metadata mismatch');
  if(fs.existsSync(target)){if(digest(fs.readFileSync(target))!==row.sha256)throw Error('Refusing to overwrite existing file: '+row.path);reuse.push(row.path);}else verified.push({row,buffer,target});
 }
 // Every reference, including legacy ones kept by the user, must still resolve and match its config.
 const mergedDoc=JSON.parse(JSON.stringify(doc)),oldEntry=mergedDoc.projects[id]||{};
 const provenance={...(oldEntry.provenance||{})};for(const row of manifest.files)provenance[row.path]={...patch.source,sha256:row.sha256,publicConfirmed:true};
 mergedDoc.projects[id]={...oldEntry,...patch.media,provenance};
 const errors=M.validateMediaDocument(mergedDoc,data);if(errors.length)throw Error(errors.join('; '));
 // Audit the future filesystem in a source-only temporary mirror, then discard only our own scratch files.
 const os=require('node:os'),scratch=fs.mkdtempSync(path.join(os.tmpdir(),'rinsora-media-import-'));
 try{
  for(const ref of refs){const row=manifest.files.find(x=>x.path===ref),source=row?confined(folder,ref):confined(root,ref),dest=path.join(scratch,ref);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(source,dest);}
  const future=audit(scratch,{items:data.items.filter(p=>p.id===id)},{[id]:{...base[id],...patch.media}},M);if(future.errors.length)throw Error(future.errors.join('; '));
 }finally{const absolute=path.resolve(scratch);if(!absolute.startsWith(path.resolve(os.tmpdir())+path.sep)||!path.basename(absolute).startsWith('rinsora-media-import-'))throw Error('Unsafe scratch path');fs.rmSync(absolute,{recursive:true,force:true});}
 const result={status:apply?'LOCAL_IMPORTED':'DRY_RUN_PASS',projectId:id,newFiles:verified.map(x=>x.row.path),reusedIdenticalFiles:reuse,configuration:'project-media-data.json',otherProjects:'UNCHANGED',git:'NOT_COMMITTED',remote:'NOT_PUBLISHED'};
 if(!apply)return result;
 // Existing-resource names are immutable. No retries against a fresh SHA or silent overwrites.
 const created=[],temp=confined(root,'project-media-data.'+crypto.randomUUID()+'.tmp');
 try{
  for(const x of verified){confined(root,x.row.path);fs.mkdirSync(path.dirname(x.target),{recursive:true});fs.writeFileSync(x.target,x.buffer,{flag:'wx'});created.push(x);}
  if(!fs.readFileSync(confined(root,'project-media-data.json')).equals(previous))throw Error('Configuration changed during import; no config was replaced');
  fs.writeFileSync(temp,JSON.stringify(mergedDoc,null,2)+'\n',{flag:'wx'});
  // Recheck immediately before rename; this is a local single-user import, not a multi-process transaction.
  if(!fs.readFileSync(confined(root,'project-media-data.json')).equals(previous))throw Error('Concurrent configuration update');
  fs.renameSync(temp,confined(root,'project-media-data.json'));return result;
 }catch(e){
  const recovery=[];for(const x of created){if(fs.existsSync(x.target)&&digest(fs.readFileSync(x.target))===x.row.sha256){fs.unlinkSync(x.target);}else recovery.push(x.row.path);}
  if(fs.existsSync(temp))fs.unlinkSync(temp);e.message+='; configuration not committed; newly-created unchanged media rolled back'+(recovery.length?'; inspect: '+recovery.join(', '):'');throw e;
 }
}
if(require.main===module){const args=process.argv.slice(2),folder=args[0],unknown=args.slice(1).filter(x=>x!=='--apply');if(!folder||unknown.length){console.error('Usage: node tools/import-project-media.cjs <extracted-folder> [--apply]\nWithout --apply: validates only. No Git commit or remote writes.');process.exitCode=1;}else importPackage(folder,path.resolve(__dirname,'..'),{apply:args.includes('--apply')}).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error('IMPORT_REFUSED: '+e.message);process.exitCode=1;});}
module.exports={importPackage,confined};
