/* ============================================================
   project-editor.js —— 网页版「项目编辑台」
   ------------------------------------------------------------
   只读写一个文件：projects-data.js（读改写全靠 gh-api.js 走 GitHub Contents API）。
   填一个链接点「自动识别」，会依次尝试 GitHub API → Microlink → 公共抓取代理，
   把页面标题和简介带出来；不满意可以随便改。
   ============================================================ */
(function (w, d) {
  'use strict';

  var GH = w.GH;
  var RP = w.RinsoraProjects;
  if (!GH || !RP) return;

  var $ = function (s) { return d.querySelector(s); };

  var el = {
    btnNew: $('#btnNew'), btnSetup: $('#btnSetup'),
    setup: $('#setupPanel'),
    cfgOwner: $('#cfgOwner'), cfgRepo: $('#cfgRepo'), cfgBranch: $('#cfgBranch'), cfgToken: $('#cfgToken'),
    btnSaveCfg: $('#btnSaveCfg'), btnForget: $('#btnForget'), cfgStatus: $('#cfgStatus'),

    list: $('#projList'), count: $('#projCount'),
    badge: $('#modeBadge'),

    url: $('#fUrl'), name: $('#fName'), cat: $('#fCat'), icon: $('#fIcon'),
    desc: $('#fDesc'), tags: $('#fTags'),
    btnProbe: $('#btnProbe'), probeStatus: $('#probeStatus'), iconPicks: $('#iconPicks'),

    btnSave: $('#btnSave'), btnReset: $('#btnReset'), btnDelete: $('#btnDelete'),
    status: $('#saveStatus'), toast: $('#toast'),

    previewGroup: $('#previewGroup'), previewCat: $('#previewCat'), previewList: $('#previewList')
  };

  var CAT_ICON = { 'Github项目': '\u2726', 'Minecraft': '\u26cf', 'Bot': '\ud83e\udd16', '其他': '\u25c6' };
  var ICON_PICKS = ['\u2726', '\u26cf', '\ud83e\udd16', '\u2661', '\u2605', '\u25b2', '\u25cf', '\u25c6',
                    '\u2727', '\u2699', '\ud83c\udf38', '\ud83c\udfae', '\ud83e\udde9', '\ud83d\udce6',
                    '\ud83c\udf31', '\ud83d\udd27'];

  var state = { id: '', existing: false, data: null, sha: null,
                cat: '', newCats: [], iconAuto: true };

  /* ====================================================== 工具 ==== */

  function say(msg, type) {
    el.status.textContent = msg || '';
    el.status.className = 'pane-status' + (type ? ' ' + type : '');
  }

  function setProbe(msg, type) {
    el.probeStatus.textContent = msg || '';
    el.probeStatus.className = 'pe-hint' + (type ? ' ' + type : '');
  }

  function toast(msg, type) {
    el.toast.textContent = msg;
    el.toast.className = 'editor-toast show' + (type ? ' t-' + type : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.toast.className = 'editor-toast'; }, type === 'err' ? 8000 : 4200);
  }

  function busy(on) {
    [el.btnSave, el.btnDelete, el.btnReset, el.btnProbe].forEach(function (b) {
      if (b) b.disabled = !!on;
    });
  }

  function catsOf() {
    var cats = ((state.data && state.data.categories) || []).slice();
    (state.newCats || []).forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); });
    return cats;
  }

  function findItem(id) {
    var items = (state.data && state.data.items) || [];
    for (var i = 0; i < items.length; i++) if (String(items[i].id) === String(id)) return items[i];
    return null;
  }

  /* ============================================ 设置面板 ==== */

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

    if (!t) { say('已清空 Token。', 'ok'); afterCfg(); return; }

    say('正在测试连接…', 'busy');
    GH.check().then(function (r) {
      if (!r.canPush) {
        say('连接成功（' + r.fullName + '），但 Token 没有写权限——' +
          '请确认 Permissions → Contents 选了 Read and write。', 'err');
      } else {
        say('连接成功：' + r.fullName + '（默认分支 ' + r.defaultBranch + '）', 'ok');
      }
      afterCfg();
    }).catch(function (e) {
      say('连接失败：' + e.message, 'err');
    });
  }

  /* ============================================ 数据读取 ==== */

  function loadData() {
    return GH.getFile(RP.DATA_PATH).then(function (f) {
      if (!f) throw new Error('仓库里找不到 ' + RP.DATA_PATH + '，先把站点文件推上去');
      state.data = RP.parse(f.text);
      state.sha = f.sha;
      w.RINSORA_PROJECTS = state.data;             /* 顺手刷新页面里的数据 */
      return state.data;
    });
  }

  /* ============================================ 左侧列表 ==== */

  function renderList() {
    if (!state.data) return;
    var items = state.data.items || [];
    el.count.textContent = items.length;

    if (!items.length) {
      el.list.innerHTML = '<li class="side-empty">还没有项目，右边填一个吧。</li>';
      return;
    }

    var order = catsOf();
    el.list.innerHTML = '';
    order.forEach(function (c) {
      var group = items.filter(function (it) { return it.category === c; });
      if (!group.length) return;

      var head = d.createElement('li');
      head.className = 'pe-sub';
      head.textContent = c;
      el.list.appendChild(head);

      group.forEach(function (it) {
        var c2 = RP.cleanItem(it);
        var li = d.createElement('li');
        li.className = 'post-item' + (String(it.id) === String(state.id) ? ' active' : '');
        li.dataset.id = it.id;
        li.innerHTML = '<span class="pi-title">' + RP.esc(c2.icon) + ' ' + RP.esc(c2.name || it.id) + '</span>' +
          '<span class="pi-date">' + RP.esc(c2.category) + '</span>';
        li.addEventListener('click', function () { openItem(it.id); });
        el.list.appendChild(li);
      });
    });
  }

  function markActive() {
    Array.prototype.forEach.call(el.list.children, function (li) {
      li.classList.toggle('active', li.dataset.id === String(state.id));
    });
  }

  /* ============================================ 表单填充 ==== */

  function setMode(editing) {
    el.badge.textContent = editing ? '编辑中' : '新建';
    el.badge.className = 'pane-badge' + (editing ? ' edit' : '');
    el.btnDelete.hidden = !editing;
    el.btnSave.textContent = editing ? '保存修改' : '保存并发布';
  }

  function fillCats(selected) {
    var cats = catsOf();
    el.cat.innerHTML = cats.map(function (c) {
      return '<option value="' + RP.esc(c) + '">' + RP.esc(c) + '</option>';
    }).join('') + '<option value="__new__">＋ 新增一个分类…</option>';

    if (selected && cats.indexOf(selected) === -1) {
      el.cat.insertAdjacentHTML('afterbegin',
        '<option value="' + RP.esc(selected) + '">' + RP.esc(selected) + '</option>');
      cats.push(selected);
    }
    el.cat.value = selected || cats[0] || '';
    state.cat = el.cat.value;
  }

  function newItem() {
    state.id = ''; state.existing = false; state.iconAuto = true;
    el.url.value = ''; el.name.value = ''; el.desc.value = ''; el.tags.value = '';
    var cat = catsOf()[0] || '';
    fillCats(cat);
    el.icon.value = CAT_ICON[cat] || RP.DEFAULT_ICON;
    setMode(false);
    setProbe('');
    say('新项目。填好链接点「自动识别」，或者直接手写。');
    refreshPreview();
    el.name.focus();
  }

  function openItem(id) {
    var it = findItem(id);
    if (!it) { say('找不到这个项目（可能已经被删掉了）', 'err'); newItem(); return; }
    var c = RP.cleanItem(it);
    state.id = c.id; state.existing = true; state.iconAuto = false;
    el.url.value = c.url; el.name.value = c.name; el.desc.value = c.desc;
    el.tags.value = c.tags.join(', '); el.icon.value = c.icon;
    fillCats(c.category);
    setMode(true);
    setProbe('');
    say('已载入。改完点「保存修改」。');
    refreshPreview();
    markActive();
  }

  /* ============================================ 实时预览 ==== */

  function refreshPreview() {
    var catIdx = catsOf().indexOf(el.cat.value);
    el.previewGroup.className = 'pt-group open pt-cat-' + (catIdx >= 0 ? catIdx % 4 : 0);
    el.previewCat.textContent = (el.cat.value && el.cat.value !== '__new__') ? el.cat.value : '（还没选分类）';
    el.previewList.innerHTML = RP.itemHtml({
      id: 'preview',
      name: el.name.value.trim() || '（还没填名称）',
      category: el.cat.value,
      url: el.url.value.trim(),
      desc: el.desc.value.trim(),
      tags: splitTags(el.tags.value),
      icon: el.icon.value.trim() || RP.DEFAULT_ICON
    });
  }

  function splitTags(v) {
    return String(v || '').split(/[,，;；\s]+/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean).slice(0, 8);
  }

  /* ============================================ 保存 / 删除 ==== */

  function collect() {
    var name = el.name.value.trim();
    if (!name) throw new Error('项目名称不能为空');

    var cat = el.cat.value;
    if (!cat || cat === '__new__') throw new Error('先选一个大分类');

    var url = el.url.value.trim();
    if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;

    var old = state.existing ? findItem(state.id) : null;
    var taken = ((state.data && state.data.items) || []).map(function (x) { return String(x.id); });

    return RP.cleanItem({
      id: state.existing && state.id ? state.id : RP.slugId(name, taken),
      name: name,
      category: cat,
      url: url,
      desc: el.desc.value.trim(),
      tags: splitTags(el.tags.value),
      icon: el.icon.value.trim() || RP.DEFAULT_ICON,
      date: (old && old.date) || RP.today()
    });
  }

  function save() {
    var item;
    try { item = collect(); }
    catch (e) { say(e.message, 'err'); toast(e.message, 'err'); return; }

    busy(true);
    say('正在提交到 GitHub …', 'busy');

    var isNew = true;
    loadData().then(function (data) {                 /* 重新拉一次，避免覆盖别人刚改的内容 */
      var items = (data.items || []).slice();
      var idx = -1;
      for (var i = 0; i < items.length; i++) {
        if (String(items[i].id) === item.id) { idx = i; break; }
      }
      isNew = idx === -1;
      if (isNew) items.push(item); else items[idx] = item;
      data.items = items;
      data.categories = catsOf();                     /* 新加的分类一起写进去 */
      return GH.putFile(RP.DATA_PATH, RP.serialize(data),
        (isNew ? '添加项目：' : '更新项目：') + item.name, state.sha);
    }).then(function () {
      state.id = item.id; state.existing = true;
      setMode(true);
      return loadData();
    }).then(function () {
      renderList();
      markActive();
      var host = w.location.pathname.split('/').pop() || 'project-editor.html';
      if (w.history && w.history.replaceState) {
        w.history.replaceState(null, '', host + '?edit=' + encodeURIComponent(item.id));
      }
      say('已提交。GitHub Pages 大约 1 分钟后更新线上页面。', 'ok');
      toast('「' + item.name + '」已提交。大约 1 分钟后线上生效。', 'ok');
    }).catch(function (e) {
      say('保存失败：' + e.message, 'err');
      toast('保存失败：' + e.message, 'err');
    }).then(function () { busy(false); });
  }

  function removeCurrent() {
    if (!state.existing || !state.id) return;
    var it = findItem(state.id);
    var name = (it && it.name) || el.name.value.trim() || state.id;

    if (!w.confirm('确定删除项目「' + name + '」？\n\n' +
      '\u00b7 会从 projects-data.js 里移除这一条\n' +
      '\u00b7 你写的简介和标签一起消失\n\n' +
      '站点上不可撤销（git 历史里还能找回）。')) return;

    var id = state.id;
    busy(true);
    say('正在删除 …', 'busy');

    loadData().then(function (data) {
      var before = data.items.length;
      data.items = (data.items || []).filter(function (x) { return String(x.id) !== String(id); });
      if (data.items.length === before) throw new Error('这条项目已经不在数据里了');
      return GH.putFile(RP.DATA_PATH, RP.serialize(data), '删除项目：' + name, state.sha);
    }).then(function () {
      toast('已删除。大约 1 分钟后线上生效。', 'ok');
      say('已删除。', 'ok');
      return loadData();
    }).then(function () {
      renderList();
      newItem();
    }).catch(function (e) {
      say('删除失败：' + e.message, 'err');
      toast('删除失败：' + e.message, 'err');
    }).then(function () { busy(false); });
  }

  /* ========================================= 自动识别链接 ==== */

  function normUrl(raw) {
    var u = String(raw || '').trim();
    if (!u) throw new Error('先填一个链接');
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    return u;
  }

  function timeoutFetch(u, ms) {
    var ctl = w.AbortController ? new w.AbortController() : null;
    var timer = setTimeout(function () { if (ctl) { try { ctl.abort(); } catch (e) {} } }, ms);
    var opt = { cache: 'no-store' };
    if (ctl) opt.signal = ctl.signal;
    return fetch(u, opt).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) { var e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
      return r;
    }, function (e) {
      clearTimeout(timer);
      throw e;
    });
  }

  function githubRepo(u) {
    var m = /^https?:\/\/(?:www\.)?github\.com\/([^\/\s?#]+)\/([^\/\s?#]+)/i.exec(u);
    if (!m) return null;
    return { owner: m[1], repo: m[2].replace(/\.git$/i, '') };
  }

  function fromGitHub(owner, repo) {
    return timeoutFetch('https://api.github.com/repos/' + owner + '/' + repo, 15000)
      .then(function (r) { return r.json(); })
      .then(function (x) {
        if (!x || !x.name) throw new Error('GitHub 没返回这个仓库');
        var tags = (x.topics || []).slice(0, 4);
        if (x.language) tags.push(x.language);
        return {
          title: x.name,
          desc: x.description || '',
          tags: tags,
          via: 'GitHub API'
        };
      });
  }

  function fromHtml(html) {
    var doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    function pick(sel, attr) {
      var n = doc.querySelector(sel);
      if (!n) return '';
      var v = attr ? n.getAttribute(attr) : n.textContent;
      return String(v || '').replace(/\s+/g, ' ').trim();
    }
    var title = pick('meta[property="og:title"]', 'content') || pick('title') || pick('h1');
    var desc = pick('meta[property="og:description"]', 'content') ||
               pick('meta[name="description"]', 'content');
    if (!desc && doc.body) desc = String(doc.body.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140);
    return { title: title, desc: desc };
  }

  function viaProxy(prefix, url) {
    return timeoutFetch(prefix + encodeURIComponent(url), 22000)
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var m = fromHtml(txt);
        if (!m.title && !m.desc) throw new Error('页面里没找到标题或简介');
        m.via = '网页抓取';
        return m;
      });
  }

  function viaMicrolink(url) {
    return timeoutFetch('https://api.microlink.io/?url=' + encodeURIComponent(url), 20000)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || j.status !== 'success' || !j.data) throw new Error('没拿到信息');
        var x = j.data, tags = [];
        if (x.publisher) tags.push(x.publisher);
        if (x.author) tags.push(x.author);
        if (!x.title && !x.description) throw new Error('页面没有标题和简介');
        return { title: x.title || '', desc: x.description || '', tags: tags, via: 'Microlink' };
      });
  }

  function guessWeb(url) {
    var steps = [
      function () { return viaMicrolink(url); },
      function () { return viaProxy('https://api.allorigins.win/raw?url=', url); },
      function () { return viaProxy('https://api.codetabs.com/v1/proxy?quest=', url); }
    ];
    var lastErr = null;
    function next(i) {
      if (i >= steps.length) {
        return Promise.reject(new Error('几条抓取通道都没成功' +
          (lastErr ? '（' + lastErr.message + '）' : '') + '，手动填一下标题和简介吧'));
      }
      return steps[i]().catch(function (e) { lastErr = e; return next(i + 1); });
    }
    return next(0);
  }

  function guess(url) {
    var gh = githubRepo(url);
    if (gh) return fromGitHub(gh.owner, gh.repo).catch(function () { return guessWeb(url); });
    return guessWeb(url);
  }

  function probe() {
    var url;
    try { url = normUrl(el.url.value); }
    catch (e) { setProbe(e.message, 'err'); say(e.message, 'err'); return; }
    el.url.value = url;

    var hasContent = !!(el.name.value.trim() || el.desc.value.trim());
    if (hasContent) {
      var ok = w.confirm('自动识别会用识别结果覆盖你现在填的「项目名称」和「简介」。\n\n继续吗？');
      if (!ok) { setProbe('已取消，你自己填的内容没动。'); say('已取消识别。'); return; }
    }

    el.btnProbe.disabled = true;
    setProbe('正在识别…（GitHub 项目走 API，其他网站走抓取，可能要几秒）', 'busy');
    say('正在识别链接…', 'busy');

    guess(url).then(function (m) {
      if (m.title) el.name.value = m.title;
      if (m.desc) el.desc.value = m.desc;
      if (!el.tags.value.trim() && m.tags && m.tags.length) {
        el.tags.value = m.tags.slice(0, 4).join(', ');
      }
      refreshPreview();
      setProbe('识别完成（来自 ' + (m.via || '网页') + '）' +
        (m.title ? '：已填标题' : '') + (m.desc ? '、已填简介' : '') +
        '。不满意直接改，改完点「保存并发布」。', 'ok');
      say('识别完成，可以接着改了。', 'ok');
    }).catch(function (e) {
      setProbe('识别失败：' + e.message, 'err');
      say('识别失败：' + e.message, 'err');
    }).then(function () { el.btnProbe.disabled = false; });
  }

  /* ================================================== 绑定 ==== */

  function buildIconPicks() {
    el.iconPicks.innerHTML = ICON_PICKS.map(function (c) {
      return '<button type="button" class="icon-pick" data-icon="' + RP.esc(c) + '">' + RP.esc(c) + '</button>';
    }).join('');
    Array.prototype.forEach.call(el.iconPicks.querySelectorAll('.icon-pick'), function (b) {
      b.addEventListener('click', function () {
        el.icon.value = b.dataset.icon;
        state.iconAuto = false;
        refreshPreview();
      });
    });
  }

  function bind() {
    el.btnSetup.addEventListener('click', function () { showSetup(el.setup.hidden); });
    el.btnSaveCfg.addEventListener('click', saveCfg);
    el.btnForget.addEventListener('click', function () {
      GH.setToken('');
      el.cfgToken.value = '';
      say('Token 已清除，管理入口已关闭。', 'ok');
      afterCfg();
    });

    el.btnNew.addEventListener('click', newItem);
    el.btnSave.addEventListener('click', save);
    el.btnReset.addEventListener('click', function () {
      if (!w.confirm('清空当前表单？（不会删除已经发布的项目）')) return;
      newItem();
    });
    el.btnDelete.addEventListener('click', removeCurrent);
    el.btnProbe.addEventListener('click', probe);

    /* 分类：支持临时新增一个 */
    el.cat.addEventListener('change', function () {
      if (el.cat.value === '__new__') {
        var name = (w.prompt('新分类的名字（会加在分类列表最后）：') || '').trim();
        if (!name) { fillCats(state.cat); refreshPreview(); return; }
        state.newCats = state.newCats || [];
        if (catsOf().indexOf(name) === -1) state.newCats.push(name);
        state.cat = name;
        fillCats(name);
        if (state.iconAuto) el.icon.value = CAT_ICON[name] || RP.DEFAULT_ICON;
      } else {
        state.cat = el.cat.value;
        if (state.iconAuto) el.icon.value = CAT_ICON[state.cat] || RP.DEFAULT_ICON;
      }
      refreshPreview();
    });

    /* 图标手改过就不再自动换 */
    el.icon.addEventListener('input', function () { state.iconAuto = false; refreshPreview(); });

    [el.url, el.name, el.desc, el.tags].forEach(function (n) {
      n.addEventListener('input', refreshPreview);
    });

    el.url.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); probe(); }
    });

    /* Ctrl/Cmd + S 保存 */
    d.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (!el.btnSave.disabled) save();
      }
    });
  }

  /* ============================================ 连接与启动 ==== */

  function afterCfg() {
    var ok = GH.hasToken();
    el.btnSave.disabled = !ok;

    if (!ok) {
      showSetup(true);
      el.list.innerHTML = '<li class="side-empty">先连接仓库。</li>';
      say('先填上 Token，然后就能在这里加项目了。');
      return;
    }

    showSetup(false);
    say('正在读取 ' + RP.DATA_PATH + ' …', 'busy');
    loadData().then(function () {
      renderList();
      var m = /[?&]edit=([^&]+)/.exec(w.location.search);
      if (m) openItem(decodeURIComponent(m[1]));
      else newItem();
    }).catch(function (e) {
      say('读取失败：' + e.message, 'err');
      el.list.innerHTML = '<li class="side-empty">读取失败：' + RP.esc(e.message) + '</li>';
      newItem();
    });
  }

  buildIconPicks();
  bind();
  afterCfg();

  /* 暴露出来，方便控制台调试或做回归测试 */
  w.RinsoraProjectEditor = {
    probe: probe, guess: guess, fromHtml: fromHtml, normUrl: normUrl,
    save: save, collect: collect, newItem: newItem, openItem: openItem,
    refreshPreview: refreshPreview, splitTags: splitTags,
    state: state
  };
})(window, document);
