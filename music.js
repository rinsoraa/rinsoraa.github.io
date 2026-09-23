/* ============================================================
   music.js —— 音乐播放器引擎
   ------------------------------------------------------------
   两个播放器（欢迎页那个 + 右下角常驻那个）用同一套模板渲染，
   共用页面里唯一的一个 <audio>，所以状态天然同步。

   行为：
     · 收起时只显示当前曲目的封面唱片（播放中会匀速自转）
     · 鼠标移到播放器上 -> 平滑展开完整详情（原始布局风格）
     · 详情里有：进度条、上一首/播放/下一首、播放模式、播放列表
     · 播放模式：顺序播放 / 随机播放 / 单曲循环，存在 localStorage
     · 播放时，页面正下方常驻一条歌词栏，当前句居中 + 卡拉OK式擦除高亮
     · 配过 Token 时，右下角出现「＋」-> 打开添加音乐面板（见 music-upload.js）

   播放列表的展开状态是**每个播放器各自独立**的（不是共用一个开关）：
   否则在欢迎页点开列表、再进入小窝，常驻播放器会白捡一个"已展开"的列表，
   看起来就是右下角那个播放器显示错乱。点播放器以外的任何地方都会收起列表。

   数据：music-data.js 的 window.RINSORA_MUSIC = {version, tracks[]}
   ============================================================ */
