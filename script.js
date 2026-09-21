(() => {
  'use strict';

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const welcome = $('#welcomeScreen');
  const app = $('#app');
  const landingPlayer = $('#landingPlayer');
  const floatingPlayer = $('#floatingPlayer');
  const enterBtn = $('#enterBtn');
  const navWrap = $('#avatarNavWrap');
  const avatarButton = $('#avatarButton');
  const themeBtn = $('#themeBtn');
  const themeLabel = $('#themeLabel');
  const settingsPanel = $('#settingsPanel');
  const settingsMask = $('#settingsMask');
  const pageProgress = $('#pageProgress');
  const boot = $('#bootScreen');

  const state = {
    section: 'about',
    theme: localStorage.getItem('rinsora-v2-theme') || (localStorage.getItem('rinsora-theme') === 'night' ? 'dream' : 'candy'),
    settings: {
      particles: localStorage.getItem('rinsora-effect-particles') !== 'off',
      cursor: localStorage.getItem('rinsora-effect-cursor') !== 'off',
      tilt: localStorage.getItem('rinsora-effect-tilt') !== 'off',
      ripple: localStorage.getItem('rinsora-effect-ripple') !== 'off'
    },
    hue: Number(localStorage.getItem('rinsora-effect-hue') || 0)
  };

  function save(k,v){ try{localStorage.setItem(k,v)}catch(e){} }

  // ---------- Boot ----------
  let p = 0;
  const bootTimer = setInterval(()=>{
    p = Math.min(100, p + (p < 70 ? 9 : 5));
    $('#bootProgress').style.width = p + '%';
    $('#bootPercent').textContent = p + '%';
    if(p >= 100){
      clearInterval(bootTimer);
      setTimeout(()=>boot.classList.add('done'), 260);
    }
  }, 70);

  // ---------- Utilities ----------
  function isReduceMotion(){
    try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}
  }

  function updateCursorState(){
    document.body.classList.toggle('cursor-on', state.settings.cursor && !isReduceMotion());
  }

  function applyEffects(){
    document.body.classList.toggle('no-particles', !state.settings.particles);
    document.body.classList.toggle('cursor-on', state.settings.cursor && !isReduceMotion());
    document.body.classList.toggle('no-tilt', !state.settings.tilt);
    $$('.switch').forEach(btn=>btn.classList.toggle('on', !!state.settings[btn.dataset.setting]));
  }

  // ---------- Theme ----------
  function applyTheme(theme, persist=true){
    document.body.classList.remove('theme-sunset','theme-dream','theme-mint');
    let isNight = false;
    if(theme === 'sunset') document.body.classList.add('theme-sunset');
    if(theme === 'mint') document.body.classList.add('theme-mint');
    if(theme === 'dream'){
      document.body.classList.add('theme-dream');
      isNight = true;
    }
    document.body.classList.toggle('night', isNight);
    document.documentElement.classList.toggle('night', isNight);
    themeLabel.textContent = isNight ? '日间模式' : '夜间模式';
    themeBtn.title = isNight ? '切换日间模式' : '切换夜间模式';
    $$('.theme-grid button').forEach(btn=>btn.classList.toggle('active',btn.dataset.theme===theme));
    if(persist){
      state.theme = theme;
      save('rinsora-v2-theme', theme);
      save('rinsora-theme', isNight ? 'night' : 'light');
    }
  }

  themeBtn?.addEventListener('click',()=>{
    const next = document.body.classList.contains('night') ? 'candy' : 'dream';
    applyTheme(next,true);
    toast(next==='dream'?'已切换到梦幻夜景 ✦':'回到糖果白日 ☀');
  });
  applyTheme(state.theme,false);

  // ---------- Avatar flight ----------
  function flyAvatar(){
    if(isReduceMotion()) return;
    const from = $('.avatar-glass img', welcome);
    const to = $('.avatar-sidebar', app);
    if(!from || !to) return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();

    const clone = from.cloneNode(true);
    clone.className = 'avatar-flight';
    clone.style.left = `${a.left}px`;
    clone.style.top = `${a.top}px`;
    clone.style.width = `${a.width}px`;
    clone.style.height = `${a.height}px`;
    document.body.appendChild(clone);

    const glow = document.createElement('div');
    glow.className = 'avatar-flight-glow';
    glow.style.left = `${a.left + a.width/2 - 115}px`;
    glow.style.top = `${a.top + a.height/2 - 115}px`;
    glow.style.width = '230px';
    glow.style.height = '230px';
    document.body.appendChild(glow);

    from.style.opacity = '0';
    to.style.opacity = '0';

    const dx = b.left - a.left;
    const dy = b.top - a.top;
    const sx = b.width / a.width;
    const sy = b.height / a.height;

    const anim = clone.animate([
      {transform:'translate3d(0,0,0) scale(1) rotate(0deg)', filter:'drop-shadow(0 16px 20px rgba(150,100,135,.22))'},
      {transform:`translate3d(${dx*.45}px,${dy*.25}px,0) scale(${1.18}) rotate(-6deg)`},
      {transform:`translate3d(${dx}px,${dy}px,0) scale(${sx}) rotate(0deg)`, filter:'drop-shadow(0 18px 28px rgba(220,124,169,.33))'}
    ],{duration:920,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});

    glow.animate([
      {transform:'translate3d(0,0,0) scale(.9)',opacity:.8},
      {transform:`translate3d(${dx*.5}px,${dy*.5}px,0) scale(1.2)`,opacity:.35},
      {transform:`translate3d(${dx}px,${dy}px,0) scale(.55)`,opacity:0}
    ],{duration:920,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});

    anim.finished?.then(()=>{
      clone.remove(); glow.remove();
      from.style.opacity='';
      to.style.opacity='';
    }).catch(()=>{
      clone.remove(); glow.remove(); from.style.opacity=''; to.style.opacity='';
    });
  }

  function enterApp(instant=false){
    try{window.RinsoraMusic?.collapse?.()}catch(e){}
    if(!instant) flyAvatar();
    landingPlayer?.classList.add('exit');
    welcome?.classList.add('hidden');
    app?.classList.add('visible');
    const show = ()=>floatingPlayer?.classList.add('visible');
    instant ? show() : setTimeout(show, 390);
  }
  enterBtn?.addEventListener('click',()=>enterApp(false));

  // ---------- Navigation ----------
  const titles = {about:'个人简介', blog:'博客 / 随笔', projects:'项目展示'};
  function showSection(id, push=true){
    if(!titles[id]) id='about';
    state.section = id;
    $$('.page-section').forEach(s=>s.classList.toggle('active', s.id===id));
    $$('.radial-item').forEach(b=>b.classList.toggle('active', b.dataset.target===id));
    $$('.mobile-nav button').forEach(b=>b.classList.toggle('active', b.dataset.target===id));
    $('#sectionTitle').textContent=titles[id];
    const widths={about:33,blog:66,projects:100};
    pageProgress.style.width=(widths[id]||33)+'%';
    document.title = `${titles[id]} · 空凛 · Rinsora`;
    if(push && history.replaceState) history.replaceState(null,'','#'+id);
    window.scrollTo({top:0,behavior:isReduceMotion()?'auto':'smooth'});
  }

  function routeHash(){
    const h=(location.hash||'').replace(/^#/,'').toLowerCase();
    if(h==='admin'||h==='write'||h==='editor'){location.href='editor.html';return;}
    if(h==='project'||h==='newproject'){location.href='project-editor.html';return;}
    if(titles[h]){
      enterApp(true);
      showSection(h,false);
    }
  }

  $$('.radial-item,.mobile-nav button').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      showSection(btn.dataset.target,true);
      navWrap.classList.remove('open','nav-closed');
    });
  });
  avatarButton?.addEventListener('click',e=>{
    e.stopPropagation();
    navWrap.classList.toggle('open');
    navWrap.classList.remove('nav-closed');
  });
  navWrap?.addEventListener('mouseleave',()=>navWrap.classList.remove('nav-closed'));
  document.addEventListener('click',e=>{
    if(!e.target.closest('#avatarNavWrap')) navWrap?.classList.remove('open','nav-closed');
  });
  window.addEventListener('hashchange',routeHash);

  // ---------- Settings ----------
  function openSettings(){settingsPanel?.classList.add('open');settingsMask?.classList.add('open')}
  function closeSettings(){settingsPanel?.classList.remove('open');settingsMask?.classList.remove('open')}
  $$('.settings-open').forEach(b=>b.addEventListener('click',openSettings));
  $('#settingsClose')?.addEventListener('click',closeSettings);
  settingsMask?.addEventListener('click',closeSettings);

  $$('.set-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      $$('.set-tab').forEach(x=>x.classList.remove('active'));
      $$('.set-pane').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      $(`.set-pane[data-pane="${btn.dataset.tab}"]`)?.classList.add('active');
    });
  });

  $$('.theme-grid button').forEach(btn=>btn.addEventListener('click',()=>{
    const t=btn.dataset.theme;
    applyTheme(t,true);
    toast(`已换上「${btn.textContent.trim()}」`);
  }));

  $('#hueRange')?.addEventListener('input',e=>{
    state.hue=Number(e.target.value||0);
    $('#hueValue').textContent = (state.hue>=0?'+':'') + state.hue + '°';
    document.documentElement.style.setProperty('--hue', `${state.hue}deg`);
    save('rinsora-effect-hue',state.hue);
  });
  $('#hueRange').value=state.hue; $('#hueValue').textContent=(state.hue>=0?'+':'')+state.hue+'°';
  document.documentElement.style.setProperty('--hue', `${state.hue}deg`);

  $$('.switch').forEach(btn=>btn.addEventListener('click',()=>{
    const k=btn.dataset.setting;
    state.settings[k]=!state.settings[k];
    save('rinsora-effect-'+k, state.settings[k]?'on':'off');
    applyEffects();
  }));
  applyEffects();

  // ---------- Clock / time ----------
  const dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function updateClock(){
    const now=new Date();
    const hh=String(now.getHours()).padStart(2,'0');
    const mm=String(now.getMinutes()).padStart(2,'0');
    const ss=String(now.getSeconds()).padStart(2,'0');
    $('#liveClock').textContent=`${hh}:${mm}`;
    $('#liveDate').textContent=`${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} · ${dayNames[now.getDay()]}`;
    const pct=((now.getHours()*3600+now.getMinutes()*60+now.getSeconds())/86400)*100;
    $('#timeProgress').style.width=pct.toFixed(2)+'%';
    $('#dayPercent').textContent=Math.floor(pct)+'%';
    $('#sidePresence').textContent=now.getHours()>=0 ? 'ONLINE' : 'AWAY';
  }
  updateClock(); setInterval(updateClock,1000);

  // ---------- Moments ----------
  const moments=[
    ['2026.09.22','终于把小窝的 V2 认真规划起来了。现在开始研究，怎么把“网页”做得像一间房间。','🌸'],
    ['2026.09.21','又折腾了一晚上 AI Agent。很多东西其实没那么有用，但做出来的时候总是很开心。','🤖'],
    ['2026.09.10','Minecraft 服务器又出现了新的问题。嗯……很正常。','⛏']
  ];
  function renderMoments(){
    const host=$('#momentsGrid'); if(!host)return;
    host.innerHTML=moments.map(m=>`<article class="moment-card card tilt-card"><div class="moment-date">${m[0]}</div><p>${esc(m[1])}</p><span class="moment-icon">${m[2]}</span></article>`).join('');
    wireTilt();
  }
  renderMoments();

  // ---------- Recent feed ----------
  function readRecentPosts(limit=3){
    return $$('#blog .blog-grid .blog-card').map(card=>{
      const a=$('.card-title-link',card), d=$('.date',card), p=card.querySelector('p');
      return a?{title:a.textContent.trim(),href:a.getAttribute('href')||'#',date:d?.textContent.trim()||'',desc:p?.textContent.trim()||''}:null;
    }).filter(Boolean).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,limit);
  }
  function readRecentProjects(limit=3){
    const raw=window.RINSORA_PROJECTS||{};
    const items=Array.isArray(raw.items)?raw.items.slice():[];
    const sorter=window.RinsoraProjects?.newestFirst||(list=>list.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))));
    return sorter(items).slice(0,limit);
  }
  function latestUpdate(){
    const ds=[];
    $$('#blog .blog-grid .blog-card .date').forEach(x=>ds.push(x.textContent.trim()));
    (window.RINSORA_PROJECTS?.items||[]).forEach(x=>x?.date&&ds.push(String(x.date)));
    ds.sort();return ds.at(-1)||'';
  }
  function buildRecent(){
    const host=$('#recentFeed'); if(!host)return;
    const posts=readRecentPosts(), projs=readRecentProjects();
    if(!posts.length&&!projs.length){host.innerHTML='';return;}
    let html='<div class="section-heading fancy-heading"><span>✧</span><h3>最近发布</h3><small>RECENT</small><span class="line"></span></div>';
    if(posts.length){
      html+='<div class="recent-grid-wrap"><div class="recent-sub"><i></i>最新博客<span class="rt-line"></span></div><div class="recent-grid">';
      html+=posts.map(p=>`<a class="recent-card" href="${esc(p.href)}"><span class="rc-kind">BLOG</span><b class="rc-title">${esc(p.title)}</b><span class="rc-desc">${esc(p.desc)}</span><span class="rc-foot"><span>${esc(p.date)}</span><span>READ MORE ↗</span></span></a>`).join('');
      html+='</div></div>';
    }
    if(projs.length){
      html+='<div class="recent-grid-wrap"><div class="recent-sub"><i></i>最新项目<span class="rt-line"></span></div><div class="recent-grid">';
      html+=projs.map(p=>{
        const tag=p.url?'a':'div';const attr=p.url?` href="${esc(p.url)}" target="_blank" rel="noopener"`:'';
        return `<${tag} class="recent-card"${attr}><span class="rc-kind k-proj">PROJECT</span><b class="rc-title">${esc(p.name||'Untitled')}</b><span class="rc-desc">${esc(p.desc||'')}</span><span class="rc-foot"><span>${esc(p.date||'')}</span><span>${p.url?'OPEN ↗':''}</span></span></${tag}>`;
      }).join('');
      html+='</div></div>';
    }
    host.innerHTML=html;
  }
  function addRecentStyles(){
    if($('#v2RecentStyles'))return;
    const s=document.createElement('style');s.id='v2RecentStyles';s.textContent=`
      .recent-grid-wrap{margin:0 0 16px}.recent-sub{display:flex;align-items:center;gap:8px;color:#ad97a8;font-size:8px;letter-spacing:.14em;margin-bottom:9px}.recent-sub i{width:6px;height:6px;border-radius:50%;background:#ef9fbc}.rt-line{height:1px;flex:1;background:linear-gradient(90deg,rgba(213,180,198,.35),transparent)}.recent-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.recent-card{display:flex;flex-direction:column;gap:7px;padding:14px 15px;border-radius:18px;transition:transform .25s var(--ease),background .2s}.recent-card:hover{transform:translateY(-4px);background:var(--glass-h)}.rc-kind{font-size:7px;letter-spacing:.18em;color:#d07f9f;font-weight:1000}.rc-kind.k-proj{color:#8e84cf}.rc-title{font-size:11px;line-height:1.4}.rc-desc{font-size:9px;color:#a28f9e;line-height:1.7;min-height:30px}.rc-foot{display:flex;justify-content:space-between;margin-top:auto;color:#ae99a8;font-size:7px;gap:8px}.rc-foot span:last-child{color:#cd86a2;font-weight:900}@media(max-width:860px){.recent-grid{grid-template-columns:1fr}}`;
    document.head.appendChild(s);
  }
  addRecentStyles();buildRecent();

  // ---------- Blog filter ----------
  function buildBlogFilter(){
    const host=$('#blogFilter'); if(!host)return;
    const cats=[...new Set(blogCards().map(c=>(c.dataset.cat||'').trim()).filter(Boolean))];
    if(cats.length<2){host.innerHTML='';return;}
    host.innerHTML=['全部',...cats].map((c,i)=>`<button class="bf-chip${i===0?' active':''}" type="button" data-cat="${esc(i?c:'')}">${esc(c)}</button>`).join('');
    host.onclick=e=>{
      const btn=e.target.closest('.bf-chip');if(!btn)return;
      $$('.bf-chip',host).forEach(x=>x.classList.remove('active'));btn.classList.add('active');
      applyBlogFilter(btn.dataset.cat||'');
    };
    applyBlogFilter('');
  }
  function blogCards(){return $$('#blog .blog-grid .blog-card')}
  function applyBlogFilter(cat){
    let count=0;
    blogCards().forEach(card=>{const hit=!cat||(card.dataset.cat||'')===cat;card.hidden=!hit;if(hit)count++});
    const empty=$('#blogEmpty');if(empty)empty.hidden=count>0;
  }
  buildBlogFilter();

  // ---------- Tilt ----------
  function wireTilt(){
    if(state.settings.tilt && !isReduceMotion()){
      $$('.tilt-card').forEach(card=>{
        if(card.dataset.tiltBound)return;
        card.dataset.tiltBound='1';
        card.addEventListener('pointermove',e=>{
          if(e.pointerType==='touch')return;
          const r=card.getBoundingClientRect();
          const x=(e.clientX-r.left)/r.width-.5;
          const y=(e.clientY-r.top)/r.height-.5;
          card.style.transform=`perspective(800px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-2px)`;
        });
        card.addEventListener('pointerleave',()=>{card.style.transform='';});
      });
    }
  }
  wireTilt();

  // ---------- Cursor ----------
  const dot=$('#cursorDot'), ring=$('#cursorRing'), glow=$('#ambientGlow');
  let cx=innerWidth/2,cy=innerHeight/2, rx=cx,ry=cy;
  function moveCursor(e){
    cx=e.clientX;cy=e.clientY;
    if(dot){dot.style.left=cx+'px';dot.style.top=cy+'px'}
    if(glow){glow.style.left=cx+'px';glow.style.top=cy+'px'}
  }
  document.addEventListener('pointermove',moveCursor,{passive:true});
  function cursorLoop(){
    rx+=(cx-rx)*.18;ry+=(cy-ry)*.18;
    if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px'}
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
  document.addEventListener('pointerover',e=>{
    if(e.target.closest('a,button,.card,.mp-btn,.mp-disc,.avatar-button,.radial-item')) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('pointerout',e=>{
    if(e.target.closest('a,button,.card,.mp-btn,.mp-disc,.avatar-button,.radial-item')) document.body.classList.remove('cursor-hover');
  });

  // ---------- Ripple ----------
  document.addEventListener('pointerdown',e=>{
    if(!state.settings.ripple||isReduceMotion()||e.button===2)return;
    const el=document.createElement('span');el.className='click-ripple';el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';document.body.appendChild(el);
    setTimeout(()=>el.remove(),650);
  });

  // ---------- Keyboard ----------
  document.addEventListener('keydown',e=>{
    const key=e.key.toLowerCase();
    if((e.ctrlKey||e.metaKey)&&key==='k'){e.preventDefault();openSettings();}
    if(key==='1')showSection('about');
    if(key==='2')showSection('blog');
    if(key==='3')showSection('projects');
    if(key==='escape')closeSettings();
  });

  // ---------- Toast ----------
  let toastEl,toastTimer;
  function toast(msg){
    if(!toastEl){toastEl=document.createElement('div');toastEl.className='blog-toast';document.body.appendChild(toastEl)}
    toastEl.textContent=msg;toastEl.className='blog-toast show';
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.className='blog-toast',2500);
  }

  // ---------- External module hook ----------
  window.RinsoraHome = {
    refreshRecent:()=>{buildRecent();$('#nowUpdate').textContent=latestUpdate()||'—';wireTilt()},
    refreshBlogFilter:buildBlogFilter,
    showSection
  };

  $('#nowUpdate').textContent=latestUpdate()||'—';

  // ---------- Hash / initial ----------
  if(location.hash){
    setTimeout(routeHash, 50);
  }
})();
