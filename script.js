/* ============================================================
   script.js —— 首页的「壳」
   ------------------------------------------------------------
   只管：进入动画、左侧头像导航、切换板块、夜间模式、hash 直达。

   音乐播放器（播放 / 暂停、进度、歌词栏、播放列表、添加音乐）
   已经整体搬到 music.js + music-upload.js 里了，
   这里一行都不碰播放相关的 DOM，免得两边抢同一批元素。
   ============================================================ */

const enterBtn = document.getElementById('enterBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const app = document.getElementById('app');
const landingPlayer = document.getElementById('landingPlayer');
const floatingPlayer = document.getElementById('floatingPlayer');
const avatarNavWrap = document.getElementById('avatarNavWrap');
const avatarButton = document.getElementById('avatarButton');
const themeBtn = document.getElementById('themeBtn');

/* ---------------------------------------------------------- 进入小窝 ---- */

function enterApp(instant){
  landingPlayer.classList.add('exit');
  welcomeScreen.classList.add('hidden');
  app.classList.add('visible');
  if(instant){
    welcomeScreen.style.display='none';
    floatingPlayer.classList.add('visible');
  }else{
    setTimeout(()=>floatingPlayer.classList.add('visible'),360);
  }
}
enterBtn.addEventListener('click',()=>enterApp(false));

/* ------------------------------------------------------------ 导航 ---- */

avatarButton.addEventListener('click',()=>avatarNavWrap.classList.toggle('open'));
document.querySelectorAll('.radial-item').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.radial-item').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    showSection(btn.dataset.target);
    avatarNavWrap.classList.remove('open');
  });
});

function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.remove('active'));
  const target=document.getElementById(id); if(target) target.classList.add('active');
  const titles={about:'关于我',blog:'博客 / 随笔',projects:'项目展示'};
  document.getElementById('sectionTitle').textContent=titles[id]||'我的小窝';
}

/* -------------------------------------------------------- 夜间模式 ---- */

function applyTheme(night,persist){
  document.body.classList.toggle('night',night);
  themeBtn.textContent=night?'☀':'☾';
  if(persist){ try{ localStorage.setItem('rinsora-theme',night?'night':'light'); }catch(e){} }
}
themeBtn.addEventListener('click',()=>applyTheme(!document.body.classList.contains('night'),true));

/* ---------- 主题记忆：和文章页共用同一个 localStorage key ---------- */
try{ if(localStorage.getItem('rinsora-theme')==='night') applyTheme(true,false); }catch(e){}

/* ---------- hash 直达：index.html#blog / #about / #projects ----------
   从文章页点「回到博客列表」时直接落到博客板块，不用重看一遍欢迎页。 */
const HASH_SECTIONS=['about','blog','projects'];
function sectionFromHash(){
  const h=(location.hash||'').replace(/^#/,'').toLowerCase();
  return HASH_SECTIONS.includes(h)?h:null;
}
function activateSection(id){
  document.querySelectorAll('.radial-item').forEach(b=>b.classList.toggle('active',b.dataset.target===id));
  showSection(id);
}
function syncFromHash(){
  const s=sectionFromHash();
  if(s) activateSection(s);
}
(function initFromHash(){
  const s=sectionFromHash();
  if(!s) return;
  activateSection(s);
  enterApp(true);
})();
window.addEventListener('hashchange',syncFromHash);
