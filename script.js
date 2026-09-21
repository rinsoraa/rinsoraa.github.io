const audio = document.getElementById('audio');
const enterBtn = document.getElementById('enterBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const app = document.getElementById('app');
const landingPlayer = document.getElementById('landingPlayer');
const floatingPlayer = document.getElementById('floatingPlayer');
const avatarNavWrap = document.getElementById('avatarNavWrap');
const avatarButton = document.getElementById('avatarButton');
const themeBtn = document.getElementById('themeBtn');
const miniLyricsBtn = document.getElementById('miniLyricsBtn');

const landingPlay = document.getElementById('landingPlay');
const floatPlay = document.getElementById('floatPlay');
const vinyl = document.getElementById('vinyl');
const landingProgress = document.getElementById('landingProgress');
const floatProgress = document.getElementById('floatProgress');
const landingTime = document.getElementById('landingTime');
const floatTime = document.getElementById('floatTime');
const landingTitle = document.getElementById('landingTitle');
const floatTitle = document.getElementById('floatTitle');
const landingArtist = document.getElementById('landingArtist');
const floatArtist = document.getElementById('floatArtist');
const landingLyrics = document.getElementById('landingLyrics');
const floatLyric = document.getElementById('floatLyric');
const floatLyricsPanel = document.getElementById('floatLyricsPanel');
const floatLyricsToggle = document.getElementById('floatLyricsToggle');

let lyrics = [
  {time:0, text:'♪ 欢迎来到空凛的小窝 ♪'},
  {time:3, text:'这里收藏一点喜欢的东西'},
  {time:6, text:'也记录一些正在发生的故事'},
  {time:9, text:'以后再一起慢慢变得更可爱吧 ♡'}
];

function fmt(s){
  if(!Number.isFinite(s)) return '00:00';
  const m=Math.floor(s/60).toString().padStart(2,'0');
  const sec=Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}
function setPlayingUI(playing){
  landingPlay.textContent = playing ? '❚❚' : '▶';
  floatPlay.textContent = playing ? '❚❚' : '▶';
  vinyl.classList.toggle('playing', playing);
}
function togglePlay(){
  if(audio.paused) audio.play().catch(()=>{}); else audio.pause();
}
landingPlay.addEventListener('click', togglePlay);
floatPlay.addEventListener('click', togglePlay);
audio.addEventListener('play', ()=>setPlayingUI(true));
audio.addEventListener('pause', ()=>setPlayingUI(false));
audio.addEventListener('ended', ()=>setPlayingUI(false));

audio.addEventListener('loadedmetadata', ()=>{
  landingTime.textContent = `00:00 / ${fmt(audio.duration)}`;
});
audio.addEventListener('timeupdate', ()=>{
  const p = audio.duration ? (audio.currentTime/audio.duration)*100 : 0;
  landingProgress.style.width = `${p}%`;
  floatProgress.style.width = `${p}%`;
  landingTime.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
  floatTime.textContent = fmt(audio.currentTime);
  renderLyrics(audio.currentTime);
});

function renderLyrics(current){
  let active=-1;
  for(let i=0;i<lyrics.length;i++) if(current>=lyrics[i].time) active=i;
  landingLyrics.innerHTML = lyrics.map((l,i)=>`<div class="lyrics-line ${i===active?'active':''}">${escapeHtml(l.text)}</div>`).join('');
  floatLyricsPanel.innerHTML = lyrics.map((l,i)=>`<div class="lyrics-line ${i===active?'active':''}">${escapeHtml(fmt(l.time))} · ${escapeHtml(l.text)}</div>`).join('');
  floatLyric.textContent = active>=0 ? lyrics[active].text : lyrics[0]?.text || '♪';
}
function escapeHtml(str){
  return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function toggleLyrics(panel){ panel.classList.toggle('open'); }
document.querySelectorAll('.lyrics-toggle').forEach(btn=>btn.addEventListener('click',()=>toggleLyrics(document.getElementById(btn.dataset.target))));
floatLyricsToggle.addEventListener('click',()=>{
  floatLyricsPanel.classList.toggle('open');
  floatLyricsToggle.textContent = floatLyricsPanel.classList.contains('open') ? '收起歌词' : '展开歌词';
});
miniLyricsBtn.addEventListener('click',()=>toggleLyrics(floatLyricsPanel));

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

function applyTheme(night,persist){
  document.body.classList.toggle('night',night);
  themeBtn.textContent=night?'☀':'☾';
  if(persist){ try{ localStorage.setItem('rinsora-theme',night?'night':'light'); }catch(e){} }
}
themeBtn.addEventListener('click',()=>applyTheme(!document.body.classList.contains('night'),true));

function readFileAsText(file){ return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsText(file)}); }
function parseLrc(text){
  const out=[];
  for(const raw of text.split(/\r?\n/)){
    const matches=[...raw.matchAll(/\[(\d{1,2}):(\d{1,2}(?:\.\d{1,3})?)\]/g)];
    const content=raw.replace(/\[[^\]]+\]/g,'').trim();
    for(const m of matches){
      out.push({time:Number(m[1])*60+Number(m[2]),text:content||'♪'});
    }
  }
  return out.sort((a,b)=>a.time-b.time);
}

document.getElementById('audioFile').addEventListener('change',e=>{
  const file=e.target.files?.[0]; if(!file) return;
  const url=URL.createObjectURL(file);
  audio.src=url;
  const name=file.name.replace(/\.[^.]+$/,'');
  landingTitle.textContent=name; floatTitle.textContent=name;
  landingArtist.textContent='Local Music'; floatArtist.textContent='Local Music';
  audio.load();
});
document.getElementById('lrcFile').addEventListener('change',async e=>{
  const file=e.target.files?.[0]; if(!file) return;
  try{ const text=await readFileAsText(file); const parsed=parseLrc(text); if(parsed.length) lyrics=parsed; renderLyrics(audio.currentTime); }
  catch(err){ console.error('LRC parse failed',err); }
});

renderLyrics(0);

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
