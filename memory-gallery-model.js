/* Independent photo records; never infer a relationship to text Moments. */
(function (w) {
  'use strict';
  const LIMITS = Object.freeze({ items: 120, categories: 24, gallery: 12, pixels: 16777216, coverPixels: 4194304, bytes: 12582912, batch: 18 });
  const record = x => !!x && typeof x === 'object' && !Array.isArray(x);
  const keys = (x, allowed) => record(x) && Object.keys(x).every(k => allowed.includes(k));
  const text = (x, max, required = false) => typeof x === 'string' && x.length <= max && (!required || x.trim().length > 0) && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x);
  const id = x => typeof x === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x) && x.length <= 64 && !['constructor', 'prototype', '__proto__'].includes(x);
  function date(x) {
    if (typeof x !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(x) || x < '1900-01-01' || x > '2199-12-31') return false;
    const value = new Date(x + 'T00:00:00Z');
    return Number.isFinite(value.getTime()) && value.toISOString().slice(0, 10) === x;
  }
  function url(x) {
    if (typeof x !== 'string' || x.length > 1000 || /[\s\\]/.test(x)) return false;
    try { const u = new URL(x); return u.protocol === 'https:' && !u.username && !u.password; } catch (_) { return false; }
  }
  function image(x, owner) {
    if (!keys(x, ['src', 'width', 'height', 'alt', 'caption']) || !id(owner)) return false;
    const prefix = 'assets/memories/' + owner + '/';
    if (typeof x.src !== 'string' || !x.src.startsWith(prefix) || !/^[a-z0-9][a-z0-9-]*\.(?:webp|png|jpg|jpeg)$/.test(x.src.slice(prefix.length))) return false;
    return Number.isInteger(x.width) && Number.isInteger(x.height) && x.width > 0 && x.height > 0 && x.width <= 8192 && x.height <= 8192 && x.width * x.height <= LIMITS.pixels && text(x.alt, 300, true) && (x.caption === undefined || text(x.caption, 600));
  }
  function validate(doc, options) {
    const errors = [], fail = s => errors.push(s);
    if (!keys(doc, ['schemaVersion', 'categories', 'items', 'testFixture']) || doc.schemaVersion !== 1) return ['Invalid memory document/schemaVersion'];
    if (doc.testFixture !== undefined && typeof doc.testFixture !== 'boolean') fail('Invalid testFixture flag');
    if (doc.testFixture && !options?.allowFixtures) fail('TEST FIXTURE is not permitted in production data');
    if (!Array.isArray(doc.categories) || doc.categories.length > LIMITS.categories) return errors.concat('Invalid categories');
    if (!Array.isArray(doc.items) || doc.items.length > LIMITS.items) return errors.concat('Invalid items/count');
    const categories = new Set(), ids = new Set();
    for (const c of doc.categories) {
      if (!keys(c, ['id', 'label']) || !id(c.id) || !text(c.label, 40, true) || categories.has(c.id)) fail('Invalid/duplicate category');
      else categories.add(c.id);
    }
    for (const item of doc.items) {
      if (!keys(item, ['id', 'title', 'date', 'category', 'description', 'story', 'tags', 'cover', 'gallery', 'featuredRank', 'source'])) { fail('Invalid memory fields'); continue; }
      const name = typeof item.id === 'string' ? item.id.slice(0, 64) : '?';
      if (!id(item.id) || ids.has(item.id)) fail('Invalid/duplicate memory id: ' + name);
      ids.add(item.id);
      if (!text(item.title, 140, true) || !date(item.date) || !categories.has(item.category) || !text(item.description, 600)) fail('Invalid identity/text/date/category: ' + name);
      if (item.story !== undefined && !text(item.story, 6000)) fail('Invalid story: ' + name);
      if (!Array.isArray(item.tags) || item.tags.length > 8 || item.tags.some(t => !text(t, 32, true))) fail('Invalid tags: ' + name);
      if (item.featuredRank !== undefined && item.featuredRank !== null && (!Number.isInteger(item.featuredRank) || item.featuredRank < 0 || item.featuredRank > 999)) fail('Invalid featuredRank: ' + name);
      if (!image(item.cover, item.id) || item.cover.width * item.cover.height > LIMITS.coverPixels) fail('Invalid cover/path/dimensions/alt: ' + name);
      if (item.gallery !== undefined && (!Array.isArray(item.gallery) || item.gallery.length > LIMITS.gallery || item.gallery.some(m => !image(m, item.id)))) fail('Invalid gallery: ' + name);
      const s = item.source;
      if (!keys(s, ['kind', 'creator', 'note', 'publicConfirmed', 'url']) || !['user-owned', 'used-with-permission', 'test-fixture'].includes(s.kind) || s.publicConfirmed !== true || !text(s.creator, 120, true) || !text(s.note, 1000, true) || (s.url !== undefined && !url(s.url))) fail('Invalid source/public confirmation: ' + name);
      if (s?.kind === 'test-fixture' && !doc.testFixture) fail('Fixture source cannot be published as a real memory: ' + name);
    }
    return errors;
  }
  function media(item) {
    const seen = new Set();
    return [item.cover, ...(item.gallery || [])].filter(m => m && !seen.has(m.src) && seen.add(m.src));
  }
  // Optional v1 convention: the manager pairs a derived cover with its full
  // viewing image in gallery. Legacy names retain cover-first semantics.
  function pairedDetail(item) {
    const key = item?.cover?.src?.match(/\/m-([a-f0-9]{24})-[a-f0-9]{24}-cover\.webp$/)?.[1];
    return key ? (item.gallery || []).find(m => m.src.includes('/m-' + key + '-') && /-[a-f0-9]{24}-detail\.webp$/.test(m.src)) || null : null;
  }
  function detailMedia(item) {
    const paired = pairedDetail(item);
    if (!paired) return media(item);
    return [paired, ...(item.gallery || []).filter(m => m.src !== paired.src)];
  }
  function build(doc, options) {
    const errors = validate(doc, options);
    if (errors.length) throw new Error(errors.join('; '));
    // Copy only validated JSON; public display has no project identity or Moments data.
    const copy = JSON.parse(JSON.stringify(doc));
    const items = copy.items.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
    const filter = category => category ? items.filter(i => i.category === category) : items.slice();
    const featured = items.filter(i => Number.isInteger(i.featuredRank)).sort((a, b) => a.featuredRank - b.featuredRank || a.id.localeCompare(b.id))[0] || null;
    return { items, categories: copy.categories, fixture: copy.testFixture === true, featured, filter, find: key => items.find(i => i.id === key) || null };
  }
  w.RinsoraMemoryModel = Object.freeze({ LIMITS, id, date, image, url, validate, build, media, pairedDetail, detailMedia,
    enabled(search) { const q = new URLSearchParams(search); return q.get('ui02') === '1' && q.get('memory') === '1'; } });
})(typeof window === 'undefined' ? globalThis : window);