(function (w, d) {
  'use strict';

  var DATA_PATH = 'music-data.js';
  var STATE_KEY = 'rinsora-music-state';
  /* 「播到哪了」单独存一份 sessionStorage（不是 localStorage）：
     换文档的跳转（直接打开某篇文章、在文章页点「回到博客列表」）里，
     <audio> 会随旧文档销毁，靠这份记录在新文档里接着播。
     sessionStorage 天然只活在当前标签页，关掉就没了 —— 不会变成
     「下次打开小窝自动开始播」这种突然袭击。 */
  var RESUME_KEY = 'rinsora-music-resume';
  var RESUME_TTL = 6 * 3600 * 1000;   // 超过 6 小时就当它已经翻篇了

  /* 曲目里的 src / cover 是按「相对站点根目录」写的（assets/music/xxx）。
     文章页在 /posts/ 下，原样用会让浏览器去找 /posts/assets/... -> 404：
     封面掉回默认唱片、点了播放没有声音。这里按当前页面的目录深度补 ../，
     幂等（已经是 ../ 或 http/绝对路径就原样返回），所以首页那边毫无影响。 */
  var BASE = (function () {
    var dir = String(w.location.pathname || '/').replace(/\/[^/]*$/, '/');
    var depth = dir.split('/').filter(function (x) { return x; }).length;
    return depth ? new Array(depth + 1).join('../') : '';
  })();

  function res(p) {
    var s = String(p == null ? '' : p);
    if (!s) return s;
    if (/^[a-z][a-z0-9+.-]*:/i.test(s) || s.charAt(0) === '/' ||
        s.charAt(0) === '#' || s.indexOf('..') === 0) return s;
    return BASE + s;
  }

  var TRACK_ORDER = ['id', 'title', 'artist', 'cover', 'src', 'lrc', 'date'];
  var MODES = ['order', 'shuffle', 'loop'];
  var MODE_LABEL = { order: '顺序播放', shuffle: '随机播放', loop: '单曲循环' };

  /* ------------------------------------------------------------
     图标：全部用同一族内联 SVG
     文字符号（↻ / 🔀 / 🔁 / ⏮ / ▶）在不同系统上有的走彩色 emoji 字体、
     有的走文字字体，粗细和颜色都对不齐，所以统一换成描边 SVG，
     颜色跟随 currentColor，缩放到任何尺寸都保持一致的风格。
     ------------------------------------------------------------ */
  var OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var SOLID = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var CLOSE = '</svg>';

  var ICON = {
    prev: SOLID + '<polygon points="19 20 9 12 19 4 19 20"/><path d="M5 19V5"/>' + CLOSE,
    next: SOLID + '<polygon points="5 4 15 12 5 20 5 4"/><path d="M19 5v14"/>' + CLOSE,
    play: SOLID + '<polygon points="6 3 20 12 6 21 6 3"/>' + CLOSE,
    pause: SOLID + '<rect x="6" y="4" width="4" height="16" rx="1.4"/>' +
      '<rect x="14" y="4" width="4" height="16" rx="1.4"/>' + CLOSE,
    list: OUT + '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/>' +
      '<path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>' + CLOSE,
    /* 顺序播放：列表首尾相接的循环箭头 */
    order: OUT + '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/>' +
      '<path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>' + CLOSE,
    /* 随机播放：两条交叉的箭头 */
    shuffle: OUT + '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22"/>' +
      '<path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/>' +
      '<path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>' + CLOSE,
    /* 单曲循环：同样两条循环箭头，中间多一个「1」 */
    loop: OUT + '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/>' +
      '<path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>' +
      '<path d="M11 10h1.1v4"/>' + CLOSE
  };

  /* 序列化时重建的文件头（和 music-data.js 里那段注释保持一致） */
  var HEADER = [
    '/* ============================================================',
    '   music-data.js —— 「音乐播放器」的数据源',
    '   ------------------------------------------------------------',
    '   这个文件由网页版「添加音乐」面板（播放器展开后右下角的 ＋）自动维护，',
    '   也可以直接手改：只要保持下面那行赋值语句的形状就行。',
    '',
    '   字段说明',
    '     tracks[]  : 曲目列表，播完一首会自动接下一首',
    '        id      内部标识，保存后别改（删除 / 定位靠它认人）',
    '        title   歌名',
    '        artist  作者 / 歌手',
    '        cover   封面图路径，留空则显示一张渐变唱片',
    '        src     音频文件路径（相对本站根目录）',
    '        lrc     歌词原文（LRC 文本，直接内联在这里，不用另外放文件）',
    '        date    添加日期',
    '',
    '   说明：音频文件和封面图会被上传到 assets/music/ 目录，',
    '        歌词则以文本形式直接存进本文件的 lrc 字段。',
    '   ============================================================ */',
    ''
  ].join('\n');

  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>'"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c];
    });
  }
  function fmt(s) {
    if (!Number.isFinite(s) || s < 0) return '00:00';
    var m = Math.floor(s / 60), x = Math.floor(s % 60);
    return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x;
  }

  /* ------------------------------------------------------- 提示条 ---- */

  var toastEl = null, toastTimer = null;
  function toast(msg, type) {
    if (!toastEl) {
      toastEl = d.createElement('div');
      toastEl.className = 'blog-toast';
      d.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.className = 'blog-toast show' + (type ? ' t-' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = 'blog-toast'; },
      type === 'err' ? 7000 : 3600);
  }

  /* ============================================================
     数据层：解析 / 序列化 music-data.js
     ============================================================ */

  /* 从源码里抠出 window.RINSORA_MUSIC = {...} 的那个对象（数花括号，手改也不怕） */
  function parse(text) {
    var src = String(text == null ? '' : text);
    var key = src.indexOf('window.RINSORA_MUSIC');
    if (key === -1) throw new Error('music-data.js 里找不到 window.RINSORA_MUSIC');
    var open = src.indexOf('{', key);
    if (open === -1) throw new Error('music-data.js 格式不对：缺少 {');
    var depth = 0, inStr = false, quote = '', escNext = false, end = -1;
    for (var i = open; i < src.length; i++) {
      var ch = src[i];
      if (inStr) {
        if (escNext) { escNext = false; continue; }
        if (ch === '\\') { escNext = true; continue; }
        if (ch === quote) inStr = false;
        continue;
      }
      if (ch === '"' || ch === "'") { inStr = true; quote = ch; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) throw new Error('music-data.js 格式不对：括号没闭合');
    var raw = src.slice(open, end + 1).replace(/,\s*([}\]])/g, '$1');   // 容忍尾随逗号
    var obj = JSON.parse(raw);
    return { version: obj.version || 1, tracks: Array.isArray(obj.tracks) ? obj.tracks : [] };
  }

  function cleanTrack(raw) {
    var t = raw || {};
    var out = {};
    TRACK_ORDER.forEach(function (k) {
      if (k === 'id') out.id = String(t.id || '');
      else out[k] = t[k] == null ? '' : String(t[k]);
    });
    if (!out.id) out.id = slugId(out.title || out.src, []);
    if (!out.title) out.title = '未命名';
    if (!out.artist) out.artist = '未知作者';
    return out;
  }

  function serialize(data) {
    var out = {
      version: data.version || 1,
      tracks: (data.tracks || []).map(cleanTrack)
    };
    return HEADER + 'window.RINSORA_MUSIC = ' + JSON.stringify(out, null, 2) + ';\n';
  }

  /* 生成一个 ascii 的 id；中文名就用时间戳兜底 */
  function slugId(name, taken) {
    var base = String(name || '').toLowerCase()
      .replace(/\.[a-z0-9]{1,5}$/i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    var take = taken || [];
    var has = function (v) { return take.indexOf(v) !== -1; };
    if (!base || /^[-0-9]+$/.test(base)) base = 'm-' + Date.now().toString(36);
    var id = base, n = 2;
    while (has(id)) { id = base + '-' + (n++); }
    return id;
  }

  function read() {
    var raw = w.RINSORA_MUSIC || { version: 1, tracks: [] };
    return { version: raw.version || 1, tracks: Array.isArray(raw.tracks) ? raw.tracks : [] };
  }

  /* ============================================================
     歌词
     ============================================================ */

  function parseLrc(text) {
    var out = [];
    String(text || '').split(/\r?\n/).forEach(function (raw) {
      var tags = raw.match(/\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/g);
      var content = raw.replace(/\[[^\]]*\]/g, '').trim();
      if (!tags) return;
      tags.forEach(function (tag) {
        var m = /\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/.exec(tag);
        if (!m) return;
        var t = Number(m[1]) * 60 + Number(String(m[2]).replace(':', '.'));
        if (Number.isFinite(t)) out.push({ t: t, text: content || '\u266a' });
      });
    });
    out.sort(function (a, b) { return a.t - b.t; });
    return out;
  }

  /* ============================================================
     播放状态
     ============================================================ */

  var audio = null;
  var admin = false;                  // 配过 Token 才会挂「＋」和播放列表里的删除按钮
  var players = [];                   // 两个播放器的 DOM 引用集合
  var state = {
    data: { version: 1, tracks: [] },
    index: 0,
    mode: 'order',
    started: false,                   // 是否已经开始播放过（决定歌词栏是否登场）
    lines: [],
    plain: false,                     // 没有歌词 -> 静态占位
    active: -1,
    lyricsHidden: false
  };

  function tracks() { return state.data.tracks; }
  function current() { return tracks()[state.index] || null; }

  function isAdmin() {
    try { return !!(w.GH && w.GH.hasToken && w.GH.hasToken()); } catch (e) { return false; }
  }

  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(STATE_KEY) || '{}') || {};
      if (MODES.indexOf(s.mode) !== -1) state.mode = s.mode;
      if (Number.isInteger(s.index) && s.index >= 0) state.index = s.index;
    } catch (e) {}
  }
  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({ mode: state.mode, index: state.index }));
    } catch (e) {}
  }

  /* ============================================================
     跨文档续播
     ------------------------------------------------------------
     同一个文档里换内容是不断音的（首页点文章走的是 script.js 的
     #spaPost 浮层）。但真链接还是会换文档：直接打开某篇文章、在文章页
     点「回到博客列表」…… <audio> 随旧文档销毁，只能在新文档里接着播。
     新文档要自动发声得靠浏览器的粘性激活，被拦下来也不会报错 ——
     那就退成「停在原位置不响」，用户点一下播放即可，不会更糟。
     ============================================================ */
  var tracked = { src: '', t: 0, playing: false, at: 0 };
  var lastSave = 0;

  function flushResume() {
    try {
      sessionStorage.setItem(RESUME_KEY, JSON.stringify({
        src: tracked.src, t: tracked.t, playing: tracked.playing, at: Date.now()
      }));
    } catch (e) {}
  }

  /* 只在真的在播的时候记录 —— 暂停中点出去，回来就不该自己响 */
  function trackResume(force) {
    if (!audio || !current()) return;
    var now = Date.now();
    if (!force && now - lastSave < 1000) return;
    lastSave = now;
    tracked.src = current().src || '';
    tracked.t = audio.currentTime || 0;
    tracked.at = now;
    flushResume();
  }

  function restoreResume() {
    var s = null;
    try { s = JSON.parse(sessionStorage.getItem(RESUME_KEY) || 'null'); } catch (e) { s = null; }
    if (!s || !s.playing || !s.src) return false;
    if (Date.now() - (Number(s.at) || 0) > RESUME_TTL) return false;

    var list = tracks(), i = -1, k;
    for (k = 0; k < list.length; k++) { if (list[k].src === s.src) { i = k; break; } }
    if (i < 0) return false;                 /* 曲库换过了，对不上就不硬放 */

    state.index = i;
    saveState();
    audio.src = res(list[i].src);
    buildLines();
    renderAll();

    /* ⚠️⚠️ 这个 seek 只能对「刚恢复的那一首」生效**一次**，绝不能变成常驻监听。
       ------------------------------------------------------------
       为什么必须改成 once + src 比对（用户反馈 5：切歌时新歌不是从头播，
       而是接着上一首的进度）：

       原来写的是 `audio.addEventListener('loadedmetadata', seek)` ——
       既没有 { once:true }，也没有在回调里摘掉。于是这个闭包捕获的
       「上次离开时的秒数」会被应用到**之后每一次 loadedmetadata** 上。
       而 setIndex()（上一首 / 下一首 / 点播放器列表 / 点博物馆唱片，
       所有切歌都走它）每次都会 `audio.src = ...; audio.load();` ——
       load() 必然重新派发一次 loadedmetadata —— 于是新歌被 seek 到
       旧的那一秒。表现为「切歌后不是从头播，而是从上一个进度继续」，
       而且只在「这次会话里有过一次成功的位置恢复」之后才出现
       （restoreResume() 只在文档初始化时跑），所以看起来时有时无、极难查。

       改法两件套：
         · { once:true }         —— 只认第一次 loadedmetadata
         · src 比对              —— 恢复的那首可能还没加载完用户就切走了，
                                    那一次 seek 必须作废，别去动别人的位置

       影响面：只影响「恢复上次进度」这一条路径，而且只有变好 ——
       恢复的那一首照旧 seek（跨文档回来接着听这个功能没变），
       但**不会再**污染之后加载的任何一首。setIndex / 自动连播 / 单曲循环
       全是 audio.src + load()，本来就该从 0 起，行为不变。 */
    var wantSrc = audio.src;
    var seek = function () {
      if (audio.src !== wantSrc) return;            /* 已经不是那一首了 → 作废 */
      var t = Number(s.t) || 0;
      if (t > 0.3 && isFinite(audio.duration) && t < audio.duration - 0.5) audio.currentTime = t;
    };
    if (audio.readyState >= 1) seek();
    else audio.addEventListener('loadedmetadata', seek, { once: true });

    tracked.src = list[i].src;
    tracked.t = Number(s.t) || 0;
    tracked.playing = true;
    audio.play().catch(function () { /* 被自动播放策略拦下：停在原位置，等用户点 */ });
    return true;
  }

  /* ============================================================
     两个播放器的模板与渲染
     ============================================================ */

  function shellHtml() {
    return '' +
      '<div class="mp-shell">' +
        '<div class="mp-top">' +
          '<div class="mp-disc"><img class="mp-cover" alt=""><span class="mp-note">\u266a</span></div>' +
          '<div class="mp-meta">' +
            '<strong class="mp-title">还没有音乐</strong>' +
            '<span class="mp-artist">点右下角的 ＋ 添加</span>' +
          '</div>' +
        '</div>' +
        '<div class="mp-body">' +
          '<div class="mp-progress" role="slider" aria-label="播放进度">' +
            '<div class="mp-fill"></div>' +
          '</div>' +
          '<div class="mp-times"><span class="mp-cur">00:00</span><span class="mp-dur">00:00</span></div>' +
          '<div class="mp-ctrl">' +
            '<button type="button" class="mp-btn" data-act="prev" title="上一首" aria-label="上一首">' +
              ICON.prev + '</button>' +
            '<button type="button" class="mp-btn mp-main" data-act="play" data-state="paused" ' +
              'title="播放 / 暂停" aria-label="播放">' + ICON.play + '</button>' +
            '<button type="button" class="mp-btn" data-act="next" title="下一首" aria-label="下一首">' +
              ICON.next + '</button>' +
            '<button type="button" class="mp-btn mp-modebtn" data-act="mode" data-mode="' + state.mode +
              '" title="播放模式">' + ICON[state.mode] + '</button>' +
            '<button type="button" class="mp-btn mp-listbtn" data-act="list" ' +
              'title="播放列表" aria-label="播放列表">' + ICON.list + '</button>' +
          '</div>' +
          '<div class="mp-playlist"><div class="mp-pl"></div></div>' +
        '</div>' +
      '</div>';
  }

  function mountPlayer(root, kind) {
    if (!root) return null;
    root.classList.add('mplayer', 'mplayer-' + kind);
    root.innerHTML = shellHtml();

    var p = {
      root: root,
      shell: $('.mp-shell', root),
      disc: $('.mp-disc', root),
      cover: $('.mp-cover', root),
      title: $('.mp-title', root),
      artist: $('.mp-artist', root),
      fill: $('.mp-fill', root),
      progress: $('.mp-progress', root),
      cur: $('.mp-cur', root),
      dur: $('.mp-dur', root),
      play: $('[data-act="play"]', root),
      modeBtn: $('.mp-modebtn', root),
      listBtn: $('.mp-listbtn', root),
      playlist: $('.mp-playlist', root),
      pl: $('.mp-pl', root)
    };
    players.push(p);

    /* ---- 播放 / 暂停 ---- */
    p.play.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });

    /* ---- 上一首 / 下一首 ---- */
    $('[data-act="prev"]', root).addEventListener('click', function (e) {
      e.stopPropagation(); step(-1);
    });
    $('[data-act="next"]', root).addEventListener('click', function (e) {
      e.stopPropagation(); step(1);
    });

    /* ---- 播放模式：顺序 -> 随机 -> 单曲 ---- */
    p.modeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var i = MODES.indexOf(state.mode);
      state.mode = MODES[(i + 1) % MODES.length];
      saveState();
      renderAll();
      updateModeBtn();
      toast('播放模式：' + MODE_LABEL[state.mode]);
      if (!audio.paused) audio.play().catch(function () {});   // 单曲循环切进去立即生效
    });

    /* ---- 播放列表：开列表时把这个播放器钉住，免得鼠标一移开就收起来 ----
       注意 plist-open 只加在「被点的那个播放器」上。如果两个播放器共用一个
       开关，在欢迎页点开列表再进入小窝时，常驻播放器会白捡一个已展开的列表。 */
    p.listBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !root.classList.contains('plist-open');
      if (open) {
        closePlaylists(root);                      // 先把它自己的列表收起来
        root.classList.add('plist-open', 'pinned'); // 再展开 + 钉住
      } else {
        closePlaylists(null);                      // 关掉时连「钉住」一起解除
      }
    });
    p.playlist.addEventListener('click', function (e) { e.stopPropagation(); });

    /* ---- 点进度条跳转 ---- */
    p.progress.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!audio.duration) return;
      var r = p.progress.getBoundingClientRect();
      var ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      audio.currentTime = ratio * audio.duration;
    });

    /* ---- 点唱片：触屏设备没有 hover，用它展开 / 收起（桌面端交给 hover，免得钉住不松） ---- */
    var noHover = false;
    try { noHover = w.matchMedia && w.matchMedia('(hover: none)').matches; } catch (e) {}
    if (noHover) {
      p.disc.addEventListener('click', function () { root.classList.toggle('pinned'); });
    }

    /* ---- 鼠标移开后如果列表没开着，就解除钉住 ---- */
    root.addEventListener('mouseleave', function () {
      if (!root.classList.contains('plist-open')) root.classList.remove('pinned');
    });

    /* ---- 播放列表逐条点击 ---- */
    p.pl.addEventListener('click', function (e) {
      var row = e.target.closest ? e.target.closest('.mp-track') : null;
      if (!row) return;
      e.stopPropagation();
      var del = e.target.closest ? e.target.closest('.mp-track-del') : null;
      if (del) {
        if (w.RinsoraMusicUpload) w.RinsoraMusicUpload.removeTrack(Number(row.dataset.i));
        return;
      }
      setIndex(Number(row.dataset.i), true);
    });

    return p;
  }

  /* 收起所有播放列表；keep 传某个 root 时保留那一个（点它自己的列表按钮时用）。
     pin=false 表示连「钉住」一起解除。 */
  function closePlaylists(keep, pin) {
    players.forEach(function (p) {
      if (p.root === keep) return;
      p.root.classList.remove('plist-open');
      if (pin !== true) p.root.classList.remove('pinned');
    });
  }

  /* 曲目列表（两个播放器共用一份 DOM 内容，各自渲染） */
  function renderPlaylist() {
    var list = tracks();
    players.forEach(function (p) {
      if (!list.length) {
        p.pl.innerHTML = '<div class="mp-pl-empty">列表还是空的，点右下角 ＋ 加一首吧 ♡</div>';
        return;
      }
      p.pl.innerHTML = list.map(function (t, i) {
        var on = i === state.index;
        return '<div class="mp-track' + (on ? ' on' : '') + '" data-i="' + i + '">' +
          '<span class="mp-track-no">' + (on
            ? '<span class="mp-eq"><i></i><i></i><i></i></span>'
            : (i + 1)) + '</span>' +
          '<span class="mp-track-t">' + esc(t.title) + '</span>' +
          '<span class="mp-track-a">' + esc(t.artist) + '</span>' +
          (admin ? '<button type="button" class="mp-track-del" title="删除这首" ' +
            'aria-label="删除">\u2715</button>' : '') +
          '</div>';
      }).join('');
    });
  }

  function updateModeBtn() {
    players.forEach(function (p) {
      p.modeBtn.innerHTML = ICON[state.mode];
      p.modeBtn.title = '播放模式：' + MODE_LABEL[state.mode] + '（点一下换一个）';
      p.modeBtn.setAttribute('data-mode', state.mode);
      p.modeBtn.setAttribute('aria-label', '播放模式：' + MODE_LABEL[state.mode]);
    });
  }

  function setPlayingUi(playing) {
    players.forEach(function (p) {
      p.play.innerHTML = playing ? ICON.pause : ICON.play;
      p.play.setAttribute('data-state', playing ? 'playing' : 'paused');
      p.play.setAttribute('aria-label', playing ? '暂停' : '播放');
    });
  }

  function renderAll() {
    var t = current();
    players.forEach(function (p) {
      if (!t) {
        p.title.textContent = '还没有音乐';
        p.artist.textContent = '点右下角的 ＋ 添加';
        p.disc.classList.remove('has-cover');
        p.cover.removeAttribute('src');
        p.fill.style.width = '0%';
        p.cur.textContent = p.dur.textContent = '00:00';
        return;
      }
      p.title.textContent = t.title;
      p.artist.textContent = t.artist;
      if (t.cover) {
        var cv = res(t.cover);
        if (p.cover.getAttribute('src') !== cv) p.cover.setAttribute('src', cv);
        p.disc.classList.add('has-cover');
      } else {
        p.disc.classList.remove('has-cover');
        p.cover.removeAttribute('src');
      }
    });
    renderPlaylist();
    updateModeBtn();
  }

  /* ============================================================
     底部歌词栏
     ============================================================ */

  var lb = null;
  function mountLyricBar() {
    if (lb) return lb;
    lb = d.createElement('div');
    lb.className = 'lyricbar';
    lb.id = 'lyricbar';
    lb.innerHTML =
      '<div class="lb-inner">' +
        '<div class="lb-side">' +
          '<span class="lb-eq"><i></i><i></i><i></i><i></i></span>' +
          '<span class="lb-now"></span>' +
        '</div>' +
        '<div class="lb-view"><div class="lb-scroll" id="lbScroll"></div></div>' +
      '</div>';
    d.body.appendChild(lb);
    return lb;
  }

  function buildLines() {
    var t = current();
    state.lines = parseLrc(t && t.lrc);
    state.plain = state.lines.length === 0;
    if (state.plain) {
      state.lines = [{ t: 0, text: '\u266a 纯音乐 · 请安静地听完 \u266a' }];
    }
    state.active = -1;
    renderLyricDom();
  }

  function renderLyricDom() {
    mountLyricBar();
    var scroll = $('#lbScroll', lb);
    scroll.style.setProperty('--n', Math.max(0, state.lines.length - 1));
    scroll.innerHTML = state.lines.map(function (l, i) {
      if (i === state.active && !state.plain) {
        /* 当前句两层文字完全重叠：底下 lb-base 是暗色，上面 lb-fill 是渐变，
           靠 clip-path 从左往右擦开做卡拉OK。两层字体、字号、字距必须一致，
           否则会错位成"重影"。 */
        return '<div class="lb-line active" data-i="' + i + '">' +
          '<span class="lb-wrap">' +
            '<span class="lb-base">' + esc(l.text) + '</span>' +
            '<span class="lb-fill" style="--p:0%">' + esc(l.text) + '</span>' +
          '</span></div>';
      }
      return '<div class="lb-line" data-i="' + i + '">' + esc(l.text) + '</div>';
    }).join('');
    scroll.style.setProperty('--i', Math.max(0, state.active));
    updateNowChip();
    updateNearLines();
  }

  /* 当前句两边的行加一点"邻近感"（淡一点、清一点），越远越糊 */
  function updateNearLines() {
    var lines = $$('.lb-line', lb);
    lines.forEach(function (el, i) {
      var dist = Math.abs(i - state.active);
      el.classList.toggle('near', dist === 1);
      el.classList.toggle('far', dist >= 3);
    });
  }

  function updateNowChip() {
    var t = current();
    var now = $('.lb-now', lb);
    if (now) now.textContent = t ? (t.title + ' · ' + t.artist) : '';
  }

  /* 每帧只更新当前句的擦除进度（卡拉OK 效果），不重建 DOM */
  function updateWipe() {
    if (state.plain || state.active < 0) return;
    var fill = $('.lb-line.active .lb-fill', lb);
    if (!fill) return;
    var start = state.lines[state.active].t;
    var end = state.active + 1 < state.lines.length
      ? state.lines[state.active + 1].t
      : (audio.duration || start + 4);
    var span = Math.max(0.35, end - start);
    var p = Math.min(1, Math.max(0, (audio.currentTime - start) / span));
    fill.style.setProperty('--p', (p * 100).toFixed(2) + '%');
  }

  /* timeupdate 只有 ~4Hz，擦除进度靠它驱动会一顿一顿的，
     所以播放期间再开一个 requestAnimationFrame 循环专门刷这一条。
     （--p 每帧直接写，不要再给 clip-path 加 transition —— 那会让擦除边缘
     一直滞后几帧，看起来像拖了一条影子。） */
  var rafId = null;
  function tickWipe() {
    if (!audio || audio.paused) { rafId = null; return; }
    updateWipe();
    rafId = w.requestAnimationFrame(tickWipe);
  }
  function startWipe() {
    if (rafId == null && w.requestAnimationFrame) rafId = w.requestAnimationFrame(tickWipe);
  }
  function stopWipe() {
    if (rafId != null && w.cancelAnimationFrame) w.cancelAnimationFrame(rafId);
    rafId = null;
  }

  function syncLyrics() {
    if (!state.lines.length) return;
    var cur = audio.currentTime, idx = -1;
    for (var i = 0; i < state.lines.length; i++) {
      if (cur + 0.12 >= state.lines[i].t) idx = i;
    }
    if (idx !== state.active) {
      state.active = idx;
      renderLyricDom();
    } else {
      updateWipe();
    }
  }

  /* ============================================================
     播放控制
     ============================================================ */

  function setIndex(i, autoplay) {
    var list = tracks();
    if (!list.length) return;
    state.index = ((i % list.length) + list.length) % list.length;
    saveState();
    var t = current();

    audio.src = res(t.src);
    audio.load();

    buildLines();
    renderAll();

    if (autoplay !== false) {
      audio.play().catch(function () {});
    }
  }

  function randomIndex() {
    var n = tracks().length;
    if (n <= 1) return state.index;
    var i = state.index;
    while (i === state.index) i = Math.floor(Math.random() * n);
    return i;
  }

  /* dir = 0 表示「这首播完了，自动接下一首」；否则是用户点的上一首/下一首 */
  function step(dir) {
    var list = tracks();
    if (!list.length) { toast('播放列表还是空的，先加一首吧', 'err'); return; }

    if (dir < 0) {
      /* 上一首：超过 3 秒就先回到开头，比较符合直觉 */
      if (audio.currentTime > 3) { audio.currentTime = 0; return; }
      setIndex(state.index - 1, !audio.paused);
      return;
    }
    if (state.mode === 'shuffle') setIndex(randomIndex(), !audio.paused);
    else setIndex(state.index + 1, !audio.paused);          // order / loop 手动切都是下一首
  }

  function autoNext() {
    if (!tracks().length) return;
    if (state.mode === 'loop') {                            // 单曲循环
      audio.currentTime = 0;
      audio.play().catch(function () {});
      return;
    }
    if (state.mode === 'shuffle') setIndex(randomIndex(), true);
    else setIndex(state.index + 1, true);                   // 顺序播放到底了会绕回第一首
  }

  function toggle() {
    if (!tracks().length) { toast('播放列表还是空的，先加一首吧', 'err'); return; }
    if (!audio.src) { setIndex(state.index, true); return; }
    if (audio.paused) audio.play().catch(function () {});
    else audio.pause();
  }

  /* ============================================================
     首屏初始化
     ============================================================ */

  function reloadFromDisk() {
    state.data = read();
    if (state.index >= state.data.tracks.length) state.index = 0;
    var t = current();
    if (t) audio.src = res(t.src);
    buildLines();
    renderAll();
  }

  function wireAudio() {
    audio.addEventListener('play', function () {
      d.body.classList.add('mp-playing');
      if (!state.started) { state.started = true; d.body.classList.add('lyrics-on'); }
      setPlayingUi(true);
      startWipe();
      tracked.playing = true;
      trackResume(true);
    });
    audio.addEventListener('pause', function () {
      d.body.classList.remove('mp-playing');
      setPlayingUi(false);
      stopWipe();
      if (state.started) syncLyrics();
      /* 迟一步再记「已暂停」：换文档时浏览器也可能顺手 pause 一下，
         当场写下去就会变成「明明在播却记成暂停」，回来就不响了。 */
      setTimeout(function () {
        if (audio.paused && !audio.ended) { tracked.playing = false; trackResume(true); }
      }, 300);
    });
    audio.addEventListener('ended', function () {
      d.body.classList.remove('mp-playing');
      setPlayingUi(false);
      stopWipe();
      autoNext();
    });
    audio.addEventListener('loadedmetadata', function () {
      var dur = fmt(audio.duration);
      players.forEach(function (p) { p.dur.textContent = dur; });
    });
    audio.addEventListener('timeupdate', function () {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      players.forEach(function (p) {
        p.fill.style.width = pct + '%';
        p.cur.textContent = fmt(audio.currentTime);
      });
      if (state.started) syncLyrics();
      trackResume(false);          /* 每秒落一次盘，关页面时进度最多差 1 秒 */
    });

    /* 离开文档前再补一次：timeupdate 是每秒级的，最后一次可能来不及写 */
    w.addEventListener('pagehide', function () {
      tracked.t = audio ? (audio.currentTime || 0) : 0;
      trackResume(true);
    });
    d.addEventListener('visibilitychange', function () {
      if (d.visibilityState === 'hidden') {
        tracked.t = audio ? (audio.currentTime || 0) : 0;
        trackResume(true);
      }
    });
  }

  /* 顶栏那个「♫ 歌词」：有播放内容时用来显隐底部歌词栏 */
  function wireLyricToggle() {
    var btn = $('#miniLyricsBtn');
    if (!btn) return;
    var sync = function () {
      btn.classList.toggle('off', state.lyricsHidden);
      btn.setAttribute('aria-pressed', state.lyricsHidden ? 'false' : 'true');
      btn.title = state.lyricsHidden ? '显示底部歌词' : '隐藏底部歌词';
    };
    btn.addEventListener('click', function () {
      state.lyricsHidden = !state.lyricsHidden;
      d.body.classList.toggle('lyrics-hidden', state.lyricsHidden);
      sync();
    });
    sync();
  }

  function mount() {
    audio = $('#audio');
    if (!audio) return;

    var land = mountPlayer($('#landingPlayer'), 'landing');
    var flt = mountPlayer($('#floatingPlayer'), 'float');
    if (!land && !flt) return;

    /* 文章页这种「没有欢迎页、也没有 .app 外壳」的页面只有右下角这一个
       播放器。给它加 .visible 原本是 script.js 的 enterApp() 干的活，
       那些页面不加载 script.js，所以这里自己淡入一次；
       两个播放器都挂载（首页）时仍交给 enterApp，避免两边抢着改类名。
       双 rAF 是为了「先让 .visible 那一帧提交过」，定时器再兜一层。 */
    if (flt && !land) {
      var froot = $('#floatingPlayer');
      setTimeout(function () {
        if (!froot) return;
        void froot.offsetHeight;
        var show = function () { froot.classList.add('visible'); };
        if (w.requestAnimationFrame) {
          w.requestAnimationFrame(function () { w.requestAnimationFrame(show); });
        }
        setTimeout(show, 300);
      }, 80);
    }

    loadState();
    state.data = read();

    mountLyricBar();
    wireAudio();
    wireLyricToggle();

    /* 先判定管理员身份再渲染 —— 播放列表里的删除按钮要据此决定挂不挂 */
    admin = isAdmin();
    if (admin) d.body.classList.add('music-admin');

    if (state.index >= state.data.tracks.length) state.index = 0;
    var t = current();
    if (t) audio.src = res(t.src);
    buildLines();
    renderAll();
    setPlayingUi(false);

    /* 跨文档跳转（真链接打开文章 / 从文章页回列表）时接着刚才的位置播。
       没记录或当时是暂停的，这里就是个空操作。 */
    restoreResume();

    /* 「＋ 添加音乐」只有配过 Token 才挂载 —— 普通访客看不到，也点不出写操作。
       面板本身在 music-upload.js 里，这里只负责把按钮插到右下角并召唤它。 */
    if (admin) {
      players.forEach(function (p) {
        if ($('.mp-addbtn', p.root)) return;
        var add = d.createElement('button');
        add.type = 'button';
        add.className = 'mp-btn mp-addbtn';
        add.dataset.act = 'add';
        add.title = '添加音乐';
        add.setAttribute('aria-label', '添加音乐');
        add.textContent = '\uff0b';
        add.addEventListener('click', function (e) {
          e.stopPropagation();
          if (w.RinsoraMusicUpload) w.RinsoraMusicUpload.open();
        });
        $('.mp-ctrl', p.root).appendChild(add);
      });
    }

    /* 点播放器以外的任何地方：收起所有播放列表，顺带解除钉住。
       播放器内部的按钮都 stopPropagation 了，所以这里的 e.target
       一定是「外面」的东西。 */
    d.addEventListener('click', function (e) {
      var inside = e.target && e.target.closest && e.target.closest('.mplayer');
      if (!inside) closePlaylists(null);
    }, true);

    /* 首次进入站点时给个提示（只在真的没配 Token 时，且只提示一次） */
    if (!admin && !tracks().length) toast('播放列表是空的 —— 配好 Token 后就能在播放器右下角 ＋ 添加');
  }

  /* 供 music-upload.js / script.js 用 */
  w.RinsoraMusic = {
    DATA_PATH: DATA_PATH,
    HEADER: HEADER,
    MODES: MODES,
    MODE_LABEL: MODE_LABEL,
    ICON: ICON,
    TRACK_ORDER: TRACK_ORDER,
    parse: parse,
    serialize: serialize,
    cleanTrack: cleanTrack,
    slugId: slugId,
    read: read,
    parseLrc: parseLrc,
    fmt: fmt,
    esc: esc,
    toast: toast,
    tracks: tracks,
    current: current,
    getState: function () { return state; },
    reload: reloadFromDisk,
    refresh: function () { buildLines(); renderAll(); },
    playIndex: function (i) { setIndex(i, true); },
    /* 进入小窝时把两个播放器都收回收起态，免得上一个页面的列表状态漏过去 */
    collapse: function () { closePlaylists(null); },
    /* 上传 / 删除完就地换掉内存里的曲库，播放器立刻能看到变化，不用刷新页面 */
    setData: function (data) {
      var list = (data && data.tracks) || [];
      state.data = { version: (data && data.version) || 1, tracks: list.slice() };
      if (state.index >= list.length) state.index = list.length - 1;
      if (state.index < 0) state.index = 0;
      saveState();
      buildLines();
      renderAll();
    },
    isAdmin: isAdmin
  };

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window, document);
