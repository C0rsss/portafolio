       // Rotating Text Effect
        const roles = [
            'Front-End Developer',
            'Problem Solver',
            'Web Developer'
        ];
        
        let roleIndex = 0;
        let charIndex = 0;
let isDeleting = false;
const textElement = document.getElementById('rotatingText');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        textElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 500);
            return;
        }
        setTimeout(type, deletingSpeed);
    } else {
        textElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, pauseTime);
            return;
        }
        setTimeout(type, typingSpeed);
    }
}

// Start typing effect
type();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', function(e) {
    const usingFormService = (contactForm.getAttribute('action') || '').includes('formsubmit.co');

    if (usingFormService) {
        const nextInput = contactForm.querySelector('input[name="_next"]');
        if (nextInput) {
            const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
            nextInput.value = base + 'gracias.html';
        }
        formStatus.textContent = 'Enviando...';
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
        return;
    }

    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let recipient = 'george@email.com';
    const mailLink = document.querySelector('.social-links a[href^="mailto:"]');
    if (mailLink) {
        try {
            recipient = mailLink.getAttribute('href').replace('mailto:', '').trim() || recipient;
        } catch (_) {}
    }

    const subject = encodeURIComponent(`Nuevo mensaje desde el portafolio - ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    formStatus.textContent = 'Abriendo tu cliente de correo...';
    formStatus.className = 'form-status success';
    formStatus.style.display = 'block';

    window.location.href = mailtoUrl;
    contactForm.reset();
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
});

(function() {
    const reveals = document.querySelectorAll('.reveal');
    const staggerContainers = document.querySelectorAll('[data-stagger]');

    staggerContainers.forEach(container => {
        const step = parseFloat(container.getAttribute('data-stagger')) || 0.1;
        const children = container.querySelectorAll(':scope > .reveal');
        children.forEach((el, idx) => {
            el.style.setProperty('--delay', `${(idx * step).toFixed(2)}s`);
        });
    });

    if (reveals.length === 0) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                io.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -5% 0px'
    });

    reveals.forEach(el => io.observe(el));
})();

(function(){
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('primary-nav');
    const backdrop = document.getElementById('navBackdrop');
    if (!toggle || !nav) return;
    function closeMenu(){
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        if (backdrop) { backdrop.classList.remove('show'); backdrop.setAttribute('hidden',''); }
        document.body.classList.remove('no-scroll');
    }
    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
            if (backdrop) { backdrop.classList.add('show'); backdrop.removeAttribute('hidden'); }
            document.body.classList.add('no-scroll');
            const firstLink = nav.querySelector('a');
            if (firstLink) firstLink.focus({preventScroll:true});
        } else {
            if (backdrop) { backdrop.classList.remove('show'); backdrop.setAttribute('hidden',''); }
            document.body.classList.remove('no-scroll');
        }
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', (e) => {
        if (!nav.classList.contains('open')) return;
        if (e.target === toggle || toggle.contains(e.target)) return;
        if (e.target === nav || nav.contains(e.target)) return;
        closeMenu();
    });
    if (backdrop) backdrop.addEventListener('click', closeMenu);
})();
