// ── CURSOR (desktop only) ──
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

if (!isTouch) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .project-row, .skill-card, .sf-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('expanded'); ring.classList.add('expanded'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('expanded'); ring.classList.remove('expanded'); });
  });
}

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
  document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
    document.body.style.overflow = '';
  });
});

// ── REVEAL ON SCROLL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let start = 0;
      const duration = 1500;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + '+';
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ── ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navAnchors.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ── TYPEWRITER ──
const phrases = [
  'Apasionado por crear experiencias digitales increíbles.',
  'Transformo ideas en APIs y sitios web funcionales.',
  'Junior Developer con proyectos reales deployados.',
  'Siempre aprendiendo, siempre construyendo 🚀'
];
let pIdx = 0, cIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeLoop() {
  const current = phrases[pIdx];
  if (!deleting) {
    tw.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 38);
  } else {
    tw.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 18);
  }
}
setTimeout(typeLoop, 1200);

// ── TRIGGER HERO REVEALS IMMEDIATELY ──
setTimeout(() => {
  document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
}, 100);

// ── CANVAS PARTICLES ──
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

const DOTS = Array.from({length: 70}, () => ({
  x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.3, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, a: Math.random()
}));

function drawParticles() {
  ctx.clearRect(0,0,W,H);
  DOTS.forEach(d => {
    d.x += d.vx; d.y += d.vy;
    if(d.x<0)d.x=W; if(d.x>W)d.x=0; if(d.y<0)d.y=H; if(d.y>H)d.y=0;
    ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(191,95,255,${d.a*0.5})`; ctx.fill();
  });
  for(let i=0;i<DOTS.length;i++) for(let j=i+1;j<DOTS.length;j++) {
    const dx=DOTS[i].x-DOTS[j].x, dy=DOTS[i].y-DOTS[j].y, dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<120){ ctx.beginPath(); ctx.moveTo(DOTS[i].x,DOTS[i].y); ctx.lineTo(DOTS[j].x,DOTS[j].y);
      ctx.strokeStyle=`rgba(191,95,255,${(1-dist/120)*0.1})`; ctx.lineWidth=0.5; ctx.stroke(); }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── SCRAMBLE TEXT ──
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
function scramble(el, finalText, duration=800) {
  el.style.opacity='1';
  let frame=0; const totalFrames=duration/16;
  function step() {
    frame++;
    const progress=frame/totalFrames;
    const revealed=Math.floor(progress*finalText.length);
    let display='';
    for(let i=0;i<finalText.length;i++) {
      display += i<revealed ? finalText[i] : (finalText[i]===' ' ? ' ' : CHARS[Math.floor(Math.random()*CHARS.length)]);
    }
    el.textContent=display;
    if(progress<1) requestAnimationFrame(step);
    else { el.textContent=finalText; el.classList.add('done'); }
  }
  requestAnimationFrame(step);
}

setTimeout(() => {
  document.querySelectorAll('#hero .scramble-reveal').forEach((el,i) => {
    setTimeout(() => scramble(el, el.dataset.final), i*300+400);
  });
  const gn=document.getElementById('glitchName');
  if(gn) setTimeout(()=>scramble(gn,'George'),600);
}, 300);

// ── DYNAMIC GLOBAL FOOTER ──
if (!document.querySelector('.main-footer')) {
  const footerHTML = `
    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-brand">
                <h3>GEOR <span>CODEX</span></h3>
                <p>Junior Full Stack Developer enfocado en construir soluciones limpias y funcionales con código puro.</p>
                <div class="footer-socials">
                    <a href="https://github.com/C0rsss" target="_blank" class="social-icon"><i class="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/ge0rgeee" target="_blank" class="social-icon"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:georgerojasmorillo@gmail.com" class="social-icon"><i class="fas fa-envelope"></i></a>
                </div>
            </div>
            <div class="footer-links">
                <div class="footer-col">
                    <h4>Navegación</h4>
                    <ul>
                        <li><a href="#hero">Inicio</a></li>
                        <li><a href="#about">Sobre Mí</a></li>
                        <li><a href="#projects">Proyectos</a></li>
                        <li><a href="#contact">Contacto</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Tech Stack</h4>
                    <ul>
                        <li><a href="#">JavaScript</a></li>
                        <li><a href="#">React</a></li>
                        <li><a href="#">Node.js</a></li>
                        <li><a href="#">Pure CSS</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div>&copy; 2026 GEOR CODEX. Todos los derechos reservados.</div>
            <div>Diseñado y Desarrollado con <span class="neon-heart">💜</span> por <a class="signature-link" href="#">George <span>Rojas</span></a></div>
        </div>
    </footer>`;
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}