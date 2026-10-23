/* Local-only media preparation. No network writes, tokens, storage, or background loops. */
(function(root,factory){'use strict';const api=factory(typeof module==='object'&&module.exports?require('./project-media-binary.js'):root.RinsoraMediaBinary);if(typeof module==='object'&&module.exports)module.exports=api;else root.RinsoraMediaManager=api;})(typeof window==='object'?window:globalThis,function(B){
'use strict';
const LIMITS=Object.freeze({imageBytes:12*1024*1024,videoBytes:32*1024*1024,totalBytes:64*1024*1024,pixels:12000000,dimension:8192,gallery:12,duration:120});
const roles=['cover','gallery','poster','video','before','after'];
const badKeys=['__proto__','constructor','prototype'];
function safe(value,depth=0){
 if(depth>24)throw Error('配置嵌套过深');
 if(value===null||typeof value==='boolean'||typeof value==='string')return value;
 if(typeof value==='number'){if(!Number.isFinite(value))throw Error('配置数字无效');return value;}
 if(Array.isArray(value))return value.map(x=>safe(x,depth+1));
 if(!value||typeof value!=='object')throw Error('配置不是纯 JSON');
 const out={};for(const key of Object.keys(value).sort()){if(badKeys.includes(key))throw Error('配置包含危险字段');out[key]=safe(value[key],depth+1);}return out;
}
const canonical=v=>JSON.stringify(safe(v));
async function hash(value){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;return Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');}
function projectId(id){if(typeof id!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(id)||badKeys.includes(id))throw Error('项目 ID 无效');return id;}
function assetPath(path,id){projectId(id);const prefix='assets/projects/'+id+'/';if(typeof path!=='string'||!path.startsWith(prefix)||path.includes('..')||!/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*\.(webp|png|jpe?g|webm)$/i.test(path.slice(prefix.length)))throw Error('素材路径必须位于当前项目目录');return path;}
function effective(base,doc,id){projectId(id);const old=base?.[id]||{},over=doc?.projects?.[id]||{};return Object.fromEntries(['cover','gallery','experience'].map(k=>[k,Object.hasOwn(over,k)?over[k]:(old[k]??(k==='gallery'?[]:null))]));}
function inspect(data,name,mime=''){
 const bytes=data instanceof Uint8Array?data:new Uint8Array(data);
 if(!bytes.length)throw Error('文件为空');
 let info;
 try{info=B.imageSize(bytes);}catch(_){try{info=B.videoInfo(bytes);}catch(_){throw Error('不支持或损坏的文件。图片限 PNG/JPEG/WebP，视频限 WebM/VP8（≤120秒）。');}}
 const video=info.format==='webm',ext=String(name||'').split('.').pop().toLowerCase(),expected=info.format==='jpeg'?['jpg','jpeg']:[info.format],type=video?'video/webm':'image/'+info.format;
 if(!expected.includes(ext))throw Error('文件后缀与实际内容不一致');
 if(mime&&mime!==type&&!(info.format==='jpeg'&&mime==='image/jpg'))throw Error('文件 MIME 与实际内容不一致');
 if(bytes.length>(video?LIMITS.videoBytes:LIMITS.imageBytes))throw Error('文件超过体积上限');
 if(info.width<1||info.height<1||info.width>(video?4096:LIMITS.dimension)||info.height>(video?4096:LIMITS.dimension)||(!video&&info.width*info.height>LIMITS.pixels))throw Error('图像尺寸过大或异常（图片最多1200万像素）');
 return {...info,mime:type,bytes:bytes.length,kind:video?'video':'image'};
}
function references(media){const list=[];function image(m){if(!m)return;list.push(m.src);(m.sources||[]).forEach(image);}image(media.cover);(media.gallery||[]).forEach(image);const e=media.experience;if(e?.type==='video'){list.push(e.src);image(e.poster);}if(e?.type==='compare'){image(e.before);image(e.after);}return [...new Set(list)];}
function sourceInfo(raw){
 const keys=['method','captured','version','note'],limits={method:160,captured:10,version:120,note:600},out={};
 for(const k of keys){const s=raw?.[k];if(typeof s!=='string'||!s.trim()||s.length>limits[k]||/[\u0000-\u001f\u007f]/.test(s))throw Error('请完整填写来源、日期、版本和说明');out[k]=s.trim();}
 if(!/^\d{4}-\d{2}-\d{2}$/.test(out.captured)||!Number.isFinite(Date.parse(out.captured))||new Date(out.captured).toISOString().slice(0,10)!==out.captured)throw Error('录制/采集日期无效');
 return {...out,verification:'user-declared'};
}
function validatePatch(patch,M,data){
 safe(patch);projectId(patch?.projectId);
 if(patch.schemaVersion!==1||!data.items.some(p=>p.id===patch.projectId)||patch.publicConfirmed!==true||!['baseMediaHash','baseOverlayHash'].every(k=>/^[a-f0-9]{64}$/.test(patch[k]||''))||Object.keys(patch).some(k=>!['schemaVersion','projectId','baseMediaHash','baseOverlayHash','media','source','publicConfirmed'].includes(k)))throw Error('补丁结构、版本或公开确认无效');
 sourceInfo(patch.source);
 if(!patch.media||Object.keys(patch.media).some(k=>!['cover','gallery','experience'].includes(k))||!['cover','gallery','experience'].every(k=>Object.hasOwn(patch.media,k)))throw Error('补丁只允许完整的三个媒体字段');
 const errors=M.validateMediaDocument({schemaVersion:1,projects:{[patch.projectId]:patch.media}},data);if(errors.length)throw Error(errors.join('；'));
 const all=references(patch.media);all.forEach(p=>assetPath(p,patch.projectId));
 return all;
}
async function decodeImage(blob){
 let bitmap;try{bitmap=await createImageBitmap(blob);}catch(_){throw Error('图片实际解码失败，请检查文件是否完整');}try{if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>LIMITS.pixels)throw Error('图片解码尺寸异常');return bitmap;}catch(e){bitmap.close();throw e;}
}
async function webp(bitmap,max){
 const scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 try{canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.92));if(!blob||blob.type!=='image/webp')throw Error('当前浏览器无法输出 WebP');return {data:new Uint8Array(await blob.arrayBuffer()),width:canvas.width,height:canvas.height,format:'webp',mime:'image/webp'};}finally{canvas.width=canvas.height=1;}
}
async function decodeVideo(blob,info){
 const url=URL.createObjectURL(blob),v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';
 try{
  if(!v.canPlayType('video/webm; codecs="vp8"'))throw Error('当前浏览器不能解码 WebM/VP8');
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>done(Error('视频解码超时，请检查文件')),12000);let seek=false;
   function done(error){clearTimeout(t);v.onloadedmetadata=v.onloadeddata=v.onseeked=v.onerror=null;error?reject(error):resolve();}
   v.onerror=()=>done(Error('浏览器不能解码这份视频'));
   v.onloadedmetadata=()=>{if(v.videoWidth!==info.width||v.videoHeight!==info.height||!Number.isFinite(v.duration)||Math.abs(v.duration-info.duration)>.08){done(Error('视频实际元数据与容器不一致'));return;}seek=true;v.currentTime=Math.min(.1,v.duration/2);};
   const ready=()=>{if(seek&&v.readyState>=2)done();};v.onseeked=ready;v.onloadeddata=ready;v.src=url;
  });
 }finally{v.pause();v.removeAttribute('src');v.load();URL.revokeObjectURL(url);}
}
async function prepare(file,role,id){
 projectId(id);if(!roles.includes(role))throw Error('素材用途无效');if(!file||!file.size)throw Error('尚未选择文件或文件为空');
 if(file.size>(role==='video'?LIMITS.videoBytes:LIMITS.imageBytes))throw Error('文件超过体积上限');
 const raw=new Uint8Array(await file.arrayBuffer()),info=inspect(raw,file.name,file.type);
 if((role==='video')!==(info.kind==='video'))throw Error('文件类型不适合所选用途');
 const original={name:file.name,bytes:file.size,sha256:await hash(raw),...info};let outputs=[];
 if(role==='video'){
  await decodeVideo(new Blob([raw],{type:info.mime}),info);outputs=[{data:raw,...info}];
 }else{
  const bitmap=await decodeImage(new Blob([raw],{type:info.mime}));try{
   outputs.push(await webp(bitmap,role==='cover'?1600:role==='poster'?1280:2400));
   if(role==='cover'&&outputs[0].width>480)outputs.push(await webp(bitmap,Math.round(480*Math.max(bitmap.width,bitmap.height)/bitmap.width)));
  }finally{bitmap.close();}
 }
 const assets=[];
 for(let i=0;i<outputs.length;i++){
  const out=outputs[i],sha256=await hash(out.data),path='assets/projects/'+id+'/m-'+sha256.slice(0,24)+'-'+role+(i?'-small':'')+'.'+out.format;
  assets.push({...out,path,sha256,bytes:out.data.length,technicalValidation:'binary-metadata-and-browser-decode'});
 }
 const first=assets[0],media={src:first.path,width:first.width,height:first.height,alt:'',caption:''};
 if(assets.length>1)media.sources=assets.slice(1).map(x=>({src:x.path,width:x.width,height:x.height}));
 return {media,assets,original,info:first};
}
// Small ZIP STORE writer (UTF-8 paths, CRC32, no dependency or compression worker).
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function zip(entries){
 if(entries.length>200)throw Error('资源包条目过多');let offset=0;const parts=[],central=[],names=new Set();
 for(const e of entries){if(!/^[a-zA-Z0-9_./-]+$/.test(e.path)||e.path.startsWith('/')||e.path.split('/').includes('..')||names.has(e.path))throw Error('ZIP 路径无效或重复');names.add(e.path);
  const name=new TextEncoder().encode(e.path),data=typeof e.data==='string'?new TextEncoder().encode(e.data):e.data,crc=crc32(data),h=new Uint8Array(30+name.length),v=new DataView(h.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);h.set(name,30);
  const c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint16(14,33,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);c.set(name,46);parts.push(h,data);central.push(c);offset+=h.length+data.length;
 }
 const cs=central.reduce((n,x)=>n+x.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,entries.length,true);ev.setUint16(10,entries.length,true);ev.setUint32(12,cs,true);ev.setUint32(16,offset,true);
 return new Blob([...parts,...central,end],{type:'application/zip'});
}
async function buildPackage({id,media,base,doc,assets,source,publicConfirmed},M,data){
 const patch={schemaVersion:1,projectId:projectId(id),baseMediaHash:await hash(canonical(effective(base,doc,id))),baseOverlayHash:await hash(canonical(doc?.projects?.[id]||null)),media:safe(media),source:sourceInfo(source),publicConfirmed:publicConfirmed===true};
 const previousExperience=effective(base,doc,id).experience;
 if(patch.media.experience&&canonical(patch.media.experience)!==canonical(previousExperience)&&patch.media.experience.source?.verification!=='user-declared')throw Error('新增或修改的体验只能标记为用户声明，不能自行认证运行真实性');
 const refs=validatePatch(patch,M,data),chosen=[...new Map(assets.filter(a=>refs.includes(a.path)).map(a=>[a.path,a])).values()];
 if(chosen.reduce((n,a)=>n+a.bytes,0)>LIMITS.totalBytes)throw Error('部署资源超过64 MiB草稿预算');
 const manifest={schemaVersion:1,projectId:id,patch:'media-patch.json',files:[]};
 for(const a of chosen){assetPath(a.path,id);if(await hash(a.data)!==a.sha256)throw Error('资源指纹变化');manifest.files.push({path:a.path,bytes:a.data.length,sha256:a.sha256,format:a.format,width:a.width,height:a.height,...(a.format==='webm'?{duration:a.duration,codec:a.codec,audio:a.audio}:{}),technicalValidation:a.technicalValidation,input:a.input||null});}
 const prefix='rinsora-project-media-'+id+'/',entries=chosen.map(a=>({path:prefix+a.path,data:a.data}));
 entries.push({path:prefix+'media-patch.json',data:JSON.stringify(patch,null,2)+'\n'},{path:prefix+'manifest.json',data:JSON.stringify(manifest,null,2)+'\n'},{path:prefix+'IMPORT.md',data:'# 本地资源包 / 未发布\n\n解压整个目录；不要直接覆盖项目源码。下载不是导入，也不是Git提交或发布。\n\n在包含兼容媒体管理系统的仓库中运行：\n\n```sh\nnode tools/import-project-media.cjs "<解压目录>"\nnode tools/import-project-media.cjs "<解压目录>" --apply\nnode tools/check-project-lab.cjs\npython tools/check-site.py\n```\n\n第一条只检查；第二条在你明确执行后导入本地文件。工具拒绝不一致的项目基线、不同内容同名文件、非法路径、越界链接及损坏元数据。现存相同字节资源可复用，不覆盖。媒体写入后最后原子更新 project-media-data.json；不修改 projects-data.js 或 project-lab-data.js、不删除旧媒体。\n\n导入前请备份项目；导入后刷新 ?ui02=1&lab=1#projects。公开确认是用户声明，文件技术验证不等于第三方运行真实性认证。远端发布在本阶段禁用。\n'});
 return {blob:zip(entries),name:prefix.slice(0,-1)+'.zip',patch,manifest};
}
function remotePublish(){throw Error('REMOTE_PUBLISH_DISABLED：此版本只支持本地导出；没有执行任何 GitHub 写入。');}
return {LIMITS,roles,safe,canonical,hash,projectId,assetPath,effective,inspect,references,sourceInfo,validatePatch,prepare,zip,crc32,buildPackage,remotePublish};
});
