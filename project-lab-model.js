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
  const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key) ? obj[key] : null;
  function build(data, enrichment, newestFirst) {
    const source = data && Array.isArray(data.items) ? data.items : [];
    const items = source.filter(p => validId(p.id)).map(p => {
      const extra = own(enrichment, p.id) || {};
      const list = value => Array.isArray(value) ? value.filter(x => typeof x === 'string').slice(0, 12) : [];
      return { ...p, tags: Array.isArray(p.tags) ? p.tags : [], external: external(p.url),
        portrait: ['bot', 'pulse', 'window', 'document'].includes(extra.portrait) ? extra.portrait : 'generic',
        rank: Number.isFinite(extra.featuredRank) && extra.featuredRank > 0 ? extra.featuredRank : Infinity,
        story: list(extra.story), highlights: list(extra.highlights),
        cover: media(extra.cover, p.id), gallery: (Array.isArray(extra.gallery) ? extra.gallery : []).map(x => media(x, p.id)).filter(Boolean).slice(0, 12) };
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
  w.RinsoraLabModel = { enabled, esc, external, validId, href, route, media, build, portrait, detailMedia, tags, repository, card };
})(window);
