/* ══════════════════════════════════════════════════════════════
   SIVA INMIGRACIÓN — main.js
══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ── Loader ────────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  const hideLoader = () => loader && loader.classList.add('loaded');
  window.addEventListener('load', () => setTimeout(hideLoader, 700));
  // Safety net in case 'load' is delayed by slow third-party assets
  setTimeout(hideLoader, 3500);

  /* ── Footer year ───────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Navbar scroll state ───────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  const toggleMenu = (open) => {
    hamburger.classList.toggle('active', open);
    mobMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  hamburger.addEventListener('click', () => toggleMenu(!mobMenu.classList.contains('open')));
  mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ── Marquee content (services ticker, duplicated for seamless loop) ── */
  const services = [
    'Visas', 'Residencia LPR', 'Ciudadanía', 'Perdón Consular',
    'Perdón I-212 / I-601', 'Deportaciones', 'Actas y Apostillas',
    'U.S. Passport', 'CRBA', 'Inversiones'
  ];
  const marqueeInner = document.getElementById('marquee');
  if (marqueeInner) {
    const buildSet = () => services.map(s =>
      `<span class="marquee-item"><i class="fa-solid fa-circle"></i>${s}</span>`
    ).join('');
    marqueeInner.innerHTML = buildSet() + buildSet();
  }

  /* ── Reveal on scroll ──────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Counters (data-count / data-prefix / data-suffix) ──── */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const format = (n) => Math.round(n).toLocaleString('es-MX');

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + format(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ── Hero canvas particle orbs ─────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    const colors = ['rgba(108,116,232,', 'rgba(255,0,0,', 'rgba(0,166,81,'];
    let particles = [];
    let w, h;

    const resize = () => {
      const hero = document.getElementById('hero');
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    };

    const initParticles = () => {
      const count = w < 700 ? 18 : 34;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.15
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ── Contact form → WhatsApp ───────────────────────────── */
  const WHATSAPP_NUMBER = '523312161840';
  const form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) {
        form.reportValidity();
        return;
      }

      const lines = [
        `Hola, soy ${name}.`,
        `Me interesa: ${interest}.`,
        `${msg}`
      ];
      const text = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }
})();
