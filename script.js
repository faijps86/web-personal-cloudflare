// Tema claro/oscuro
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme') ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(saved);
themeBtn.addEventListener('click', () =>
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
function setTheme(t) {
  root.dataset.theme = t;
  localStorage.setItem('theme', t);
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
}

// Menú móvil
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

// Header con borde al hacer scroll + enlace activo
const header = document.getElementById('header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10));
const links = [...navLinks.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Animaciones de aparición y contadores
const counters = document.querySelectorAll('[data-count]');
function animateCount(el) {
  const target = +el.dataset.count;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / 1200, 1);
    el.textContent = Math.round(target * p) + (p === 1 ? '+' : '');
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const reveal = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      en.target.querySelectorAll('[data-count]').forEach(animateCount);
      reveal.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

// Filtro de proyectos
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.project').forEach(p =>
    p.classList.toggle('hide', btn.dataset.filter !== 'all' && p.dataset.cat !== btn.dataset.filter));
});

// Validación del formulario (demo: no envía datos)
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('input, textarea').forEach(f => {
    const field = f.closest('.field');
    let msg = '';
    if (!f.value.trim()) msg = 'Este campo es obligatorio.';
    else if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)) msg = 'Introduce un email válido.';
    field.classList.toggle('error', !!msg);
    field.querySelector('small').textContent = msg;
    if (msg) ok = false;
  });
  status.textContent = ok ? '¡Gracias! Tu mensaje se ha validado correctamente (demo).' : '';
  if (ok) form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
