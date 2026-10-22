/* Optional UI-02 presentation. Data and routing remain owned by script.js. */
(() => {
  'use strict';
  if (new URLSearchParams(location.search).get('ui02') !== '1') return;
  document.documentElement.classList.add('ui02-preview');
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'ui02.css?v=ui03e-3';
  document.head.appendChild(css);

  const esc = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  // Only visual metadata lives here; article/project content has no second source.
  const articleImages = {
    'posts/post-2026-10-04.html': { src: 'assets/blog/20261004-031406.png', width: 979, height: 507, alt: '文章中的 API 请求与 Token 用量记录' },
    'posts/hello.html': { src: 'assets/blog/20260921-094604.jpg', width: 1080, height: 1080, alt: 'Hello 文章中的罐头插画' }
  };
  const identities = {
    'dsh-pulse-rail': 'pulse', catoobot: 'bot', trayhider: 'window',
    'markdown-reader': 'document'
  };
  const marks = {
    pulse: '<svg viewBox="0 0 280 80" fill="none"><path d="M0 40H30L38 29L46 51L54 16L62 65L70 26L78 49L86 35H106L114 18L122 62L130 6L138 73L146 23L154 53L162 33H184L192 24L200 56L208 14L216 66L224 30L232 48L240 40H280" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bot: '<span class="u2-bot-face"><i></i><i></i></span>',
    window: '<span class="u2-window-mark"><i></i><i></i><i></i></span>',
    document: '<span class="u2-document-mark">Aa<span>— &nbsp; —<br>———</span></span>',
    generic: '<span class="u2-generic-mark">&lt; / &gt;</span>'
  };
  function section(title, label, content, kind, count) {
    return '<section class="u2-recent-section u2-' + kind + '" aria-label="' + title + '">' +
      '<div class="u2-section-head"><div><span>' + label + '</span><h3>' + title + '</h3></div>' +
      '<span class="u2-section-count">' + String(count).padStart(2, '0') + ' SELECTED</span></div>' + content + '</section>';
  }
  function postCard(p, index) {
    const image = articleImages[p.href];
    const figure = image ? '<span class="u2-post-image"><img src="' + image.src + '" width="' + image.width + '" height="' + image.height + '" alt="' + image.alt + '" loading="lazy" decoding="async"></span>' : '';
    return '<a class="u2-post' + (index === 0 ? ' u2-featured' : '') + '" href="' + esc(p.href) + '">' +
      '<span class="u2-post-meta"><span>' + (index === 0 ? 'LATEST NOTE' : 'NOTE ' + String(index + 1).padStart(2, '0')) + '</span><span>' + esc(p.category) + '</span></span>' +
      '<h4>' + esc(p.title) + '</h4><p>' + esc(p.desc) + '</p>' + figure +
      '<span class="u2-card-foot"><time>' + esc(p.date) + '</time><span>阅读文章 <b aria-hidden="true">↗</b></span></span></a>';
  }
  function projectCard(p, index) {
    const identity = Object.prototype.hasOwnProperty.call(identities, p.id) ? identities[p.id] : 'generic';
    const tag = p.url ? 'a' : 'article';
    const attrs = p.url ? ' href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer"' : '';
    const tags = Array.isArray(p.tags) ? p.tags : [];
    return '<' + tag + ' class="u2-project' + (index === 0 ? ' u2-featured' : '') + '" data-project-id="' + esc(p.id) + '"' + attrs + '>' +
      '<span class="u2-project-visual u2-identity-' + identity + '" aria-hidden="true"><span class="u2-visual-label">PROJECT IDENTITY / ' + String(index + 1).padStart(2, '0') + '</span>' +
      marks[identity] + '<span class="u2-visual-name">' + esc(p.name || '未命名项目') + '</span></span>' +
      '<div class="u2-project-copy"><span class="u2-project-category">' + esc(p.category || 'PROJECT') + (p.status ? ' · ' + esc(p.status) : '') + '</span>' +
      '<h4>' + esc(p.name || '未命名项目') + '</h4><span class="u2-project-desc">' + esc(p.desc || '') + '</span>' +
      '<span class="u2-project-tags">' + tags.map(t => '<span>' + esc(t) + '</span>').join('') + '</span>' +
      '<span class="u2-card-foot"><time>' + esc(p.date) + '</time><span>' + (p.url ? '查看项目 ↗' : '项目记录') + '</span></span></div></' + tag + '>';
  }
  window.RinsoraUI02 = {
    renderRecent(posts, projects) {
      let content = '';
      if (posts.length) content += section('最近写下的', 'JOURNAL / NOTES & EXPERIMENTS',
        '<div class="u2-post-grid" data-count="' + posts.length + '">' + posts.map(postCard).join('') + '</div>', 'journal', posts.length);
      if (projects.length) content += section('把想法做出来', 'SELECTED WORK / LITTLE INVENTIONS',
        '<div class="u2-project-grid" data-count="' + projects.length + '">' + projects.map(projectCard).join('') + '</div>', 'showcase', projects.length);
      return content;
    }
  };
})();
