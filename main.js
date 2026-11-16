(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  window.addEventListener('load', () => document.body.classList.add('is-loaded'));

  // Stagger reveals by group
  document.querySelectorAll('.hero__title, .steps, .bubbles, .dict, .faq__list, .postcards, .offer__grid').forEach(g => {
    g.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 0.09}s`));
  });

  // Hero title lines are clip-masked (IO can't see them) — reveal on load
  requestAnimationFrame(() => setTimeout(() => {
    document.querySelectorAll('.hero__title .reveal').forEach(el => el.classList.add('is-in'));
  }, 120));

  const els = document.querySelectorAll('.reveal:not(.hero__title .reveal)');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }

  // Nav hide on scroll down, FAB after hero
  const nav = document.querySelector('[data-nav]');
  const fab = document.querySelector('[data-fab]');
  const hero = document.querySelector('.hero');
  let last = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-hidden', y > last && y > 400);
    fab.classList.toggle('is-on', y > hero.offsetHeight * 0.7);
    last = y;
  }, { passive: true });

  // Hero subtle parallax on pointer
  const visual = document.querySelector('.hero__visual');
  if (!reduce && matchMedia('(pointer:fine)').matches && visual) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      visual.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
    });
    hero.addEventListener('pointerleave', () => { visual.style.transform = ''; });
    visual.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
  }

  // Single-open FAQ
  const dets = document.querySelectorAll('.faq details');
  dets.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) dets.forEach(o => { if (o !== d) o.open = false; });
  }));

  document.querySelectorAll('[data-year]').forEach(n => n.textContent = new Date().getFullYear());
})();
