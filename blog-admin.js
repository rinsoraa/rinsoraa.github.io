/* ============================================================
   blog-admin.js —— 首页的「写作台」入口
   配过 Token 后：博客标题旁出现「＋ 写一篇」，每张卡片右上角出现编辑 / 删除按钮。
   没配 Token 时这些全都不挂载（普通访客什么也看不到），但仍保留
   #admin / Ctrl+Shift+E / 连点三下小标题 这几个入口，用来进写作台配 Token。
   ============================================================ */
(function (w, d) {
  'use strict';
  var GH = w.GH;                /* 可能为 undefined，下面都做了防御 */

  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

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
    toastTimer = setTimeout(function () {
      toastEl.className = 'blog-toast';
    }, type === 'err' ? 7000 : 3800);
  }

  /* ----------------------------------------------------- 卡片工具 ---- */

  function slugOf(card) {
    var a = $('.card-title-link', card);
    if (!a) return '';
    var m = /posts\/([^/?#]+)\.html/.exec(a.getAttribute('href') || '');
    return m ? decodeURIComponent(m[1]) : '';
  }

  function titleOf(card) {
    var a = $('.card-title-link', card);
    return a ? a.textContent.trim() : '';
  }

  /* 卡片在 index.html 里是「一行一张」，所以按行剔除最稳 */
  function dropCardLine(html, slug) {
    return html.split('\n').filter(function (line) {
      if (line.indexOf('<article class="blog-card card">') === -1) return true;
      return line.indexOf('posts/' + slug + '.html') === -1;
    }).join('\n');
  }

  function removePost(card, slug, title, btn) {
    var ok = w.confirm('确定删除《' + title + '》？\n\n' +
      '\u00b7 会从仓库删掉 posts/' + slug + '.html\n' +
      '\u00b7 并从首页博客列表移除这张卡片\n\n' +
      '站点上不可撤销（git 历史里还能找回）。');
    if (!ok) return;

    btn.disabled = true;
    btn.classList.add('busy');
    toast('正在删除…');

    var postPath = 'posts/' + slug + '.html';

    w.GH.getFile(postPath).then(function (f) {
      if (!f) throw new Error('仓库里找不到 ' + postPath);
      return w.GH.delFile(postPath, '删除文章：' + title, f.sha);
    }).then(function () {
      return w.GH.getFile('index.html');
    }).then(function (idx) {
      if (!idx) throw new Error('读不到 index.html');
      var next = dropCardLine(idx.text, slug);
      if (next === idx.text) return null;          // 卡片本来就没写进首页
      return w.GH.putFile('index.html', next, '移除首页卡片：' + title, idx.sha);
    }).then(function () {
      card.classList.add('card-removing');
      setTimeout(function () { card.remove(); }, 340);
      toast('已删除。GitHub Pages 大约 1 分钟后更新线上页面。', 'ok');
    }).catch(function (e) {
      btn.disabled = false;
      btn.classList.remove('busy');
      toast('删除失败：' + e.message, 'err');
    });
  }

  /* --------------------------------------------------------- 挂载 ---- */

  function mount() {
    var admin = false;
    try { admin = !!(GH && GH.hasToken && GH.hasToken()); } catch (e) { admin = false; }
    if (!admin) return;                       // 访客 / 未加载 GH：静默退出，不留任何痕迹

    d.body.classList.add('blog-admin');

    /* 1. 博客标题旁的「＋ 写一篇」 */
    var heading = $('#blog .section-heading');
    if (heading && !$('.blog-add', heading)) {
      var add = d.createElement('button');
      add.type = 'button';
      add.className = 'blog-add';
      add.title = '打开写作台，发布新文章';
      add.innerHTML = '<b>＋</b><span>写一篇</span>';
      add.addEventListener('click', function () { w.location.href = 'editor.html'; });
      var lineEl = heading.querySelector('.line');
      if (lineEl) heading.insertBefore(add, lineEl);   // 贴在标题右边，分隔线跟在后面
      else heading.appendChild(add);
    }

    /* 2. 每张卡片右上角的编辑 / 删除 */
    $$('.blog-card').forEach(function (card) {
      if ($('.card-tools', card)) return;
      var slug = slugOf(card);
      if (!slug) return;

      var tools = d.createElement('div');
      tools.className = 'card-tools';

      var edit = d.createElement('button');
      edit.type = 'button';
      edit.className = 'card-tool tool-edit';
      edit.title = '编辑这篇';
      edit.setAttribute('aria-label', '编辑');
      edit.textContent = '\u270e';
      edit.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        w.location.href = 'editor.html?edit=' + encodeURIComponent(slug);
      });

      var del = d.createElement('button');
      del.type = 'button';
      del.className = 'card-tool tool-del';
      del.title = '删除这篇';
      del.setAttribute('aria-label', '删除');
      del.textContent = '\u2715';
      del.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        removePost(card, slug, titleOf(card), del);
      });

      tools.appendChild(edit);
      tools.appendChild(del);
      card.appendChild(tools);
    });

    /* 3. 从写作台回来时给个交代 */
    if (/[?&]saved=1/.test(w.location.search)) {
      toast('已提交到 GitHub，Pages 大约 1 分钟后生效。', 'ok');
    }
  }

  /* --------------------------------------- 写作台入口（不需要令牌）----
     「＋ 写一篇」只有配过令牌才会出现，可第一次总要有个地方进去配令牌。
     所以留三个对访客完全无害的口子（editor.html 本身没令牌什么也做不了）：
       1. 地址栏加 #admin / #write / #editor
       2. Ctrl + Shift + E（Mac 上是 Cmd + Shift + E）
       3. 连点三下「博客 / 随笔」这个小标题
     三个都只是跳到 editor.html，页面上看不出任何痕迹。
     （script.js 只管 #about / #blog / #projects，所以 #admin 不会和它撞车。）
  -------------------------------------------------------------------- */

  var EDITOR_PAGE = 'editor.html';

  function openEditor() { w.location.href = EDITOR_PAGE; }

  function fromHash() {
    var h = (w.location.hash || '').replace(/^#/, '').toLowerCase();
    if (h === 'admin' || h === 'write' || h === 'editor') openEditor();
  }

  function wireEntry() {
    fromHash();
    w.addEventListener('hashchange', fromHash);

    d.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
          String(e.key).toLowerCase() === 'e') {
        e.preventDefault();
        openEditor();
      }
    });

    /* 连点三下博客小标题 */
    var brand = $('#blog .section-heading h3') || $('#blog .section-heading');
    if (brand) {
      var hits = 0, timer = null;
      brand.addEventListener('click', function () {
        hits++;
        clearTimeout(timer);
        timer = setTimeout(function () { hits = 0; }, 700);
        if (hits >= 3) { hits = 0; clearTimeout(timer); openEditor(); }
      });
    }
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', function () { wireEntry(); mount(); });
  } else {
    wireEntry();
    mount();
  }
})(window, document);
