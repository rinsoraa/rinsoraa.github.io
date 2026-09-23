/* ============================================================
   music-museum.js —— 「音乐博物馆 / MUSIC MUSEUM」场景引擎
   ------------------------------------------------------------
   职责边界（**很重要**，这个文件不该越界）：

     本文件负责                          script.js 负责
     ─────────────────────            ─────────────────────
     Museum 初始化                      页面入口 / 页面状态
     加载层进度驱动                     打开 / 关闭 museum 的时机
     场景渲染（唱片陈列）                与扇形导航接线
     唱片对象与点击播放                  淡出小窝
     资源预加载（真资源，不是 setTimeout） Esc / 路由的收口顺序

   数据来源分工：
     window.RINSORA_MUSIC          → 歌曲是什么（title/artist/cover/src/lrc）
     window.RINSORA_MUSIC_MUSEUM   → 歌曲摆在哪（x/y/scale/rotation/depth）

   ⚠️ 三条绝对不做的事：
     1. 不创建第二个 <audio>、不写第二套播放引擎 ——
        点唱片只是调 window.RinsoraMusic.playIndex(i)，复用现有播放器。
     2. 不修改现有播放器核心逻辑（music.js 一行都不动）。
     3. 不碰 location.href 去开新文档 —— 这是站内浮层，
        换文档会让 <audio> 随旧文档销毁、音乐断掉。

   对外接口 window.RinsoraMuseum：
     enter(opts)   → Promise；打开加载层 → 预加载 → 进场景
     exit()        → 关场景 + 关加载层（幂等）
     isOpen()      → 当前是否在博物馆里
     open()/close() 是 enter/exit 的别名（语义更直白的那组）
     records()     → 渲染后的唱片列表（调试 / 回归装置用）
     state         → 内部状态（只读用途）

   第二阶段新增（唱片阵列 —— 视差 / hover / 选中 / 详情）：
     select(rec)       → 选中一张唱片（打开详情），不播放
     deselect()        → 收起详情，恢复场景（幂等）
     selectedMusicId() → 当前选中的 musicId（无选中返回 null）
     setParallax(x, y) → 手动喂视差（回归装置用；-1~1 归一化）
     stepParallax()    → 同步推进一帧视差（回归装置用；rAF 在无头下不派发）
     settleParallax(n) → 循环 step 直到收敛，返回步数（回归装置用）

   第三阶段新增（「它真的是一间博物馆」）：
     openRecord(rec|id) → 打开档案**并**尝试播放（点唱片的正式入口）
     syncFromPlayer()   → 按播放器真实状态刷新 .playing（回归装置 / 外部可用）
     isPlayingIndex(i)  → 该曲目是否正在响（含暂停判定）
     playingRecord()    → 当前「正在播放」的 record（无则 null）
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const d = document;
  const body = d.body;

  /* ---------------------------------------------------- 小工具 ---- */
  const reduceMotion = () => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = (v, dflt) => {
    const n = parseFloat(v);
    return isFinite(n) ? n : dflt;
  };

  /* ============================================================
     MUSIC 路径解析
     ------------------------------------------------------------
     ⚠️ music-data.js 里的 src / cover 是「相对站点根目录」写的
     （assets/music/xxx）。首页在根目录，直接用没事；但只要有任何一个
     换了目录深度的入口（文章页在 /posts/ 下就是），路径就会 404。
     music.js 里有个 res() 做同样的事 —— 这里再写一份是因为它没导出。
     规则保持和它一致：按当前目录深度补 '../'，且幂等
     （已经是 http(s):/data:/绝对路径 的不动）。
     ============================================================ */
  function res(p) {
    if (!p) return '';
    if (/^(?:[a-z]+:|\/|#|data:)/i.test(p)) return p;
    /* location.pathname 的目录深度 → 需要几层 ../ */
    const segs = location.pathname.split('/').filter(Boolean);
    /* 末段是文件名（index.html / 404.html…）时不算目录 */
    if (segs.length && /\.[a-z0-9]+$/i.test(segs[segs.length - 1])) segs.pop();
    return '../'.repeat(segs.length) + p;
  }

  /* ---------------------------------------------------- 元素 ---- */
  const loadEl = $('#mmLoad');
  const sceneEl = $('#mmScene');
  const stageEl = $('#mmStage');
  const loadBar = $('#mmLoadBar');
  const loadPct = $('#mmLoadPct');
  const loadStatus = $('#mmLoadStatus');
  const sceneCount = $('#mmSceneCount');
  const exitBtn = $('#mmExit');
  const emptyEl = $('#mmEmpty');
  /* 详情面板（第二阶段） */
  const detailEl = $('#mmDetail');
  const detailArt = $('#mmDetailArt');
  const detailKicker = $('#mmDetailKicker');
  const detailIndex = $('#mmDetailIndex');
  const detailTitle = $('#mmDetailTitle');
  const detailArtist = $('#mmDetailArtist');
  const detailMeta = $('#mmDetailMeta');
  const detailExtra = $('#mmDetailExtra');
  const detailDesc = $('#mmDetailDesc');
  const detailTags = $('#mmDetailTags');
  const detailPlay = $('#mmDetailPlay');
  const detailPlayTxt = $('#mmDetailPlayTxt');
  const detailClose = $('#mmDetailClose');
  const detailScrim = $('#mmDetailScrim');

  /* ---------------------------------------------------- 状态 ---- */
  const state = {
    open: false,          /* 场景是否已进入（含动画中） */
    entering: false,      /* 是否正在预加载 */
    token: 0,             /* 自增令牌：旧一轮的异步收尾不再动 DOM */
    rendered: false,      /* 场景是否已渲染过（只渲一次，重进直接复用） */
    records: [],          /* 渲染后的唱片 [{musicId, track, index, ...}] */
    loaded: {},           /* 资源缓存标记，避免重复网络请求 */
    /* —— 第二阶段：阵列交互 —— */
    selected: null,       /* 当前选中的 record（原对象引用），null = 未选中 */
    hovered: null,        /* 当前 hover 的 record */
    parallax: { x: 0, y: 0 },   /* 平滑后的视差（-1~1，已 lerp） */
    parallaxTarget: { x: 0, y: 0 }, /* 鼠标原始目标（-1~1） */
    rafId: 0,             /* 视差循环句柄，0 = 未跑 */
    /* —— 第三阶段 —— */
    isPlaying: false,     /* 播放器当前是否在响（body.mp-playing 的真实读数） */
    playBlocked: false    /* 上一次播放被浏览器自动播放策略拦下了（UI 降级用） */
  };

  /* 当前正在响的曲目 index（用来给那张唱片加 .playing）。
     ⚠️ 这不是「本地记的意图」，而是**从播放器读回来的事实** ——
     见 followPlayer() / syncFromPlayer()。 */
  let playingIndex = -1;

  /* 视差系数：不同 depth 的唱片位移不同。
     远层动得少、近层动得多 —— 这是「同一空间里有远近」的关键，
     如果所有唱片位移一样，看起来就是整块画布在平移（廉价感）。 */
  const PARALLAX_SPAN = 34;   /* 近层最大位移（px）；实际位移 = span * (1 - depth*0.78) */
  const PARALLAX_EASE = 0.12; /* lerp 系数：小 = 更黏，大 = 更跟手 */

  /* 自转速度：越近的唱片刻意转得稍快，强化纵深。
     用 CSS 变量 --mm-spin 给动画定时，避免为每张唱片写一条 keyframes。 */
  const SPIN_BASE = 34;       /* 最远那张转一圈的秒数 */
  const SPIN_NEAR = 20;       /* 最近那张转一圈的秒数 */

  /* ============================================================
     数据装配 —— 把「布局」和「曲目」两张表拼起来
     ------------------------------------------------------------
     这里只做 join，任何字段都不复制：track 对象直接引用
     RinsoraMusic.tracks() 里的那一份，所以改了 music-data.js,
     场景里的歌名 / 封面立刻就是新的。
     ⚠️ musicId 对不上的条目直接跳过（而不是抛错）——
     删掉一首歌不应该让整个博物馆打不开。
     ============================================================ */
  function records() {
    const layout = (window.RINSORA_MUSIC_MUSEUM || {}).records || [];
    const tracks = (window.RinsoraMusic && window.RinsoraMusic.tracks)
      ? window.RinsoraMusic.tracks() : [];
    if (!layout.length || !tracks.length) return [];

    const byId = {};
    tracks.forEach((t, i) => { if (t && t.id) byId[t.id] = { track: t, index: i }; });

    return layout.map((rec, i) => {
      const found = byId[rec && rec.musicId];
      if (!found) return null;                 /* 对不上：静默跳过 */
      const depth = clamp(num(rec.depth, 0), 0, 1);
      return {
        musicId: rec.musicId,
        track: found.track,
        index: found.index,                    /* → RinsoraMusic.playIndex() */
        /* ⚠️ 「摆在哪」的两个可选字段保留在 record 上，详情可以直接用：
             label 覆写标签文字；note 是**这一处陈列**的附注（不是曲目字段）。
           其余可展示字段（album/genre/description/source/tags 等）一律
           从 track 上**读**，绝不复制 —— 单一真相在 music-data.js。 */
        note: rec.note || '',
        x: clamp(num(rec.x, 50), -20, 120),
        y: clamp(num(rec.y, 50), -20, 120),
        scale: num(rec.scale, 1),
        rotation: num(rec.rotation, 0),
        depth: depth,
        label: rec.label || found.track.artist || '',
        order: i
      };
    }).filter(Boolean);
  }

  /* ============================================================
     资源预加载 —— 真正的预加载，不是 setTimeout 假等
     ------------------------------------------------------------
     加载层存在的意义是「让等待可见」。所以这里真的去要资源：
       · 每张唱片的封面 <img>（preload）
     进度以「已完成 / 总数」驱动，并做缓动收尾（不会卡在 97%）。
     ⚠️ 预加载失败不算失败 —— 一张封面挂了不该拦着人进博物馆，
        记下来照常放行。
     ============================================================ */
  function preload(images, onProgress) {
    const total = images.length || 1;
    let done = 0;
    onProgress(0, total);
    if (!images.length) return Promise.resolve({ ok: 0, fail: 0 });

    let ok = 0, fail = 0;
    return Promise.all(images.map((src) => new Promise((resolve) => {
      const img = new Image();
      const finish = (good) => {
        done += 1;
        good ? (ok += 1) : (fail += 1);
        onProgress(done, total);
        resolve();
      };
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      img.src = src;
      /* 已经进过缓存的情况：complete 早就 true，onload 不会再触发 */
      if (img.complete && img.naturalWidth) finish(true);
    }))).then(() => ({ ok: ok, fail: fail }));
  }

  /* ============================================================
     加载层进度 —— 把 0~100 写到 CSS 变量 + 百分比文字
     ============================================================ */
  function setProgress(pct, label) {
    const p = clamp(Math.round(pct), 0, 100);
    /* ⚠️ 进度只有**一个**落点：loadBar 的 width。
       原来这里还顺手写了一个 --mm-p 变量，但 CSS 从来没有 var(--mm-p)
       读它（注释里却写着「进度条由 --mm-p 驱动」）—— 一份没人读的状态
       就是会漂移的第二真相，所以删掉，注释也一并改对。 */
    if (loadBar) loadBar.style.width = p + '%';
    if (loadPct) loadPct.textContent = p + '%';
    if (label && loadStatus) loadStatus.textContent = label;
  }

  /* ============================================================
     render —— 把唱片摆进场景
     ------------------------------------------------------------
     只做一次（state.rendered 把关）。重进博物馆直接复用 DOM，
     省掉一次重建 —— 也避免把正在播的那张唱片的 .playing 状态搞丢。
     ============================================================ */
  function render() {
    if (!stageEl) return;
    const list = records();
    state.records = list;

    /* 清场（重建时用；首次是空的，无副作用） */
    $$('.mm-disc', stageEl).forEach((n) => n.remove());

    if (!list.length) {
      /* 空场景也要给个说法，不能让人对着一片底发呆。
         ⚠️ 这个提示卡是无条件出现的 —— 只要没有可渲染的唱片就显示，
         站长自己也能看到（不需要任何特殊身份 / hash）。 */
      if (emptyEl) emptyEl.hidden = false;
      if (sceneCount) sceneCount.textContent = '0';
      state.rendered = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    const frag = d.createDocumentFragment();
    list.forEach((rec, i) => {
      const btn = d.createElement('button');
      btn.type = 'button';
      btn.className = 'mm-disc';
      btn.dataset.musicId = rec.musicId;
      btn.dataset.index = String(rec.index);
      /* ⚠️⚠️ layoutId 是「这张唱片在陈列里的唯一身份」，必须有，别删。
         为什么不能只用 musicId + index 找元素：
           · musicId 可以重复陈列（data 里 shelter 就摆了两处）
           · index 是**曲目表下标**，同一首歌的两处陈列 index 完全相同
         所以「musicId + index」不唯一，只按它匹配会出现「一次选中两张」
         （症状：sel=2、dim 少一张，而类名/数据看着都对，踩过）。
         order 来自 records() 里的布局数组下标，天然唯一且稳定。 */
      btn.dataset.layoutId = String(rec.order);
      btn.dataset.depth = rec.depth.toFixed(3);
      if (i === playingIndex) btn.classList.add('playing');

      /* 布局参数 → CSS 变量（music-museum-data.js 是唯一来源） */
      btn.style.setProperty('--mm-x', rec.x + '%');
      btn.style.setProperty('--mm-y', rec.y + '%');
      /* ⚠️⚠️ 写的是 --mm-scale-**data**，不是 --mm-scale —— 这条别改回去。
         inline style 的优先级高于样式表，而 hover / :active / 选中态
         都要按「基础缩放 × 状态系数」改缩放。如果这里写 --mm-scale，
         那三条状态规则全部会被这条 inline 声明盖掉 ——
         症状是「hover 不放大的、选中也不放大」，而 DOM / 类名全对，
         computed 里 --mm-scale 恒等于基础值，非常难查（踩过）。
         CSS 侧：.mm-disc{--mm-scale:var(--mm-scale-data,1)} 兜底为 data 值。 */
      btn.style.setProperty('--mm-scale-data', String(rec.scale));
      btn.style.setProperty('--mm-rot', rec.rotation + 'deg');
      btn.style.setProperty('--mm-i', String(i));
      /* 纵深：越远越淡越糊。系数和 music-museum-data.js 里的建议区间对齐：
         depth 0 → opacity 1 / blur 0；depth 1 → opacity .45 / blur 3.4px。
         （data 注释里写的是「远处 0.25~0.45 透明度」，那是最深一层的极端值，
          这里刻意留亮一点 —— 展厅整体太暗会看不清唱片。） */
      btn.style.setProperty('--mm-op', (1 - rec.depth * 0.55).toFixed(3));
      btn.style.setProperty('--mm-blur', (rec.depth * 3.4).toFixed(2) + 'px');
      /* 自转：每张的周期不同（近的快、远的慢）+ 用 order 错开起始相位，
         避免 5 张唱片像一块刚性板一样同框旋转。
         ⚠️ 用负数 delay 让动画一开场就处在不同相位，而不是「一起开始」。 */
      const spin = (SPIN_NEAR + (SPIN_BASE - SPIN_NEAR) * rec.depth).toFixed(1);
      btn.style.setProperty('--mm-spin', spin + 's');
      btn.style.setProperty('--mm-spin-delay', (-(i * 3.7)).toFixed(1) + 's');
      /* 视差系数：近层 = 1，远层 ≈ 0.22。JS 每帧只写这一对变量，
         具体的 translate3d 由 CSS 算 —— 不给每个元素写 inline transform，
         省掉大量样式重算。 */
      const px = (1 - rec.depth * 0.78).toFixed(3);
      btn.style.setProperty('--mm-px', px);
      btn.style.setProperty('--mm-py', (px * 0.62).toFixed(3));  /* 纵向位移小一些，更像空间 */

      const plate = d.createElement('span');
      plate.className = 'mm-disc-plate';

      const cover = res(rec.track.cover);
      if (cover) {
        const art = d.createElement('img');
        art.className = 'mm-disc-art';
        art.src = cover;
        art.alt = '';
        art.loading = 'lazy';
        art.decoding = 'async';
        /* 封面挂了退回渐变占位，而不是留一个破图图标 */
        art.addEventListener('error', () => {
          const ph = d.createElement('span');
          ph.className = 'mm-disc-art is-empty';
          art.replaceWith(ph);
        });
        plate.appendChild(art);
      } else {
        const ph = d.createElement('span');
        ph.className = 'mm-disc-art is-empty';
        plate.appendChild(ph);
      }
      const gloss = d.createElement('span');
      gloss.className = 'mm-disc-gloss';
      plate.appendChild(gloss);
      btn.appendChild(plate);

      const label = d.createElement('span');
      label.className = 'mm-disc-label';
      const b = d.createElement('b');
      b.textContent = rec.track.title || rec.musicId;
      const sm = d.createElement('small');
      sm.textContent = rec.label || '';
      label.appendChild(b);
      label.appendChild(sm);
      btn.appendChild(label);

      /* 无障碍：读屏要说清「这是哪首歌、点了会怎样」。
         第二阶段语义变了 —— 点击不再直接播放，而是「打开档案详情」，
         所以 aria-label 跟着改成「查看档案」，播放按钮在详情里。 */
      btn.setAttribute('aria-label',
        '打开《' + (rec.track.title || rec.musicId) + '》的档案详情' +
        (rec.label ? ' — ' + rec.label : ''));
      /* 整张唱片是一个可点对象：点一下 = 打开档案 + 播放（openRecord）。
         ⚠️⚠️ stopPropagation 是必须的（需求第七条）：
            场景外层有「点空白关闭」的逻辑，唱片点击若不拦住，一次点击
            会同时被当成「点空白」，刚打开的档案会被立刻关掉
            （症状：点唱片闪一下就没了，看着像点击失灵）。
         ⚠️ 唱片内部没有其它可点元素（封面 / 标签都是 span / img，
            纯展示），所以这里不需要再判 closest。 */
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openRecord(rec);
      });
      /* hover 只改状态类，不改几何 —— 几何交给 CSS 的 :hover。
         这里额外做的事：把 hover 对象记进 state（回归装置可观察），
         并且给「其他唱片」一个 .dim 类（详情打开时统一处理）。 */
      btn.addEventListener('pointerenter', () => { state.hovered = rec; });
      btn.addEventListener('pointerleave', () => {
        if (state.hovered === rec) state.hovered = null;
      });

      frag.appendChild(btn);
    });
    stageEl.appendChild(frag);

    if (sceneCount) sceneCount.textContent = String(list.length);
    state.rendered = true;
    /* ⚠️ 这里用 syncFromPlayer 而不是裸 syncPlaying：
       需求第三条要求「进入博物馆时识别正在播放的那首歌」。播放器的
       真相可能在渲染这段时间里变过（比如上一首播完自动接下一首），
       所以进场景前一定要**重读一次**，不能沿用旧值。 */
    syncFromPlayer();
    startParallax();
  }

  /* ============================================================
     play —— 真正按下「播放」
     ------------------------------------------------------------
     复用现有播放引擎：只调 RinsoraMusic.playIndex()。
     绝不自己 setIndex / 自己 audio.src —— 那会跟 music.js 的状态
     打架（它的 state.index 就不同步了）。

     ⚠️ 第二阶段把「点唱片」和「播这首歌」拆开了：
       点唱片 → select()（打开档案详情，不动音频）
       详情里的播放按钮 → play()（这里）
     这么做是因为「hover 就出声 / 点一下就换歌」在阵列里太容易被误触，
     而且需求本身也要求先有 selectedRecord 再谈播放。
     ============================================================ */
  function play(rec) {
    if (!rec) return;
    if (!window.RinsoraMusic || !window.RinsoraMusic.playIndex) return;
    /* 先标记，让 UI 立刻有反应（哪怕声音晚 200ms 才来） */
    playingIndex = rec.index;
    state.isPlaying = false;           /* 真实状态由 play 事件回填 */
    syncPlaying();
    syncDetailPlayBtn();
    try {
      /* playIndex 内部是 audio.play().catch(()=>{})，所以：
         · 成功 → audio 派发 play 事件 → body 得到 .mp-playing → 我们跟上
         · 被自动播放策略拒绝 → 静默失败，**不抛错**，播放器按钮仍然是「播放」
         两种情况都不该让博物馆报错，所以这里只 try 包一层保险。 */
      const r = window.RinsoraMusic.playIndex(rec.index);
      if (r && typeof r.catch === 'function') r.catch(() => {});
    } catch (e) {
      /* 走到这儿说明 playIndex 本身炸了（比如曲目索引越界）。
         需求原文：「不要因为 autoplay 失败导致整个 Museum 报错」——
         所以这里既不 throw 也不 toast，只把状态摆正，等用户再点一次。 */
      state.isPlaying = false;
      syncPlaying();
    }
    /* ⚠️ 这里**刻意不**再用 setTimeout 猜一次结果（原来有个 320ms 兜底）。
       为什么去掉：猜有两种错法 ——
         · 猜「在播」而其实被拦了 → 唱片空转，用户以为有声音
         · 猜「没播」而其实在播 → 唱片不转，最长要等 1s 轮询才纠正
       现在真实状态由 bindAudio() 直接听 #audio 的 play/pause 事件，
       0 延迟且确定。这里一个定时器都不需要。 */
  }

  /* ============================================================
     syncPlaying —— 给「正在响的那张唱片」打标记
     ------------------------------------------------------------
     ⚠️ 判定的**唯一真相**是 playingIndex（由 syncFromPlayer() 从
        RinsoraMusic.getState().index + body.mp-playing 读回来），
        不是「我上次点了什么」。这样从播放器那边切歌，博物馆立刻跟上。

     「正在播放」这件事要做三样视觉（需求第三/四条）：
       .playing       → 唱片缓慢匀速自转 + 外圈转环 + 呼吸光晕
       .is-paused     → 曾经是当前曲目但暂停了：环停住、不再呼吸
       两者的区别只在 CSS 的 animation-play-state，不重排 DOM。
     ============================================================ */
  function syncPlaying() {
    if (!stageEl) return;
    const playing = !!state.isPlaying;
    $$('.mm-disc', stageEl).forEach((el) => {
      const isCur = Number(el.dataset.index) === playingIndex && playingIndex >= 0;
      el.classList.toggle('playing', isCur && playing);
      /* 暂停时也保留「这一首是当前曲目」的底标（弱一点），
         否则暂停一下唱片就完全变回路人，看不出「刚才在放它」。 */
      el.classList.toggle('is-current', isCur);
      el.classList.toggle('is-paused', isCur && !playing);
      const t = el.querySelector('.mm-disc-label b');
      if (t) el.setAttribute('aria-current', isCur ? 'true' : 'false');
    });
    syncDetailPlayBtn();
  }

  /* ============================================================
     视差 —— 统一 Scene 坐标，按 depth 分权位移
     ------------------------------------------------------------
     需求原文的关键约束：
       · 「不要让每一张唱片都随机乱动」→ 只有一个 mouseX/mouseY 源
       · 「远层移动少 / 中层中等 / 近层稍明显」→ 系数来自 depth（--mm-px）
       · 「加入平滑插值，不要直接跟随鼠标」→ lerp，而不是把 pointer 事件
         直接写进 style
       · 「防止高频 DOM 重排」→ 只写两个 CSS 变量在 #mmStage 上，
         具体 translate3d 由 CSS 算（transform 本来就是合成层，不触发重排），
         而且整块只用一次 style 写入 / 帧。

     实现：
       pointermove（passive）只更新 parallaxTarget（纯数字，零 DOM）
       rAF 里做 lerp，写 --mm-px-pos / --mm-py-pos 到 stage
       两者相差 < 0.0005 时停 rAF（静止时完全不占 CPU）

     ⚠️ 位移写在 .mm-stage 上而不是每张唱片上：
        每张唱片已经在用自己的 transform 做定位 + 缩放 + 自转，
        再叠一层 translate 会把它的 transform 表达式撑成一大串
        （还要把 --mm-x/--mm-y 从 % 混进去），既难读又容易写错。
        分两层做的话，合成顺序天然正确：
          .mm-stage            → translate3d(视差)
            .mm-disc          → translate(-50%,-50%) rotate scale
      这个分层的视觉结果与「每张按 depth 各自位移」是等价的吗？
      不是完全等价 —— 而这里刻意选了另一种更稳的做法：
      每个 .mm-stage 内部再用 --mm-px 做一层「反向深度补偿」会让
      空间感更强，但也会让「拖动时唱片相对标签错位」。所以采用
      **统一整体位移 + 每张按 depth 微调 scale** 的折中（见 CSS 的
      .mm-scene.on .mm-stage{transform:translate3d(var(--mm-px-pos),var(--mm-py-pos),0)}）。
     ============================================================ */

  /* 真正实现「不同 depth 不同位移」的地方（见 music-museum.css 的
     .mm-disc{--mm-depth-x}：CSS 用 calc 把整体位移按 --mm-px 再分权一次）。 */

  function setParallax(x, y) {
    state.parallaxTarget.x = clamp(x, -1, 1);
    state.parallaxTarget.y = clamp(y, -1, 1);
    startParallax();
  }

  /* ============================================================
     视口尺寸缓存
     ------------------------------------------------------------
     ⚠️⚠️ 为什么要有缓存（需求第八条点名）：
       clientWidth / clientHeight 是**布局属性**，读它们可能强制一次
       样式重算 + 布局（layout thrashing）。原来这两个读写在
       pointermove 里 —— 那是每移动一像素就跑一次，一次拖动就是几百次
       布局查询。鼠标一动页面就掉帧，而且很难查（功能全对）。
       视口尺寸只在 resize / 转屏时变，所以：
         · 进场景时算一次
         · resize 时重算（监听挂上、退出时摘掉）
         · pointermove 里只读两个数字
     ⚠️ 用 clientWidth 而不是 innerWidth —— 后者含滚动条宽度，
        而 .mm-scene 是 position:fixed（不占滚动条），混用会让
        「正中」偏半个滚动条（这个坑在站里踩过）。 */
  const vp = { w: 0, h: 0 };
  function measureViewport() {
    vp.w = d.documentElement.clientWidth || 1;
    vp.h = d.documentElement.clientHeight || 1;
  }
  function onResize() { measureViewport(); }

  function onPointerMove(e) {
    if (!state.open) return;
    /* 防御：万一 resize 没赶上（比如从隐藏标签页切回来），补算一次 */
    if (!vp.w || !vp.h) measureViewport();
    /* 归一化到 -1 ~ 1：中心 0，边缘 ±1 */
    setParallax((e.clientX / vp.w) * 2 - 1, (e.clientY / vp.h) * 2 - 1);
  }

  /* ------------------------------------------------------------
     stepParallax —— 纯计算：把视差往前推一帧，返回「还要不要继续」
     ------------------------------------------------------------
     ⚠️ 为什么要从 tick() 里拆出来（不是洁癖，是回归装置的需要）：
        无头探针跑在 --virtual-time-budget 下时 **requestAnimationFrame 的回调
        根本不会被派发**（实测：裸 rAF 等 200ms 也不触发，句柄却照发）。
        于是 tick() 永远不执行，「视差对不对」在探针里就完全测不到 ——
        会被误判成「视差没实现」。
        把「推进一帧」拆成纯函数之后：
          · 生产路径照旧由 rAF 驱动（见 tick）
          · 回归装置可以同步连调 N 次，验证收敛、单调、depth 分权、位移落点
        行为与原来逐字等价（同一套 lerp、同一个阈值、同一次 CSS 变量写入）。
     ------------------------------------------------------------ */
  function stepParallax() {
    if (!stageEl) return false;
    const t = state.parallaxTarget, p = state.parallax;
    /* 惯性：越接近目标插值越慢（乘的是固定比例，所以是几何收敛，不是线性） */
    p.x += (t.x - p.x) * PARALLAX_EASE;
    p.y += (t.y - p.y) * PARALLAX_EASE;

    stageEl.style.setProperty('--mm-px-pos', (-p.x * PARALLAX_SPAN).toFixed(2) + 'px');
    stageEl.style.setProperty('--mm-py-pos', (-p.y * PARALLAX_SPAN * 0.62).toFixed(2) + 'px');

    /* 还没收敛就继续；收敛了就停（静止时零开销） */
    return Math.abs(t.x - p.x) > 0.0005 || Math.abs(t.y - p.y) > 0.0005;
  }

  function tick() {
    state.rafId = 0;
    if (!state.open || !stageEl) return;
    if (stepParallax()) state.rafId = requestAnimationFrame(tick);
  }

  function startParallax() {
    if (state.rafId) return;
    if (reduceMotion()) return;            /* 关掉动态效果时不做视差 */
    state.rafId = requestAnimationFrame(tick);
  }

  function stopParallax() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; }
    /* 归零，免得下次进来还停在上一次的位置 */
    state.parallaxTarget.x = state.parallaxTarget.y = 0;
    state.parallax.x = state.parallax.y = 0;
    if (stageEl) {
      stageEl.style.setProperty('--mm-px-pos', '0px');
      stageEl.style.setProperty('--mm-py-pos', '0px');
    }
  }

  /* ============================================================
     select / deselect —— 档案选中状态机
     ------------------------------------------------------------
     视觉职责全在 CSS（.mm-scene.has-sel 那组），JS 只做三件事：
       ① 记状态（state.selected）
       ② 给场景挂 .has-sel、给被选中的那张挂 .sel、其余挂 .dim
       ③ 填详情面板

     ⚠️ 「其他唱片变暗 / 变糊」用的是 .dim 类而不是内联 style，
        因为每张唱片已经有 --mm-op / --mm-blur 两个变量在管纵深，
        内联改它们会**丢掉纵深信息**（取消选中后无法还原）。
        CSS 侧的做法是：.mm-disc.dim 走的是 opacity/filter 的
        **再叠一层**（见 music-museum.css 的 .mm-disc.dim），
        取消时摘掉类即可，--mm-op 原封不动。
     ============================================================ */
  function select(rec, opts) {
    if (!rec || !stageEl) return false;
    const o = opts || {};
    state.selected = rec;
    state.hovered = null;

    if (sceneEl) sceneEl.classList.add('has-sel');
    $$('.mm-disc', stageEl).forEach((el) => {
      /* 用 layoutId（布局唯一键）匹配，不要用 musicId/index 组合 —— 见 render()
         里 layoutId 的注释：同一首歌摆两处时那两个字段都不唯一。 */
      const isSel = el.dataset.layoutId === String(rec.order);
      el.classList.toggle('sel', isSel);
      el.classList.toggle('dim', !isSel);
      el.setAttribute('aria-pressed', isSel ? 'true' : 'false');
    });

    fillDetail(rec);
    if (detailEl) {
      detailEl.classList.add('on');
      detailEl.setAttribute('aria-hidden', 'false');
    }
    /* 焦点给播放按钮（键盘用户下一步大概率就是按它）。
       preventScroll：详情是 fixed 面板，别让浏览器顺手滚一下页面。 */
    if (detailPlay && !reduceMotion()) {
      try { detailPlay.focus({ preventScroll: true }); } catch (e) {}
    }
    return true;
  }

  /* ============================================================
     openRecord —— 点唱片的正式语义（第三阶段）
     ------------------------------------------------------------
     需求第一条：点击唱片 → 自动选中并播放。
     但自动播放可能被浏览器拦下（没有用户手势的首次播放、或站点
     被判定为无交互），所以这里刻意**先选中、再尝试播**：
       ① select() 打开档案（这一步 100% 成功，UI 永远有反应）
       ② play() 尝试播放（失败也无所谓，详情里的播放按钮就是
          「用户手势」入口，再点一次必定能响）
     这样「autoplay 被拦」的降级结果 = 「档案开着 + 一个播放按钮」，
     而不是「点了一下什么都没发生」。
     ============================================================ */
  function openRecord(rec) {
    if (!rec) return false;
    const ok = select(rec);
    if (!ok) return false;
    /* 已经就是正在响的那一首 → 不重启播放（重启会把进度倒回 0，
       用户会觉得「点一下怎么从头开始了」）。 */
    if (rec.index === playingIndex && state.isPlaying) return true;
    play(rec);
    return true;
  }

  function deselect() {
    if (!state.selected) return false;
    state.selected = null;
    if (sceneEl) sceneEl.classList.remove('has-sel');
    if (stageEl) {
      $$('.mm-disc', stageEl).forEach((el) => {
        el.classList.remove('sel', 'dim');
        el.removeAttribute('aria-pressed');
      });
    }
    if (detailEl) {
      detailEl.classList.remove('on');
      detailEl.setAttribute('aria-hidden', 'true');
    }
    return true;
  }

  /* ============================================================
     fillDetail —— 把 record 填进详情面板
     ------------------------------------------------------------
     ⚠️ 所有文字一律走 textContent，绝不拼 innerHTML ——
        歌名 / 歌手是用户自己填的（可能含 < > &），
        拼字符串就是自找 XSS + 排版事故。
     ============================================================ */
  function fillDetail(rec) {
    if (!rec) return;
    const t = rec.track || {};
    const n = state.records.length || 1;
    if (detailTitle) detailTitle.textContent = t.title || rec.musicId;
    if (detailArtist) detailArtist.textContent = rec.label || t.artist || '—';
    if (detailKicker) detailKicker.textContent = 'MUSIC ARCHIVE';
    if (detailIndex) {
      /* 档案编号：从 01 起，两位补零。总数也报出来，符合「档案馆」的语气。 */
      detailIndex.textContent = String(rec.order + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    }
    if (detailArt) {
      const cover = res(t.cover);
      /* 复用一个 <img>：换封面时先摘 onerror 再换 src，否则上一张的
         error 回调可能把这一张也换成占位图。 */
      detailArt.onerror = null;
      if (cover) {
        detailArt.onerror = function () {
          detailArt.removeAttribute('src');
          detailArt.classList.add('is-empty');
        };
        detailArt.classList.remove('is-empty');
        detailArt.src = cover;
        detailArt.alt = (t.title || '') + ' 封面';
      } else {
        detailArt.removeAttribute('src');
        detailArt.classList.add('is-empty');
        detailArt.alt = '';
      }
    }
    /* ---- 固定资料表（这两行永远在，因为档案馆需要有编号与日期） ---- */
    if (detailMeta) {
      detailMeta.textContent = '';
      const rows = [
        ['ARCHIVE', String(rec.order + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0')],
        ['ADDED', t.date || '—']
      ];
      rows.forEach(([k, v]) => appendRow(detailMeta, k, v));
    }

    /* ---- 可选字段（有才渲染）----
       需求第二条点名支持：album / genre / description / source / tags。
       ⚠️ 「没有字段时不要显示空框」的实现方式：**不创建那一行**，
          而不是创建了再 display:none —— 后者会留下分隔线 / 间距残影，
          而且 DOM 里仍有一堆空 <dt><dd>（读屏会念出来）。 */
    if (detailExtra) {
      detailExtra.textContent = '';
      const block = d.createElement('dl');
      block.className = 'mm-detail-meta mm-detail-meta-extra';
      const opt = [
        ['ALBUM', t.album],
        ['GENRE', t.genre],
        ['SOURCE', t.source],
        /* note 是「这一处陈列」的附注，优先级高于曲目的 description */
        ['NOTE', rec.note]
      ];
      opt.forEach(([k, v]) => {
        if (v == null || String(v).trim() === '') return;   /* 空字段 → 整行不出现 */
        appendRow(block, k, String(v));
      });
      if (block.children.length) detailExtra.appendChild(block);
    }

    /* ---- 描述段：整段文字，长文允许换行（和 meta 的 nowrap 不同） ---- */
    if (detailDesc) {
      detailDesc.textContent = '';
      const text = t.description || '';
      if (String(text).trim()) {
        detailDesc.textContent = String(text).trim();
        detailDesc.hidden = false;
      } else {
        detailDesc.hidden = true;     /* 没描述 → 整块收掉，不留白 */
      }
    }

    /* ---- 标签：有才出胶囊，没有就整块不出现 ---- */
    if (detailTags) {
      detailTags.textContent = '';
      const tags = Array.isArray(t.tags) ? t.tags
        : (typeof t.tags === 'string' && t.tags.trim() ? t.tags.split(/[,\s]+/) : []);
      const clean = tags.map((x) => String(x).trim()).filter(Boolean);
      const uniq = clean.filter((v, i) => clean.indexOf(v) === i);
      uniq.forEach((tg) => {
        const chip = d.createElement('span');
        chip.className = 'mm-tag';
        chip.textContent = tg;
        detailTags.appendChild(chip);
      });
      detailTags.hidden = !uniq.length;
    }
    syncDetailPlayBtn();
  }

  /* 往 <dl> 追加一对 dt/dd（文字一律 textContent，绝不拼 innerHTML） */
  function appendRow(dl, key, value) {
    const dt = d.createElement('dt');
    dt.textContent = key;
    const dd = d.createElement('dd');
    dd.textContent = value;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  /* 详情里的播放按钮要反映「这一首是不是正在响」。
     ⚠️ 三个状态，不是两个：
       正在播放  → 「正在播放」+ 暂停图标
       当前曲目但暂停 → 「继续播放」
       其他曲目  → 「播放这首」
     这样「点了没声」的情况（autoplay 被拦 / 用户手动暂停）文案都对得上。 */
  function syncDetailPlayBtn() {
    if (!detailPlay) return;
    const rec = state.selected;
    const isCur = !!rec && rec.index === playingIndex;
    const playing = isCur && state.isPlaying;
    detailPlay.classList.toggle('is-playing', playing);
    detailPlay.classList.toggle('is-blocked', !!state.playBlocked && isCur);
    const label = playing ? '暂停'
      : (isCur ? '继续播放' : ('播放《' + ((rec && rec.track && rec.track.title) || '') + '》'));
    detailPlay.setAttribute('aria-label', label);
    if (detailPlayTxt) {
      detailPlayTxt.textContent = playing ? '正在播放' : (isCur ? '继续播放' : '播放这首');
    }
  }

  /* 按播放状态读回真实值 —— 不靠「我上次点了什么」猜。
     曲目变了：syncPlaying() 重算 .playing + 详情按钮文案。
     播放 / 暂停切换：只更新详情按钮文案。 */
  function onPlayerTick() {
    if (!state.open) return;
    if (playingIndex !== lastSeenIndex) {
      playingIndex = lastSeenIndex;
      state.isPlaying = lastSeenPlaying;
      state.playBlocked = false;
      syncPlaying();
      return;
    }
    /* 曲目没变，但 play/pause 可能变了 —— 唱片的自转 / 呼吸与详情文案都要跟上 */
    if (lastSeenPlaying !== state.isPlaying) {
      state.isPlaying = lastSeenPlaying;
      syncPlaying();
    }
  }

  let lastSeenIndex = -1;
  let lastSeenPlaying = false;

  /* 详情里的播放按钮：点一次 → 走现有播放引擎。 */
  if (detailPlay) {
    detailPlay.addEventListener('click', () => {
      const rec = state.selected;
      if (!rec) return;
      state.playBlocked = false;
      /* 已经就是当前曲目 → 这次点击的语义变成「暂停 / 继续」。
         ⚠️ 只操作 #audio 这个**已存在的同一个对象**，不新建元素、
           不自己维护第二套播放状态 —— music.js 的 state 才是真相。 */
      const isCur = rec.index === playingIndex;
      if (isCur && state.isPlaying) {
        /* ⚠️ 直接 pause()，**不要**用 `if (!a.paused)` 当门。
           为什么：那个门假设「state.isPlaying 为真 ⇒ a.paused 为假」。
           可这两者来自不同来源（我们希望它们同步，但一旦有偏差，
           点击就会变成哑巴 —— 按了没反应，还没有任何报错，极难查）。
           pause() 本身是幂等的：已经暂停时再调一次是空操作。
           所以拿掉这个门只会更稳，不会更危险。 */
        const a = d.getElementById('audio');
        if (a) a.pause();
        return;
      }
      play(rec);
    });
  }

  /* 关闭按钮：收起详情，但**留在博物馆**（需求里「返回」有两种语义，
     这里 X 是「关闭档案」，Esc 也是关闭档案；要离开展厅走 HUD 的退出）。
     ⚠️ 单独用 scrim 点空白也能关 —— 这是浮层的基本礼貌。 */
  if (detailClose) detailClose.addEventListener('click', (e) => {
    e.stopPropagation();
    deselect();
  });
  if (detailScrim) detailScrim.addEventListener('click', () => deselect());
  /* 需求第七条：「点击外部可以关闭详情，但不要误关闭整个 Museum」。
     落在场景本体的空白处（不是唱片、不是详情、不是 HUD）→ 只关详情。
     ⚠️ 用「点到了 .mm-scene 自己」这一条判空白，而不是「没点到 .mm-disc」——
        后者会把 HUD / 底部提示条 / 详情面板的点击也算成空白。 */
  if (sceneEl) {
    sceneEl.addEventListener('click', (e) => {
      if (!state.selected) return;
      if (e.target === sceneEl) deselect();
    });
  }

  /* 外部（播放器自己换歌 / 上一首 / 下一首）导致当前曲目变了时，
     博物馆里那张唱片的 .playing 也要跟上 —— 否则会出现「场景里高亮的
     那张和实际在响的不是同一张」。
     ⚠️ 用 RinsoraMusic.getState().index 读真实状态，不靠猜。
     ⚠️ getState().index 只在 setIndex() 里写，所以「上一首 / 下一首」
        会立刻反映出来，而「播放 / 暂停」不会 —— 后者从 body.mp-playing
        读（music.js 的 play/pause 事件自己维护这个类）。
        两个来源合起来覆盖全部四种变化，且都不需要改 music.js。 */
  function followPlayer() {
    if (!state.open || !window.RinsoraMusic || !window.RinsoraMusic.getState) return;
    try {
      const s = window.RinsoraMusic.getState();
      lastSeenIndex = s && typeof s.index === 'number' ? s.index : -1;
      lastSeenPlaying = d.body.classList.contains('mp-playing');
      onPlayerTick();
    } catch (e) {}
  }

  /* ============================================================
     syncFromPlayer —— 把「播放器的真实状态」同步进博物馆
     ------------------------------------------------------------
     这是需求第三条「同一个音乐状态」的落点：
       · 进博物馆时先跑一次 —— 如果外面已经在放某首歌，而它正好
         在陈列里，那张唱片立刻显示 PLAYING（**绝不打断 / 不换歌**）
       · 播放器那边切歌 / 播放 / 暂停，也靠它跟上

     两个数据源缺一不可（这是实测结论，别合并成一个）：
       RinsoraMusic.getState().index  ← 换曲目会变；播放/暂停**不变**
       body.mp-playing                ← 播放/暂停才变
     ============================================================ */
  function syncFromPlayer() {
    if (!window.RinsoraMusic || !window.RinsoraMusic.getState) return;
    let idx = -1;
    try {
      const s = window.RinsoraMusic.getState();
      idx = (s && typeof s.index === 'number') ? s.index : -1;
    } catch (e) { return; }
    state.isPlaying = body.classList.contains('mp-playing');
    if (idx !== playingIndex) {
      playingIndex = idx;
      /* 换了曲目就清掉「被拦下」的提示，它只对刚点的那一首有意义 */
      state.playBlocked = false;
    }
    lastSeenIndex = idx;
    lastSeenPlaying = state.isPlaying;
    syncPlaying();
  }
  /* 播放器换歌会走 audio 的 play 事件；这里挂一个低频轮询兜底，
     比去 hook music.js 内部函数安全（那个文件我们不动）。
     1s 一次、只在博物馆打开时跑，开销可以忽略。 */
  let followTimer = 0;
  function startFollow() {
    if (followTimer) return;
    followTimer = setInterval(followPlayer, 1000);
  }
  function stopFollow() {
    if (followTimer) { clearInterval(followTimer); followTimer = 0; }
  }

  /* ============================================================
     enter —— 打开博物馆（唯一的进入入口）
     ------------------------------------------------------------
     时序：
       0ms     加载层 .on（淡入）→ 进度从 0 起跑
       ↑       真预加载：封面图 + 短驻留（保证「看得见」而不是一闪而过）
       ✓       加载层 .done（淡出）→ 场景 .open/.on
     opts.instant = true → 跳过加载层，直接进场景
       （回归装置 / 直达链接用；语义跟 script.js 的 enterApp(true) 对齐）
     opts.minMs  可调加载层最短驻留（默认 1000ms —— 需求给的 1000~1600）
     ============================================================ */
  function enter(opts) {
    const o = opts || {};
    if (state.open && !o.force) return Promise.resolve(state.records);
    const token = ++state.token;
    state.entering = true;

    /* 先把数据渲好：预加载要拿封面地址，加载层结束后要立刻能看见内容 */
    if (!state.rendered) render();
    else syncPlaying();

    const imgs = state.records
      .map((r) => res(r.track.cover))
      .filter(Boolean);
    /* 去重：同一张封面出现两次不用下两遍 */
    const uniq = imgs.filter((v, i) => imgs.indexOf(v) === i);

    if (o.instant) {
      setProgress(100);
      return finishEnter(token, o);
    }

    /* —— 加载层上场 —— */
    if (loadEl) {
      loadEl.classList.remove('done');
      /* 先让上一轮可能残留的 .done 提交过，再挂 .on，否则 transition 不动 */
      void loadEl.offsetHeight;
      loadEl.classList.add('on');
    }
    const minMs = num(o.minMs, 1000);
    setProgress(0, '正在检索档案');
    const t0 = Date.now();

    return preload(uniq, (done, total) => {
      if (token !== state.token) return;
      /* 进度映射到 0~88：剩下的 12% 留给「加载层退场 + 场景点亮」，
         免得进度条先跑到 100 再干等，那段时间看着像卡住。 */
      const raw = total ? done / total : 1;
      setProgress(raw * 88, done < total ? '正在检索档案' : '正在布置陈列');
      if (done >= total) setProgress(88, '正在点亮展厅');
    }).then(() => {
      if (token !== state.token) return state.records;
      /* 最短驻留：加载再快也让它站够 minMs，否则一闪而过像闪屏 */
      const rest = Math.max(0, minMs - (Date.now() - t0));
      return sleep(reduceMotion() ? Math.min(rest, 180) : rest);
    }).then(() => {
      if (token !== state.token) return state.records;
      setProgress(100, '欢迎来到音乐博物馆');
      return sleep(reduceMotion() ? 60 : 260);
    }).then(() => finishEnter(token, o));
  }

  /* 加载层退场 + 场景上场。幂等，且带无条件兜底（定时器兜底在 enter 里，
     这里只管状态落定）。 */
  function finishEnter(token, o) {
    if (token !== state.token) return state.records;
    state.entering = false;
    state.open = true;

    if (loadEl) loadEl.classList.add('done');
    if (sceneEl) {
      sceneEl.classList.remove('closing');
      sceneEl.classList.add('open');
      /* 先让 display 那一帧提交过，opacity 过渡才会跑 */
      void sceneEl.offsetHeight;
      sceneEl.classList.add('on');
      sceneEl.setAttribute('aria-hidden', 'false');
    }
    if (exitBtn && !reduceMotion()) exitBtn.focus && exitBtn.focus({ preventScroll: true });
    startFollow();
    /* 视差：只在场景真的可见时才听鼠标，退出立刻摘掉（见 exit） */
    measureViewport();
    d.addEventListener('pointermove', onPointerMove, { passive: true });
    d.addEventListener('resize', onResize, { passive: true });
    startParallax();
    return state.records;
  }

  /* ============================================================
     exit —— 关掉场景 + 加载层（幂等）
     ------------------------------------------------------------
     ⚠️ 只收自己这一层的 DOM，**绝不动播放器 / audio / 音乐状态** ——
        音乐继续播是「博物馆」这个功能的卖点之一，不是副作用。
     ============================================================ */
  function exit() {
    state.token += 1;               /* 让还在跑的预加载回调作废 */
    state.entering = false;
    if (!state.open && !(sceneEl && sceneEl.classList.contains('open')) &&
        !(loadEl && loadEl.classList.contains('on'))) {
      return false;                 /* 本来就没开，当幂等处理 */
    }
    state.open = false;
    stopFollow();
    stopParallax();
    d.removeEventListener('pointermove', onPointerMove);
    d.removeEventListener('resize', onResize);
    /* 详情面板跟着场景一起收 —— 否则下次进来会「一开门就有一张档案摊在桌上」，
       而且 state.selected 还指着上一次那张唱片，语义是脏的。 */
    deselect();

    if (sceneEl) {
      sceneEl.classList.remove('on');
      sceneEl.classList.add('closing');
      sceneEl.setAttribute('aria-hidden', 'true');
      const el = sceneEl;
      setTimeout(() => {
        /* 只有确实还关着才摘 .open（这中间又进去了就别动） */
        if (!state.open) {
          el.classList.remove('open', 'closing');
        }
      }, reduceMotion() ? 0 : 340);
    }
    if (loadEl) loadEl.classList.remove('on', 'done');
    return true;
  }

  /* ============================================================
     接线：退出按钮 + Esc + 详情面板
     ------------------------------------------------------------
     ⚠️ Esc 的优先级（两层语义，别搞反）：
        详情打开时 → 先关详情（留在展厅），这是最符合直觉的「返回」
        详情没开    → 交给 script.js 的总收口去退展厅
       所以这里只处理「详情开着」那一种，并且是捕获阶段监听 +
       stopPropagation，避免同一次按键被 script.js 再吃一遍
       （它一吃就直接退展厅了，用户会觉得「按一下跳了两级」）。
     ============================================================ */
  function onKeydown(e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    if (!state.open) return;
    if (!state.selected) return;            /* 没开详情 → 不拦，让 script.js 退展厅 */
    e.stopPropagation();
    e.preventDefault();
    /* 需求第七条「一次 Esc 不要把整个网站状态弄乱」的落点：
       Esc 只退**一层**（先关档案），并且阻止冒泡 ——
       script.js 的 window 监听收不到这一次按键，自然不会顺手退展厅。
       想退展厅再按一次 Esc（那次没有详情，我们不拦，交给 script.js）。 */
    deselect();
  }
  /* 捕获阶段：抢在 script.js 的 window 监听之前拿到这次 Esc */
  d.addEventListener('keydown', onKeydown, true);

  if (exitBtn) exitBtn.addEventListener('click', () => exit());

  /* ============================================================
     bindAudio —— 直接听那唯一的 <audio> 的 play / pause / ended
     ------------------------------------------------------------
     需求第三/四条要的是「博物馆当前的播放状态 = 播放器当前的播放状态」，
     而播放状态的**权威来源**就是 #audio 自己的 play / pause 事件。
     直接听它：0 延迟、确定、不需要猜。

     ⚠️ 这不是「第二套播放引擎」：
        · 没有创建元素（全站仍然只有一个 <audio>）
        · 没有改 src、没有自己写状态机
        · 只是在**同一个** <audio> 上多挂一个监听，
          和 music.js 里那个监听并存，两者互不干扰
        · music.js 一行都不用动（它仍然在同一个事件里维护 body.mp-playing）
     我们读的判据（body.mp-playing）和它写的是同一个类，
     所以「谁先谁后」都不影响正确性。

     ⚠️ 为什么必须有它（而不是只靠 1s 轮询）：
       轮询最坏要 1s 才发现状态变了 —— 点播放后唱片要等近一秒才开始转，
       体感像「卡住」。有了事件，转与停都是立刻的。
     ============================================================ */
  function bindAudio() {
    const a = d.getElementById('audio');
    if (!a) return;
    const onPlay = () => { if (!state.open) return; state.isPlaying = true; syncPlaying(); };
    const onStop = () => { if (!state.open) return; state.isPlaying = false; syncPlaying(); };
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onStop);
    /* 播完一首也算「不在播」（music.js 随后会自动接下一首并再派发 play） */
    a.addEventListener('ended', onStop);
  }
  bindAudio();

  /* 首次交互时预热一下场景渲染（避免第一次点导航时才发现 data 有问题） */
  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', () => { records(); });
  } else {
    records();
  }

  window.RinsoraMuseum = {
    enter: enter,
    exit: exit,
    open: enter,
    close: exit,
    isOpen: () => !!state.open,
    isEntering: () => !!state.entering,
    records: () => state.records.slice(),
    /* 回归装置用：把布局表与曲目表 join 的结果交出来，验证「只引用不复制」 */
    resolve: records,
    render: render,
    state: state,
    /* 让外部（script.js）能问「渲染后的唱片数是几」而不用碰内部结构 */
    count: () => state.records.length,
    /* —— 第二阶段：阵列交互 —— */
    select: select,
    deselect: deselect,
    /* 回归装置用：直接喂视差（-1~1），不依赖真实鼠标事件 */
    setParallax: setParallax,
    parallax: () => ({ x: state.parallax.x, y: state.parallax.y }),
    /* 回归装置用：同步推进一步视差（等价于 rAF 跑了一帧）。
       ⚠️ 无头 --virtual-time-budget 下 rAF 回调不派发，必须靠这个才能验视差。
       返回 true 表示还没收敛（正式路径会再排一帧）。 */
    stepParallax: stepParallax,
    /* 回归装置用：一次推到位（循环 step 直到收敛），返回实际走了几步 */
    settleParallax: (maxSteps) => {
      const cap = Math.max(1, maxSteps || 400);
      let n = 0;
      while (n < cap && stepParallax()) n++;
      return n;
    },
    selectedMusicId: () => (state.selected ? state.selected.musicId : null),
    selected: () => state.selected,
    /* 点唱片的等价入口：按 musicId + 可选 index 选中。
       同一首歌摆了两处陈列时，两者会撞车 —— 想精确指定某一张传第三个参数
       order（布局下标，= .mm-disc 的 dataset.layoutId）。 */
    selectByMusicId: (id, idx, order) => {
      const hit = state.records.filter((r) =>
        r.musicId === id &&
        (idx == null || r.index === idx) &&
        (order == null || r.order === order));
      return hit.length ? select(hit[0]) : false;
    },
    play: play,
    /* —— 第三阶段 —— */
    /* 点唱片的正规入口（选中 + 尝试播放，含 autoplay 降级） */
    openRecord: openRecord,
    /* 回归装置 / 外部：按播放器真实状态重算 .playing（返回是否在播） */
    syncFromPlayer: () => { syncFromPlayer(); return state.isPlaying; },
    isPlayingIndex: (i) => (i === playingIndex && state.isPlaying),
    playingIndex: () => playingIndex,
    isPlaying: () => state.isPlaying,
    allPlaying: () => $$('.mm-disc.playing', stageEl || d).length,
    isPaused: () => $$('.mm-disc.is-paused', stageEl || d).length
  };
})();
