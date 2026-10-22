/* Reuse the site's router and room controller. No animation loop. */
(() => {
  'use strict';
  const projects = document.getElementById('heroProjects');
  const room = document.getElementById('heroRoom');
  const status = document.getElementById('heroRoomStatus');
  const image = document.getElementById('homeHeroImage');
  function prepareImage() {
    image.loading = 'eager';
    // Cover's workbench is a 130px vignette on mobile. Its existing eager
    // loading remains, but the room background owns the critical image slot.
    image.fetchPriority = document.documentElement.classList.contains('cover-preview') ? 'low' : 'high';
  }
  document.getElementById('enterBtn')?.addEventListener('click', prepareImage, { capture: true, once: true });
  projects.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (window.RinsoraHome) {
      event.preventDefault();
      window.RinsoraHome.navigateTo('projects');
    }
  });
  room.addEventListener('click', async () => {
    room.disabled = true;
    room.setAttribute('aria-busy', 'true');
    status.textContent = '正在准备房间…';
    try {
      const entered = await window.RinsoraRoom.enter();
      status.textContent = entered ? '' : '房间暂未准备好，请稍后重试。';
    } catch (error) {
      status.textContent = '房间加载失败，请稍后重试。';
    } finally {
      room.disabled = false;
      room.removeAttribute('aria-busy');
    }
  });
  // Welcome stays light: promote only when its exit begins, or on a direct route.
  function promote() {
    if (!document.getElementById('welcomeScreen')?.classList.contains('hidden') &&
        !document.documentElement.hasAttribute('data-pre-section') &&
        !document.getElementById('about')?.closest('.app')?.classList.contains('visible')) return;
    prepareImage();
    watch.disconnect();
  }
  const watch = new MutationObserver(promote);
  watch.observe(document.getElementById('welcomeScreen'), { attributes: true, attributeFilter: ['class'] });
  watch.observe(document.querySelector('.app'), { attributes: true, attributeFilter: ['class'] });
  promote();
})();
