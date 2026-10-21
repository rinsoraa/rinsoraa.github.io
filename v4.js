/* ============================================================
   v4.js —— 视觉增强层（渐进增强，无依赖）
   ------------------------------------------------------------
   做三件事：
     1. 把鼠标位置变成 CSS 变量，给背景 / 头像 / 卡片柔光用；
     2. 插入两颗偶发流星和房间内的灯光 / 标题控件；
     3. 不接管任何原有交互，失败时页面仍按 v3 完整运行。
   ============================================================ */
(() => {
  'use strict';

  const html = document.documentElement;
  html.classList.add('v4');

  const reduceMotion = (() => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  })();
  const finePointer = (() => {
    try { return matchMedia('(pointer: fine)').matches; } catch (e) { return true; }
  })();

  /* ---- 背景与欢迎页的轻微视差：用 rAF 缓动，pointermove 里不直接写布局 ---- */
  if (!reduceMotion && finePointer) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, raf = 0;
    const tick = () => {
      currentX += (targetX - currentX) * .06;
      currentY += (targetY - currentY) * .06;
      html.style.setProperty('--v4-bg-x', (-currentX * 7).toFixed(2) + 'px');
      html.style.setProperty('--v4-bg-y', (-currentY * 5).toFixed(2) + 'px');
      html.style.setProperty('--v4-rx', (-currentY * 2.4).toFixed(2) + 'deg');
      html.style.setProperty('--v4-ry', (currentX * 3.6).toFixed(2) + 'deg');
      if (Math.abs(targetX - currentX) > .0015 || Math.abs(targetY - currentY) > .0015) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      targetX = (e.clientX / Math.max(1, innerWidth) - .5) * 2;
      targetY = (e.clientY / Math.max(1, innerHeight) - .5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ---- 卡片内的柔光跟着指针走；事件委托，动态生成的卡片也生效 ---- */
  if (!reduceMotion && finePointer) {
    document.addEventListener('pointermove', (e) => {
      const card = e.target && e.target.closest && e.target.closest('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;
      card.style.setProperty('--spot-x', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      card.style.setProperty('--spot-y', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  /* ---- 偶发流星：不是循环刷屏，14–20 秒才一颗 ---- */
  if (!reduceMotion) {
    for (let i = 0; i < 2; i++) {
      const meteor = document.createElement('i');
      meteor.className = 'v4-meteor' + (i === 1 ? ' m2' : '');
      meteor.setAttribute('aria-hidden', 'true');
      meteor.style.animationDelay = (i === 0 ? 2.5 : 10.5) + 's';
      document.body.appendChild(meteor);
    }
  }

  /* ---- 3D 房间：灯光开关 + 左下角小标题（只加在桌面端房间上） ---- */
  function enhanceRoom() {
    const section = document.getElementById('roomSection');
    if (!section || section.dataset.v4Enhanced === '1') return false;
    section.dataset.v4Enhanced = '1';

    const caption = document.createElement('div');
    caption.className = 'room-caption';
    caption.innerHTML = '<i class="dot"></i><b>RINSORA\'S ROOM</b><em>点击房间里的家具 · 探索小窝</em>';
    caption.setAttribute('aria-hidden', 'true');
    section.appendChild(caption);

    const light = document.createElement('button');
    light.id = 'roomLight';
    light.type = 'button';
    light.dataset.night = '1';
    light.setAttribute('aria-pressed', 'true');
    light.setAttribute('aria-label', '切换房间灯光');
    light.innerHTML = '<span class="bulb" aria-hidden="true">☾</span><span class="label">夜灯</span>';
    const syncLightUI = (night) => {
      light.dataset.night = night ? '1' : '0';
      light.querySelector('.bulb').textContent = night ? '☾' : '☀';
      light.querySelector('.label').textContent = night ? '夜灯' : '日光';
      light.setAttribute('aria-pressed', String(night));
    };
    light.addEventListener('click', () => {
      const next = light.dataset.night !== '1';
      syncLightUI(next);
      if (window.__room && typeof window.__room.setNight === 'function') {
        window.__room.setNight(next);
      } else {
        // 场景模块还在加载：等它挂好后再执行一次，不让第一次点击丢失。
        setTimeout(() => {
          if (window.__room && typeof window.__room.setNight === 'function') window.__room.setNight(next);
        }, 500);
      }
    });
    // 房间墙上的木质按钮也能切昼夜；把 3D 内部状态同步回玻璃按钮。
    window.addEventListener('room:night', (e) => {
      if (e && e.detail && typeof e.detail.night === 'boolean') syncLightUI(e.detail.night);
    });
    section.appendChild(light);
    return true;
  }

  if (!enhanceRoom()) {
    const roomWatch = new MutationObserver(() => {
      if (enhanceRoom()) roomWatch.disconnect();
    });
    roomWatch.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => roomWatch.disconnect(), 15000);
  }

  // 给 CSS 一个「增强层已就绪」的钩子，方便后续迭代按需开动画。
  requestAnimationFrame(() => document.body.classList.add('v4-ready'));
})();
