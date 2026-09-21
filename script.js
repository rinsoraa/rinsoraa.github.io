/* ============================================================
   script.js —— 首页的「壳」
   ------------------------------------------------------------
   只管：进入动画、左侧头像导航、切换板块、夜间模式、hash 直达、
        主页的「最近发布」区、鼠标点击涟漪。

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
const themeLabel = document.getElementById('themeLabel');

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* ---------------------------------------------------------- 进入小窝 ---- */

function enterApp(instant){
  /* 上一个页面里如果还开着播放列表，把两个播放器一起收回收起态。
     不然进到小窝时右下角那个播放器会白捡一个"已展开"的列表，显示就错乱了。 */
  try{
    if (window.RinsoraMusic && window.RinsoraMusic.collapse) window.RinsoraMusic.collapse();
  }catch(e){}

  if (landingPlayer) landingPlayer.classList.add('exit');
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

/* ------------------------------------------------------------ 导航 ----
   点击头像：挂起 / 收起导航栏（可切换）。
   再点页面上任何空白处也会收起。
   鼠标悬停依然能顺带展开，但「刚被显式收起」的那一下不会被悬停重新顶开
   —— 靠 nav-closed 抑制类，鼠标移开后自动复位。 */

function openNav(on){
  avatarNavWrap.classList.toggle('open', on);
  avatarNavWrap.classList.toggle('nav-closed', !on);
}

avatarButton.addEventListener('click',()=>{
  openNav(!avatarNavWrap.classList.contains('open'));
});

/* 鼠标移开就把抑制复位，下次悬停照常展开 */
avatarNavWrap.addEventListener('mouseleave',()=>{
  avatarNavWrap.classList.remove('nav-closed');
});

/* 点空白处收起导航栏 */
document.addEventListener('click',(e)=>{
  if(e.target && e.target.closest && e.target.closest('#avatarNavWrap')) return;
  avatarNavWrap.classList.remove('open');
  avatarNavWrap.classList.remove('nav-closed');
});

$$('.radial-item').forEach(btn=>{
  btn.addEventListener('click',()=>{
    $$('.radial-item').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    showSection(btn.dataset.target);
    avatarNavWrap.classList.remove('open');
    avatarNavWrap.classList.remove('nav-closed');
  });
});

function showSection(id){
  $$('.page-section').forEach(s=>s.classList.remove('active'));
  const target=document.getElementById(id); if(target) target.classList.add('active');
  const titles={about:'主页',blog:'博客 / 随笔',projects:'项目展示'};
  document.getElementById('sectionTitle').textContent=titles[id]||'我的小窝';
}

/* -------------------------------------------------------- 夜间模式 ----
   按钮里叠着日 / 月两个 SVG，换挡动画交给 CSS（.ic-sun / .ic-moon 的
   透明度 + 旋转），这里只负责切 body 上的 night 类。

   页面本身的过渡用 View Transitions：先给当前画面拍一张快照，再从
   按钮所在的位置扩散一个圆，把新配色"揭"出来。浏览器不支持、或者
   用户开了「减少动态效果」时，直接切换，不做动画。 */

let reduceMotion = false;
try { reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}

function applyTheme(night,persist){
  document.body.classList.toggle('night',night);
  if(themeLabel) themeLabel.textContent = night ? '日间模式' : '夜间模式';
  if(themeBtn) themeBtn.title = night ? '切换日间模式' : '切换夜间模式';
  if(persist){ try{ localStorage.setItem('rinsora-theme',night?'night':'light'); }catch(e){} }
}

function toggleTheme(){
  const next = !document.body.classList.contains('night');
  if(!document.startViewTransition || reduceMotion){ applyTheme(next,true); return; }

  const r = themeBtn.getBoundingClientRect();
  const x = r.left + r.width/2, y = r.top + r.height/2;
  /* 半径取到最远的那个角，保证圆能盖住整屏 */
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 28;

  const vt = document.startViewTransition(()=>applyTheme(next,true));
  vt.ready.then(()=>{
    document.documentElement.animate(
      { clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${far}px at ${x}px ${y}px)`
        ] },
      { duration: 640, easing: 'cubic-bezier(.2,.8,.2,1)',
        pseudoElement: '::view-transition-new(root)' }
    );
  }).catch(()=>{});
}

if(themeBtn) themeBtn.addEventListener('click',toggleTheme);

/* ---------- 主题记忆：和文章页共用同一个 localStorage key ---------- */
try{ if(localStorage.getItem('rinsora-theme')==='night') applyTheme(true,false); else applyTheme(false,false); }catch(e){}

/* ------------------------------------------------- 主页「最近发布」 ----
   博客直接从 #blog 的卡片里读（不再抄一份数据，改博客只需要改一处），
   项目读 projects-data.js。项目一条都没有时，项目那一整块不渲染。 */

function readRecentPosts(limit){
  return $$('#blog .blog-grid .blog-card').map(card=>{
    const a = card.querySelector('.card-title-link');
    if(!a) return null;
    const d = card.querySelector('.date'), p = card.querySelector('p');
    return {
      date : d ? d.textContent.trim() : '',
      title: a.textContent.trim(),
      href : a.getAttribute('href') || '#',
      desc : p ? p.textContent.trim() : ''
    };
  }).filter(Boolean).slice(0,limit);
}

function readRecentProjects(limit){
  const raw = window.RINSORA_PROJECTS || {};
  const items = Array.isArray(raw.items) ? raw.items.slice() : [];
  /* 日期是 YYYY.MM.DD 的定宽写法，直接按字符串倒排就是最新的在前 */
  items.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  return items.slice(0,limit);
}

function buildRecent(){
  const host = document.getElementById('recentFeed');
  if(!host) return;

  const posts  = readRecentPosts(3);
  const projs  = readRecentProjects(3);
  if(!posts.length && !projs.length){ host.innerHTML=''; return; }

  let html = '<div class="section-heading"><span>✧</span><h3>最近发布</h3><span class="line"></span></div>';

  if(posts.length){
    html += '<div class="recent-block">' +
      '<div class="recent-sub"><i></i>最新博客<span class="rt-line"></span></div>' +
      '<div class="recent-grid">' +
        posts.map(p=>
          `<a class="recent-card" href="${esc(p.href)}">` +
            '<span class="rc-kind">BLOG</span>' +
            `<b class="rc-title">${esc(p.title)}</b>` +
            `<span class="rc-desc">${esc(p.desc)}</span>` +
            '<span class="rc-foot">' +
              `<span class="rc-date">${esc(p.date)}</span>` +
              '<span class="recent-more">READ MORE →</span>' +
            '</span>' +
          '</a>'
        ).join('') +
      '</div></div>';
  }

  if(projs.length){
    html += '<div class="recent-block">' +
      '<div class="recent-sub"><i></i>最新项目<span class="rt-line"></span></div>' +
      '<div class="recent-grid">' +
        projs.map(p=>{
          const tag  = p.url ? 'a' : 'div';
          const attr = p.url ? ` href="${esc(p.url)}" target="_blank" rel="noopener"` : '';
          return `<${tag} class="recent-card"${attr}>` +
            '<span class="rc-kind k-proj">PROJECT</span>' +
            `<b class="rc-title">${esc(p.name)}</b>` +
            `<span class="rc-desc">${esc(p.desc || '')}</span>` +
            '<span class="rc-foot">' +
              `<span class="rc-date">${esc(p.date || '')}</span>` +
              (p.url ? '<span class="recent-more">OPEN →</span>' : '') +
            '</span>' +
          `</${tag}>`;
        }).join('') +
      '</div></div>';
  }

  host.innerHTML = html;
}

buildRecent();

/* ------------------------------------------------------ 鼠标点击涟漪 ----
   在指针位置放一个会扩散淡出的小圆，自动清理，不拦截任何事件。
   尊重「减少动态效果」，那种情况下 CSS 直接不显示。 */
document.addEventListener('pointerdown',(e)=>{
  if(e.button !== undefined && e.button !== 0) return;
  const dot = document.createElement('span');
  dot.className = 'click-ripple';
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
  document.body.appendChild(dot);
  setTimeout(()=>{ if(dot.parentNode) dot.parentNode.removeChild(dot); },620);
});

/* ---------- hash 直达：index.html#blog / #about / #projects ----------
   从文章页点「回到博客列表」时直接落到博客板块，不用重看一遍欢迎页。 */
const HASH_SECTIONS=['about','blog','projects'];
function sectionFromHash(){
  const h=(location.hash||'').replace(/^#/,'').toLowerCase();
  return HASH_SECTIONS.includes(h)?h:null;
}
function activateSection(id){
  $$('.radial-item').forEach(b=>b.classList.toggle('active',b.dataset.target===id));
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

/* 给别的模块留个口子：内容变了可以重刷「最近发布」 */
window.RinsoraHome = { refreshRecent: buildRecent };
