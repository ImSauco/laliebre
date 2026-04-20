/* --------------------------------------------------
   1. Inicializar iconos Lucide
-------------------------------------------------- */
lucide.createIcons();


/* --------------------------------------------------
   2. Cursor personalizado
-------------------------------------------------- */
const cursor = document.getElementById('cursor');


/* --------------------------------------------------
   2b. Ocultar/mostrar nav al hacer scroll
-------------------------------------------------- */
(function () {
  const nav = document.getElementById('main-nav');

  // Eliminar la animación de entrada una vez termina para que la transición funcione
  nav.addEventListener('animationend', () => {
    nav.style.animation = 'none';
  }, { once: true });

  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Solo en móvil (< 1024px)
        if (window.innerWidth >= 1024) {
          nav.classList.remove('nav-hidden');
          lastY = window.scrollY;
          ticking = false;
          return;
        }
        const currentY = window.scrollY;
        if (currentY > lastY && currentY > 80) {
          nav.classList.add('nav-hidden');
        } else {
          nav.classList.remove('nav-hidden');
        }
        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  });
})();
document.addEventListener('mousemove', (e) => {
  cursor.style.left = (e.clientX - 12) + 'px';
  cursor.style.top  = (e.clientY - 12) + 'px';
});


/* --------------------------------------------------
   3. Construir el grid animado (líneas con luz)
-------------------------------------------------- */
function buildGrid(id) {
  const container = document.getElementById(id);
  if (!container) return;

  // 20 líneas verticales
  for (let i = 0; i < 20; i++) {
    const line = document.createElement('div');
    line.className = 'grid-line-v';
    line.style.left = `${i * 5}%`;
    const scan = document.createElement('div');
    scan.className = 'grid-scan-v';
    scan.style.animationDuration = `${3 + i * 0.2}s`;
    scan.style.animationDelay    = `${-i * 0.3}s`;
    line.appendChild(scan);
    container.appendChild(line);
  }

  // 20 líneas horizontales
  for (let i = 0; i < 20; i++) {
    const line = document.createElement('div');
    line.className = 'grid-line-h';
    line.style.top = `${i * 5}%`;
    const scan = document.createElement('div');
    scan.className = 'grid-scan-h';
    scan.style.animationDuration = `${4 + i * 0.2}s`;
    scan.style.animationDelay    = `${-i * 0.3}s`;
    line.appendChild(scan);
    container.appendChild(line);
  }
}
buildGrid('grid-servicios');
buildGrid('grid-cta');


/* --------------------------------------------------
   4. Partículas (canvas)
-------------------------------------------------- */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Crear partículas
  const particles = Array.from({ length: 80 }, () => ({
    x:       Math.random() * canvas.width,
    y:       Math.random() * canvas.height,
    vx:      (Math.random() - 0.5) * 0.3,
    vy:      (Math.random() - 0.5) * 0.3,
    size:    Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Mover
      p.x += p.vx; p.y += p.vy;
      // Rebote en bordes
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Dibujar punto
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,107,53,${p.opacity})`;
      ctx.fill();

      // Dibujar líneas de conexión con partículas cercanas
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx   = p.x - q.x;
        const dy   = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,107,53,${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}

initParticles('particles');
initParticles('particles2');


/* --------------------------------------------------
   5. Animaciones al hacer scroll (IntersectionObserver)
      Equivalente a whileInView de Framer Motion
-------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach((el) => revealObserver.observe(el));


/* --------------------------------------------------
   6. Contador animado (para las estadísticas del hero)
-------------------------------------------------- */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el      = entry.target;
    const target  = parseInt(el.dataset.counter);
    const suffix  = el.dataset.suffix || '';
    const start   = performance.now();
    const dur     = 2000; // duración en ms

    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]')
  .forEach((el) => counterObserver.observe(el));


/* --------------------------------------------------
   7. Botones magnéticos
-------------------------------------------------- */
document.querySelectorAll('.magnetic-btn').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.3;
    const dy   = (e.clientY - cy) * 0.3;
    btn.style.transform  = `translate(${dx}px, ${dy}px)`;
    btn.style.transition = 'transform 0.1s';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform  = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  });
});


/* --------------------------------------------------
   8. Efectos de scroll: parallax hero + rotación texto + fade
-------------------------------------------------- */
const heroSection   = document.getElementById('hero');
const heroImageWrap = document.getElementById('hero-image-wrap');
const heroBgText    = document.getElementById('hero-bg-text');
const heroContentEl = heroSection.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrollY  = window.scrollY;
  const heroH    = heroSection.offsetHeight;
  const progress = Math.min(scrollY / heroH, 1);

  // Parallax imagen (se mueve hacia abajo más lento que el scroll)
  if (heroImageWrap) {
    heroImageWrap.style.transform = `translateY(${scrollY * 0.4}px)`;
  }

  // Fade del contenido al hacer scroll
  if (heroContentEl) {
    heroContentEl.style.opacity = Math.max(0, 1 - progress / 0.7).toFixed(3);
  }

  // Rotación del texto gigante de fondo
  if (heroBgText) {
    heroBgText.style.transform = `translate(-50%, -50%) rotate(${progress * 360}deg)`;
  }
}, { passive: true });
