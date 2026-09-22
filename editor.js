/* ============================================================
   editor.js —— 网页版写作台
   读写都通过 gh-api.js 走 GitHub Contents API。
   保存时做两件事：生成/更新 posts/<slug>.html，并同步 index.html 的卡片。
   ============================================================ */
(function (w, d) {
  'use strict';

  var GH = w.GH;
  if (!GH) return;

  var $ = function (s) { return d.querySelector(s); };

  var el = {
    btnNew: $('#btnNew'), btnSetup: $('#btnSetup'),
    setup: $('#setupPanel'),
    cfgOwner: $('#cfgOwner'), cfgRepo: $('#cfgRepo'), cfgBranch: $('#cfgBranch'), cfgToken: $('#cfgToken'),
    btnSaveCfg: $('#btnSaveCfg'), btnForget: $('#btnForget'), cfgStatus: $('#cfgStatus'),
    list: $('#postList'), count: $('#postCount'),
    badge: $('#modeBadge'),
    title: $('#fTitle'), slug: $('#fSlug'), date: $('#fDate'), kicker: $('#fKicker'),
    summary: $('#fSummary'), tags: $('#fTags'), body: $('#fBody'),
    previewBox: $('#previewBox'),
    imgFile: $('#imgFile'),
    btnSave: $('#btnSave'), btnReset: $('#btnReset'), btnDelete: $('#btnDelete'),
    status: $('#saveStatus'), toast: $('#toast')
  };

  var SITE = 'https://rinsora.dpdns.org';

  var state = { slug: '', existing: null, cards: {} };

  /* ====================================================== 工具 ==== */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function today() {
    var n = new Date();
    var p = function (x) { return (x < 10 ? '0' : '') + x; };
    return n.getFullYear() + '.' + p(n.getMonth() + 1) + '.' + p(n.getDate());
  }

  function toast(msg, type) {
    el.toast.textContent = msg;
    el.toast.className = 'editor-toast show' + (type ? ' t-' + type : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.toast.className = 'editor-toast'; }, type === 'err' ? 8000 : 4200);
  }

  function say(msg, type) {
    el.status.textContent = msg || '';
    el.status.className = 'pane-status' + (type ? ' ' + type : '');
  }

  function busy(on) {
    [el.btnSave, el.btnDelete, el.btnReset].forEach(function (b) { if (b) b.disabled = !!on; });
  }

  /* ================================================ Markdown ==== */

  var CJK = /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef]/;

  function inline(t) {
    t = esc(t);
    var codes = [];
    t = t.replace(/`([^`]+)`/g, function (_, c) {
      codes.push(c);
      return '\u0000' + (codes.length - 1) + '\u0000';
    });
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">');
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(?<![*\w])\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
    t = t.replace(/\u0000(\d+)\u0000/g, function (_, i) { return '<code>' + codes[+i] + '</code>'; });
    return t;
  }

  function codeAttr(lang) {
    return lang ? ' class="language-' + esc(lang) + '"' : '';
  }

  function joinPara(lines) {
    var s = '';
    for (var i = 0; i < lines.length; i++) {
      if (i) {
        var a = lines[i - 1].slice(-1), b = lines[i].charAt(0);
        if (!(CJK.test(a) && CJK.test(b))) s += ' ';
      }
      s += lines[i];
    }
    return inline(s);
  }

  function mdToHtml(md) {
    var lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
    var out = [], buf = [], mode = null;

    function flush() {
      if (!buf.length) { mode = null; return; }
      if (mode === 'p') {
        out.push('<p>' + joinPara(buf) + '</p>');
      } else if (mode === 'ul' || mode === 'ol') {
        out.push('<' + mode + '>' + buf.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</' + mode + '>');
      } else if (mode === 'quote') {
        out.push('<blockquote>' + buf.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</blockquote>');
      }
      buf = []; mode = null;
    }

    var inCode = false, codeBuf = [], codeLang = '';

    for (var i = 0; i < lines.length; i++) {
      var raw = lines[i], line = raw.replace(/\s+$/, '');

      if (line.replace(/^\s+/, '').slice(0, 3) === '```') {
        if (!inCode) {
          flush();
          inCode = true; codeBuf = []; codeLang = line.trim().slice(3).trim();
        } else {
          out.push('<pre><code' + codeAttr(codeLang) + '>' + esc(codeBuf.join('\n')) + '</code></pre>');
          inCode = false; codeLang = '';
        }
        continue;
      }
      if (inCode) { codeBuf.push(raw); continue; }

      if (!line.trim()) { flush(); continue; }

      var m = /^(#{1,6})\s+(.*)$/.exec(line);
      if (m) {
        flush();
        var lvl = Math.min(m[1].length + 1, 6);   // # → h2，h1 留给文章标题
        out.push('<h' + lvl + '>' + inline(m[2].trim()) + '</h' + lvl + '>');
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        if (mode !== 'ul') { flush(); mode = 'ul'; }
        buf.push(inline(line.replace(/^\s*[-*+]\s+/, '')));
        continue;
      }
      if (/^\s*\d+[.)]\s+/.test(line)) {
        if (mode !== 'ol') { flush(); mode = 'ol'; }
        buf.push(inline(line.replace(/^\s*\d+[.)]\s+/, '')));
        continue;
      }
      if (/^\s*>/.test(line)) {
        if (mode !== 'quote') { flush(); mode = 'quote'; }
        buf.push(inline(line.replace(/^\s*>\s?/, '')));
        continue;
      }
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flush(); out.push('<hr>'); continue; }

      if (mode !== 'p') { flush(); mode = 'p'; }
      buf.push(line.trim());
    }

    if (inCode && codeBuf.length) out.push('<pre><code' + codeAttr(codeLang) + '>' + esc(codeBuf.join('\n')) + '</code></pre>');
    flush();

    return out.map(function (x) { return '        ' + x; }).join('\n');
  }

  /* --- HTML → Markdown（只认我们自己产出的那几种结构） --- */

  function inlineFrom(node) {
    var out = '';
    Array.prototype.forEach.call(node.childNodes, function (n) {
      if (n.nodeType === 3) { out += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      var t = n.tagName.toLowerCase();
      if (t === 'strong' || t === 'b') out += '**' + inlineFrom(n).trim() + '**';
      else if (t === 'em' || t === 'i') out += '*' + inlineFrom(n).trim() + '*';
      else if (t === 'code') out += '`' + n.textContent + '`';
      else if (t === 'a') out += '[' + inlineFrom(n).trim() + '](' + (n.getAttribute('href') || '') + ')';
      else if (t === 'img') out += '![' + (n.getAttribute('alt') || '') + '](' + (n.getAttribute('src') || '') + ')';
      else if (t === 'br') out += ' ';
      else out += inlineFrom(n);
    });
    return out.replace(/\s+/g, ' ').trim();
  }

  function mdFromHtml(container) {
    var blocks = [];
    Array.prototype.forEach.call(container.children, function (el2) {
      var tag = el2.tagName.toLowerCase();
      if (tag === 'p') {
        var kids = el2.children;
        if (kids.length === 1 && kids[0].tagName === 'IMG') {
          blocks.push('![' + (kids[0].getAttribute('alt') || '') + '](' + (kids[0].getAttribute('src') || '') + ')');
        } else {
          blocks.push(inlineFrom(el2));
        }
      } else if (/^h[1-6]$/.test(tag)) {
        var lvl = Math.max(1, parseInt(tag.slice(1), 10) - 1);
        blocks.push(new Array(lvl + 1).join('#') + ' ' + inlineFrom(el2));
      } else if (tag === 'ul' || tag === 'ol') {
        blocks.push(Array.prototype.map.call(el2.children, function (li, i) {
          return (tag === 'ol' ? (i + 1) + '. ' : '- ') + inlineFrom(li);
        }).join('\n'));
      } else if (tag === 'blockquote') {
        blocks.push(Array.prototype.map.call(el2.children, function (p) {
          return '> ' + inlineFrom(p);
        }).join('\n'));
      } else if (tag === 'pre') {
        var codeEl = el2.querySelector('code');
        var cm = codeEl ? /language-([a-zA-Z0-9_+-]+)/.exec(codeEl.className || '') : null;
        blocks.push('```' + (cm ? cm[1] : '') + '\n' + el2.textContent.replace(/\s+$/, '') + '\n```');
      } else if (tag === 'hr') {
        blocks.push('---');
      } else if (tag === 'img') {
        blocks.push('![' + (el2.getAttribute('alt') || '') + '](' + (el2.getAttribute('src') || '') + ')');
      } else {
        blocks.push(inlineFrom(el2));
      }
    });
    return blocks.join('\n\n');
  }

  /* ========================================= 解析 / 生成文章 ==== */

  var PAGE = [
    '<!doctype html>',
    '<html lang="zh-CN">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width,initial-scale=1">',
    '  <meta name="theme-color" content="#ffb6d5">',
    '  <title>__TITLE__ · \u7a7a\u51db · Rinsora \u7684\u5c0f\u7a9d</title>',
    '  <meta name="description" content="__SUMMARY__">',
    '  <link rel="canonical" href="__URL__">',
    '  <meta property="og:type" content="article">',
    '  <meta property="og:site_name" content="\u7a7a\u51db \u00b7 Rinsora \u7684\u5c0f\u7a9d">',
    '  <meta property="og:title" content="__TITLE__ \u00b7 \u7a7a\u51db \u00b7 Rinsora \u7684\u5c0f\u7a9d">',
    '  <meta property="og:description" content="__SUMMARY__">',
    '  <meta property="og:url" content="__URL__">',
    '  <meta property="og:image" content="https://rinsora.dpdns.org/apple-touch-icon.png">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  <link rel="icon" href="../favicon.ico" sizes="any">',
    '  <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">',
    '  <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">',
    '  <link rel="stylesheet" href="../style.css">',
    '  <link rel="stylesheet" href="post.css">',
    '</head>',
    '<body>',
    "  <script>try{if(localStorage.getItem('rinsora-theme')==='night'){document.documentElement.classList.add('night');document.body.classList.add('night')}}catch(e){}</" + 'script>',
    '',
    '  <div class="bg-decor" aria-hidden="true">',
    '    <span class="blob blob-a"></span><span class="blob blob-b"></span><span class="blob blob-c"></span>',
    '    <span class="spark s1">\u2726</span><span class="spark s2">\u2727</span><span class="spark s3">\u2726</span><span class="spark s4">\u2727</span>',
    '  </div>',
    '  <div class="screen-grain" aria-hidden="true"></div>',
    '',
    '  <main class="post-wrap">',
    '    <article class="post-card glass">',
    '      <div class="post-top">',
    '        <a class="post-back" href="../index.html#blog">\u2190 \u56de\u5230\u535a\u5ba2\u5217\u8868</a>',
    '        <span class="post-brand">空凛 / Rinsora</span>',
    '      </div>',
    '',
    '      <p class="post-kicker">__KICKER__</p>',
    '      <h1 class="post-title">__TITLE__</h1>',
    '      <p class="post-meta">',
    '        <span class="date">__DATE__</span>',
    '        <span class="dot"></span><span>\u7a7a\u51db / Rinsora</span>',
    '        <span class="dot"></span><span>__READING__</span>',
    '      </p>',
    '      <hr class="post-divider">',
    '',
    '      <div class="post-body">',
    '__BODY__',
    '      </div>',
    '',
    '      <div class="post-footer">',
    '        <div class="post-tags">__TAGS__</div>',
    '        <a class="enter-btn" href="../index.html#blog"><span>\u770b\u66f4\u591a\u6587\u7ae0</span><span class="enter-arrow">\u2192</span></a>',
    '      </div>',
    '    </article>',
    '  </main>',
    '',
    '  <audio id="audio" preload="metadata"></audio>',
    '  <aside id="floatingPlayer" aria-label="音乐播放器"></aside>',
    '  <script src="../gh-api.js"></' + 'script>',
    '  <script src="../music-data.js"></' + 'script>',
    '  <script src="../music.js"></' + 'script>',
    '  <script src="../music-upload.js"></' + 'script>',
    '</body>',
    '</html>',
    ''
  ].join('\n');

  function plainFromMd(md, limit) {
    limit = limit || 46;
    var t = String(md || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/^[ \t]*([-*+>]\s+|\d+[.)]\s+|#{1,6}\s+)/gm, '')
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*`_]/g, '')
      .replace(/[ \t]+/g, '')
      .replace(/\s+/g, '')
      .trim();
    if (t.length > limit) t = t.slice(0, limit) + '\u2026\u2026';
    return t;
  }

  function readingTime(md) {
    var n = String(md || '').replace(/```[\s\S]*?```/g, '').replace(/\s+/g, '').length;
    return '\u7ea6 ' + Math.max(1, Math.round(n / 300)) + ' \u5206\u949f';
  }

  function buildPage(f) {
    var tags = f.tags.length
      ? f.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('')
      : '<span>\u968f\u7b14</span>';
    return PAGE
      .replace('__TITLE__', esc(f.title))
      .replace('__TITLE__', esc(f.title))
      .replace('__SUMMARY__', esc(f.summary))
      .replace('__URL__', SITE + '/posts/' + f.slug + '.html')
      .replace('__KICKER__', esc(f.kicker))
      .replace('__DATE__', esc(f.date))
      .replace('__READING__', readingTime(f.md))
      .replace('__BODY__', mdToHtml(f.md))
      .replace('__TAGS__', tags);
  }

  /* \u5206\u7c7b = kicker \u659c\u6760\u540e\u9762\u90a3\u4e00\u6bb5(BLOG / \u5de5\u4f5c\u6d41 -> \u5de5\u4f5c\u6d41)
     \u9996\u9875\u5361\u7247\u4e0a\u7684 data-cat \u7528\u7684\u5c31\u662f\u5b83,\u5206\u7c7b\u7b5b\u9009\u6761\u4f1a\u81ea\u52a8\u591a\u51fa\u6765\u4e00\u9879 */
  function catOf(f) {
    var s = String(f.kicker || '').split('/');
    return String(s[s.length - 1] || '').trim() || '\u968f\u7b14';
  }

  /* \u5361\u7247\u4e0a\u53ea\u8981\u6570\u5b57 (\u7ea6 3 \u5206\u949f -> 3 min) */
  function minOf(f) {
    var m = /(\d+)/.exec(readingTime(f.md));
    return m ? m[1] : '1';
  }

  function parsePost(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var q = function (s) { return doc.querySelector(s); };
    var metaDesc = q('meta[name=description]');
    var body = q('.post-body');
    return {
      title: q('.post-title') ? q('.post-title').textContent.trim() : '',
      kicker: q('.post-kicker') ? q('.post-kicker').textContent.trim() : 'BLOG / \u968f\u7b14',
      date: q('.post-meta .date') ? q('.post-meta .date').textContent.trim() : today(),
      summary: metaDesc ? (metaDesc.getAttribute('content') || '') : '',
      tags: Array.prototype.map.call(doc.querySelectorAll('.post-tags span'), function (s) {
        return s.textContent.trim();
      }).filter(Boolean),
      md: body ? mdFromHtml(body) : ''
    };
  }

  /* ------------------------------------------ index.html 卡片同步 --- */

  function cdateOf(line) {
    var m = /<span class="date">(\d{4})\.(\d{2})\.(\d{2})<\/span>/.exec(line);
    return m ? m[1] + m[2] + m[3] : '00000000';
  }

  function cardLine(slug, title, date, summary, cat, min) {
    cat = cat || '\u968f\u7b14';
    min = min || '1';
    return '            <article class="blog-card card" data-cat="' + esc(cat) + '" data-min="' + esc(min) + '">' +
      '<span class="date">' + esc(date) + '</span>' +
      '<h4><a class="card-title-link" href="posts/' + slug + '.html">' + esc(title) + '</a></h4>' +
      '<p>' + esc(summary) + '</p>' +
      '<div class="blog-foot"><span class="bm-cat">' + esc(cat) + '</span>' +
      '<span class="bm-min">' + esc(min) + ' min</span>' +
      '<a class="read-more" href="posts/' + slug + '.html">READ MORE \u2192</a></div></article>';
  }

  function findGrid(lines) {
    var start = -1;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf('<div class="blog-grid">') !== -1) { start = i; break; }
    }
    if (start === -1) return null;
    for (var j = start + 1; j < lines.length; j++) {
      if (/^\s*<\/div>\s*$/.test(lines[j])) return { start: start, end: j };
    }
    return null;
  }

  function upsertCard(html, slug, title, date, summary, cat, min) {
    var lines = html.split('\n');
    var g = findGrid(lines);
    if (!g) return null;

    var cards = lines.slice(g.start + 1, g.end).filter(function (l) {
      return l.indexOf('<article class="blog-card card">') !== -1;
    }).filter(function (l) {
      return l.indexOf('posts/' + slug + '.html') === -1;
    });

    var fresh = cardLine(slug, title, date, summary, cat, min);
    var items = cards.map(function (l) { return { d: cdateOf(l), n: 0, l: l }; });
    items.push({ d: cdateOf(fresh), n: 1, l: fresh });
    items.sort(function (a, b) {
      if (a.d !== b.d) return a.d < b.d ? 1 : -1;
      return b.n - a.n;
    });

    return lines.slice(0, g.start + 1)
      .concat(items.map(function (x) { return x.l; }))
      .concat(lines.slice(g.end))
      .join('\n');
  }

  /* ================================================== 设置面板 ==== */

  function fillCfg() {
    var c = GH.loadCfg();
    el.cfgOwner.value = c.owner;
    el.cfgRepo.value = c.repo;
    el.cfgBranch.value = c.branch;
    el.cfgToken.value = GH.token();
  }

  function showSetup(on) {
    el.setup.hidden = !on;
    if (on) fillCfg();
  }

  function saveCfg() {
    var t = el.cfgToken.value.trim();
    GH.saveCfg({
      owner: el.cfgOwner.value.trim(),
      repo: el.cfgRepo.value.trim(),
      branch: el.cfgBranch.value.trim() || 'main'
    });
    GH.setToken(t);

    if (!t) { say('\u5df2\u6e05\u7a7a Token\u3002', 'ok'); afterCfg(); return; }

    say('\u6b63\u5728\u6d4b\u8bd5\u8fde\u63a5\u2026', 'busy');
    GH.check().then(function (r) {
      if (!r.canPush) {
        say('\u8fde\u63a5\u6210\u529f\uff08' + r.fullName + '\uff09\uff0c\u4f46 Token \u6ca1\u6709\u5199\u6743\u9650\u2014\u2014' +
          '\u8bf7\u786e\u8ba4 Permissions \u2192 Contents \u9009\u4e86 Read and write\u3002', 'err');
      } else {
        say('\u8fde\u63a5\u6210\u529f\uff1a' + r.fullName + '\uff08\u9ed8\u8ba4\u5206\u652f ' + r.defaultBranch + '\uff09', 'ok');
      }
      afterCfg();
    }).catch(function (e) {
      say('\u8fde\u63a5\u5931\u8d25\uff1a' + e.message, 'err');
    });
  }

  function afterCfg() {
    var ok = GH.hasToken();
    el.btnSave.disabled = !ok;
    if (ok) { showSetup(false); loadList(); }
    else { showSetup(true); el.list.innerHTML = '<li class="side-empty">\u5148\u8fde\u63a5\u4ed3\u5e93\u3002</li>'; }
  }

  /* ================================================== 文章列表 ==== */

  function loadList() {
    el.list.innerHTML = '<li class="side-empty">\u8bfb\u53d6\u4e2d\u2026</li>';
    el.count.textContent = '\u2026';

    var cardsP = GH.getFile('index.html').then(function (f) {
      state.cards = {};
      if (!f) return;
      f.text.split('\n').forEach(function (line) {
        if (line.indexOf('<article class="blog-card card">') === -1) return;
        var m = /href="posts\/([^"]+)\.html"[^>]*>([^<]*)</.exec(line);
        if (!m) return;
        var d = /<span class="date">([^<]*)<\/span>/.exec(line);
        var s = /<\/h4><p>([^<]*)<\/p>/.exec(line);
        state.cards[m[1]] = {
          title: m[2],
          date: d ? d[1] : '',
          summary: s ? s[1] : ''
        };
      });
      return null;
    });

    return cardsP.then(function () {
      return GH.listDir('posts');
    }).then(function (items) {
      var files = items.filter(function (it) {
        return it.type === 'file' && /\.html$/i.test(it.name) && it.name.charAt(0) !== '_';
      }).map(function (it) { return it.name.replace(/\.html$/i, ''); });

      files.sort(function (a, b) {
        var da = (state.cards[a] || {}).date || '';
        var db = (state.cards[b] || {}).date || '';
        return db.localeCompare(da);
      });

      el.count.textContent = files.length;
      if (!files.length) {
        el.list.innerHTML = '<li class="side-empty">posts/ \u91cc\u8fd8\u6ca1\u6709\u6587\u7ae0\u3002</li>';
        return;
      }

      el.list.innerHTML = '';
      files.forEach(function (slug) {
        var c = state.cards[slug] || {};
        var li = d.createElement('li');
        li.className = 'post-item' + (slug === state.slug ? ' active' : '');
        li.dataset.slug = slug;
        li.innerHTML = '<span class="pi-title">' + esc(c.title || slug) + '</span>' +
          '<span class="pi-date">' + esc(c.date || '') + '</span>';
        li.addEventListener('click', function () { openPost(slug); });
        el.list.appendChild(li);
      });
    }).catch(function (e) {
      el.list.innerHTML = '<li class="side-empty">\u8bfb\u53d6\u5931\u8d25\uff1a' + esc(e.message) + '</li>';
      el.count.textContent = '!';
    });
  }

  /* ================================================== 打开文章 ==== */

  function setMode(editing) {
    el.badge.textContent = editing ? '\u7f16\u8f91\u4e2d' : '\u65b0\u5efa';
    el.badge.className = 'pane-badge' + (editing ? ' edit' : '');
    el.btnDelete.hidden = !editing;
    el.btnSave.textContent = editing ? '\u4fdd\u5b58\u4fee\u6539' : '\u4fdd\u5b58\u5e76\u53d1\u5e03';
  }

  function newPost() {
    state.slug = ''; state.existing = null;
    el.title.value = ''; el.slug.value = ''; el.date.value = today();
    el.kicker.value = 'BLOG / \u968f\u7b14';
    el.summary.value = ''; el.tags.value = '';
    el.body.value = '';
    setMode(false);
    say('\u65b0\u6587\u7ae0\u3002\u5199\u5b8c\u70b9\u201c\u4fdd\u5b58\u5e76\u53d1\u5e03\u201d\u3002');
    switchTab('write');
    Array.prototype.forEach.call(el.list.children, function (li) { li.classList.remove('active'); });
    el.title.focus();
  }

  function openPost(slug) {
    say('\u8bfb\u53d6 posts/' + slug + '.html \u2026', 'busy');
    GH.getFile('posts/' + slug + '.html').then(function (f) {
      if (!f) throw new Error('\u627e\u4e0d\u5230\u8fd9\u7bc7\u6587\u7ae0');
      var p = parsePost(f.text);
      state.slug = slug; state.existing = f.sha;
      el.title.value = p.title;
      el.slug.value = slug;
      el.date.value = p.date || today();
      el.kicker.value = p.kicker;
      el.summary.value = p.summary;
      el.tags.value = p.tags.join(', ');
      el.body.value = p.md;
      setMode(true);
      switchTab('write');
      say('\u5df2\u8f7d\u5165\u3002\u6539\u5b8c\u70b9\u201c\u4fdd\u5b58\u4fee\u6539\u201d\u3002');
      Array.prototype.forEach.call(el.list.children, function (li) {
        li.classList.toggle('active', li.dataset.slug === slug);
      });
    }).catch(function (e) {
      say('\u6253\u5f00\u5931\u8d25\uff1a' + e.message, 'err');
    });
  }

  /* ====================================================== 保存 ==== */

  function slugify(raw, title, date) {
    var s = String(raw || '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
    if (s) return s;
    var t = String(title || '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
    return t || ('post-' + String(date || '').replace(/\./g, '-'));
  }

  function collect() {
    var md = el.body.value.trim();
    var title = el.title.value.trim();
    if (!title) throw new Error('\u6807\u9898\u4e0d\u80fd\u4e3a\u7a7a');
    var date = el.date.value.trim() || today();
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(date)) throw new Error('\u65e5\u671f\u683c\u5f0f\u5e94\u8be5\u662f 2026.09.21');
    if (!md) throw new Error('\u6b63\u6587\u8fd8\u662f\u7a7a\u7684');

    var slug = slugify(el.slug.value.trim(), title, date);
    if (state.slug && slug !== state.slug) {
      throw new Error('\u4fdd\u5b58\u5df2\u6709\u6587\u7ae0\u65f6\u4e0d\u8981\u6539\u6587\u4ef6\u540d\uff08' + state.slug + '\uff09\uff0c' +
        '\u4e0d\u7136\u4f1a\u53d8\u6210\u65b0\u5efa\u4e00\u7bc7');
    }

    var tags = el.tags.value.split(/[,，\s]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    var summary = el.summary.value.trim() || plainFromMd(md);
    if (!summary) summary = '\u70b9\u8fdb\u6765\u770b\u770b \u2192';

    return {
      title: title, slug: slug, date: date,
      kicker: el.kicker.value.trim() || 'BLOG / \u968f\u7b14',
      tags: tags.length ? tags : ['\u968f\u7b14'],
      summary: summary, md: md
    };
  }

  function save() {
    var f;
    try { f = collect(); }
    catch (e) { say(e.message, 'err'); toast(e.message, 'err'); return; }

    busy(true);
    say('\u6b63\u5728\u63d0\u4ea4\u5230 GitHub \u2026', 'busy');

    var postPath = 'posts/' + f.slug + '.html';
    var editing = !!state.slug;
    var html = buildPage(f);

    GH.getFile(postPath).then(function (cur) {
      if (editing && !cur) throw new Error('\u4ed3\u5e93\u91cc\u627e\u4e0d\u5230 ' + postPath + '\uff0c\u65e0\u6cd5\u4fdd\u5b58');
      return GH.putFile(postPath, html,
        (editing ? '\u66f4\u65b0\u6587\u7ae0\uff1a' : '\u53d1\u5e03\u6587\u7ae0\uff1a') + f.title,
        cur ? cur.sha : null);
    }).then(function () {
      say('\u6587\u7ae0\u5df2\u63d0\u4ea4\uff0c\u6b63\u5728\u66f4\u65b0\u9996\u9875\u5217\u8868 \u2026', 'busy');
      return GH.getFile('index.html');
    }).then(function (idx) {
      if (!idx) throw new Error('\u8bfb\u4e0d\u5230 index.html');
      var next = upsertCard(idx.text, f.slug, f.title, f.date, f.summary, catOf(f), minOf(f));
      if (!next) throw new Error('index.html \u91cc\u6ca1\u627e\u5230 .blog-grid\uff0c\u5361\u7247\u9700\u8981\u624b\u52a8\u52a0');
      if (next === idx.text) return null;
      return GH.putFile('index.html', next, '\u66f4\u65b0\u9996\u9875\u5361\u7247\uff1a' + f.title, idx.sha);
    }).then(function () {
      state.slug = f.slug;
      setMode(true);
      el.slug.value = f.slug;
      if (w.history && w.history.replaceState) {
        w.history.replaceState(null, '', 'editor.html?edit=' + encodeURIComponent(f.slug));
      }
      say('\u5df2\u63d0\u4ea4\u3002GitHub Pages \u5927\u7ea6 1 \u5206\u949f\u540e\u66f4\u65b0\u7ebf\u4e0a\u9875\u9762\u3002', 'ok');
      toast('\u300a' + f.title + '\u300b\u5df2\u63d0\u4ea4\u3002\u5927\u7ea6 1 \u5206\u949f\u540e\u7ebf\u4e0a\u751f\u6548\u3002', 'ok');
      return loadList();
    }).catch(function (e) {
      say('\u4fdd\u5b58\u5931\u8d25\uff1a' + e.message, 'err');
      toast('\u4fdd\u5b58\u5931\u8d25\uff1a' + e.message, 'err');
    }).then(function () { busy(false); });
  }

  function removePost() {
    if (!state.slug) return;
    var title = el.title.value.trim() || state.slug;
    if (!w.confirm('\u786e\u5b9a\u5220\u9664\u300a' + title + '\u300b\uff1f\n\n' +
      '\u4f1a\u4ece\u4ed3\u5e93\u5220\u6389 posts/' + state.slug + '.html\uff0c\u5e76\u4ece\u9996\u9875\u5217\u8868\u79fb\u9664\u5361\u7247\u3002\n' +
      '\u7ad9\u70b9\u4e0a\u4e0d\u53ef\u64a4\u9500\uff08git \u5386\u53f2\u91cc\u8fd8\u80fd\u627e\u56de\uff09\u3002')) return;

    var slug = state.slug;
    busy(true);
    say('\u6b63\u5728\u5220\u9664 \u2026', 'busy');

    GH.getFile('posts/' + slug + '.html').then(function (f) {
      if (!f) throw new Error('\u627e\u4e0d\u5230\u8fd9\u7bc7\u6587\u7ae0');
      return GH.delFile('posts/' + slug + '.html', '\u5220\u9664\u6587\u7ae0\uff1a' + title, f.sha);
    }).then(function () {
      return GH.getFile('index.html');
    }).then(function (idx) {
      if (!idx) throw new Error('\u8bfb\u4e0d\u5230 index.html');
      var next = idx.text.split('\n').filter(function (line) {
        if (line.indexOf('<article class="blog-card card">') === -1) return true;
        return line.indexOf('posts/' + slug + '.html') === -1;
      }).join('\n');
      if (next === idx.text) return null;
      return GH.putFile('index.html', next, '\u79fb\u9664\u9996\u9875\u5361\u7247\uff1a' + title, idx.sha);
    }).then(function () {
      toast('\u5df2\u5220\u9664\u3002\u5927\u7ea6 1 \u5206\u949f\u540e\u7ebf\u4e0a\u751f\u6548\u3002', 'ok');
      say('\u5df2\u5220\u9664 ' + slug + '\u3002', 'ok');
      newPost();
      return loadList();
    }).catch(function (e) {
      say('\u5220\u9664\u5931\u8d25\uff1a' + e.message, 'err');
      toast('\u5220\u9664\u5931\u8d25\uff1a' + e.message, 'err');
    }).then(function () { busy(false); });
  }

  /* ==================================================== 图片 ==== */

  function imgName(orig) {
    var n = new Date();
    var p = function (x) { return (x < 10 ? '0' : '') + x; };
    var stamp = '' + n.getFullYear() + p(n.getMonth() + 1) + p(n.getDate()) + '-' +
      p(n.getHours()) + p(n.getMinutes()) + p(n.getSeconds());
    var ext = (/\.([a-zA-Z0-9]+)$/.exec(orig || '') || [null, 'png'])[1].toLowerCase();
    var base = String(orig || '').replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
    return stamp + (base ? '-' + base : '') + '.' + ext;
  }

  function insertAtCursor(text) {
    var ta = el.body;
    var s = ta.selectionStart, e = ta.selectionEnd;
    if (ta.setRangeText) {
      ta.setRangeText(text, s, e, 'end');
      ta.setSelectionRange(s + text.length, s + text.length);
    } else {
      ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
    }
    ta.focus();
  }

  function uploadImages(files) {
    var list = Array.prototype.slice.call(files).filter(function (f) { return /^image\//.test(f.type); });
    if (!list.length) return;

    busy(true);
    say('\u6b63\u5728\u4e0a\u4f20 ' + list.length + ' \u5f20\u56fe\u7247 \u2026', 'busy');

    var paths = [];
    list.reduce(function (chain, file) {
      return chain.then(function () {
        var name = imgName(file.name);
        var path = 'assets/blog/' + name;
        var alt = file.name.replace(/\.[^.]+$/, '');
        return file.arrayBuffer().then(function (buf) {
          return GH.getFile(path).then(function (exist) {
            return GH.putBinary(path, buf, '\u4e0a\u4f20\u535a\u5ba2\u914d\u56fe\uff1a' + name, exist ? exist.sha : null);
          });
        }).then(function () {
          paths.push('../' + path);
          insertAtCursor('\n\n![' + alt + '](../' + path + ')\n\n');
        });
      });
    }, Promise.resolve())
      .then(function () {
        say('\u56fe\u7247\u5df2\u4e0a\u4f20\u5e76\u63d2\u5165\u6b63\u6587\uff08\u5171 ' + paths.length + ' \u5f20\uff09\u3002', 'ok');
        toast('\u56fe\u7247\u5df2\u63d2\u5165\u3002\u521a\u4e0a\u4f20\u7684\u56fe\u5728 Pages \u90e8\u7f72\u5b8c\u6210\u540e\u624d\u80fd\u770b\u5230\u3002', 'ok');
      })
      .catch(function (e) {
        say('\u56fe\u7247\u4e0a\u4f20\u5931\u8d25\uff1a' + e.message, 'err');
        toast('\u56fe\u7247\u4e0a\u4f20\u5931\u8d25\uff1a' + e.message, 'err');
      })
      .then(function () { busy(false); });
  }

  /* ============================================ 预览与工具条 ==== */

  function switchTab(name) {
    Array.prototype.forEach.call(d.querySelectorAll('.pane-tabs .tab'), function (t) {
      t.classList.toggle('active', t.dataset.tab === name);
    });
    var preview = name === 'preview';
    el.body.hidden = preview;
    el.previewBox.hidden = !preview;
    if (preview) renderPreview();
  }

  function renderPreview() {
    var md = el.body.value.trim();
    if (!md) { el.previewBox.innerHTML = '<p class="md-empty">\u6b63\u6587\u8fd8\u662f\u7a7a\u7684\u3002</p>'; return; }
    el.previewBox.innerHTML = mdToHtml(md).replace(/src="\.\.\//g, 'src="').replace(/href="\.\.\//g, 'href="');
  }

  function wrapSel(before, after, ph) {
    var ta = el.body;
    var s = ta.selectionStart, e = ta.selectionEnd;
    var sel = ta.value.slice(s, e) || ph || '';
    var text = before + sel + after;
    ta.setRangeText(text, s, e, 'end');
    ta.focus();
    ta.setSelectionRange(s + before.length, s + before.length + sel.length);
  }

  function prefixLine(prefix) {
    var ta = el.body;
    var s = ta.selectionStart;
    var head = ta.value.lastIndexOf('\n', s - 1) + 1;
    ta.setRangeText(prefix, head, head, 'end');
    ta.focus();
  }

  function runTpl(kind) {
    if (kind === 'h2') prefixLine('## ');
    else if (kind === 'h3') prefixLine('### ');
    else if (kind === 'b') wrapSel('**', '**', '\u7c97\u4f53');
    else if (kind === 'i') wrapSel('*', '*', '\u659c\u4f53');
    else if (kind === 'code') wrapSel('`', '`', 'code');
    else if (kind === 'ul') prefixLine('- ');
    else if (kind === 'quote') prefixLine('> ');
    else if (kind === 'hr') insertAtCursor('\n\n---\n\n');
    else if (kind === 'pre') insertAtCursor('\n\n```\n' + '\u4ee3\u7801\u5199\u5728\u8fd9\u91cc\n' + '```\n\n');
    else if (kind === 'link') wrapSel('[', '](https://)', '\u94fe\u63a5\u6587\u5b57');
  }

  /* ====================================================== 绑定 ==== */

  function bind() {
    el.btnSetup.addEventListener('click', function () { showSetup(el.setup.hidden); });
    el.btnSaveCfg.addEventListener('click', saveCfg);
    el.btnForget.addEventListener('click', function () {
      GH.setToken('');
      el.cfgToken.value = '';
      say('Token \u5df2\u6e05\u9664\uff0c\u7ba1\u7406\u5165\u53e3\u5df2\u5173\u95ed\u3002', 'ok');
      afterCfg();
    });

    el.btnNew.addEventListener('click', newPost);
    el.btnSave.addEventListener('click', save);
    el.btnReset.addEventListener('click', function () {
      if (!w.confirm('\u6e05\u7a7a\u5f53\u524d\u8868\u5355\uff1f\uff08\u4e0d\u4f1a\u5220\u9664\u5df2\u53d1\u5e03\u7684\u6587\u7ae0\uff09')) return;
      newPost();
    });
    el.btnDelete.addEventListener('click', removePost);

    Array.prototype.forEach.call(d.querySelectorAll('.pane-tabs .tab'), function (t) {
      t.addEventListener('click', function () { switchTab(t.dataset.tab); });
    });

    Array.prototype.forEach.call(d.querySelectorAll('.md-toolbar button[data-md]'), function (b) {
      b.addEventListener('click', function () { runTpl(b.dataset.md); });
    });

    el.imgFile.addEventListener('change', function () {
      uploadImages(el.imgFile.files);
      el.imgFile.value = '';
    });

    /* 拖拽 / 粘贴图片 */
    ['dragover', 'drop'].forEach(function (ev) {
      el.body.addEventListener(ev, function (e) {
        e.preventDefault();
        if (ev === 'drop' && e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          uploadImages(e.dataTransfer.files);
        }
      });
    });
    el.body.addEventListener('paste', function (e) {
      var items = (e.clipboardData && e.clipboardData.items) || [];
      var files = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          var f = items[i].getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length) { e.preventDefault(); uploadImages(files); }
    });

    /* 自动补 slug */
    el.title.addEventListener('blur', function () {
      if (!el.slug.value.trim() && !state.slug) {
        el.slug.value = slugify('', el.title.value.trim(), el.date.value.trim() || today());
      }
    });
    el.date.addEventListener('focus', function () {
      if (!el.date.value.trim()) el.date.value = today();
    });

    /* Ctrl/Cmd + S 保存 */
    d.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (!el.btnSave.disabled) save();
      }
    });
  }

  /* ====================================================== 启动 ==== */

  bind();
  if (!el.date.value) el.date.value = today();

  afterCfg();

  var m = /[?&]edit=([^&]+)/.exec(w.location.search);
  if (m && GH.hasToken()) {
    openPost(decodeURIComponent(m[1]));
  } else if (!GH.hasToken()) {
    showSetup(true);
    say('\u5148\u586b\u4e0a Token\uff0c\u7136\u540e\u5c31\u80fd\u5728\u8fd9\u91cc\u5199\u4e1c\u897f\u4e86\u3002');
  }
  /* 暴露出来，方便在控制台调试或做回归测试 */
  w.RinsoraEditor = {
    mdToHtml: mdToHtml, mdFromHtml: mdFromHtml, parsePost: parsePost,
    buildPage: buildPage, upsertCard: upsertCard, slugify: slugify,
    plainFromMd: plainFromMd
  };
})(window, document);
