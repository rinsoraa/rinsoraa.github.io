/* Pure presentation helpers. The project collection is always supplied by
   RinsoraProjects.read(); this module owns no independent project list. */
(function (w) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const enabled = search => {
    const q = new URLSearchParams(search);
    return q.get('ui02') === '1' && q.get('lab') === '1';
  };
  function external(value) {
    const raw = String(value || '').trim();
    if (!/^https:\/\//i.test(raw) || /[\u0000-\u0020\u007f]/.test(raw)) return '';
    try { const url = new URL(raw); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; }
    catch (_) { return ''; }
  }
  const validId = id => /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(String(id));
  const href = id => validId(id) ? '#/lab/' + encodeURIComponent(id) : '';
  function route(hash) {
    const match = /^#\/lab\/([^/?#]+)$/i.exec(hash || '');
    if (!match) return null;
    try { const id = decodeURIComponent(match[1]); return validId(id) ? id : ''; }
    catch (_) { return ''; }
  }
  function media(raw, id, variants = true) {
    if (!raw || !validId(id)) return null;
    const src = String(raw.src || '');
    const prefix = 'assets/projects/' + id + '/';
    if (!src.startsWith(prefix) || src.includes('..') || !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*\.(webp|avif|png|jpe?g)$/i.test(src.slice(prefix.length))) return null;
    const width = Number(raw.width), height = Number(raw.height);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 8192 || height > 8192) return null;
    const sources = variants && Array.isArray(raw.sources) ? raw.sources.slice(0, 6).map(x => media(x, id, false)).filter(x => x && Math.abs(x.width / x.height - width / height) < .01) : [];
    return { src, width, height, alt: String(raw.alt || ''), caption: String(raw.caption || ''), sources };
  }
  function experience(raw, id) {
    if (!raw || !validId(id) || !raw.source || raw.source.genuine !== true) return null;
    const text = (value, max) => typeof value === 'string' && value.trim() && value.length <= max && !/[\u0000-\u001f\u007f]/.test(value) ? value.trim() : '';
    const source = { method: text(raw.source.method, 160), version: text(raw.source.version, 120), captured: text(raw.source.captured, 10), note: text(raw.source.note, 600), genuine: true };
    if (!source.method || !source.version || !/^\d{4}-\d{2}-\d{2}$/.test(source.captured) || !Number.isFinite(Date.parse(source.captured)) || new Date(source.captured).toISOString().slice(0, 10) !== source.captured || !source.note) return null;
    if (raw.source.verification != null) {
      if (!['user-declared', 'runtime-evidence'].includes(raw.source.verification)) return null;
      source.verification = raw.source.verification;
    }
    const common = { type: raw.type, title: text(raw.title, 120), description: text(raw.description, 600), source };
    if (!common.title || !common.description) return null;
    if (raw.type === 'video') {
      const prefix = 'assets/projects/' + id + '/';
      const src = typeof raw.src === 'string' ? raw.src : '';
      const width = Number(raw.width), height = Number(raw.height), duration = Number(raw.duration);
      const poster = media(raw.poster, id, false);
      if (!src.startsWith(prefix) || src.includes('..') || !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*\.webm$/i.test(src.slice(prefix.length)) || raw.mime !== 'video/webm' || raw.codec !== 'vp8' || typeof raw.audio !== 'boolean') return null;
      if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4096 || height > 4096 || !Number.isFinite(duration) || duration <= 0 || duration > 120 || !poster || Math.abs(poster.width / poster.height - width / height) >= .01) return null;
      return { ...common, src, width, height, duration, poster, audio: raw.audio, mime: 'video/webm', codec: 'vp8' };
    }
    if (raw.type === 'compare') {
      const before = media(raw.before, id, false), after = media(raw.after, id, false);
      const alignment = text(raw.source.alignment, 240);
      if (!before || !after || !alignment || Math.abs(before.width / before.height - after.width / after.height) >= .01) return null;
      return { ...common, before, after, source: { ...source, alignment } };
    }
    return null;
  }
  const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key) ? obj[key] : null;
  function build(data, enrichment, newestFirst) {
    enrichment = mergeMedia(enrichment, w.RINSORA_PROJECT_MEDIA, data);
    const source = data && Array.isArray(data.items) ? data.items : [];
    const items = source.filter(p => validId(p.id)).map(p => {
      const extra = own(enrichment, p.id) || {};
      const list = value => Array.isArray(value) ? value.filter(x => typeof x === 'string').slice(0, 12) : [];
      return { ...p, tags: Array.isArray(p.tags) ? p.tags : [], external: external(p.url),
        portrait: ['bot', 'pulse', 'window', 'document'].includes(extra.portrait) ? extra.portrait : 'generic',
        rank: Number.isFinite(extra.featuredRank) && extra.featuredRank > 0 ? extra.featuredRank : Infinity,
        story: list(extra.story), highlights: list(extra.highlights),
        cover: media(extra.cover, p.id), gallery: (Array.isArray(extra.gallery) ? extra.gallery : []).map(x => media(x, p.id)).filter(Boolean).slice(0, 12),
        experience: experience(extra.experience, p.id) };
    });
    const categories = (data && Array.isArray(data.categories) ? data.categories : []).filter(c => items.some(p => p.category === c));
    const sorted = newestFirst ? newestFirst(items) : items;
    const featured = items.filter(p => p.rank < Infinity).sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id)).slice(0, 3);
    // Media-led showcase is a presentation choice; source order and configured ranks remain intact.
    const lead = sorted.find(p => p.cover);
    const showcase = lead ? [lead, ...featured.filter(p => p.id !== lead.id)].slice(0, 3) : featured;
    return { items: sorted, categories, featured, showcase,
      find: id => items.find(p => p.id === id) || null,
      filter: category => sorted.filter(p => !category || p.category === category),
      orphans: Object.keys(enrichment || {}).filter(id => !source.some(p => p.id === id)) };
  }

  const mediaKeys = ['cover', 'gallery', 'experience'];
  function validateMediaDocument(doc, data) {
    const errors = [];
    if (!doc || doc.schemaVersion !== 1 || !doc.projects || typeof doc.projects !== 'object' || Array.isArray(doc.projects) || Object.keys(doc).some(k => !['schemaVersion','projects'].includes(k))) return ['媒体 JSON 版本或结构不兼容'];
    for (const [id, entry] of Object.entries(doc.projects)) {
      if (!validId(id) || ['__proto__','constructor','prototype'].includes(id)) { errors.push('未知项目：' + id); continue; }
      if (!entry || typeof entry !== 'object' || Array.isArray(entry) || Object.keys(entry).some(k => ![...mediaKeys,'provenance'].includes(k))) { errors.push('非法媒体字段：' + id); continue; }
      if (entry.cover != null && !media(entry.cover,id)) errors.push('封面配置无效：' + id);
      if (Object.prototype.hasOwnProperty.call(entry,'gallery') && (!Array.isArray(entry.gallery) || entry.gallery.length > 12 || entry.gallery.some(m => !media(m,id)))) errors.push('图集配置无效：' + id);
      if (entry.experience != null && !experience(entry.experience,id)) errors.push('体验配置无效：' + id);
      if (entry.provenance != null) {
        if (typeof entry.provenance !== 'object' || Array.isArray(entry.provenance)) { errors.push('来源记录无效：' + id); continue; }
        for (const [path, record] of Object.entries(entry.provenance)) {
          const prefix = 'assets/projects/' + id + '/';
          if (!path.startsWith(prefix) || !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*\.(webp|png|jpe?g|webm)$/.test(path.slice(prefix.length)) || path.includes('..') || !record || !/^[a-f0-9]{64}$/.test(record.sha256 || '') || record.verification !== 'user-declared' || record.publicConfirmed !== true || !['method','captured','version','note'].every(k => typeof record[k] === 'string' && record[k].trim() && record[k].length <= 600) || !/^\d{4}-\d{2}-\d{2}$/.test(record.captured) || new Date(record.captured).toString() === 'Invalid Date' || new Date(record.captured).toISOString().slice(0,10) !== record.captured) errors.push('来源记录无效：' + path);
        }
      }
    }
    return errors;
  }
  function mergeMedia(base, doc, data) {
    if (!doc) return base || {};
    const errors = validateMediaDocument(doc,data);
    if (errors.length) throw new Error(errors.join('；'));
    const out = { ...(base || {}) };
    for (const [id,entry] of Object.entries(doc.projects)) {
      if (!data?.items?.some(p => p.id === id)) continue;
      out[id] = { ...(out[id] || {}) };
      for (const key of mediaKeys) if (Object.prototype.hasOwnProperty.call(entry,key)) out[id][key] = entry[key];
    }
    return out;
  }

  function compareMarkup(e) {
    const img = (m, cls) => '<img class="' + cls + '" src="' + esc(m.src) + '" width="' + m.width + '" height="' + m.height + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async" draggable="false">';
    return '<div class="lab-compare"><div class="lab-compare-frame" style="aspect-ratio:' + e.before.width + '/' + e.before.height + ';--compare:50%">' + img(e.before, 'lab-compare-before') + img(e.after, 'lab-compare-after') + '<span class="lab-compare-label lab-compare-label-before">之前</span><span class="lab-compare-label lab-compare-label-after">之后</span><span class="lab-compare-divider" aria-hidden="true"><b>↔</b></span><p class="lab-compare-error" hidden>对比图片暂时无法加载，请继续查看项目图集。</p></div><label class="lab-compare-control">效果分割比例 <output>50%</output><input type="range" min="0" max="100" value="50" aria-label="之前与之后的图片分割比例"></label><p class="lab-experience-note">可横向拖动画面中的分割线，或使用滑块及方向键。' + esc(e.source.alignment) + '</p></div>';
  }
  const symbols = {
    bot: '<span class="lab-bot"><i></i><i></i></span>',
    pulse: '<svg viewBox="0 0 300 90" fill="none"><path d="M0 45h28l8-12 9 28 10-48 10 64 10-44 9 20 8-8h25l9-25 9 52 11-65 10 77 10-50 9 18h26l10-25 10 47 10-38 9 26 9-14h34" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>',
    window: '<span class="lab-window"><i></i><i></i><i></i><b></b></span>',
    document: '<span class="lab-document">Aa<small>— —<br>———</small></span>',
    generic: '<span class="lab-generic">&lt; / &gt;</span>'
  };
  function portrait(p, image = true, prominent = false, deferMedia = false) {
    const art = '<span class="lab-identity lab-identity-' + p.portrait + '" aria-hidden="true"><span class="lab-identity-label">RINSORA / PROJECT PORTRAIT</span>' + symbols[p.portrait || 'generic'] + '<span class="lab-identity-name">' + esc(p.name) + '</span></span>';
    if (!image || !p.cover) return art;
    const m = p.cover;
    if (deferMedia) return '<span class="lab-image-wrap lab-cover">' + art + '</span>';
    // Exclusive picture sources keep repeated cards on the same candidate,
    // including warm-cache visits. High-DPR screens retain the full cover.
    const variants = m.sources.filter(x => x.width < m.width).sort((a, b) => a.width - b.width).map(x => ({ ...x, query: '(max-width:' + (x.width + 40) + 'px) and (max-resolution:1dppx)' }));
    const sources = variants.map(x => '<source media="' + x.query + '" srcset="' + esc(x.src) + '">').join('');
    // Match the fallback at fragment creation as well: a warm-cache browser may
    // start img.src before connecting its picture ancestor. Native picture
    // sources still own later viewport/DPR changes; no resize listener needed.
    const fallback = variants.find(x => w.matchMedia?.(x.query).matches) || m;
    return '<span class="lab-image-wrap lab-cover">' + art + '<picture class="lab-cover-picture">' + sources + '<source srcset="' + esc(m.src) + '"><img src="' + esc(fallback.src) + '" width="' + m.width + '" height="' + m.height + '" alt="' + esc(m.alt) + '" loading="' + (prominent ? 'eager' : 'lazy') + '" fetchpriority="' + (prominent ? 'high' : 'auto') + '" decoding="async"></picture><span class="lab-media-label">PROJECT VIEW / 页面记录</span></span>';
  }
  const detailMedia = p => p.gallery.length ? p.gallery : p.cover ? [p.cover] : [];
  const tags = p => '<span class="lab-tags">' + p.tags.map(t => '<span>' + esc(t) + '</span>').join('') + '</span>';
  const repository = p => p.external ? '<a class="lab-external" href="' + esc(p.external) + '" target="_blank" rel="noopener noreferrer">' + (new URL(p.external).hostname === 'github.com' ? 'GitHub 仓库' : '项目链接') + ' <span aria-hidden="true">↗</span></a>' : '';
  function card(p, featured, deferMedia = false) {
    return '<article class="clab-card' + (featured ? ' clab-card-featured' : '') + '" data-project-id="' + esc(p.id) + '"><a class="clab-card-main" href="' + href(p.id) + '">' + portrait(p, true, featured, deferMedia) +
      '<div class="clab-card-copy"><span class="clab-card-meta">' + esc(p.category) + (p.status ? '<span class="lab-state">' + esc(p.status) + '</span>' : '') + '</span><h4>' + esc(p.name) + '</h4><span class="lab-description">' + esc(p.desc) + '</span>' + tags(p) + '<span class="clab-card-bottom"><time>' + esc(p.date) + '</time><span>走近这件作品 <b aria-hidden="true">↗</b></span></span></div></a>' + repository(p) + '</article>';
  }
  w.RinsoraLabModel = { compareMarkup, validateMediaDocument, mergeMedia, enabled, esc, external, validId, href, route, media, experience, build, portrait, detailMedia, tags, repository, card };
})(window);
