/* ============================================================
   projects.js —— 「项目展示」区
   ------------------------------------------------------------
   1) 把 projects-data.js 里的数据渲染成按大分类分组的树形列表。
      所有访客都看得到；某个大分类下一个项目都没有时，它不会出现。
   2) 浏览器里配过 Token 时，额外挂上「＋ 加一个」和每行的编辑 / 删除按钮，
      并把 #project / Ctrl+Shift+P / 连点三下小标题 作为无令牌入口。

   数据读写的工具函数挂在 window.RinsoraProjects 上，项目编辑台也会复用。
   （编辑台页面同样会加载本文件，那里没有 #projects，渲染和入口逻辑会自动跳过。）
   ============================================================ */
(function (w, d) {
  'use strict';

  var GH = w.GH;

  var DATA_PATH = 'projects-data.js';
  var EDITOR = 'project-editor.html';
  var CLOSED_KEY = 'rinsora-projects-closed';
  var DEFAULT_ICON = '\u2726';                     /* ✦ */

  /* --------------------------------------------------- 小工具 --- */

  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

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

  function isAdmin() {
    try { return !!(GH && GH.hasToken && GH.hasToken()); } catch (e) { return false; }
  }

  /* ----------------------------------------------- 数据读写 --- */

  var ORDER = ['id', 'name', 'category', 'url', 'desc', 'tags', 'icon', 'date'];

  var HEADER = [
    '/* ============================================================',
    '   projects-data.js —— 「项目展示」的数据源',
    '   ------------------------------------------------------------',
    '   这个文件由网页版「项目编辑台」（project-editor.html）自动维护，',
    '   也可以直接手改：只要保持下面那行赋值语句的形状就行。',
    '',
    '   字段说明',
    '     categories : 大分类的显示顺序。',
    '                  某个分类下面一个项目都没有时，页面上不会显示它。',
    '     items[]    : 项目列表，每项',
    '                    id       内部标识，保存后别改（删除 / 编辑靠它认人）',
    '                    name     项目名称',
    '                    category 所属大分类（写 categories 里的名字）',
    '                    url      点击跳转的链接，留空则不可点',
    '                    desc     一句话简介',
    '                    tags     小标签数组，会显示在预览卡片上',
    '                    icon     卡片左侧的图标（一个字符）',
    '                    date     添加日期',
    '   ============================================================ */',
    ''
  ].join('\n');

  /* 把 projects-data.js 的源码文本解析成对象 */
  function parse(text) {
    var t = String(text || '');
    var m = /^[ \t]*window\.RINSORA_PROJECTS[ \t]*=[ \t]*(\{[\s\S]*\})[ \t]*;[ \t]*$/m.exec(t);
    if (!m) {
      var i = t.indexOf('{'), j = t.lastIndexOf('}');
      if (i === -1 || j <= i) throw new Error('projects-data.js 里没找到数据对象');
      m = [null, t.slice(i, j + 1)];
    }
    var obj;
    try { obj = JSON.parse(m[1]); }
    catch (e) { throw new Error('projects-data.js 的内容不是合法 JSON，检查一下引号和逗号'); }
    if (!obj || typeof obj !== 'object') throw new Error('projects-data.js 的数据格式不对');
    if (!Array.isArray(obj.categories)) obj.categories = [];
    if (!Array.isArray(obj.items)) obj.items = [];
    return obj;
  }

  function cleanItem(raw) {
    raw = raw || {};
    var tags = Array.isArray(raw.tags) ? raw.tags : [];
    return {
      id: String(raw.id || '').trim(),
      name: String(raw.name || '').trim(),
      category: String(raw.category || '').trim(),
      url: String(raw.url || '').trim(),
      desc: String(raw.desc || '').trim(),
      tags: tags.map(function (t) { return String(t == null ? '' : t).trim(); }).filter(Boolean),
      icon: String(raw.icon || '').trim() || DEFAULT_ICON,
      date: String(raw.date || '').trim()
    };
  }

  /* 生成 projects-data.js 的完整源码（键的顺序固定，方便看 diff） */
  function serialize(data) {
    data = data || {};
    var out = {
      version: 1,
      categories: (data.categories || []).map(function (c) { return String(c); }),
      items: (data.items || []).map(function (raw) {
        var c = cleanItem(raw), o = {};
        ORDER.forEach(function (k) { o[k] = c[k]; });
        return o;
      })
    };
    return HEADER + 'window.RINSORA_PROJECTS = ' + JSON.stringify(out, null, 2) + ';\n';
  }

  /* 由项目名生成内部 id；纯中文名走时间戳兜底 */
  function slugId(name, taken) {
    taken = taken || [];
    var base = String(name || '')
      .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
    if (!base) base = 'p-' + Date.now().toString(36);
    var id = base, n = 2;
    while (taken.indexOf(id) !== -1) { id = base + '-' + (n++); }
    return id;
  }

  /* 当前页面的数据（含「数据里出现过但没列进 categories」的分类，补到末尾） */
  function read() {
    var x = w.RINSORA_PROJECTS;
    if (!x || typeof x !== 'object') return { version: 1, categories: [], items: [] };
    var cats = (Array.isArray(x.categories) ? x.categories : [])
      .map(function (c) { return String(c); }).filter(Boolean);
    var items = (Array.isArray(x.items) ? x.items : []).map(cleanItem);
    items.forEach(function (it) {
      if (it.category && cats.indexOf(it.category) === -1) cats.push(it.category);
    });
    return { version: 1, categories: cats, items: items };
  }

  /* ------------------------------------------- 单张项目卡 HTML --- */

  function itemHtml(raw) {
    var it = cleanItem(raw);
    var hasUrl = !!it.url;
    var ext = hasUrl ? '<i class="pt-ext">\u2197</i>' : '';
    var desc = it.desc ? '<span class="pt-desc">' + esc(it.desc) + '</span>' : '';
    var tags = it.tags.length
      ? '<span class="pt-tags">' + it.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</span>'
      : '';

    return '<li class="pt-item" data-id="' + esc(it.id) + '" data-name="' + esc(it.name) + '">' +
      '<a class="pt-link"' + (hasUrl ? ' href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer"' : '') + '>' +
        '<span class="pt-icon" aria-hidden="true">' + esc(it.icon) + '</span>' +
        '<span class="pt-info">' +
          '<span class="pt-name">' + esc(it.name || '未命名') + ext + '</span>' +
          desc + tags +
        '</span>' +
      '</a>' +
      '</li>';
  }

  /* -------------------------------------------------- 排序规则 ---
     全站统一的「最新在前」：
       ① 先比 date（YYYY.MM.DD 是定宽写法，直接字符串倒排就等于按时间倒排）
       ② 日期一样就看它在 items 数组里靠不靠后 —— 编辑台新增项目是 push 追加的，
          所以数组里越靠后的越新
     首页的「最新项目」和项目展示页都调这个函数，别在两处各写一份排序。
     不直接改 items 的顺序：数据文件保持追加顺序，排序只在渲染时发生。 */
  function newestFirst(list) {
    return (list || [])
      .map(function (it, i) { return { it: it, i: i }; })
      .sort(function (a, b) {
        var d = String(b.it.date || '').localeCompare(String(a.it.date || ''));
        return d !== 0 ? d : (b.i - a.i);
      })
      .map(function (x) { return x.it; });
  }

  w.RinsoraProjects = {
    DATA_PATH: DATA_PATH, HEADER: HEADER, DEFAULT_ICON: DEFAULT_ICON,
    esc: esc, today: today,
    parse: parse, serialize: serialize, cleanItem: cleanItem,
    slugId: slugId, read: read, itemHtml: itemHtml,
    newestFirst: newestFirst
  };

  /* ================================================== 首页部分 ====
     编辑台页面没有 #projects，下面全部跳过。
     ================================================================ */

  if (!$('#projects')) return;

  /* ------------------------------------------------- 折叠状态 --- */

  function closedList() {
    try {
      var v = JSON.parse(localStorage.getItem(CLOSED_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }

  function setClosed(list) {
    try { localStorage.setItem(CLOSED_KEY, JSON.stringify(list)); } catch (e) {}
  }

  /* ----------------------------------------------------- 渲染 --- */

  function groupOf(data) {
    return data.categories.map(function (name) {
      return {
        name: name,
        /* 分类内部再按「最新在前」排一遍：最近上传的项目排在这个分类的最上面 */
        items: newestFirst(data.items.filter(function (it) { return it.category === name; }))
      };
    }).filter(function (g) { return g.items.length > 0; });   /* 空分类不显示 */
  }

  function render() {
    var host = $('#projectTree');
    if (!host) return;

    var data = read();
    var groups = groupOf(data);

    if (!groups.length) {
      host.innerHTML = '<div class="pt-empty">' +
        (isAdmin() ? '还没有项目。点上面的「＋ 加一个」添加第一个 \u2726' : '项目整理中，晚点再来看看 \u2726') +
        '</div>';
      return;
    }

    var closed = closedList();

    host.innerHTML = groups.map(function (g, gi) {
      var open = closed.indexOf(g.name) === -1;              /* 默认展开 */
      return '<section class="pt-group pt-cat-' + (gi % 4) + (open ? ' open' : '') + '" data-cat="' + esc(g.name) + '">' +
        '<button class="pt-head" type="button" aria-expanded="' + (open ? 'true' : 'false') + '">' +
          '<span class="pt-caret" aria-hidden="true">\u25be</span>' +
          '<span class="pt-title">' + esc(g.name) + '</span>' +
          '<span class="pt-count">' + g.items.length + '</span>' +
          '<span class="pt-line" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="pt-body"><ul class="pt-list">' +
          g.items.map(itemHtml).join('') +
        '</ul></div>' +
      '</section>';
    }).join('');

    wireGroups(host);
    wireTools(host);
  }

  function wireGroups(host) {
    $$('.pt-head', host).forEach(function (head) {
      head.addEventListener('click', function () {
        var group = head.parentNode;
        var name = group.getAttribute('data-cat') || '';
        var open = group.classList.toggle('open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
        var closed = closedList().filter(function (c) { return c !== name; });
        if (!open) closed.push(name);
        setClosed(closed);
      });
    });
  }

  /* ------------------------------------------- 管理态：增删改 --- */

  function toast(msg, type) {
    var el = $('#ptToast');
    if (!el) {
      el = d.createElement('div');
      el.id = 'ptToast';
      el.className = 'blog-toast';
      d.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'blog-toast show' + (type ? ' t-' + type : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.className = 'blog-toast'; }, type === 'err' ? 7000 : 3800);
  }

  function removeItem(id, name, li) {
    var ok = w.confirm('确定删除项目「' + name + '」？\n\n' +
      '\u00b7 会从 projects-data.js 里移除这一条\n' +
      '\u00b7 你写的简介和标签一起消失\n\n' +
      '站点上不可撤销（git 历史里还能找回）。');
    if (!ok) return;

    var btn = $('.tool-del', li);
    if (btn) { btn.disabled = true; btn.classList.add('busy'); }
    toast('正在删除\u2026');

    GH.getFile(DATA_PATH).then(function (f) {
      if (!f) throw new Error('仓库里找不到 ' + DATA_PATH);
      var data = parse(f.text);
      var before = data.items.length;
      data.items = data.items.filter(function (it) { return String(it.id) !== id; });
      if (data.items.length === before) throw new Error('这条项目已经不在数据里了，刷新看看');
      return GH.putFile(DATA_PATH, serialize(data), '删除项目：' + name, f.sha);
    }).then(function () {
      toast('已删除。GitHub Pages 大约 1 分钟后更新线上页面。', 'ok');
      return reload();
    }).catch(function (e) {
      if (btn) { btn.disabled = false; btn.classList.remove('busy'); }
      toast('删除失败：' + e.message, 'err');
    });
  }

  function wireTools(host) {
    if (!isAdmin()) return;

    $$('.pt-item', host).forEach(function (li) {
      if ($('.pt-tools', li)) return;
      var id = li.getAttribute('data-id') || '';
      var name = li.getAttribute('data-name') || '未命名';

      var tools = d.createElement('div');
      tools.className = 'card-tools pt-tools';

      var edit = d.createElement('button');
      edit.type = 'button';
      edit.className = 'card-tool tool-edit';
      edit.title = '编辑这个项目';
      edit.setAttribute('aria-label', '编辑');
      edit.textContent = '\u270e';
      edit.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        w.location.href = EDITOR + '?edit=' + encodeURIComponent(id);
      });

      var del = d.createElement('button');
      del.type = 'button';
      del.className = 'card-tool tool-del';
      del.title = '删除这个项目';
      del.setAttribute('aria-label', '删除');
      del.textContent = '\u2715';
      del.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        removeItem(id, name, li);
      });

      tools.appendChild(edit);
      tools.appendChild(del);
      li.appendChild(tools);
    });
  }

  /* 重新从仓库拉一次数据再渲染（管理操作后保持最新） */
  function reload() {
    if (!GH || !GH.getFile) { render(); return Promise.resolve(); }
    return GH.getFile(DATA_PATH).then(function (f) {
      if (f) w.RINSORA_PROJECTS = parse(f.text);
      render();
    }).catch(function () { render(); });
  }

  /* ------------------------------------------------- 挂载 --- */

  function mount() {
    var admin = isAdmin();
    if (admin) d.body.classList.add('blog-admin');   /* 和博客共用同一套「管理态」样式钩子 */

    var heading = $('#projects .section-heading');
    if (admin && heading && !$('.proj-add', heading)) {
      var add = d.createElement('button');
      add.type = 'button';
      add.className = 'proj-add';
      add.title = '打开项目编辑台，添加一个项目';
      add.innerHTML = '<b>\uff0b</b><span>加一个</span>';
      add.addEventListener('click', function () { w.location.href = EDITOR; });
      var lineEl = heading.querySelector('.line');
      if (lineEl) heading.insertBefore(add, lineEl);   /* 贴在标题右边，分隔线跟在后面 */
      else heading.appendChild(add);
    }

    render();
    if (admin) reload();                             /* 有令牌时顺手拉一次仓库里的最新数据 */
  }

  /* --------------------------------- 项目编辑台入口（无需令牌）----
     和博客一样留几个对访客无害的口子：项目编辑台本身没令牌什么也做不了。
       1. 地址栏加 #project / #newproject
       2. Ctrl + Shift + P（Mac 上是 Cmd + Shift + P）
       3. 连点三下「项目展示」这个小标题
     （script.js 只管 #about / #blog / #projects，所以 #project 不会撞车。）
     ---------------------------------------------------------------- */

  function fromHash() {
    var h = (w.location.hash || '').replace(/^#/, '').toLowerCase();
    if (h === 'project' || h === 'newproject') w.location.href = EDITOR;
  }

  function wireEntry() {
    fromHash();
    w.addEventListener('hashchange', fromHash);
    d.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
          String(e.key).toLowerCase() === 'p') {
        e.preventDefault();
        w.location.href = EDITOR;
      }
    });
    var brand = $('#projects .section-heading h3');
    if (brand) {
      var hits = 0, timer = null;
      brand.addEventListener('click', function () {
        hits++;
        clearTimeout(timer);
        timer = setTimeout(function () { hits = 0; }, 700);
        if (hits >= 3) { hits = 0; clearTimeout(timer); w.location.href = EDITOR; }
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
