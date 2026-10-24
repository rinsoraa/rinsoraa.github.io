/* Same-origin editor adapter around the actual gallery, not a second site router. */
(function(w,d){'use strict';
w.RinsoraHome={AppState:{currentPage:'moments'},navigateTo(){},closeSettings(){}};
w.addEventListener('message',e=>{
 if(e.source!==w.parent||e.origin!==location.origin||!['memory-preview','memory-clear'].includes(e.data?.type))return;
 w.RinsoraMemory.destroy();if(e.data.type==='memory-clear'){d.getElementById('previewHint').textContent='草稿已改变，请重新更新预览。';return;}
 try{
  const data=e.data,errors=w.RinsoraMemoryModel.validate(data.doc,{allowFixtures:data.doc?.testFixture===true});if(errors.length)throw Error(errors.join('; '));
  const refs=new Set(data.doc.items.flatMap(i=>w.RinsoraMemoryModel.media(i).map(m=>m.src))),urls=data.urls||{};
  for(const [path,value] of Object.entries(urls))if(!refs.has(path)||typeof value!=='string'||!value.startsWith('blob:'+location.origin+'/'))throw Error('Invalid local preview image');
  d.documentElement.dataset.theme=data.night?'night':'day';
  w.RinsoraMemory.init(data.doc,{resolveImage:path=>urls[path]||path});w.RinsoraMemory.activate();
  d.getElementById('previewHint').textContent='本地草稿 · 尚未导入或发布。点击卡片查看高清详情。';
  w.parent.postMessage({type:'memory-preview-ready'},location.origin);
 }catch(error){d.getElementById('previewHint').textContent='预览校验失败：'+error.message;}
});
w.parent.postMessage({type:'memory-preview-loaded'},location.origin);
})(window,document);
