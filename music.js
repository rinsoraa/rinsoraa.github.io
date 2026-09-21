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

   数据：music-data.js 的 window.RINSORA_MUSIC = {version, tracks[]}
   ============================================================ */
(function (w, d) {
  'use strict';

  var DATA_PATH = 'music-data.js';
  var STATE_KEY = 'rinsora-music-state';

  var TRACK_ORDER = ['id', 'title', 'artist', 'cover', 'src', 'lrc', 'date'];
  var MODES = ['order', 'shuffle', 'loop'];
  var MODE_LABEL = { order: '顺序播放', shuffle: '随机播放', loop: '单曲循环' };
  var MODE_ICON = { order: '\u21bb', shuffle: '\ud83d\udd00', loop: '\ud83d\udd02' };

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
            '<button type="button" class="mp-btn" data-act="prev" title="上一首">\u23ee</button>' +
            '<button type="button" class="mp-btn mp-main" data-act="play" title="播放 / 暂停">\u25b6</button>' +
            '<button type="button" class="mp-btn" data-act="next" title="下一首">\u23ed</button>' +
            '<button type="button" class="mp-btn mp-modebtn" data-act="mode" title="播放模式">' +
              MODE_ICON[state.mode] + '</button>' +
            '<button type="button" class="mp-btn mp-listbtn" data-act="list" title="播放列表">\u2630</button>' +
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

    /* ---- 播放列表：展开时把播放器钉住，不然鼠标一移开就收起来了 ---- */
    p.listBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !root.classList.contains('plist-open');
      players.forEach(function (q) { q.root.classList.toggle('plist-open', open); });
      if (open) root.classList.add('pinned');
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

    /* ---- 鼠标移开后如果列表是开的，收起列表并解除钉住 ---- */
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
      p.modeBtn.textContent = MODE_ICON[state.mode];
      p.modeBtn.title = '播放模式：' + MODE_LABEL[state.mode] + '（点一下换一个）';
      p.modeBtn.dataset.mode = state.mode;
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
        if (p.cover.getAttribute('src') !== t.cover) p.cover.setAttribute('src', t.cover);
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
     所以播放期间再开一个 requestAnimationFrame 循环专门刷这一条。 */
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

    audio.src = t.src;
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
    if (t) audio.src = t.src;
    buildLines();
    renderAll();
  }

  function wireAudio() {
    audio.addEventListener('play', function () {
      d.body.classList.add('mp-playing');
      if (!state.started) { state.started = true; d.body.classList.add('lyrics-on'); }
      players.forEach(function (p) { p.play.textContent = '\u275a\u275a'; });
      startWipe();
    });
    audio.addEventListener('pause', function () {
      d.body.classList.remove('mp-playing');
      players.forEach(function (p) { p.play.textContent = '\u25b6'; });
      stopWipe();
      if (state.started) syncLyrics();
    });
    audio.addEventListener('ended', function () {
      d.body.classList.remove('mp-playing');
      players.forEach(function (p) { p.play.textContent = '\u25b6'; });
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
    });
  }

  /* 顶栏那个「♫ 歌词」：有播放内容时用来显隐底部歌词栏 */
  function wireLyricToggle() {
    var btn = $('#miniLyricsBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      state.lyricsHidden = !state.lyricsHidden;
      d.body.classList.toggle('lyrics-hidden', state.lyricsHidden);
      btn.classList.toggle('off', state.lyricsHidden);
      btn.title = state.lyricsHidden ? '显示底部歌词' : '隐藏底部歌词';
    });
  }

  function mount() {
    audio = $('#audio');
    if (!audio) return;

    var land = mountPlayer($('#landingPlayer'), 'landing');
    var flt = mountPlayer($('#floatingPlayer'), 'float');
    if (!land && !flt) return;

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
    if (t) audio.src = t.src;
    buildLines();
    renderAll();

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
        add.textContent = '\uff0b';
        add.addEventListener('click', function (e) {
          e.stopPropagation();
          if (w.RinsoraMusicUpload) w.RinsoraMusicUpload.open();
        });
        $('.mp-ctrl', p.root).appendChild(add);
      });
    }

    /* 首次进入站点时给个提示（只在真的没配 Token 时，且只提示一次） */
    if (!admin && !tracks().length) toast('播放列表是空的 —— 配好 Token 后就能在播放器右下角 ＋ 添加');
  }

  /* 供 music-upload.js 用 */
  w.RinsoraMusic = {
    DATA_PATH: DATA_PATH,
    HEADER: HEADER,
    MODES: MODES,
    MODE_LABEL: MODE_LABEL,
    MODE_ICON: MODE_ICON,
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
