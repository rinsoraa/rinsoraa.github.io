/* ============================================================
   music-upload.js —— 「添加音乐」面板
   ------------------------------------------------------------
   播放器展开后右下角的「＋」会把它召唤出来。填歌名 / 作者，
   选封面图、音频文件、歌词文件，点保存：

     · 音频 -> assets/music/<id>.<ext>       （GH.putBinary）
     · 封面 -> assets/music/<id>-cover.<ext> （GH.putBinary，可留空）
     · 歌词 -> 解析成文本，直接内联进 music-data.js 的 lrc 字段
     · 最后把新曲目追加进 music-data.js       （GH.putFile）

   和写作台 / 项目编辑台一样，写操作要本机 localStorage 里的 PAT。
   没有 Token 时面板也能打开（配置入口），但保存会提示先配 Token。
   ============================================================ */
(function (w, d) {
  'use strict';

  var M, GH;
  var modal = null;
  var busy = false;
  var picked = { cover: null, audio: null, lrcText: '', lrcName: '' };

  var MAX_AUDIO = 45 * 1024 * 1024;     // 超过就拒收（GitHub Contents API 单文件上限远大于此，留足余量）
  var WARN_AUDIO = 20 * 1024 * 1024;    // 超过就提醒一句

  function $(s, r) { return (r || d).querySelector(s); }

  function extOf(name, fallback) {
    var m = /\.([a-z0-9]{2,5})$/i.exec(String(name || ''));
    return (m ? m[1] : fallback).toLowerCase();
  }
  function baseName(name) {
    return String(name || '').replace(/\.[^.]+$/, '') || '未命名';
  }
  function readBuf(file) {
    if (file.arrayBuffer) return file.arrayBuffer();
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = rej;
      r.readAsArrayBuffer(file);
    });
  }
  function readText(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result || '')); };
      r.onerror = rej;
      r.readAsText(file);
    });
  }

  function hint(msg, type) {
    var el = $('#mmHint');
    if (!el) return;
    el.textContent = msg;
    el.className = 'mm-hint' + (type ? ' ' + type : '');
  }

  function takenIds() {
    return M.tracks().map(function (t) { return t.id; });
  }

  /* ------------------------------------------------------------ DOM ---- */

  function build() {
    if (modal) return modal;
    modal = d.createElement('div');
    modal.className = 'mm-mask';
    modal.id = 'musicModal';
    modal.innerHTML =
      '<div class="mm-card" role="dialog" aria-modal="true" aria-label="添加音乐">' +
        '<div class="mm-head">' +
          '<div><p class="mm-kicker">\u266b NEW TRACK</p><h3>添加音乐</h3></div>' +
          '<button type="button" class="mm-x" id="mmClose" aria-label="关闭">\u2715</button>' +
        '</div>' +
        '<div class="mm-body">' +
          '<label class="mm-coverbox" id="mmCoverBox" title="点这里选封面图">' +
            '<img class="mm-coverprev" id="mmCoverPrev" alt="">' +
            '<span class="mm-covernote">\u266a</span>' +
            '<span class="mm-coverhint">\uff0b 封面</span>' +
            '<input type="file" accept="image/*" id="mmCoverInput" hidden>' +
          '</label>' +
          '<div class="mm-fields">' +
            '<label class="mm-field"><span>歌名</span>' +
              '<input type="text" id="mmTitle" placeholder="选好音频后自动填，也可以自己改"></label>' +
            '<label class="mm-field"><span>作者</span>' +
              '<input type="text" id="mmArtist" placeholder="歌手 / 社团 / 自己"></label>' +
            '<label class="mm-field mm-pick"><span>音频文件</span><b id="mmAudioName">未选择</b>' +
              '<input type="file" accept="audio/*" id="mmAudioInput" hidden></label>' +
            '<label class="mm-field mm-pick"><span>歌词文件</span><b id="mmLrcName">未选择（可留空）</b>' +
              '<input type="file" accept=".lrc,.txt,text/plain" id="mmLrcInput" hidden></label>' +
          '</div>' +
        '</div>' +
        '<p class="mm-hint" id="mmHint">音频和封面会上传到 assets/music/，歌词直接写进 music-data.js。</p>' +
        '<div class="mm-modal-foot">' +
          '<button type="button" class="mm-btn" id="mmCancel">取消</button>' +
          '<button type="button" class="mm-btn mm-primary" id="mmSave">保存并上传</button>' +
        '</div>' +
      '</div>';
    d.body.appendChild(modal);

    /* 关闭 */
    $('#mmClose', modal).addEventListener('click', close);
    $('#mmCancel', modal).addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(); });

    /* 封面 */
    $('#mmCoverInput', modal).addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      picked.cover = f;
      var url = URL.createObjectURL(f);
      var img = $('#mmCoverPrev', modal);
      img.src = url;
      $('#mmCoverBox', modal).classList.add('has-img');
    });

    /* 音频：顺便把歌名填上 */
    $('#mmAudioInput', modal).addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      picked.audio = f;
      $('#mmAudioName', modal).textContent = f.name;
      var titleEl = $('#mmTitle', modal);
      if (!titleEl.value.trim()) titleEl.value = baseName(f.name);
      if (f.size > MAX_AUDIO) hint('这个音频 ' + (f.size / 1048576).toFixed(1) + ' MB，太大了（上限 45 MB），换个小一点的吧', 'err');
      else if (f.size > WARN_AUDIO) hint('音频有点大（' + (f.size / 1048576).toFixed(1) + ' MB），上传会慢一些', 'warn');
      else hint('已选好音频，随时可以保存');
    });

    /* 歌词 */
    $('#mmLrcInput', modal).addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      readText(f).then(function (txt) {
        var lines = M.parseLrc(txt);
        if (!lines.length) {
          picked.lrcText = ''; picked.lrcName = '';
          $('#mmLrcName', modal).textContent = '这个文件里没有解析到时间轴';
          hint('歌词文件里没找到 [mm:ss] 形式的时间轴，换一个 .lrc 试试', 'err');
          return;
        }
        picked.lrcText = txt.replace(/\r\n/g, '\n').trim();
        picked.lrcName = f.name;
        $('#mmLrcName', modal).textContent = f.name + '（' + lines.length + ' 句）';
        hint('歌词已读入，' + lines.length + ' 句时间轴');
      }).catch(function () { hint('歌词文件读不出来', 'err'); });
    });

    $('#mmSave', modal).addEventListener('click', save);
    return modal;
  }

  function isOpen() { return !!(modal && modal.classList.contains('open')); }

  function open() {
    M = w.RinsoraMusic;
    GH = w.GH;
    build();
    picked = { cover: null, audio: null, lrcText: '', lrcName: '' };
    $('#mmCoverPrev', modal).removeAttribute('src');
    $('#mmCoverBox', modal).classList.remove('has-img');
    $('#mmTitle', modal).value = '';
    $('#mmArtist', modal).value = '';
    $('#mmAudioName', modal).textContent = '未选择';
    $('#mmLrcName', modal).textContent = '未选择（可留空）';
    if (!(GH && GH.hasToken && GH.hasToken())) {
      hint('还没有配 Token —— 面板可以看，但保存需要先去「写作台」的设置里填好 PAT。', 'err');
    } else {
      hint('音频和封面会上传到 assets/music/，歌词直接写进 music-data.js。');
    }
    modal.classList.add('open');
    setTimeout(function () { var t = $('#mmTitle', modal); if (t) t.focus(); }, 60);
  }

  function close() {
    if (modal) modal.classList.remove('open');
  }

  /* ----------------------------------------------------------- 保存 ---- */

  function save() {
    M = w.RinsoraMusic;
    GH = w.GH;
    if (busy) return;

    if (!(GH && GH.hasToken && GH.hasToken())) {
      hint('没有 Token，保存不了。先去写作台把 PAT 配上。', 'err');
      return;
    }
    if (!picked.audio) { hint('先选一个音频文件再保存', 'err'); return; }
    if (picked.audio.size > MAX_AUDIO) {
      hint('音频超过 45 MB 上限，换个小一点的吧', 'err');
      return;
    }

    var title = ($('#mmTitle', modal).value || '').trim() || baseName(picked.audio.name);
    var artist = ($('#mmArtist', modal).value || '').trim() || '未知作者';
    var id = M.slugId(title, takenIds());
    var aExt = extOf(picked.audio.name, 'mp3');
    var cExt = picked.cover ? extOf(picked.cover.name, 'png') : '';
    var audioPath = 'assets/music/' + id + '.' + aExt;
    var coverPath = picked.cover ? ('assets/music/' + id + '-cover.' + cExt) : '';

    var btn = $('#mmSave', modal);
    busy = true;
    btn.disabled = true;
    btn.classList.add('busy');

    hint('正在上传音频（' + (picked.audio.size / 1048576).toFixed(1) + ' MB）…');

    readBuf(picked.audio).then(function (buf) {
      return GH.putBinary(audioPath, buf, '上传音乐：' + title);
    }).then(function () {
      if (!picked.cover) return null;
      hint('音频好了，正在上传封面…');
      return readBuf(picked.cover).then(function (buf) {
        return GH.putBinary(coverPath, buf, '上传音乐封面：' + title);
      });
    }).then(function () {
      hint('正在写入 music-data.js…');
      return GH.getFile(M.DATA_PATH);
    }).then(function (f) {
      if (!f) throw new Error('读不到 ' + M.DATA_PATH);
      var data = M.parse(f.text);
      data.tracks = data.tracks || [];
      data.tracks.push(M.cleanTrack({
        id: id,
        title: title,
        artist: artist,
        cover: coverPath,
        src: audioPath,
        lrc: picked.lrcText || '',
        date: new Date().toISOString().slice(0, 10)
      }));
      return GH.putFile(M.DATA_PATH, M.serialize(data), '添加音乐：' + title, f.sha)
        .then(function () { return data; });
    }).then(function (data) {
      /* 就地更新内存里的数据，播放器立刻能看到新歌，不用刷新页面 */
      w.RINSORA_MUSIC = { version: data.version || 1, tracks: data.tracks };
      M.setData(w.RINSORA_MUSIC);
      M.playIndex(w.RINSORA_MUSIC.tracks.length - 1);
      busy = false;
      btn.disabled = false;
      btn.classList.remove('busy');
      close();
      M.toast('已添加《' + title + '》。Pages 大约 1 分钟后更新线上页面。', 'ok');
    }).catch(function (e) {
      busy = false;
      btn.disabled = false;
      btn.classList.remove('busy');
      hint('保存失败：' + (e && e.message ? e.message : e), 'err');
    });
  }

  /* ----------------------------------------------------------- 删除 ---- */

  function removeTrack(i) {
    M = w.RinsoraMusic;
    GH = w.GH;
    var t = M.tracks()[i];
    if (!t) return;

    if (!(GH && GH.hasToken && GH.hasToken())) {
      M.toast('删除需要先配 Token', 'err');
      return;
    }
    if (!w.confirm('删除《' + t.title + '》？\n\n' +
      '\u00b7 会从 music-data.js 里移除这首歌\n' +
      '\u00b7 已经上传到 assets/music/ 的音频和封面文件会留在仓库里（想清掉得去 GitHub 手动删）\n\n' +
      '线上页面大约 1 分钟后更新。')) return;

    M.toast('正在删除…');
    GH.getFile(M.DATA_PATH).then(function (f) {
      if (!f) throw new Error('读不到 ' + M.DATA_PATH);
      var data = M.parse(f.text);
      data.tracks = (data.tracks || []).filter(function (x) { return x.id !== t.id; });
      return GH.putFile(M.DATA_PATH, M.serialize(data), '删除音乐：' + t.title, f.sha)
        .then(function () { return data; });
    }).then(function (data) {
      w.RINSORA_MUSIC = { version: data.version || 1, tracks: data.tracks };
      M.setData(w.RINSORA_MUSIC);
      M.toast('已删除《' + t.title + '》', 'ok');
    }).catch(function (e) {
      M.toast('删除失败：' + (e && e.message ? e.message : e), 'err');
    });
  }

  /* ------------------------------------------------- 无条件入口 ---- */
  /* 「＋」按钮只有配过 Token 才出现，所以另留两条不依赖 Token 的路：
       1. 地址栏加 #music
       2. Ctrl / Cmd + Shift + M
     面板本身没有 Token 也做不了任何写操作，对访客无害。 */
  function wireEntry() {
    var fromHash = function () {
      var h = (w.location.hash || '').replace(/^#/, '').toLowerCase();
      if (h === 'music' || h === 'addmusic') open();
    };
    fromHash();
    w.addEventListener('hashchange', fromHash);
    d.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && String(e.key).toLowerCase() === 'm') {
        e.preventDefault();
        open();
      }
    });
  }

  w.RinsoraMusicUpload = {
    open: open,
    close: close,
    removeTrack: removeTrack
  };

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', wireEntry);
  } else {
    wireEntry();
  }
})(window, document);
