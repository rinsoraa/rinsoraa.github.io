/* ============================================================
   gh-api.js —— 用 GitHub Contents API 读写仓库文件
   纯前端，无后端。Token 只存在本机浏览器 localStorage，只发给 api.github.com。
   供首页（blog-admin.js）和编辑器（editor.js）共用。
   ============================================================ */
(function (w) {
  'use strict';

  var CFG_KEY = 'rinsora-blog-cfg';
  var TOKEN_KEY = 'rinsora-blog-token';

  var DEFAULTS = { owner: 'rinsoraa', repo: 'rinsoraa.github.io', branch: 'main' };

  /* ---------------------------------------------------------- 配置 ---- */

  function loadCfg() {
    var c = {};
    try { c = JSON.parse(localStorage.getItem(CFG_KEY) || '{}') || {}; } catch (e) { c = {}; }
    return {
      owner:  c.owner  || DEFAULTS.owner,
      repo:   c.repo   || DEFAULTS.repo,
      branch: c.branch || DEFAULTS.branch
    };
  }

  function saveCfg(c) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (e) {}
  }

  function token() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }

  function setToken(t) {
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }

  function hasToken() { return token().length > 0; }

  /* ------------------------------------------------------ base64 ---- */

  function b64encode(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    var CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    }
    return btoa(bin);
  }

  function b64decode(b64) {
    var bin = atob(String(b64).replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }

  function bufToB64(buf) {
    var bytes = new Uint8Array(buf);
    var bin = '';
    var CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    }
    return btoa(bin);
  }

  /* --------------------------------------------------------- API ---- */

  function contentsUrl(path, ref) {
    var cfg = loadCfg();
    var url = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/';
    url += String(path || '').split('/').map(encodeURIComponent).join('/');
    if (ref !== false) url += '?ref=' + encodeURIComponent(ref || cfg.branch);
    return url;
  }

  function request(url, opts) {
    opts = opts || {};
    var headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    var t = token();
    if (t) headers['Authorization'] = 'Bearer ' + t;
    if (opts.body) headers['Content-Type'] = 'application/json';

    return fetch(url, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store'
    }).then(function (res) {
      return res.text().then(function (txt) {
        var data = null;
        try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = null; }
        if (res.ok) return data;

        var msg = (data && data.message) || ('HTTP ' + res.status);
        if (res.status === 401) msg = '\u0031\u0030\u0031\uff1aToken \u65e0\u6548\u6216\u5df2\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u751f\u6210';
        else if (res.status === 403) msg = '\u0034\u0030\u0033\uff1a\u6ca1\u6709\u5199\u6743\u9650\uff0c\u6216\u8bf7\u6c42\u8fc7\u4e8e\u9891\u7e41\u88ab\u9650\u6d41';
        else if (res.status === 404) msg = '\u0034\u0030\u0034\uff1a\u627e\u4e0d\u5230\u4ed3\u5e93\u6216\u6587\u4ef6\u2014\u2014\u68c0\u67e5\u7528\u6237\u540d / \u4ed3\u5e93\u540d / \u5206\u652f\uff0c\u6216 Token \u6ca1\u6709\u8be5\u4ed3\u5e93\u6743\u9650';
        else if (res.status === 409) msg = '\u0034\u0030\u0039\uff1a\u6587\u4ef6\u51b2\u7a81\uff08\u521a\u521a\u88ab\u6539\u8fc7\uff09\uff0c\u5237\u65b0\u91cd\u8bd5';
        else if (res.status === 422) msg = '422\uff1a\u53c2\u6570\u4e0d\u5bf9\uff0c\u6216\u6587\u4ef6\u5df2\u5b58\u5728\u4f46\u6ca1\u5e26 sha';

        var err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
      });
    });
  }

  /* --- 读单文件：返回 {text, sha, path}，不存在返回 null --- */
  function getFile(path) {
    return request(contentsUrl(path)).then(function (d) {
      if (!d || Array.isArray(d)) return null;
      return { text: b64decode(d.content), sha: d.sha, path: d.path, size: d.size };
    }).catch(function (e) {
      if (e.status === 404) return null;
      throw e;
    });
  }

  /* --- 写文本文件：sha 为空表示新建 --- */
  function putFile(path, text, message, sha) {
    var cfg = loadCfg();
    var body = { message: message, content: b64encode(text), branch: cfg.branch };
    if (sha) body.sha = sha;
    var url = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/' +
      String(path).split('/').map(encodeURIComponent).join('/');
    return request(url, { method: 'PUT', body: body });
  }

  /* --- 上传二进制（图片） --- */
  function putBinary(path, arrayBuffer, message, sha) {
    var cfg = loadCfg();
    var body = { message: message, content: bufToB64(arrayBuffer), branch: cfg.branch };
    if (sha) body.sha = sha;
    var url = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/' +
      String(path).split('/').map(encodeURIComponent).join('/');
    return request(url, { method: 'PUT', body: body });
  }

  /* --- 删文件 --- */
  function delFile(path, message, sha) {
    var cfg = loadCfg();
    var url = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/' +
      String(path).split('/').map(encodeURIComponent).join('/');
    return request(url, { method: 'DELETE', body: { message: message, sha: sha, branch: cfg.branch } });
  }

  /* --- 列目录 --- */
  function listDir(path) {
    return request(contentsUrl(path)).then(function (d) {
      return Array.isArray(d) ? d : [];
    }).catch(function (e) {
      if (e.status === 404) return [];
      throw e;
    });
  }

  /* --- 测试连接：顺带读出默认分支和写权限 --- */
  function check() {
    var cfg = loadCfg();
    return request('https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo).then(function (r) {
      return {
        fullName: r.full_name,
        defaultBranch: r.default_branch,
        canPush: !!(r.permissions && r.permissions.push),
        isPrivate: !!r.private
      };
    });
  }

  /* --- 原始文件直链（用于预览刚上传的图） --- */
  function rawUrl(path) {
    var cfg = loadCfg();
    return 'https://raw.githubusercontent.com/' + cfg.owner + '/' + cfg.repo + '/' +
      cfg.branch + '/' + String(path).split('/').map(encodeURIComponent).join('/');
  }

  w.GH = {
    DEFAULTS: DEFAULTS,
    loadCfg: loadCfg, saveCfg: saveCfg,
    token: token, setToken: setToken, hasToken: hasToken,
    getFile: getFile, putFile: putFile, putBinary: putBinary,
    delFile: delFile, listDir: listDir, check: check,
    rawUrl: rawUrl,
    b64encode: b64encode, b64decode: b64decode
  };
})(window);
