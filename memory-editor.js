/* Local memory drafts only. No credentials, remote upload or storage writes. */
(function(w,d){'use strict';
const A=w.RinsoraMemoryManager,M=w.RinsoraMemoryModel,$=id=>d.getElementById(id),clone=x=>JSON.parse(JSON.stringify(x));
let doc,current='',busy=false,generation=0,closed=false;const drafts=new Map(),urls=new Map(),downloads=new Set();
const draft=()=>drafts.get(current),node=(tag,text,cls)=>{const e=d.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const bytes=n=>n>=1048576?(n/1048576).toFixed(2)+' MiB':(n/1024).toFixed(1)+' KiB';
function say(text,kind=''){const s=$('actionStatus');s.textContent=text;s.dataset.kind=kind;}
function clearPreview(){ $('memoryPreview').contentWindow?.postMessage({type:'memory-clear'},location.origin);$('previewStatus').textContent='草稿预览未更新。';}
function release(){clearPreview();for(const u of urls.values())URL.revokeObjectURL(u);urls.clear();}
function clearDownloads(){for(const u of downloads)URL.revokeObjectURL(u);downloads.clear();$('downloadLinks').replaceChildren();}
function localURL(path){const a=draft()?.assets.get(path);if(!a)return path;if(!urls.has(path))urls.set(path,URL.createObjectURL(new Blob([a.data],{type:a.mime})));return urls.get(path);}
function collect(x){const refs=new Set(M.media(x.record).map(m=>m.src));for(const name of x.assets.keys())if(!refs.has(name)){x.assets.delete(name);const u=urls.get(name);if(u){URL.revokeObjectURL(u);urls.delete(name);}}}
function initDraft(record){return{record:clone(record),categories:[],assets:new Map(),confirmed:false,dirty:false,warnings:[]};}
function allCategories(){const list=clone(doc.categories);for(const c of draft()?.categories||[])if(!list.some(x=>x.id===c.id))list.push(c);return list;}
function save(){
 const x=draft();if(!x)return;const r=x.record,previous=x.formValues||{},different=id=>$(id).value!==previous[id];
 for(const [field,id]of Object.entries({title:'memoryTitle',date:'memoryDate',category:'memoryCategory',description:'memoryDescription',story:'memoryStory'}))if(different(id))r[field]=$(id).value;
 if(different('memoryTags'))r.tags=$('memoryTags').value.split(/[,，]/).map(t=>t.trim()).filter(Boolean);
 if(different('featuredRank')){const rank=$('featuredRank').value;if(rank!=='')r.featuredRank=Number(rank);else if(Object.hasOwn(r,'featuredRank'))r.featuredRank=null;}
 for(const [field,id]of Object.entries({kind:'sourceKind',creator:'sourceCreator',note:'sourceNote'}))if(different(id))r.source[field]=$(id).value;
 if(different('sourceURL')){if($('sourceURL').value)r.source.url=$('sourceURL').value;else delete r.source.url;}
 r.source.publicConfirmed=$('publicConfirm').checked;
 captureForm(x);
 x.confirmed=$('publicConfirm').checked;
}
function captureForm(x){x.formValues=Object.fromEntries(['memoryTitle','memoryDate','memoryCategory','memoryDescription','memoryStory','memoryTags','featuredRank','sourceKind','sourceCreator','sourceNote','sourceURL'].map(id=>[id,$(id).value]));}
function changed(){const x=draft();if(!x)return;x.dirty=true;x.confirmed=false;x.record.source.publicConfirmed=false;$('publicConfirm').checked=false;$('budgetConfirm').checked=false;clearPreview();clearDownloads();}
function choices(){
 const host=$('memoryChoices');host.replaceChildren();const records=new Map(doc.items.map(i=>[i.id,i]));for(const [id,x] of drafts)records.set(id,x.record);
 if(!records.size)host.append(node('p','回忆册还空着，先新建一页吧。','hint'));
 for(const [id,r] of records){const b=node('button',r.title||'尚未命名的一页');b.type='button';b.dataset.memory=id;b.setAttribute('aria-pressed',String(id===current));b.disabled=busy;b.append(node('small',id),node('small',(r.date||'事件日期待填写')+' · '+(r.gallery?.length||0)+' 张高清图'+(drafts.get(id)?.dirty?' · 草稿':'')));b.onclick=()=>select(id);host.append(b);}
}
function categoryOptions(){const selected=draft()?.record.category,host=$('memoryCategory');host.replaceChildren();for(const c of allCategories()){const option=node('option',c.label);option.value=c.id;host.append(option);}host.value=selected||allCategories()[0]?.id||'';}
function setBusy(value){busy=value;$('editorFields').disabled=value;for(const id of ['newMemory','exportMemory','refreshPreview','resetDraft'])$(id).disabled=value;$('cancelRead').hidden=!value;choices();}
function mediaCard(m,cover,index){
 const x=draft(),card=node('div',undefined,'me-media');if(!m){card.append(node('p','还没有选择封面。','hint'));return card;}
 const paired=M.pairedDetail(x.record),primary=!cover&&paired?.src===m.src,img=node('img');img.width=m.width;img.height=m.height;img.alt=m.alt||'所选图片的本地预览';img.loading='lazy';img.src=localURL(m.src);img.onerror=()=>{img.hidden=true;card.prepend(node('p','图片暂时无法加载，可以替换；原配置引用仍保留。','hint'));};card.append(img);
 const a=x.assets.get(m.src);card.append(node('p',(cover?'网页轻量封面':primary?'封面高清对应图 · 详情第一张':'图集高清图')+' · '+m.width+' × '+m.height+(a?' · '+bytes(a.bytes):''),'me-code'),node('p',m.src,'me-code'));
 if(a)card.append(node('p','原输入：'+a.input.width+' × '+a.input.height+' · '+bytes(a.input.bytes)+'；输出 WebP，不导出原文件名。','hint'));
 for(const [field,label,max] of [['alt','替代文字 alt · 必填',300],['caption','图片说明',600]]){const l=node('label',undefined,'field');l.append(node('span',label));const input=node('input');input.value=m[field]||'';input.maxLength=max;input.dataset.mediaField=field;input.oninput=()=>{m[field]=input.value;changed();};l.append(input);card.append(l);}
 if(!cover){const controls=node('div',undefined,'me-controls');for(const [text,offset] of [['上移',-1],['下移',1]]){const b=node('button',text,'btn-ghost');b.type='button';const next=index+offset;b.disabled=primary||next<0||next>=x.record.gallery.length||(next>=0&&x.record.gallery[next].src===paired?.src);b.onclick=()=>{save();[x.record.gallery[index],x.record.gallery[next]]=[x.record.gallery[next],x.record.gallery[index]];changed();renderMedia();};controls.append(b);}const remove=node('button','移除引用','btn-ghost');remove.type='button';remove.disabled=primary;remove.onclick=()=>{save();x.record.gallery.splice(index,1);collect(x);changed();renderMedia();};controls.append(remove);card.append(controls);}
 return card;
}
function renderMedia(){release();$('coverPreview').replaceChildren(mediaCard(draft().record.cover,true));$('galleryList').replaceChildren(...(draft().record.gallery||[]).map((m,i)=>mediaCard(m,false,i)));$('galleryCount').textContent=(draft().record.gallery?.length||0)+' / 12';choices();}
function render(){
 const x=draft(),r=x.record;$('nothingSelected').hidden=true;$('memoryForm').hidden=false;
 for(const [field,id] of Object.entries({id:'memoryId',title:'memoryTitle',date:'memoryDate',description:'memoryDescription',story:'memoryStory'}))$(id).value=r[field]||'';
 categoryOptions();$('memoryTags').value=r.tags.join(', ');$('featuredRank').value=Number.isInteger(r.featuredRank)?r.featuredRank:'';
 $('sourceKind').value=r.source.kind;$('sourceCreator').value=r.source.creator;$('sourceNote').value=r.source.note;$('sourceURL').value=r.source.url||'';$('publicConfirm').checked=x.confirmed;
 $('fixtureNotice').hidden=!(doc.testFixture||r.source.kind==='test-fixture');captureForm(x);renderMedia();say(x.warnings.join('\n'));
}
function select(id){if(busy)return;save();release();clearDownloads();current=id;if(!drafts.has(id))drafts.set(id,initDraft(doc.items.find(i=>i.id===id)));render();}
function fresh(){
 if(busy)return;save();const id='memory-'+crypto.randomUUID();drafts.set(id,initDraft({id,title:'',date:'',category:doc.categories[0]?.id||'',description:'',tags:[],gallery:[],source:{kind:'user-owned',creator:'',note:'',publicConfirmed:false}}));select(id);
}
function verifyRecord(){
 save();const x=draft(),r=x.record;if(!x.confirmed)throw Error('请填写来源并确认照片可公开；预览与导出都只在本机进行');const errors=M.validate({schemaVersion:1,categories:allCategories(),items:[r],...(r.source.kind==='test-fixture'||doc.testFixture?{testFixture:true}:{})},{allowFixtures:true});
 if(errors.length)throw Error('请检查标题、真实日期、分类、图片 alt、来源及字段长度：\n'+errors.join('\n'));A.privacy(r);return r;
}
async function filesSelected(files,cover){
 if(busy||!draft()||!files.length)return;save();setBusy(true);const ticket=++generation,x=draft(),next=clone(x.record),assets=new Map(x.assets),warnings=[];
 try{
  say('正在读取、验证并生成 WebP；未上传任何文件。');
  for(const file of files){
   const prepared=await A.prepare(file,current,{cover,featured:Number.isInteger(next.featuredRank)});if(ticket!==generation||closed)return;
   for(const a of prepared.assets)assets.set(a.path,a);const caption=next.title||'';prepared.detail.alt=caption;
   if(cover){const old=M.pairedDetail(next);next.gallery=(next.gallery||[]).filter(m=>m.src!==old?.src&&m.src!==prepared.detail.src);next.gallery.unshift(prepared.detail);next.cover={...prepared.cover,alt:caption};}
   else{next.gallery=next.gallery||[];if(!next.gallery.some(m=>m.src===prepared.detail.src))next.gallery.push(prepared.detail);}
   if(next.gallery.length>M.LIMITS.gallery)throw Error('图集最多12个位置（含封面高清图）；请先移除不需要的引用');warnings.push(...prepared.warnings);
  }
  const refs=new Set(M.media(next).map(m=>m.src));for(const key of assets.keys())if(!refs.has(key))assets.delete(key);
  let total=0;for(const [id,other] of drafts)for(const a of (id===current?assets:other.assets).values())total+=a.bytes;
  if(total>A.LIMITS.totalBytes)throw Error('全部草稿部署资源超过64 MiB，请导出并撤销其他草稿后再处理');
  x.record=next;x.assets=assets;x.warnings=warnings;changed();renderMedia();say('预览素材就绪。'+(warnings.length?'\n'+warnings.join('\n'):'')+'\n请检查图片细节并补全 alt、故事和来源。');
 }catch(e){say('未应用本次选择：'+e.message,'error');}finally{setBusy(false);$('coverFile').value='';$('galleryFiles').value='';}
}
async function preview(){
 try{const record=clone(verifyRecord()),urls={};if($('previewStyle').value==='featured')record.featuredRank=0;else delete record.featuredRank;
  for(const m of M.media(record))if(draft().assets.has(m.src))urls[m.src]=localURL(m.src);
  const sample={schemaVersion:1,categories:allCategories(),items:[record],...(record.source.kind==='test-fixture'||doc.testFixture?{testFixture:true}:{})};
  $('memoryPreview').contentWindow.postMessage({type:'memory-preview',doc:sample,urls,night:d.documentElement.dataset.theme==='night'},location.origin);
 }catch(e){say(e.message,'error');}
}
async function exportDraft(){
 if(busy||!draft())return;try{const record=verifyRecord();setBusy(true);say('正在生成并重新读取 ZIP，检查目录、CRC 与 SHA256…');
  const pkg=await A.buildPackage({doc,record,addCategories:draft().categories,assets:[...draft().assets.values()],publicConfirmed:draft().confirmed,budgetConfirmed:$('budgetConfirm').checked});
  if(closed)return;clearDownloads();const url=URL.createObjectURL(pkg.blob);downloads.add(url);const link=node('a','下载 '+pkg.name);link.href=url;link.download=pkg.name;$('downloadLinks').append(link);link.click();say('资源包已导出，需要导入项目仓库后才能在网站展示。\nZIP、CRC、SHA256 与配置已重新校验；未写入正式 JSON，未提交或发布。');
 }catch(e){say('未导出：'+e.message,'error');}finally{setBusy(false);}
}
$('newMemory').onclick=fresh;$('coverFile').onchange=e=>filesSelected([...e.target.files],true);$('galleryFiles').onchange=e=>filesSelected([...e.target.files],false);
$('cancelRead').onclick=()=>{generation++;say('已取消接收读取结果；当前解码结束后释放临时缓冲。');};
$('addCategory').onclick=()=>{try{save();const id=$('newCategoryId').value,label=$('newCategoryLabel').value;if(!M.id(id)||!label.trim()||label.length>40)throw Error('请填写合法分类 ID 与名称');if(allCategories().some(c=>c.id===id))throw Error('分类 ID 已存在，不能覆盖');if(allCategories().length>=M.LIMITS.categories)throw Error('分类最多24个');draft().categories.push({id,label});draft().record.category=id;categoryOptions();changed();say('分类已加入本次草稿；尚未写入网站。');}catch(e){say(e.message,'error');}};
$('memoryForm').addEventListener('submit',e=>e.preventDefault());
$('memoryForm').addEventListener('input',e=>{if(e.target.closest('#coverPreview,#galleryList')||['budgetConfirm','newCategoryId','newCategoryLabel'].includes(e.target.id))return;save();if(e.target.id!=='publicConfirm')changed();else if(!e.target.checked)clearPreview();if(e.target.id==='sourceKind')$('fixtureNotice').hidden=!(doc.testFixture||draft().record.source.kind==='test-fixture');});
$('refreshPreview').onclick=preview;$('exportMemory').onclick=exportDraft;
$('previewStyle').onchange=preview;$('mobilePreview').onchange=()=>{$('memoryPreview').classList.toggle('is-mobile',$('mobilePreview').checked);};
$('resetDraft').onclick=()=>{if(busy||!draft())return;const old=doc.items.find(i=>i.id===current);release();clearDownloads();drafts.delete(current);if(old){drafts.set(current,initDraft(old));render();}else{current='';$('memoryForm').hidden=true;$('nothingSelected').hidden=false;choices();}};
$('toggleTheme').onclick=()=>{d.documentElement.dataset.theme=d.documentElement.dataset.theme==='night'?'day':'night';if(draft()?.confirmed)preview();};
w.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===$('memoryPreview').contentWindow&&e.data?.type==='memory-preview-ready')$('previewStatus').textContent='实际收藏册组件预览已更新 · 草稿未保存。';});
w.addEventListener('pagehide',()=>{closed=true;generation++;release();clearDownloads();drafts.clear();});
w.addEventListener('beforeunload',e=>{if([...drafts.values()].some(x=>x.dirty)){e.preventDefault();e.returnValue='';}});
(async()=>{try{const r=await fetch('memory-gallery-data.json',{cache:'no-cache',credentials:'same-origin'});if(!r.ok||Number(r.headers.get('content-length'))>2097152)throw Error('回忆目录不可用');const text=await r.text();if(new TextEncoder().encode(text).length>2097152)throw Error('回忆目录过大');doc=JSON.parse(text);const errors=M.validate(doc,{allowFixtures:doc.testFixture===true});if(errors.length)throw Error(errors.join('; '));if(closed)return;try{if(localStorage.getItem('rinsora-theme')==='night')d.documentElement.dataset.theme='night';}catch(_){}$('loadState').textContent='目录已读取 · 本地准备模式';$('workspace').hidden=false;$('fixtureNotice').hidden=!doc.testFixture;choices();d.documentElement.dataset.memoryEditor='ready';}catch(e){$('loadState').textContent='无法读取目录：'+e.message+'。没有修改任何文件。';}})();
})(window,document);
