/* A single local dialog. Existing RinsoraHome owns section/history navigation. */
(function (w, d) {
  'use strict';
  const M = w.RinsoraMemoryModel;
  if (!M) return;
  let host, model, dialog, panel, grid, feature, status, more, previous, empty, selected = '', shown = M.LIMITS.batch;
  let initialized = false, origin = null, current = null, currentImages = [], currentIndex = 0, events, resolveImage;
  const home = () => w.RinsoraHome;
  const node = (tag, cls, text) => { const e = d.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  function button(text, action, cls) { const b = node('button', cls, text); b.type = 'button'; b.addEventListener('click', action); return b; }
  function imageBox(m, eager) {
    const frame = node('div', 'memory-image'); frame.style.aspectRatio = m.width + '/' + m.height;
    const fallback = node('span', 'memory-image-fallback', '这张画面暂时没有加载出来。文字与故事还在。'); fallback.hidden = true;
    const img = node('img'); img.width = m.width; img.height = m.height; img.alt = m.alt; img.loading = eager ? 'eager' : 'lazy'; img.decoding = 'async'; img.fetchPriority = eager ? 'high' : 'auto';
    function failed() { img.hidden = true; fallback.hidden = false; frame.dataset.imageState = 'failed'; }
    img.addEventListener('error', failed, { once: true });
    img.addEventListener('load', () => { if (img.naturalWidth !== m.width || img.naturalHeight !== m.height) failed(); else frame.dataset.imageState = 'ready'; }, { once: true });
    img.src = resolveImage ? resolveImage(m.src) : m.src; frame.append(img, fallback); return frame;
  }
  function category(id) { return model.categories.find(c => c.id === id)?.label || id; }
  function card(item, featured, firstVisible) {
    const article = node('article', 'memory-card' + (featured ? ' memory-feature-card' : ''));
    article.dataset.memoryId = item.id;
    const link = button('', () => open(item.id), 'memory-card-button'); link.dataset.memoryOpen = item.id;
    link.setAttribute('aria-label', '翻开回忆：' + item.title);
    link.append(imageBox(item.cover, (featured || firstVisible) && (home()?.AppState.currentPage === 'moments' || d.documentElement.dataset.preSection === 'moments')));
    const copy = node('div', 'memory-card-copy');
    const fact = node('p', 'memory-card-meta'); const time = node('time', '', item.date); time.dateTime = item.date;
    fact.append(node('span', '', category(item.category)), time);
    copy.append(fact, node('h4', '', item.title), node('p', 'memory-description', item.description));
    const tags = node('div', 'memory-tags'); item.tags.forEach(t => tags.append(node('span', '', t))); copy.append(tags);
    copy.append(node('span', 'memory-card-foot', featured ? '精选的一页 · 翻开看看 ↗' : '翻开这一页 ↗'));
    link.append(copy); article.append(link); return article;
  }
  function draw() {
    const items = model.filter(selected), featured = !selected ? model.featured : null;
    const others = items.filter(i => i !== featured);
    host.querySelectorAll('[data-memory-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.memoryFilter === selected)));
    feature.replaceChildren(); feature.hidden = !featured;
    if (featured) { feature.append(node('p', 'memory-eyebrow', 'A PAGE TO KEEP / 精选回忆'), card(featured, true)); }
    grid.replaceChildren(...others.slice(Math.max(0, shown - M.LIMITS.batch), shown).map((i, index) => card(i, false, !featured && index === 0)));
    more.hidden = shown >= others.length;
    previous.hidden = shown <= M.LIMITS.batch;
    more.textContent = '下一页 · 还有 ' + Math.max(0, others.length - shown) + ' 段回忆';
    empty.hidden = items.length !== 0;
    empty.querySelector('h4').textContent = selected && model.items.length ? '这一页，还在等一个喜欢的瞬间。' : '回忆册还空着。';
    empty.querySelector('p').textContent = selected && model.items.length ? '换一个分类，也许就能遇见。' : '等遇见喜欢的瞬间，再慢慢把它们装进来。';
    empty.querySelector('button').hidden = !selected;
    status.textContent = (selected ? category(selected) + ' · ' : '') + items.length + ' 段回忆' + (featured ? '，其中 1 页精选' : '');
    host.querySelector('.memory-total').textContent = String(model.items.length).padStart(2, '0');
  }
  function showImage(index) {
    if (!dialog?.open || !currentImages.length) return;
    currentIndex = (index + currentImages.length) % currentImages.length;
    const m = currentImages[currentIndex], figure = panel.querySelector('.memory-detail-figure');
    figure.replaceChildren(imageBox(m, true), node('figcaption', '', m.caption || m.alt));
    panel.querySelector('.memory-image-count').textContent = (currentIndex + 1) + ' / ' + currentImages.length;
    panel.querySelectorAll('[data-memory-index]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.memoryIndex) === currentIndex)));
  }
  function open(id) {
    const item = model?.find(id);
    if (!initialized || !item || !home()) return false;
    if (!dialog.open) {
      const samePage = home().AppState.currentPage === 'moments', focus = d.activeElement;
      const y = samePage ? w.scrollY : 0;
      // The existing router also cancels pending Museum requests, before they
      // acquire museum-open. Do not infer lifecycle only from visible classes.
      home().navigateTo('moments', { scrollY: y, silent: true });
      origin = { focus: focus?.closest?.('#memoryGalleryMount') ? focus : null, y };
    }
    home().closeSettings(); w.RinsoraRoom?.leave();
    current = item; currentImages = M.detailMedia(item); currentIndex = 0;
    panel.replaceChildren();
    const top = node('div', 'memory-dialog-top'); top.append(node('span', 'memory-eyebrow', 'A LITTLE MEMORY / 一页收藏'), button('关闭 ×', () => hide({ restore: true }), 'memory-close'));
    panel.append(top);
    if (model.fixture) panel.append(node('p', 'memory-fixture', 'TEST FIXTURE · 仅验证功能，不是真实回忆'));
    const title = node('h2', '', item.title); title.id = 'memoryDetailTitle';
    const meta = node('p', 'memory-detail-meta', item.date + ' · ' + category(item.category));
    panel.append(title, meta, node('figure', 'memory-detail-figure'));
    const controls = node('div', 'memory-image-controls');
    const prev = button('← 上一张', () => showImage(currentIndex - 1)); prev.disabled = currentImages.length < 2;
    const next = button('下一张 →', () => showImage(currentIndex + 1)); next.disabled = currentImages.length < 2;
    const count = node('span', 'memory-image-count'); count.setAttribute('aria-live', 'polite'); controls.append(prev, count, next);
    panel.append(controls);
    if (currentImages.length > 1) {
      const pages = node('div', 'memory-image-pages'); pages.setAttribute('role', 'group'); pages.setAttribute('aria-label', '选择照片');
      currentImages.forEach((m, i) => { const b = button('第 ' + (i + 1) + ' 张', () => showImage(i)); b.dataset.memoryIndex = i; b.setAttribute('aria-label', '第 ' + (i + 1) + ' 张：' + m.alt); pages.append(b); }); panel.append(pages);
    }
    panel.append(node('p', 'memory-detail-description', item.description));
    if (item.story) { const story = node('section', 'memory-story'); story.setAttribute('aria-label', '这段回忆的故事'); item.story.split(/\n+/).filter(Boolean).forEach(p => story.append(node('p', '', p))); panel.append(story); }
    const source = node('footer', 'memory-source'); source.append(node('p', '', '素材：' + item.source.creator), node('p', '', item.source.note), node('small', '', '公开状态：已由提供者确认；此声明不代替独立版权或隐私核查。'));
    if (item.source.url) { const a = node('a', '', '素材来源 ↗'); a.href = item.source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; source.append(a); }
    panel.append(source);
    d.body.classList.add('memory-detail-open'); if (!dialog.open) dialog.showModal();
    panel.scrollTop = 0; showImage(0); top.querySelector('button').focus({ preventScroll: true });
    return true;
  }
  function hide(options) {
    if (!dialog?.open) return false;
    dialog.close(); d.body.classList.remove('memory-detail-open'); panel.replaceChildren(); current = null; currentImages = [];
    if (options?.restore && home()?.AppState.currentPage === 'moments' && origin) {
      w.scrollTo({ top: origin.y, behavior: 'instant' });
      if (origin.focus?.isConnected) origin.focus.focus({ preventScroll: true });
      else { const heading = host.querySelector('h3'); heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
    return true;
  }
  function pageChanged(page, options) {
    if (!(page === 'moments' && home()?.AppState.currentPage === 'moments' && options?.silent)) hide();
    if (page === 'moments') { const first = host?.querySelector('img'); if (first) first.loading = 'eager'; }
  }
  function destroy() {
    hide(); events?.abort(); dialog?.remove();
    if (host) { host.replaceChildren(); host.hidden = true; host.inert = false; host.className = ''; }
    d.body.classList.remove('memory-detail-open'); initialized = false; selected = ''; shown = M.LIMITS.batch; origin = null; resolveImage = null;
  }
  function init(doc, options) {
    if (initialized) return true;
    if (!M.enabled(location.search) || !d.getElementById('memoryGalleryMount')) return false;
    model = M.build(doc, { allowFixtures: doc?.testFixture === true }); events = new AbortController();
    // Only a trusted caller (the isolated editor preview) may supply a resolver;
    // the JSON schema never accepts executable functions or blob paths.
    resolveImage = typeof options?.resolveImage === 'function' ? options.resolveImage : null;
    host = d.getElementById('memoryGalleryMount'); host.replaceChildren(); host.className = 'memory-book'; host.hidden = false; host.inert = !home(); host.setAttribute('aria-busy', String(!home()));
    if (model.fixture) host.append(node('p', 'memory-fixture', 'TEST FIXTURE · 布局与交互样例，不是真实回忆'));
    const intro = node('header', 'memory-intro');
    const text = node('div'); text.append(node('p', 'memory-eyebrow', 'THE LITTLE MEMORY BOOK'), node('h3', '', '把喜欢的瞬间，悄悄收藏起来。'), node('p', 'memory-intro-copy', '一些路过的风景，一些做过的梦，还有不想忘记的小小瞬间。'));
    const heading = text.querySelector('h3'); heading.replaceChildren(node('span', '', '把喜欢的瞬间，'), node('span', '', '悄悄收藏起来。'));
    const note = node('aside', 'memory-bookmark'); note.setAttribute('aria-label', '收藏数量'); note.append(node('span', '', 'KEEP THE LITTLE THINGS'), node('b', 'memory-total', '00'), node('span', '', '段回忆，慢慢装满')); intro.append(text, note); host.append(intro);
    const filters = node('div', 'memory-filters'); filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', '按回忆分类浏览');
    [{ id: '', label: '全部' }, ...model.categories].forEach(c => { const b = button(c.label, () => { selected = c.id; shown = M.LIMITS.batch; draw(); }); b.dataset.memoryFilter = c.id; filters.append(b); });
    status = node('p', 'memory-result'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    feature = node('section', 'memory-featured'); feature.setAttribute('aria-label', '精选回忆');
    grid = node('div', 'memory-grid'); more = button('再翻几页', () => { shown = Math.min(Math.ceil(M.LIMITS.items / M.LIMITS.batch) * M.LIMITS.batch, shown + M.LIMITS.batch); draw(); grid.querySelector('button')?.focus({ preventScroll: true }); grid.scrollIntoView({ block: 'start', behavior: 'auto' }); }, 'memory-more');
    previous = button('← 上一页', () => { shown = Math.max(M.LIMITS.batch, shown - M.LIMITS.batch); draw(); grid.querySelector('button')?.focus({ preventScroll: true }); grid.scrollIntoView({ block: 'start', behavior: 'auto' }); }, 'memory-previous');
    empty = node('div', 'memory-empty');
    const papers = node('div', 'memory-empty-papers'); papers.setAttribute('aria-hidden', 'true'); papers.append(node('span'), node('span'), node('i', '', 'a little space\nfor a lovely day'));
    empty.append(papers, node('h4'), node('p'), button('看看全部回忆', () => { selected = ''; draw(); }));
    host.append(filters, status, feature, grid, empty, previous, more);
    dialog = node('dialog', 'memory-dialog'); dialog.id = 'memoryDetail'; dialog.setAttribute('aria-labelledby', 'memoryDetailTitle');
    panel = node('div', 'memory-detail-panel'); dialog.append(panel); d.body.append(dialog);
    dialog.addEventListener('cancel', e => { e.preventDefault(); hide({ restore: true }); }, { signal: events.signal });
    dialog.addEventListener('click', e => { if (e.target === dialog) hide({ restore: true }); }, { signal: events.signal });
    dialog.addEventListener('close', () => { if (!dialog.open) d.body.classList.remove('memory-detail-open'); }, { signal: events.signal });
    dialog.addEventListener('keydown', e => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key) && currentImages.length > 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); showImage(currentIndex + (e.key === 'ArrowLeft' ? -1 : 1)); }
      if (e.key === 'Tab') {
        const targets = [...dialog.querySelectorAll('button:not(:disabled),a[href]')].filter(e => e.getClientRects().length), first = targets[0], last = targets[targets.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }, { signal: events.signal });
    w.addEventListener('pagehide', () => hide(), { signal: events.signal });
    initialized = true; draw(); return true;
  }
  function activate() {
    if (!initialized || !home()) return false;
    host.inert = false; host.setAttribute('aria-busy', 'false'); return true;
  }
  w.RinsoraMemory = { init, activate, open, hide, close: () => hide({ restore: true }), isOpen: () => !!dialog?.open, pageChanged, destroy };
})(window, document);
