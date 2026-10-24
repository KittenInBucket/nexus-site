/* NEXUS ARCHITECTS — main.js */
'use strict';

// remove no-js class
document.documentElement.classList.remove('no-js');

// ── HEADER: scroll shadow ──────────────────────────────────────────
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── BURGER MENU ────────────────────────────────────────────────────
const burger = document.getElementById('burger');
const nav    = document.getElementById('main-nav');
if (burger && nav) {
  const toggle = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', open);
    if (header) header.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => {
    toggle(document.body.classList.contains('menu-open') ? false : true);
  });
  // close on nav link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggle(false));
  });
  // close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) toggle(false);
  });
  // close on outside click
  document.addEventListener('click', e => {
    if (document.body.classList.contains('menu-open') &&
        !nav.contains(e.target) && !burger.contains(e.target)) {
      toggle(false);
    }
  });
}

// ── SCROLL REVEAL ──────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ── SMOOTH ANCHOR SCROLL ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = (header ? header.offsetHeight : 80) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── TEAM MODAL ────────────────────────────────────────────────────
const modalOverlay = document.getElementById('team-modal');
if (modalOverlay) {
  const modalImg  = document.getElementById('modal-img');
  const modalName = document.getElementById('modal-name');
  const modalRole = document.getElementById('modal-role');
  const modalBio  = document.getElementById('modal-bio');
  const modalClose = document.getElementById('modal-close');

  const openModal = (member) => {
    modalImg.src        = member.dataset.img || '';
    modalImg.alt        = member.dataset.name || '';
    modalName.textContent = member.dataset.name || '';
    modalRole.textContent = member.dataset.role || '';
    modalBio.textContent  = member.dataset.bio  || '';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  };
  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.team-member').forEach(m => {
    m.addEventListener('click', () => openModal(m));
    m.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(m); } });
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ── ACTIVE NAV LINK (current page) ───────────────────────────────
(function markActivePage() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const page = href.split('/').pop().split('#')[0] || 'index.html';
    if (page && page === path) a.setAttribute('aria-current', 'page');
  });
})();
