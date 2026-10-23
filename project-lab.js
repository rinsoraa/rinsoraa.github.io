/* Optional gallery and dialog view. script.js remains the sole hash router. */
(function (w, d) {
  'use strict';
  const M = w.RinsoraLabModel;
  if (!M) return;
  let host, dialog, panel, lightbox, model, selected = '', origin = null, currentId = '', mediaTrigger = null, galleryDeferred = false, initialized = false;
  const enabled = M.enabled(location.search) && d.documentElement.dataset.labLoadState !== 'error';
  const home = () => w.RinsoraHome;
  const read = () => M.build(w.RinsoraProjects.read(), w.RINSORA_PROJECT_LAB || {}, w.RinsoraProjects.newestFirst);
  const esc = M.esc;
  const label = category => category === 'Github项目' ? 'GitHub 项目' : category;
  function gallery() {
    const featured = model.showcase;
    host.innerHTML = '<header class="lab-intro"><div><p class="lab-eyebrow">RINSORA / CREATIVE LAB</p><h3>欢迎来到我的<br><em>创作实验室</em><span aria-hidden="true">.</span></h3><p class="lab-intro-copy">这里放着我做过的小工具、奇怪的实验，还有一些正在慢慢长大的想法。</p></div><aside class="lab-intro-note"><span>IDEAS, MADE REAL</span><b>' + String(model.items.length).padStart(2, '0') + '</b><span>件作品，慢慢生长中</span></aside></header>' +
      (featured.length ? '<section class="lab-featured" aria-labelledby="labFeaturedTitle"><div class="lab-section-heading"><div><p class="lab-eyebrow">A FEW THINGS I LOVE</p><h3 id="labFeaturedTitle">先从这几件开始</h3></div><span>SELECTED / 01</span></div><div class="lab-featured-grid">' + featured.map((p, i) => M.card(p, i === 0, galleryDeferred)).join('') + '</div></section>' : '') +
      '<section class="lab-collection" aria-labelledby="labCollectionTitle"><div class="lab-section-heading"><div><p class="lab-eyebrow">THE LITTLE COLLECTION</p><h3 id="labCollectionTitle">每个想法，都有自己的位置</h3></div><span>COLLECTION / 02</span></div><div class="lab-filters" role="group" aria-label="按作品分类浏览"><button type="button" data-lab-filter="" aria-pressed="true">全部</button>' + model.categories.map(c => '<button type="button" data-lab-filter="' + esc(c) + '" aria-pressed="false">' + esc(label(c)) + '</button>').join('') + '</div><p class="lab-result-count" role="status" aria-live="polite"></p><div class="lab-grid"></div></section>' +
      (w.GH && w.GH.hasToken() ? '<a class="lab-manage" href="project-editor.html">管理我的作品 ↗</a>' : '');
    filter();
  }
  function filter() {
    const items = model.filter(selected);
    host.querySelectorAll('[data-lab-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.labFilter === selected)));
    host.querySelector('.lab-result-count').textContent = (selected ? label(selected) + ' · ' : '') + items.length + ' 件作品';
    host.querySelector('.lab-grid').innerHTML = items.length ? items.map(p => M.card(p, false, galleryDeferred)).join('') : '<p class="lab-empty">新的想法还在路上。等它长大一点，再放到这里。</p>';
  }
  function refresh() {
    if (!initialized) return;
    model = read();
    if (!model.categories.includes(selected)) selected = '';
    gallery();
    if (dialog.open) openRoute(location.hash);
    home()?.refreshRecent();
  }
  function captureReturn() {
    if (!dialog.open) origin = { page: home().AppState.currentPage, hash: location.hash || '#about', y: scrollY, focus: d.activeElement };
    return { page: origin.page, hash: origin.hash, y: origin.y };
  }
  function imageFigure(m, index) {
    return '<figure class="lab-media" style="--media-native-width:' + m.width + 'px"><button class="lab-enlarge" type="button" data-lab-image="' + index + '" aria-label="放大：' + esc(m.alt || '作品图片') + '"><span class="lab-image-wrap" style="aspect-ratio:' + m.width + '/' + m.height + '"><span class="lab-image-unavailable">这张画面暂时没有加载出来</span><img src="' + esc(m.src) + '" width="' + m.width + '" height="' + m.height + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async"></span><span>点击放大 ↗</span></button>' + (m.caption ? '<figcaption>' + esc(m.caption) + '</figcaption>' : '') + '</figure>';
  }
  function openRoute(hash) {
    if (!initialized) return false;
    closeMedia();
    model = read();
    const id = M.route(hash);
    currentId = id || '';
    const p = model.find(currentId);
    if (!dialog.open) {
      const saved = history.state && history.state.rinsoraLab && history.state.rinsoraLab.origin;
      origin = saved ? { ...(origin || {}), ...saved } : { page: 'projects', hash: '#projects', y: 0 };
    }
    const close = '<div class="lab-dialog-top"><span>RINSORA / FIELD NOTES</span><button type="button" data-lab-close="back" aria-label="关闭作品详情">关闭 <span aria-hidden="true">×</span></button></div>';
    if (!p) {
      panel.innerHTML = close + '<div class="lab-detail-body lab-not-found"><p class="lab-eyebrow">A LITTLE DETOUR</p><h2 id="labDetailTitle">这件作品暂时找不到</h2><p>也许它换了一个位置。回实验室，看看其他正在生长的想法吧。</p><button class="lab-return" type="button" data-lab-close="list">返回创作实验室 →</button></div>';
      d.title = '作品未找到 · Rinsora Creative Lab';
    } else {
      const images = M.detailMedia(p);
      panel.innerHTML = close + '<div class="lab-detail-body"><header class="lab-detail-heading"><p class="lab-eyebrow">' + esc(label(p.category)) + ' / PROJECT NOTES</p><h2 id="labDetailTitle">' + esc(p.name) + '</h2><p class="lab-detail-description">' + esc(p.desc) + '</p><div class="lab-detail-facts"><span>' + esc(p.status || '状态未标注') + '</span><time>' + esc(p.date) + '</time></div>' + M.tags(p) + '</header>' +
        '<div class="lab-detail-layout"><section class="lab-detail-story" aria-label="关于这件作品"><h3>关于这件作品</h3>' + (p.story.length ? p.story : [p.desc || '更多创作记录，慢慢补上。']).map(t => '<p>' + esc(t) + '</p>').join('') + '<h3>它的小小特点</h3><ul>' + (p.highlights.length ? p.highlights : p.tags.length ? p.tags : ['一个留在这里，继续生长的想法。']).map(t => '<li>' + esc(t) + '</li>').join('') + '</ul></section><aside class="lab-detail-portrait">' + M.portrait(p, false) + '<p>PROJECT PORTRAIT / 作品身份</p></aside></div>' +
        '<section class="lab-detail-media" aria-label="作品画面"><div class="lab-section-heading"><h3>' + (images.length ? '一些真实的画面' : '留一点画面的位置') + '</h3><span>' + (images.length ? 'PROJECT GALLERY' : 'IN THE MAKING') + '</span></div>' + (images.length ? images.map(imageFigure).join('') : '<div class="lab-media-empty"><span aria-hidden="true">＋</span><div><strong>画面，稍后见。</strong><p>还没有放上作品截图，先从这些想法认识它。</p></div></div>') + '</section><footer class="lab-detail-footer">' + M.repository(p) + '<button class="lab-return" type="button" data-lab-close="list">返回创作实验室 →</button></footer></div>';
      d.title = p.name + ' · Rinsora Creative Lab';
    }
    d.body.classList.add('lab-detail-open');
    if (!dialog.open) dialog.showModal();
    panel.scrollTop = 0;
    panel.querySelector('[data-lab-close]').focus({ preventScroll: true });
    return true;
  }
  function hide(options) {
    if (!initialized || !dialog.open) return null;
    closeMedia();
    dialog.close();
    d.body.classList.remove('lab-detail-open');
    // A direct detail link should spend its network budget on the foreground
    // gallery, not on an obscured list thumbnail. Restore it when returning.
    if (galleryDeferred) { galleryDeferred = false; gallery(); }
    currentId = '';
    if (options && options.restoreFocus && origin?.focus?.isConnected) origin.focus.focus({ preventScroll: true });
    return origin ? { page: origin.page, hash: origin.hash, y: origin.y } : null;
  }
  function closeMedia() {
    if (!lightbox?.open) return;
    lightbox.close();
    if (dialog?.open && mediaTrigger?.isConnected) mediaTrigger.focus({ preventScroll: true });
    mediaTrigger = null;
  }
  function restoreFocus(page) {
    if (!origin || origin.page !== page) return;
    if (origin.focus?.isConnected) origin.focus.focus({ preventScroll: true });
    else if (page === 'projects') {
      const heading = host.querySelector('h3');
      heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true });
    }
  }
  function enlarge(index) {
    const p = model.find(currentId);
    if (!p) return;
    const m = M.detailMedia(p)[index];
    if (!m) return;
    mediaTrigger = d.activeElement;
    lightbox.classList.remove('lab-actual-size');
    lightbox.innerHTML = '<div class="lab-lightbox-inner"><div class="lab-lightbox-tools"><button type="button" data-lab-media-close aria-label="关闭放大图片">关闭 ×</button><button type="button" data-lab-actual aria-pressed="false">查看原尺寸</button></div><img src="' + esc(m.src) + '" width="' + m.width + '" height="' + m.height + '" alt="' + esc(m.alt) + '"><p>' + esc(m.caption) + '</p></div>';
    lightbox.showModal();
  }
  function recentCard(p, index) {
    const enriched = read().find(p.id);
    if (!enriched) return '';
    return '<article class="u2-project lab-recent' + (index === 0 ? ' u2-featured' : '') + '" data-project-id="' + esc(p.id) + '"><a class="lab-recent-main" href="' + M.href(p.id) + '">' + M.portrait(enriched) + '<div class="u2-project-copy"><span class="u2-project-category">' + esc(p.category) + (p.status ? ' · ' + esc(p.status) : '') + '</span><h4>' + esc(p.name) + '</h4><span class="u2-project-desc">' + esc(p.desc) + '</span>' + M.tags(enriched) + '<span class="u2-card-foot"><time>' + esc(p.date) + '</time><span>走近作品 ↗</span></span></div></a>' + M.repository(enriched) + '</article>';
  }
  function init() {
    if (!api.enabled || initialized) return initialized;
    if (!home() || !w.RinsoraProjects || !d.getElementById('projects')) return false;
    host = d.createElement('div'); host.id = 'creativeLab';
    d.getElementById('projects').prepend(host);
    dialog = d.createElement('dialog'); dialog.id = 'labDetail'; dialog.className = 'lab-modal'; dialog.setAttribute('aria-labelledby', 'labDetailTitle');
    panel = d.createElement('div'); panel.className = 'lab-dialog-panel'; dialog.appendChild(panel);
    lightbox = d.createElement('dialog'); lightbox.id = 'labLightbox'; lightbox.className = 'lab-lightbox'; lightbox.setAttribute('aria-label', '放大作品图片');
    d.getElementById('app').append(dialog, lightbox);
    dialog.addEventListener('cancel', e => { e.preventDefault(); home().closeLab('back'); });
    dialog.addEventListener('click', e => { if (e.target === dialog) home().closeLab('back'); });
    lightbox.addEventListener('cancel', e => { e.preventDefault(); closeMedia(); });
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox || e.target.closest('[data-lab-media-close]')) closeMedia();
      const button = e.target.closest('[data-lab-actual]');
      if (button) {
        const actual = lightbox.classList.toggle('lab-actual-size');
        button.setAttribute('aria-pressed', String(actual)); button.textContent = actual ? '适应窗口' : '查看原尺寸';
        const scroll = lightbox.querySelector('.lab-lightbox-inner'); scroll.scrollTop = 0; scroll.scrollLeft = 0;
      }
    });
    d.addEventListener('keydown', e => {
      if (e.key !== 'Tab' || e.ctrlKey || e.metaKey || !dialog.open) return;
      const active = lightbox.open ? lightbox : dialog;
      const targets = [...active.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
        .filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
      if (!targets.length) { e.preventDefault(); active.focus(); return; }
      const first = targets[0], last = targets[targets.length - 1];
      if (e.shiftKey && (d.activeElement === first || !active.contains(d.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (d.activeElement === last || !active.contains(d.activeElement))) { e.preventDefault(); first.focus(); }
    });
    d.addEventListener('click', e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target.closest('a,button');
      if (!target) return;
      if (target.hasAttribute('data-lab-filter')) { selected = target.dataset.labFilter; filter(); return; }
      if (target.hasAttribute('data-lab-close')) { home().closeLab(target.dataset.labClose); return; }
      if (target.hasAttribute('data-lab-image')) { enlarge(Number(target.dataset.labImage)); return; }
      const id = M.route(target.getAttribute('href'));
      if (id != null) { e.preventDefault(); home().openLab(id); }
    });
    d.addEventListener('error', e => {
      const image = e.target;
      if (image.tagName === 'IMG' && image.closest('.lab-image-wrap')) {
        image.hidden = true;
        image.closest('.lab-image-wrap').classList.add('lab-image-failed');
      } else if (image.tagName === 'IMG' && lightbox.contains(image)) {
        image.hidden = true; lightbox.querySelector('p').textContent = '这张画面暂时没有加载出来。';
      }
    }, true);
    initialized = true;
    galleryDeferred = /^#\/lab\//i.test(location.hash);
    d.getElementById('projects').classList.add('lab-ready');
    refresh();
    return true;
  }
  const api = w.RinsoraLab = { enabled, init, refresh, captureReturn, openRoute, hide, restoreFocus, recentCard,
    isReady: () => initialized, isOpen: () => !!dialog?.open, isMediaOpen: () => !!lightbox?.open, closeMedia };
})(window, document);
