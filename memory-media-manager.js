/* Local preparation only. Shared ZIP/hash primitives; independent Memory schema. */
(function(root,factory){'use strict';if(typeof module==='object'&&module.exports){require('./memory-gallery-model.js');module.exports=factory(require('./project-media-binary.js'),require('./project-media-manager.js'),globalThis.RinsoraMemoryModel);}else root.RinsoraMemoryManager=factory(root.RinsoraMediaBinary,root.RinsoraMediaManager,root.RinsoraMemoryModel);})(typeof window==='object'?window:globalThis,function(B,A,M){
'use strict';
const LIMITS=Object.freeze({imageBytes:M.LIMITS.bytes,pixels:M.LIMITS.pixels,dimension:8192,totalBytes:64*1024*1024,zipBytes:66*1024*1024,coverEdge:960,detailEdge:3200,normalCoverBytes:120*1024,featuredCoverBytes:200*1024});
const {safe,canonical,hash,crc32}=A,clone=x=>JSON.parse(JSON.stringify(x));
const plain=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>keys.includes(k));
function fail(message){throw Error(message);}
function memoryId(id){if(!M.id(id))fail('回忆 ID 无效');return id;}
function assetPath(path,id){if(!M.image({src:path,width:1,height:1,alt:'check'},memoryId(id)))fail('图片路径必须位于当前回忆目录');return path;}
function privacy(value){
 safe(value);const scan=x=>{if(typeof x==='string'&&(/\b[A-Za-z]:[\\/]|file:\/\/|\/(?:Users|home)\//i.test(x)||/gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{40,}|-----BEGIN .*PRIVATE KEY-----/.test(x)))fail('配置中疑似包含本机路径或凭据，请移除后再导出');if(Array.isArray(x))x.forEach(scan);else if(x&&typeof x==='object')Object.values(x).forEach(scan);};scan(value);
}
function inspect(input,name,mime=''){
 const data=input instanceof Uint8Array?input:new Uint8Array(input);if(!data.length||data.length>LIMITS.imageBytes)fail('图片为空或超过 12 MiB');
 let info;try{info=B.imageSize(data);}catch(_){fail('不支持或损坏的图片；请选择 PNG、JPEG 或 WebP');}
 const ext=String(name||'').split('.').pop().toLowerCase(),types=info.format==='jpeg'?['jpg','jpeg']:[info.format];
 if(!types.includes(ext))fail('后缀与图片实际格式不一致');if(mime&&mime!=='image/'+info.format&&!(info.format==='jpeg'&&mime==='image/jpg'))fail('MIME 与实际图片格式不一致');
 if(!Number.isInteger(info.width)||!Number.isInteger(info.height)||info.width<1||info.height<1||info.width>LIMITS.dimension||info.height>LIMITS.dimension||info.width*info.height>LIMITS.pixels)fail('图片超过 16 MP 或 8192px 安全限制');
 return {...info,bytes:data.length,mime:'image/'+info.format};
}
async function encode(bitmap,edge,quality){
 const scale=Math.min(1,edge/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 try{const ctx=canvas.getContext('2d');if(!ctx)fail('无法创建图片处理缓冲');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));if(!blob||blob.type!=='image/webp')fail('浏览器不能生成 WebP');const data=new Uint8Array(await blob.arrayBuffer()),info=inspect(data,'output.webp','image/webp');const check=await createImageBitmap(blob);try{if(check.width!==info.width||check.height!==info.height)fail('派生图解码尺寸不一致');}finally{check.close();}return{data,...info,quality};}finally{canvas.width=canvas.height=1;}
}
async function prepare(file,id,{cover=false,featured=false}={}){
 memoryId(id);if(!file?.size||file.size>LIMITS.imageBytes)fail('尚未选择图片，或图片超过 12 MiB');
 const raw=new Uint8Array(await file.arrayBuffer()),info=inspect(raw,file.name,file.type),inputSha256=await hash(raw);let bitmap;
 try{bitmap=await createImageBitmap(new Blob([raw],{type:info.mime}));}catch(_){fail('浏览器实际解码失败；图片可能已损坏');}
 const assets=[],warnings=[];let detail;
 try{
  const aligned=bitmap.width===info.width&&bitmap.height===info.height,rotated=info.format==='jpeg'&&bitmap.width===info.height&&bitmap.height===info.width;
  if((!aligned&&!rotated)||bitmap.width*bitmap.height>LIMITS.pixels)fail('解码尺寸与文件元数据不一致，请检查图片');
  if(cover){
   const budget=featured?LIMITS.featuredCoverBytes:LIMITS.normalCoverBytes;let thumb;
   // Three bounded attempts. Keep a useful 720px minimum and high quality;
   // budgets are warnings, never permission to crush fine lines indefinitely.
   for(const [edge,q] of [[960,.90],[840,.90],[720,.88]]){thumb=await encode(bitmap,edge,q);if(thumb.bytes<=budget)break;}
   if(thumb.bytes>budget)warnings.push('封面为 '+Math.round(thumb.bytes/1024)+' KiB，超过建议 '+Math.round(budget/1024)+' KiB；请检查细节与加载预算');
   assets.push({...thumb,role:'cover'});
  }
  detail=await encode(bitmap,LIMITS.detailEdge,.94);assets.push({...detail,role:'detail'});
 }finally{bitmap.close();}
 for(const a of assets){a.sha256=await hash(a.data);a.inputSha256=inputSha256;a.path='assets/memories/'+id+'/m-'+inputSha256.slice(0,24)+'-'+a.sha256.slice(0,24)+'-'+a.role+'.webp';a.input={sha256:inputSha256,bytes:info.bytes,width:info.width,height:info.height,format:info.format};}
 const metadata=a=>({src:a.path,width:a.width,height:a.height,alt:'',caption:''});
 return {assets,cover:cover?metadata(assets[0]):null,detail:metadata(assets.at(-1)),warnings,input:{...info,sha256:inputSha256}};
}
function validatePatch(patch){
 safe(patch);privacy(patch);if(!plain(patch,['schemaVersion','memoryId','baseRecordHash','record','addCategories','testFixture','publicConfirmed'])||patch.schemaVersion!==1||!/^[a-f0-9]{64}$/.test(patch.baseRecordHash||'')||typeof patch.testFixture!=='boolean'||patch.publicConfirmed!==true)fail('补丁版本、基线或公开确认无效');
 memoryId(patch.memoryId);if(patch.record?.id!==patch.memoryId||!Array.isArray(patch.addCategories))fail('补丁目标或分类无效');
 // The caller supplies complete categories for cross-record validation in merge.
 if(patch.addCategories.length>M.LIMITS.categories||patch.addCategories.some(c=>!plain(c,['id','label'])||!M.id(c.id)||typeof c.label!=='string'||!c.label.trim()||c.label.length>40)||new Set(patch.addCategories.map(c=>c.id)).size!==patch.addCategories.length)fail('新增分类无效或重复');
 if(patch.record.source?.kind==='test-fixture'&&!patch.testFixture)fail('TEST FIXTURE 必须保持测试身份');
 if(/\/m-[a-f0-9]{24}-[a-f0-9]{24}-cover\.webp$/.test(patch.record.cover?.src||'')&&!M.pairedDetail(patch.record))fail('新封面必须保留对应高清图（占一个图集位置）');
 return M.media(patch.record).map(m=>assetPath(m.src,patch.memoryId));
}
async function merge(doc,patch,{allowFixtures=false}={}){
 const oldErrors=M.validate(doc,{allowFixtures});if(oldErrors.length)fail(oldErrors.join('; '));validatePatch(patch);
 if(patch.testFixture&&!allowFixtures)fail('测试包只能导入明确授权的 TEST FIXTURE 副本');
 const next=clone(doc),categories=next.categories;
 for(const c of patch.addCategories){const old=categories.find(x=>x.id===c.id);if(old&&canonical(old)!==canonical(c))fail('分类 ID 已存在且标签不同，拒绝覆盖');if(!old)categories.push(clone(c));}
 const old=next.items.find(i=>i.id===patch.memoryId)||null,oldHash=await hash(canonical(old)),newHash=await hash(canonical(patch.record));
 const repeated=oldHash===newHash;if(oldHash!==patch.baseRecordHash&&!repeated)fail('回忆版本冲突；请重新打开管理页并审查最新记录');
 if(old)next.items[next.items.indexOf(old)]=clone(patch.record);else next.items.push(clone(patch.record));
 if(patch.testFixture)next.testFixture=true;
 const errors=M.validate(next,{allowFixtures});if(errors.length)fail(errors.join('; '));if(new TextEncoder().encode(JSON.stringify(next)).length>2097152)fail('最终回忆 JSON 超过 2 MiB');
 return{doc:next,repeated,references:M.media(patch.record)};
}
function readZip(input){
 const data=input instanceof Uint8Array?input:new Uint8Array(input);if(data.length>LIMITS.zipBytes||data.length<22)fail('ZIP 大小无效');const v=new DataView(data.buffer,data.byteOffset,data.byteLength),u16=p=>v.getUint16(p,true),u32=p=>v.getUint32(p,true);
 const end=data.length-22;if(u32(end)!==0x06054b50||u16(end+20)||u16(end+4)||u16(end+6)||u16(end+8)!==u16(end+10)||u16(end+10)>32)fail('只支持本工具生成的单卷 ZIP STORE 包');
 const count=u16(end+10),central=u32(end+16);if(central+u32(end+12)!==end)fail('ZIP 目录不完整');let at=central,localEnd=0;const entries=new Map(),decoder=new TextDecoder('utf-8',{fatal:true});
 for(let n=0;n<count;n++){
  if(at+46>end||u32(at)!==0x02014b50)fail('ZIP 中央目录损坏');const len=u16(at+28),extra=u16(at+30),comment=u16(at+32),offset=u32(at+42),size=u32(at+24),crc=u32(at+16),nameEnd=at+46+len;if(nameEnd+extra+comment>end)fail('ZIP 名称越界');
  const name=decoder.decode(data.subarray(at+46,nameEnd)),mode=(u32(at+38)>>>16)&0xf000;
  if(!/^[a-zA-Z0-9_./-]+$/.test(name)||name.startsWith('/')||name.split('/').some(x=>!x||x==='.'||x==='..')||entries.has(name)||![0,0x8000].includes(mode)||u16(at+8)!==0x800||u16(at+10)!==0||u32(at+20)!==size||offset!==localEnd||offset+30>central)fail('ZIP 路径、重复条目、链接或压缩方式无效');
  if(u32(offset)!==0x04034b50||u16(offset+6)!==0x800||u16(offset+8)!==0||u16(offset+26)!==len||u16(offset+28)!==0||u32(offset+18)!==size||u32(offset+22)!==size||u32(offset+14)!==crc)fail('ZIP 本地头不一致');
  const from=offset+30+len,to=from+size;if(to>central||decoder.decode(data.subarray(offset+30,from))!==name)fail('ZIP 数据越界');const body=data.slice(from,to);if(crc32(body)!==crc)fail('ZIP CRC 校验失败');entries.set(name,body);localEnd=to;at=nameEnd+extra+comment;
 }
 if(at!==end||localEnd!==central)fail('ZIP 含未声明数据');return entries;
}
function packageEntries(input){
 const entries=readZip(input),first=entries.keys().next().value,prefix=first?.split('/')[0]+'/';
 if(!prefix||!/^rinsora-memory-[a-z0-9-]+\/$/.test(prefix)||[...entries.keys()].some(n=>!n.startsWith(prefix)))fail('ZIP 包根目录无效');
 const result=new Map([...entries].map(([n,b])=>[n.slice(prefix.length),b]));
 if(prefix!=='rinsora-memory-'+memoryId(jsonBytes(result.get('memory-patch.json')).memoryId)+'/')fail('ZIP 根目录与目标 ID 不一致');return result;
}
function jsonBytes(data){if(!data||data.length>2097152)fail('包元数据缺失或超过 2 MiB');return safe(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(data)));}
async function verifyEntries(entries){
 const manifest=jsonBytes(entries.get('manifest.json')),patch=jsonBytes(entries.get('memory-patch.json'));validatePatch(patch);
 if(!plain(manifest,['schemaVersion','memoryId','patch','files','warnings'])||manifest.schemaVersion!==1||manifest.memoryId!==patch.memoryId||manifest.patch!=='memory-patch.json'||!Array.isArray(manifest.files)||manifest.files.length>13||!Array.isArray(manifest.warnings)||manifest.warnings.some(x=>typeof x!=='string'||x.length>400))fail('资源清单无效');
 privacy(manifest);const refs=new Set(M.media(patch.record).map(m=>m.src)),seen=new Set(),expected=new Set(['manifest.json','memory-patch.json','IMPORT.md']);let total=0;
 for(const row of manifest.files){
  if(!plain(row,['path','bytes','sha256','format','width','height','role','input'])||!['cover','detail'].includes(row.role)||row.format!=='webp'||!Number.isInteger(row.bytes)||row.bytes<1||row.bytes>LIMITS.imageBytes||!/^[a-f0-9]{64}$/.test(row.sha256||'')||seen.has(row.path)||!refs.has(row.path))fail('资源清单含重复、无引用或无效资源');assetPath(row.path,patch.memoryId);
  if(!plain(row.input,['sha256','bytes','width','height','format'])||!/^[a-f0-9]{64}$/.test(row.input.sha256||'')||!Number.isInteger(row.input.bytes)||row.input.bytes<1||row.input.bytes>LIMITS.imageBytes||!Number.isInteger(row.input.width)||!Number.isInteger(row.input.height)||row.input.width<1||row.input.height<1||row.input.width>8192||row.input.height>8192||row.input.width*row.input.height>LIMITS.pixels||!['png','jpeg','webp'].includes(row.input.format))fail('原始输入技术记录无效');
  const bytes=entries.get(row.path);if(!bytes||bytes.length!==row.bytes||await hash(bytes)!==row.sha256)fail('素材缺失、体积或 SHA256 不符');const info=inspect(bytes,row.path);if(info.format!==row.format||info.width!==row.width||info.height!==row.height)fail('素材实际格式或尺寸不符');
  if(row.role==='cover'&&(row.path!==patch.record.cover.src||info.width*info.height>M.LIMITS.coverPixels))fail('封面用途不符');if(row.role==='detail'&&!patch.record.gallery?.some(m=>m.src===row.path))fail('高清图用途不符');
  const meta=M.media(patch.record).filter(m=>m.src===row.path);if(meta.some(m=>m.width!==info.width||m.height!==info.height))fail('配置与素材尺寸不一致');seen.add(row.path);expected.add(row.path);total+=row.bytes;
 }
 if(total>LIMITS.totalBytes||entries.size!==expected.size||[...entries.keys()].some(n=>!expected.has(n))||!entries.get('IMPORT.md')?.length||entries.get('IMPORT.md').length>16384)fail('资源包体积超限或包含额外文件');
 return{manifest,patch,totalBytes:total};
}
async function buildPackage({doc,record,addCategories=[],assets=[],publicConfirmed=false,budgetConfirmed=false}){
 if(!publicConfirmed)fail('请确认素材可以公开，且没有不愿公开的信息');const old=doc.items.find(x=>x.id===record.id)||null;
 const patch={schemaVersion:1,memoryId:record.id,baseRecordHash:await hash(canonical(old)),record:safe(record),addCategories:safe(addCategories),testFixture:record.source?.kind==='test-fixture'||doc.testFixture===true,publicConfirmed:true};
 const merged=await merge(doc,patch,{allowFixtures:patch.testFixture}),refs=new Set(M.media(record).map(m=>m.src)),chosen=[...new Map(assets.filter(a=>refs.has(a.path)).map(a=>[a.path,a])).values()],warnings=[];
 const manifest={schemaVersion:1,memoryId:record.id,patch:'memory-patch.json',files:[],warnings};
 for(const a of chosen){const budget=Number.isInteger(record.featuredRank)?LIMITS.featuredCoverBytes:LIMITS.normalCoverBytes;if(a.role==='cover'&&a.data.length>budget)warnings.push('封面 '+Math.round(a.data.length/1024)+' KiB 超过建议 '+Math.round(budget/1024)+' KiB，已由用户复核');manifest.files.push({path:a.path,bytes:a.data.length,sha256:await hash(a.data),format:a.format,width:a.width,height:a.height,role:a.role,input:a.input});}
 if(warnings.length&&!budgetConfirmed)fail('封面超过建议预算；请检查画质并明确确认后导出');
 const entries=new Map(chosen.map(a=>[a.path,a.data]));entries.set('manifest.json',new TextEncoder().encode(JSON.stringify(manifest,null,2)+'\n'));entries.set('memory-patch.json',new TextEncoder().encode(JSON.stringify(patch,null,2)+'\n'));
 entries.set('IMPORT.md',new TextEncoder().encode('# 本地回忆资源包 — 尚未导入或发布\n\n只包含主动选择的派生 WebP；原件自行保留。source 是提供者声明，不是独立版权认证。\n\n在兼容此管理器的仓库执行：\n\n    node tools/import-memory-gallery.cjs <本ZIP或解压目录>\n    node tools/import-memory-gallery.cjs <本ZIP或解压目录> --apply\n    node tools/check-memory-gallery.cjs\n    python tools/check-site.py\n\n第一条 DRY_RUN 不写文件。--apply 才导入本地。先备份；内容哈希命名不可静默覆盖。过期目标记录或冲突分类需重新准备。重复相同包返回 ALREADY_IMPORTED，不重复建记录。测试包须在独立副本额外指定 --allow-fixture；不得将测试图片导入正式相册。\n\n网页 cover 用轻量派生图；同源 detail 在 gallery 中占一位置，详情优先显示它。最多12个图集位置（含封面高清图）。旧记录不配对则保持 cover-first。不会删除旧文件或修改 Moments/项目。\n\n写入使用本地协作锁、完整预校验、备份、日志，最后替换 JSON。进程突然退出时可能留下不可见孤立媒体；保留 journal 和备份人工审查，不自动清理或强制覆盖。下载、导入、Git提交、远端发布是不同状态。远端发布 DISABLED。\n'));
 await verifyEntries(entries);const prefix='rinsora-memory-'+memoryId(record.id)+'/',blob=A.zip([...entries].map(([path,data])=>({path:prefix+path,data})));
 // Re-read the actual bytes, including central/local directory, CRC and SHA256.
 const checked=await verifyEntries(packageEntries(new Uint8Array(await blob.arrayBuffer())));
 return{blob,name:prefix.slice(0,-1)+'.zip',manifest:checked.manifest,patch,merged:merged.doc};
}
return Object.freeze({LIMITS,memoryId,assetPath,inspect,prepare,hash,canonical,safe,privacy,validatePatch,merge,readZip,packageEntries,verifyEntries,buildPackage});
});
