/* NEXUS ARCHITECTS — страница Levitate Mass: 3D-вкладки, планировки, лайтбокс */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ── вкладки 3D-модели ─────────────────────────────────────────────
(function () {
  const views = {
    top: 'assets/img/3D.png',
    left: 'assets/img/LM%201.png',
    right: 'assets/img/LM%203.png',
    bottom: 'assets/img/3D.png',
  };
  const img = $('#model-img');
  const tabs = $$('.model-tab');
  if (!img || !tabs.length) return;
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
    const src = views[tab.dataset.view] || views.top;
    img.style.opacity = '0';
    setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 180);
  }));
})();

// ── переключатель планировок ──────────────────────────────────────
(function () {
  const plan = 'assets/img/FLOOR%20PLAN.png';
  const floors = [
    { img: plan, label: 'Уровень 01', dl: 'Levitate-Mass-Level-01.png' },
    { img: plan, label: 'Уровень 02', dl: 'Levitate-Mass-Level-02.png' },
    { img: plan, label: 'Уровень 03', dl: 'Levitate-Mass-Level-03.png' },
  ];
  const fpImg = $('#fp-img'), fpLabel = $('#fp-label'), fpDownload = $('#fp-download');
  const dots = $$('#fp-dots .fp-dot');
  if (!fpImg) return;
  let current = 0;
  function goTo(idx) {
    current = (idx + floors.length) % floors.length;
    fpImg.style.opacity = '0';
    setTimeout(() => {
      fpImg.src = floors[current].img;
      fpImg.alt = floors[current].label + ' — Levitate Mass';
      fpImg.style.opacity = '1';
      fpLabel.textContent = floors[current].label;
      fpDownload.href = floors[current].img;
      fpDownload.download = floors[current].dl;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }, 180);
  }
  $('#fp-prev').addEventListener('click', () => goTo(current - 1));
  $('#fp-next').addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
})();

// ── лайтбокс галереи ──────────────────────────────────────────────
(function () {
  const overlay = $('#lightbox'), lbImg = $('#lightbox-img'), lbClose = $('#lightbox-close');
  if (!overlay) return;
  const items = $$('.gallery-item');
  let index = 0, lastFocus = null;

  const show = (i) => {
    index = (i + items.length) % items.length;
    const el = items[index];
    lbImg.src = el.dataset.src || $('img', el).src;
    lbImg.alt = $('img', el).alt || '';
  };
  const open = (i, trigger) => {
    lastFocus = trigger;
    show(i);
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
    lbClose.focus();
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i, item));
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, item); } });
  });
  lbClose.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  // свайп на телефоне
  let x0 = null;
  overlay.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
