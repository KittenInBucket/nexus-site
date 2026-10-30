/* NEXUS ARCHITECTS — main.js */
'use strict';

document.documentElement.classList.remove('no-js');

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ── HEADER: фон при прокрутке ──────────────────────────────────────
const header = $('#site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── BURGER MENU ────────────────────────────────────────────────────
const burger = $('#burger');
const nav = $('#main-nav');
if (burger && nav) {
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  // при переходе на десктопную ширину меню закрываем
  window.matchMedia('(min-width:721px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
}

// ── SCROLL REVEAL ──────────────────────────────────────────────────
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ── SMOOTH ANCHOR SCROLL (учитывает высоту шапки) ──────────────────
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 80) - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── АКТИВНЫЙ ПУНКТ МЕНЮ ───────────────────────────────────────────
(function markActivePage() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const section = document.body.dataset.section; // например "projects" для страниц проектов
  $$('.nav a').forEach(a => {
    const page = (a.getAttribute('href') || '').split('#')[0];
    if (page === path || (section && page === section + '.html')) a.setAttribute('aria-current', 'page');
  });
})();

// ── УВЕДОМЛЕНИЕ ПОСЛЕ ОТПРАВКИ ФОРМЫ ───────────────────────────────
const notice = $('#signup-notice');
let noticeTimer;
function showNotice(title, text) {
  if (!notice) return;
  $('strong', notice).textContent = title;
  $('p', notice).textContent = text;
  notice.classList.add('is-visible');
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => notice.classList.remove('is-visible'), 5000);
}
const noticeClose = $('#signup-notice-close');
if (noticeClose) noticeClose.addEventListener('click', () => notice.classList.remove('is-visible'));

/* ВАЖНО: на сайте нет сервера, поэтому формы только показывают уведомление.
   Чтобы письма реально приходили, подключите сервис форм (Formspree, Getform и т.п.):
   достаточно добавить форме action="https://…" и method="post" и убрать preventDefault ниже. */
$$('form[data-demo-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    form.reset();
    showNotice(form.dataset.title || 'Спасибо!', form.dataset.text || 'Мы получили ваше сообщение и скоро ответим.');
  });
});

// ── TEAM MODAL (главная) ──────────────────────────────────────────
const modalOverlay = $('#team-modal');
if (modalOverlay) {
  const modalImg = $('#modal-img'), modalName = $('#modal-name'), modalRole = $('#modal-role'),
        modalBio = $('#modal-bio'), modalClose = $('#modal-close');
  let lastFocus = null;
  const openModal = (m) => {
    lastFocus = m;
    modalImg.src = m.dataset.img || '';
    modalImg.alt = m.dataset.name || '';
    modalName.textContent = m.dataset.name || '';
    modalRole.textContent = m.dataset.role || '';
    modalBio.textContent = m.dataset.bio || '';
    modalOverlay.classList.add('open');
    document.body.classList.add('modal-open');
    modalClose.focus();
  };
  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  };
  $$('.team-member').forEach(m => {
    m.addEventListener('click', () => openModal(m));
    m.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(m); } });
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });
}

// ── ФИЛЬТР ПРОЕКТОВ (projects.html) ───────────────────────────────
const filterBar = $('#filters');
if (filterBar) {
  const cards = $$('.projects-all .proj-card');
  const empty = $('#empty-note');
  // счётчики
  $$('.filter', filterBar).forEach(btn => {
    const f = btn.dataset.filter;
    const n = f === 'all' ? cards.length : cards.filter(c => c.dataset.type === f).length;
    const span = document.createElement('span');
    span.className = 'filter-count';
    span.textContent = n;
    btn.appendChild(span);
  });
  const apply = (f) => {
    let shown = 0;
    cards.forEach(c => {
      const ok = f === 'all' || c.dataset.type === f;
      c.classList.toggle('is-hidden', !ok);
      if (ok) { shown++; c.classList.add('in'); }
    });
    if (empty) empty.style.display = shown ? 'none' : 'block';
    $$('.filter', filterBar).forEach(b => {
      const on = b.dataset.filter === f;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    try { history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f); } catch (_) {}
  };
  filterBar.addEventListener('click', e => {
    const b = e.target.closest('.filter');
    if (b) apply(b.dataset.filter);
  });
  const fromHash = location.hash.slice(1);
  if (fromHash && $(`.filter[data-filter="${fromHash}"]`, filterBar)) apply(fromHash);
}
