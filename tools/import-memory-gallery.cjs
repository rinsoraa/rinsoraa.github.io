/* Offline, default read-only. No Git operations or remote API. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const A=require('../memory-media-manager.js'),{model}=require('./check-memory-gallery.cjs'),M=model();
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
function plainPath(absolute){
 const resolved=path.resolve(absolute),parts=resolved.slice(path.parse(resolved).root.length).split(path.sep);let at=path.parse(resolved).root;
 for(const p of parts){at=path.join(at,p);let s;try{s=fs.lstatSync(at);}catch(e){if(e.code==='ENOENT')continue;throw e;}if(s.isSymbolicLink())throw Error('Symlink/junction path refused');}
 return resolved;
}
function confined(base,relative){
 if(typeof relative!=='string'||relative.includes('\\')||relative.includes(':')||path.isAbsolute(relative)||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe relative path');
 const root=plainPath(base),target=plainPath(path.join(root,relative));if(!target.startsWith(root+path.sep))throw Error('Path escapes root');return target;
}
function readPackage(input){
 input=plainPath(input);const stat=fs.statSync(input);
 if(stat.isFile()){if(stat.size>A.LIMITS.zipBytes)throw Error('Package exceeds size budget');return A.packageEntries(fs.readFileSync(input));}
 if(!stat.isDirectory())throw Error('Package must be ZIP or extracted directory');
 const entries=new Map();let total=0,count=0;
 function walk(dir,depth){if(depth>5)throw Error('Package nesting too deep');for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(++count>50)throw Error('Too many package entries');const absolute=plainPath(path.join(dir,item.name)),relative=path.relative(input,absolute).split(path.sep).join('/');confined(input,relative);if(item.isDirectory())walk(absolute,depth+1);else if(item.isFile()){const n=fs.statSync(absolute).size;total+=n;if(total>A.LIMITS.zipBytes)throw Error('Package exceeds size budget');entries.set(relative,new Uint8Array(fs.readFileSync(absolute)));}else throw Error('Non-file package entry');}}
 walk(input,0);return entries;
}
function readDoc(root){const file=confined(root,'memory-gallery-data.json'),data=fs.readFileSync(file);if(data.length>2097152)throw Error('Memory JSON too large');return{file,data,doc:A.safe(JSON.parse(data.toString('utf8')))};}
function auditFuture(root,doc,entries){
 const hashes=new Map();
 for(const item of doc.items)for(const meta of M.media(item)){
  const file=confined(root,meta.src),data=entries.get(meta.src)||fs.readFileSync(file);
  const info=A.inspect(data,meta.src);if(info.width!==meta.width||info.height!==meta.height)throw Error('Actual image dimensions mismatch: '+meta.src);
  hashes.set(meta.src,digest(data));
 }
 return hashes;
}
async function importPackage(input,root,{apply=false,allowFixtures=false}={}){
 root=plainPath(root);const previous=readDoc(root),entries=readPackage(input),{manifest,patch}=await A.verifyEntries(entries);
 const merged=await A.merge(previous.doc,patch,{allowFixtures:allowFixtures||previous.doc.testFixture===true});
 const pending=[],reuse=[];
 for(const row of manifest.files){const target=confined(root,row.path);if(fs.existsSync(target)){if(!fs.statSync(target).isFile()||digest(fs.readFileSync(target))!==row.sha256)throw Error('Refusing to overwrite different existing bytes: '+row.path);reuse.push(row.path);}else pending.push({row,target,data:entries.get(row.path)});}
 const futureHashes=auditFuture(root,merged.doc,entries);
 const unchanged=A.canonical(previous.doc)===A.canonical(merged.doc);
 const status=unchanged&&!pending.length?'ALREADY_IMPORTED':apply?'LOCAL_IMPORTED':'DRY_RUN_PASS';
 const result={status,memoryId:patch.memoryId,newFiles:pending.map(x=>x.row.path),reusedIdenticalFiles:reuse,recordOperation:merged.repeated?'identical':previous.doc.items.some(x=>x.id===patch.memoryId)?'update':'create',configuration:'memory-gallery-data.json',otherMemoriesAndCategories:'PRESERVED_EXCEPT_EXPLICIT_NEW_CATEGORIES',momentsAndProjects:'NOT_WRITTEN',remote:'DISABLED',git:'NOT_COMMITTED'};
 if(!apply||status==='ALREADY_IMPORTED')return result;
 const lock=confined(root,'.memory-import.lock'),journal=confined(root,'.memory-import-journal.json');if(fs.existsSync(journal))throw Error('Unfinished import journal exists; review its recovery plan before retry');
 const token=crypto.randomUUID(),temp=confined(root,'memory-gallery-data.'+token+'.tmp');
 const backupRelative='.memory-import-backups/'+digest(previous.data)+'.json',backup=confined(root,backupRelative);
 // Validate every destination, including backup parents, before taking a lock.
 const fd=fs.openSync(lock,'wx'),created=[],recovery=[];let journalOwned=false,tempOwned=false,backupReady=false;
 try{
  if(!fs.readFileSync(previous.file).equals(previous.data))throw Error('Configuration changed after validation');
  fs.mkdirSync(path.dirname(backup),{recursive:true});if(fs.existsSync(backup)){if(!fs.readFileSync(backup).equals(previous.data))throw Error('Backup collision');}else fs.writeFileSync(backup,previous.data,{flag:'wx'});
  backupReady=true;
  const note={schemaVersion:1,memoryId:patch.memoryId,baseDocumentSha256:digest(previous.data),backup:backupRelative,plannedFiles:pending.map(x=>({path:x.row.path,sha256:x.row.sha256})),recovery:'On interruption: compare current JSON with backup; review only listed content hashes. Do not delete or overwrite unrelated files. No automatic restart.'};
  const journalFd=fs.openSync(journal,'wx');journalOwned=true;try{fs.writeFileSync(journalFd,JSON.stringify(note,null,2)+'\n');}finally{fs.closeSync(journalFd);}
  for(const x of pending){confined(root,x.row.path);fs.mkdirSync(path.dirname(x.target),{recursive:true});const imageFd=fs.openSync(x.target,'wx');created.push(x);try{fs.writeFileSync(imageFd,x.data);}finally{fs.closeSync(imageFd);}}
  for(const [name,hash] of futureHashes)if(digest(fs.readFileSync(confined(root,name)))!==hash)throw Error('Media changed during import: '+name);
  if(!fs.readFileSync(previous.file).equals(previous.data))throw Error('Concurrent configuration update; refusing replacement');
  const newBytes=Buffer.from(JSON.stringify(merged.doc,null,2)+'\n'),tempFd=fs.openSync(temp,'wx');tempOwned=true;try{fs.writeFileSync(tempFd,newBytes);}finally{fs.closeSync(tempFd);}
  if(!fs.readFileSync(previous.file).equals(previous.data))throw Error('Concurrent configuration update before commit');
  fs.renameSync(temp,previous.file);
  // Config is now committed. Failure to remove our journal is a recovery warning,
  // never a reason to roll back the media that the committed JSON references.
  try{fs.unlinkSync(journal);journalOwned=false;}catch(_){result.recoveryWarning='JSON committed; journal retained. Inspect before another import.';}
  result.backup=backupRelative;result.finalDocumentSha256=digest(newBytes);return result;
 }catch(e){
  for(const x of created){try{if(fs.existsSync(x.target)&&digest(fs.readFileSync(x.target))===x.row.sha256)fs.unlinkSync(x.target);else recovery.push(x.row.path);}catch(_){recovery.push(x.row.path);}}
  if(tempOwned&&fs.existsSync(temp))try{fs.unlinkSync(temp);}catch(_){recovery.push(path.basename(temp));}
  if(journalOwned&&!recovery.length)try{fs.unlinkSync(journal);journalOwned=false;}catch(_){recovery.push('.memory-import-journal.json');}
  e.message+='; JSON not committed; '+(recovery.length?'MANUAL_RECOVERY_REQUIRED: '+recovery.join(', '):'new unchanged assets rolled back')+'; verified backup: '+(backupReady?backupRelative:'none');
  e.recovery={configurationCommitted:false,manualPaths:recovery,backup:backupReady?backupRelative:null,backupCandidate:backupRelative,journal:journalOwned?'.memory-import-journal.json':null};throw e;
 }finally{fs.closeSync(fd);try{fs.unlinkSync(lock);}catch(_){}}
}
if(require.main===module){const args=process.argv.slice(2),input=args[0],allowed=['--apply','--allow-fixture'];if(!input||args.slice(1).some(x=>!allowed.includes(x))){console.error('Usage: node tools/import-memory-gallery.cjs <zip-or-folder> [--apply] [--allow-fixture]\nDefault DRY_RUN. --allow-fixture only for isolated test copies. No commit or network.');process.exitCode=1;}else importPackage(input,path.resolve(__dirname,'..'),{apply:args.includes('--apply'),allowFixtures:args.includes('--allow-fixture')}).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error('MEMORY_IMPORT_REFUSED: '+e.message);process.exitCode=1;});}
module.exports={importPackage,confined,readPackage,auditFuture};
