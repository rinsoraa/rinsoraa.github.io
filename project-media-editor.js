/* Dedicated local preparation UI. Deliberately exposes no remote-save handler. */
(function(w,d){'use strict';
const P=w.RinsoraProjects,M=w.RinsoraLabModel,A=w.RinsoraMediaManager,$=id=>d.getElementById(id),clone=x=>JSON.parse(JSON.stringify(x));
let data,doc,id='',processing=false,revision=0;const drafts=new Map(),urls=new Map(),downloads=new Set();
const draft=()=>drafts.get(id);
function say(message,kind=''){const e=$('actionStatus');e.textContent=message;e.dataset.kind=kind;}
function node(tag,text,cls){const e=d.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;}
function release(){for(const v of d.querySelectorAll('video')){v.pause();v.removeAttribute('src');v.load();}for(const url of urls.values())URL.revokeObjectURL(url);urls.clear();}
function sourceURL(path){const a=draft()?.assets.get(path);if(!a)return path;if(!urls.has(path))urls.set(path,URL.createObjectURL(new Blob([a.data],{type:a.mime})));return urls.get(path);}
function size(bytes){return Number.isFinite(bytes)?(bytes/1024/1024>=1?(bytes/1024/1024).toFixed(2)+' MiB':(bytes/1024).toFixed(1)+' KiB'):'未取得大小';}
function initDraft(pid){const media=clone(A.effective(w.RINSORA_PROJECT_LAB,doc,pid)),e=media.experience;return {media,type:e?.type||'none',video:e?.type==='video'?clone(e):{},compare:e?.type==='compare'?clone(e):{},title:e?.title||'',description:e?.description||'',alignment:e?.source?.alignment||'',source:{method:'',captured:new Date().toLocaleDateString('en-CA'),version:'',note:''},originConfirm:false,publicConfirmed:false,expDirty:false,dirty:false,assets:new Map()};}
function saveForm(){const x=draft();if(!x)return;for(const [k,f]of Object.entries({method:'sourceMethod',captured:'sourceDate',version:'sourceVersion',note:'sourceNote'}))x.source[k]=$(f).value;x.title=$('experienceTitle').value;x.description=$('experienceDescription').value;x.alignment=$('alignment').value;x.originConfirm=$('originConfirm').checked;x.publicConfirmed=$('publicConfirm').checked;}
function choices(){const host=$('projectChoices');host.replaceChildren();for(const p of data.items){const x=drafts.get(p.id),m=x?.media||A.effective(w.RINSORA_PROJECT_LAB,doc,p.id),type=x?.type||m.experience?.type;const b=node('button',p.name);b.type='button';b.dataset.project=p.id;b.setAttribute('aria-pressed',String(p.id===id));b.append(node('small',p.id),node('small',(p.status||'未设置状态')+' · '+(m.cover?'有封面':'无封面')+' · 图集 '+m.gallery.length),node('small',type==='video'?'视频演示':type==='compare'?'图片对比':'DEMO_PENDING'));b.addEventListener('click',()=>select(p.id));b.disabled=processing;host.append(b);}}
function edited(){const x=draft();x.dirty=true;x.publicConfirmed=false;$('publicConfirm').checked=false;$('downloadLinks').replaceChildren();collect();}
function collect(){const x=draft();if(!x)return;const used=new Set([...A.references({...x.media,experience:null}),...A.references({experience:{...x.video,type:'video'}}),...A.references({experience:{...x.compare,type:'compare'}})]);for(const path of [...x.assets.keys()])if(!used.has(path)){x.assets.delete(path);const u=urls.get(path);if(u){URL.revokeObjectURL(u);urls.delete(path);}}}
function mediaCard(m,role,index){
 const card=node('div',null,'mm-card');card.dataset.previewRole=role;
 if(!m){card.append(node('p','尚未选择素材。','mm-empty'));return card;}
 const img=node('img');img.src=sourceURL(m.src);img.alt=m.alt||'所选图片预览';img.width=m.width;img.height=m.height;
 img.addEventListener('error',()=>{img.hidden=true;card.prepend(node('p','这张已配置图片无法加载；可以替换，或移除引用。','hint'));});
 if(role==='cover'){const ctx=node('div',null,'mm-cover-context'),crop=node('div',null,'mm-cover-crop'),mini=img.cloneNode();crop.append(mini);ctx.append(img,crop);card.append(ctx,node('p','左：完整比例；右：项目卡16:10裁切预览，不改变部署图片。','hint'));}else card.append(img);
 const meta=node('p',m.width+' × '+m.height+' · '+m.src,'mm-code'),a=draft().assets.get(m.src);card.append(meta);
 const bytes=node('p',a?size(a.bytes)+' · 新准备的 WebP':'文件大小读取中…','hint');card.append(bytes);
 if(a?.input)card.append(node('p','原件：'+a.input.name+' · '+a.input.format+' · '+size(a.input.bytes)+'；部署为 WebP。','hint'));
 if(!a){const stamp=revision;fetch(m.src,{method:'HEAD',cache:'no-cache'}).then(r=>{if(stamp===revision&&bytes.isConnected)bytes.textContent=r.ok?size(Number(r.headers.get('content-length')))+' · 已保存的媒体':'文件不存在或不可读取';}).catch(()=>{if(bytes.isConnected)bytes.textContent='文件大小未取得';});}
 for(const [field,label]of [['alt','替代文本 alt'],['caption','图片说明']]){const l=node('label',null,'field');l.append(node('span',label));const input=node('input');input.value=m[field]||'';input.maxLength=field==='alt'?400:600;input.dataset.mediaField=field;input.addEventListener('input',()=>{m[field]=input.value;draft().dirty=true;$('publicConfirm').checked=false;draft().publicConfirmed=false;});l.append(input);card.append(l);}
 const controls=node('div',null,'mm-controls');function button(text,run,disabled=false){const b=node('button',text,'btn-ghost');b.type='button';b.disabled=disabled;b.addEventListener('click',()=>{saveForm();run();edited();render();});controls.append(b);}
 if(role==='gallery'){button('上移',()=>{const list=draft().media.gallery;[list[index-1],list[index]]=[list[index],list[index-1]];},index===0);button('下移',()=>{const list=draft().media.gallery;[list[index],list[index+1]]=[list[index+1],list[index]];},index===draft().media.gallery.length-1);button('移除引用',()=>draft().media.gallery.splice(index,1));}
 else button('撤销 / 移除引用',()=>{if(role==='cover')draft().media.cover=null;else if(role==='poster'){delete draft().video.poster;draft().expDirty=true;}else{delete draft().compare[role];draft().expDirty=true;}});
 card.append(controls);return card;
}
function videoPreview(){const x=draft(),e=x.video,host=$('videoPreview');host.replaceChildren();if(!e.src){host.append(node('p','还没有放上演示素材，随时可以回来添加。','mm-empty'));return;}
 const card=node('div',null,'mm-card'),v=node('video');v.controls=true;v.muted=true;v.playsInline=true;v.preload='none';v.src=sourceURL(e.src);v.width=e.width;v.height=e.height;if(e.poster)v.poster=sourceURL(e.poster.src);v.setAttribute('aria-label','本地视频预览（默认静音）');card.append(v,node('p',e.width+' × '+e.height+' · '+Number(e.duration).toFixed(2)+'秒 · VP8 · '+(e.audio?'含音轨':'无音轨'),'mm-code'),node('p',e.src,'mm-code'));
 const a=x.assets.get(e.src);if(a)card.append(node('p',size(a.bytes)+' · '+a.input.name+' · 浏览器解码通过','hint'));
 if(e.source)card.append(node('p','已保存来源：'+e.source.method+' / '+e.source.version+' / '+e.source.captured+'。'+e.source.note,'hint'));
 const b=node('button','移除视频引用','btn-ghost');b.type='button';b.onclick=()=>{saveForm();delete x.video.src;x.expDirty=true;edited();render();};card.append(b);host.append(card);
}
function comparePreview(){const x=draft(),e=x.compare,host=$('comparePreview');host.replaceChildren();if(!e.before||!e.after)return;
 if(Math.abs(e.before.width/e.before.height-e.after.width/e.after.height)>=.01){host.append(node('p','两张图片比例不一致，暂不能生成对比。','mm-empty'));return;}
 host.innerHTML=M.compareMarkup({before:{...e.before,src:sourceURL(e.before.src)},after:{...e.after,src:sourceURL(e.after.src)},source:{alignment:x.alignment||'请填写同场景与对齐说明；比例相同不代表可比较。'}});
 const frame=host.querySelector('.lab-compare-frame'),range=host.querySelector('input'),output=host.querySelector('output');
 function update(value){range.value=Math.max(0,Math.min(100,value));frame.style.setProperty('--compare',range.value+'%');output.textContent=range.value+'%';}
 range.addEventListener('input',()=>update(range.value));let dragging=false;
 frame.addEventListener('pointerdown',ev=>{if(ev.button!==0)return;dragging=true;frame.setPointerCapture(ev.pointerId);const r=frame.getBoundingClientRect();update((ev.clientX-r.left)/r.width*100);});
 frame.addEventListener('pointermove',ev=>{if(!dragging)return;const r=frame.getBoundingClientRect();update((ev.clientX-r.left)/r.width*100);});for(const type of ['pointerup','pointercancel','lostpointercapture'])frame.addEventListener(type,()=>{dragging=false;});
 host.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{frame.classList.add('lab-compare-failed');frame.querySelector('.lab-compare-error').hidden=false;}));
}
function render(){release();revision++;const x=draft(),p=data.items.find(p=>p.id===id);if(!x||!p)return;
 choices();$('projectTitle').textContent=p.name;$('projectIdentity').textContent=p.id+' · '+p.category+' · '+(p.status||'未设置状态');$('viewProject').href='index.html?ui02=1&lab=1'+M.href(id);
 $('coverPreview').replaceChildren(mediaCard(x.media.cover,'cover'));$('galleryCount').textContent=x.media.gallery.length+' / 12';$('galleryPreview').replaceChildren(...x.media.gallery.map((m,i)=>mediaCard(m,'gallery',i)));if(!x.media.gallery.length)$('galleryPreview').append(node('p','还没有图集，可以一次选择多张真实作品图片。','mm-empty'));
 $('experienceType').value=x.type;$('experienceFields').hidden=x.type==='none';$('experienceEmpty').hidden=x.type!=='none';$('videoFields').hidden=x.type!=='video';$('compareFields').hidden=x.type!=='compare';$('experienceTitle').value=x.title;$('experienceDescription').value=x.description;$('alignment').value=x.alignment;$('originConfirm').checked=x.originConfirm;
 if(x.type==='video'){videoPreview();$('posterPreview').replaceChildren(mediaCard(x.video.poster,'poster'));}else{$('videoPreview').replaceChildren();$('posterPreview').replaceChildren();}
 if(x.type==='compare'){for(const role of ['before','after'])$(role+'Preview').replaceChildren(mediaCard(x.compare[role],role));comparePreview();}else{for(const role of ['before','after'])$(role+'Preview').replaceChildren();$('comparePreview').replaceChildren();}
 for(const [k,f]of Object.entries({method:'sourceMethod',captured:'sourceDate',version:'sourceVersion',note:'sourceNote'}))$(f).value=x.source[k];$('publicConfirm').checked=x.publicConfirmed;
}
function select(pid){if(processing)return;saveForm();id=pid;if(!drafts.has(id))drafts.set(id,initDraft(id));$('downloadLinks').replaceChildren();say('本地准备模式：尚未导入或发布。');render();}
function busy(on){processing=on;for(const e of d.querySelectorAll('#workspace button:not([disabled]),#workspace input[type=file],#experienceType')){if(on){e.dataset.wasEnabled='1';e.disabled=true;}}if(!on)for(const e of d.querySelectorAll('[data-was-enabled]')){e.disabled=false;delete e.dataset.wasEnabled;}choices();}
async function choose(input){saveForm();const files=[...input.files],role=input.dataset.role;if(!files.length){say('尚未选择文件。');return;}const x=draft();if(!x)return;
 if(role==='gallery'&&x.media.gallery.length+files.length>12){say('图集最多12张，未添加任何文件。','error');input.value='';return;}
 if(files.reduce((n,f)=>n+f.size,0)>A.LIMITS.totalBytes){say('本次选择超过64 MiB预算。','error');input.value='';return;}
 busy(true);say('正在读取并验证所选文件…');const prepared=[];
 try{
  for(const file of files){say('正在验证 '+file.name+'；完成前不会上传。');prepared.push(await A.prepare(file,role,id));}
  const total=[...drafts.values()].reduce((n,x)=>n+[...x.assets.values()].reduce((m,a)=>m+a.bytes,0),0)+prepared.reduce((n,p)=>n+p.assets.reduce((m,a)=>m+a.bytes,0),0);if(total>A.LIMITS.totalBytes)throw Error('草稿部署资源累计超过64 MiB；请撤销不用的文件。');
  for(const p of prepared){for(const a of p.assets){a.input=p.original;x.assets.set(a.path,a);}if(role==='cover')x.media.cover=p.media;else if(role==='gallery')x.media.gallery.push(p.media);else if(role==='video'){x.video={...x.video,src:p.info.path,width:p.info.width,height:p.info.height,duration:p.info.duration,audio:p.info.audio,mime:'video/webm',codec:'vp8'};x.expDirty=true;}else if(role==='poster'){x.video.poster=p.media;x.expDirty=true;}else{x.compare[role]=p.media;x.expDirty=true;}}
  edited();render();say('预览就绪。文件只在当前页面内存中；请填写说明、来源并导出。','ok');
 }catch(e){say('验证失败：'+e.message+' 原配置未改变。','error');}finally{input.value='';busy(false);}
}
function assembled(){const x=draft(),media=clone(x.media);
 if(x.type==='none')media.experience=null;
 else if(!x.expDirty&&x.media.experience?.type===x.type)media.experience=clone(x.media.experience);
 else{if(!x.originConfirm)throw Error('请确认体验素材的项目来源声明；此声明不是独立运行核验');const source={...A.sourceInfo(x.source),genuine:true};if(x.type==='compare')source.alignment=x.alignment;
  media.experience={...(x.type==='video'?clone(x.video):clone(x.compare)),type:x.type,title:x.title,description:x.description,source};if(!M.experience(media.experience,id))throw Error('体验配置不完整：请检查标题、介绍、来源、文件、Poster比例或对齐说明');}
 for(const m of [media.cover,...media.gallery,...(media.experience?.type==='video'?[media.experience.poster]:media.experience?.type==='compare'?[media.experience.before,media.experience.after]:[])].filter(Boolean))if(!m.alt?.trim()||m.alt.length>400||(m.caption||'').length>600)throw Error('请为每张素材填写alt（≤400字），图片说明最多600字');
 return media;
}
async function exportPackage(){if(processing)return;saveForm();busy(true);say('正在检查配置并生成资源包…');try{const x=draft(),result=await A.buildPackage({id,media:assembled(),base:w.RINSORA_PROJECT_LAB,doc,assets:[...x.assets.values()],source:x.source,publicConfirmed:x.publicConfirmed},M,data);for(const previous of downloads)URL.revokeObjectURL(previous);downloads.clear();const url=URL.createObjectURL(result.blob);downloads.add(url);const a=node('a','再次下载：'+result.name);a.href=url;a.download=result.name;$('downloadLinks').replaceChildren(a);a.click();x.dirty=false;say('资源包已生成并交给浏览器下载，需要导入项目仓库后才能在网站展示。尚未复制到仓库、提交Git或发布。','ok');}catch(e){say('无法导出：'+e.message,'error');}finally{busy(false);}}
$('themeToggle').onclick=()=>{d.documentElement.classList.toggle('night');d.documentElement.dataset.theme=d.documentElement.classList.contains('night')?'night':'day';};
$('experienceType').onchange=()=>{saveForm();draft().type=$('experienceType').value;draft().expDirty=true;edited();render();};
for(const f of ['experienceTitle','experienceDescription','alignment','originConfirm'])$(f).addEventListener('input',()=>{saveForm();draft().expDirty=true;draft().dirty=true;if(f==='alignment')comparePreview();});
for(const f of ['sourceMethod','sourceDate','sourceVersion','sourceNote','publicConfirm'])$(f).addEventListener('input',()=>{saveForm();draft().dirty=true;});
d.querySelectorAll('input[type=file]').forEach(input=>input.addEventListener('change',()=>choose(input)));
$('exportPackage').onclick=exportPackage;$('resetDraft').onclick=()=>{if(processing)return;drafts.set(id,initDraft(id));$('downloadLinks').replaceChildren();say('当前作品草稿已撤销；已保存的文件和配置未改变。');render();};
w.addEventListener('beforeunload',e=>{if([...drafts.values()].some(x=>x.dirty)){e.preventDefault();e.returnValue='';}});w.addEventListener('pagehide',()=>{release();for(const url of downloads)URL.revokeObjectURL(url);downloads.clear();});d.addEventListener('visibilitychange',()=>{if(d.hidden)d.querySelectorAll('video').forEach(v=>v.pause());});
(async()=>{try{if(!w.crypto?.subtle||!w.createImageBitmap)throw Error('需要支持图片解码的现代浏览器，并通过localhost或HTTPS打开');data=P.read();const response=await fetch('project-media-data.json',{cache:'no-cache'});if(!response.ok)throw Error('无法读取媒体JSON；请通过本地网站服务打开');doc=await response.json();const errors=M.validateMediaDocument(doc,data);if(errors.length)throw Error(errors.join('；'));const cfg=w.GH?.loadCfg();$('remoteTarget').textContent=cfg?cfg.owner+'/'+cfg.repo+' / '+cfg.branch+'（仅显示配置，不连接远端）':'未配置仓库';$('loadState').textContent=data.items.length?'项目已读取 · 本地准备可用':'还没有项目，请先在项目编辑台添加。';$('workspace').hidden=!data.items.length;if(data.items.length)select(data.items[0].id);}catch(e){$('loadState').textContent='无法初始化：'+e.message+'。未进行任何写入。';}})();
})(window,document);
