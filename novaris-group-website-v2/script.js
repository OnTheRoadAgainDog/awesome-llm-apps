/* ===========================================================
   Novaris Group v2 — UI interactions
   custom cursor · magnetic buttons · tilt · reveals · counters
   =========================================================== */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* --- header + scroll progress --- */
  const hdr = document.getElementById('hdr');
  const bar = document.getElementById('scrollProgress');
  const onScroll = () => {
    hdr.classList.toggle('scrolled', window.scrollY > 12);
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- mobile nav --- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );

  /* --- reveal on scroll --- */
  const fx = document.querySelectorAll('[data-fx]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e, i) => {
        if (e.isIntersecting) {
          // small stagger for siblings entering together
          setTimeout(() => e.target.classList.add('in'), (i % 6) * 70);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fx.forEach((el) => io.observe(el));
  } else {
    fx.forEach((el) => el.classList.add('in'));
  }

  /* --- animated counters --- */
  const counters = document.querySelectorAll('[data-count]');
  const run = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const start = performance.now(), dur = 1500;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || '')));
  }

  /* --- desktop-only: subtle card tilt + glow-follow (kept restrained for a
         professional feel; no custom cursor or magnetic gimmicks) --- */
  if (fine && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(1100px) rotateY(${(px - 0.5) * 3.5}deg) rotateX(${(0.5 - py) * 3.5}deg) translateY(-3px)`;
        el.style.setProperty('--mx', px * 100 + '%');
        el.style.setProperty('--my', py * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* --- contact form (front-end only) --- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    note.hidden = false;
    if (!name || !ok) {
      note.style.color = '#f87171';
      note.textContent = 'Please enter your name and a valid email address.';
      return;
    }
    note.style.color = '';
    note.textContent = `Thanks, ${name}! Connect this form to a backend or form service to deliver it.`;
    form.reset();
  });

  /* --- year --- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
