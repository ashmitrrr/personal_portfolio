/* js */

// GSAP plugins ──
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ══════════════════════════════════════════
// INTRO LOADER
// ══════════════════════════════════════════
(function initLoader() {
    const loader  = document.getElementById('intro-loader');
    const logo    = document.getElementById('loader-logo');
    const bar     = document.getElementById('loader-bar');
    const label   = document.getElementById('loader-label');
    const ringA   = document.querySelector('.ring-a');
    const ringB   = document.querySelector('.ring-b');
    const ringC   = document.querySelector('.ring-c');

    document.body.style.overflow = 'hidden';

    const labels = ['initialising...', 'loading assets...', 'almost there...', 'welcome.'];
    let progress = 0;
    let labelIdx = 0;

    setTimeout(() => {
        [ringA, ringB, ringC].forEach((ring, i) => {
            ring.style.transition = `transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s, opacity 0.5s ease ${i * 0.08}s`;
            ring.style.transform  = 'translate(-50%, -50%) scale(1)';
            ring.style.opacity    = '1';
        });
    }, 200);

    setTimeout(() => {
        logo.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.4,0.64,1), filter 1s ease';
        logo.style.opacity    = '1';
        logo.style.transform  = 'scale(1)';
        logo.style.filter     = 'drop-shadow(0 0 24px rgba(255,99,71,0.7)) drop-shadow(0 0 60px rgba(255,99,71,0.3))';
    }, 500);

    const interval = setInterval(() => {
        progress += Math.random() * 18 + 8;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';

        const newIdx = Math.floor((progress / 100) * (labels.length - 1));
        if (newIdx !== labelIdx) {
            labelIdx = newIdx;
            label.style.opacity = '0';
            setTimeout(() => {
                label.textContent = labels[labelIdx];
                label.style.transition = 'opacity 0.3s';
                label.style.opacity = '1';
            }, 150);
        }

        if (progress >= 100) {
            clearInterval(interval);
            label.textContent = 'welcome.';

            setTimeout(() => {
                logo.style.transition = 'filter 0.4s ease, transform 0.4s ease';
                logo.style.filter     = 'drop-shadow(0 0 40px rgba(255,99,71,1)) drop-shadow(0 0 80px rgba(255,99,71,0.5))';
                logo.style.transform  = 'scale(1.08)';
            }, 300);

            setTimeout(() => {
                loader.classList.add('exit');
                document.body.style.overflow = '';
                setTimeout(() => { loader.style.display = 'none'; }, 900);
            }, 900);
        }
    }, 120);
})();


// ══════════════════════════════════════════
// THREE.JS — Particle Background
// ══════════════════════════════════════════
(function initThree() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 700;

    const COUNT = 1800;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const alphas    = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 2400;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2400;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;
        sizes[i]  = Math.random() * 2.0 + 0.5;
        alphas[i] = Math.random() * 0.6 + 0.15;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const shaderMat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0xff6347) },
        },
        vertexShader: `
            attribute float size;
            attribute float alpha;
            varying float vAlpha;
            uniform float uTime;
            void main() {
                vAlpha = alpha;
                vec3 pos = position;
                pos.y += sin(uTime * 0.3 + position.x * 0.001) * 8.0;
                pos.x += cos(uTime * 0.2 + position.y * 0.001) * 6.0;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (400.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
                float d = length(gl_PointCoord - vec2(0.5));
                if (d > 0.5) discard;
                float strength = 1.0 - (d * 2.0);
                gl_FragColor = vec4(uColor, vAlpha * strength * 0.7);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geo, shaderMat);
    scene.add(particles);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 120;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 80;
    });

    const clock = new THREE.Clock();

    (function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        shaderMat.uniforms.uTime.value = t;

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        particles.rotation.y = t * 0.015 + targetX * 0.001;
        particles.rotation.x = targetY * 0.001;

        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();


// ══════════════════════════════════════════
// CUSTOM CURSOR
// ══════════════════════════════════════════
(function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    (function cursorLoop() {
        requestAnimationFrame(cursorLoop);
        dotX  += (mouseX - dotX)  * 0.85;
        dotY  += (mouseY - dotY)  * 0.85;
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        dot.style.left  = dotX  + 'px';
        dot.style.top   = dotY  + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
    })();

    const hoverEls = document.querySelectorAll('a, button, [data-tilt], .skill-item, .tag');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
})();


// ══════════════════════════════════════════
// NAVIGATION — Scroll effect & Mobile menu
// ══════════════════════════════════════════
(function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobLinks = document.querySelectorAll('.mob-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
})();


// ══════════════════════════════════════════
// HERO ROTATING TEXT
// ══════════════════════════════════════════
(function initRotatingText() {
    const el = document.getElementById('rotating-text');
    const phrases = [
        'build AI systems.',
        'turn raw data into insights.',
        'ship cloud-native apps.',
        'craft clean interfaces.',
        'solve real problems.',
    ];
    let idx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 100;

    function type() {
        const current = phrases[idx];
        if (isDeleting) {
            el.textContent = current.substring(0, charIdx--);
            delay = 55;
        } else {
            el.textContent = current.substring(0, charIdx++);
            delay = 95;
        }

        if (!isDeleting && charIdx === current.length + 1) {
            delay = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            idx = (idx + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 1400);
})();


// ══════════════════════════════════════════
// SCROLL REVEAL — Intersection Observer
// ══════════════════════════════════════════
(function initReveal() {
    const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => obs.observe(el));
})();


// ══════════════════════════════════════════
// COUNTER ANIMATION
// ══════════════════════════════════════════
(function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                let start = 0;
                const duration = 1400;
                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => obs.observe(el));
})();


// ══════════════════════════════════════════
// TICKER / MARQUEE
// ══════════════════════════════════════════
(function initTicker() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const items = [
        'Python', 'PyTorch', 'AWS', 'Google Cloud', 'Docker',
        'React', 'Node.js', 'Supabase', 'BERT', 'Streamlit',
        'Pandas', 'Plotly', 'spaCy', 'Machine Learning', 'NLP',
        'Deep Learning', 'Data Analytics', 'Computer Vision',
    ];

    const ticker = document.createElement('div');
    ticker.className = 'ticker-section';
    ticker.innerHTML = `<div class="ticker-track">${
        [...items, ...items].map(item =>
            `<div class="ticker-item"><span class="ticker-dot">✦</span>${item}</div>`
        ).join('')
    }</div>`;

    aboutSection.parentNode.insertBefore(ticker, aboutSection);
})();


(function initGSAP() {
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8,
                delay: i * 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    once: true,
                }
            }
        );
    });

    gsap.utils.toArray('.section-heading').forEach((heading) => {
        gsap.fromTo(heading,
            { opacity: 0, y: 35, skewY: 2 },
            {
                opacity: 1, y: 0, skewY: 0,
                duration: 1, ease: 'expo.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    once: true,
                }
            }
        );
    });

    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item,
            { x: -50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.9,
                delay: i * 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    once: true,
                }
            }
        );
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 6,
            speed: 400,
            glare: true,
            'max-glare': 0.08,
        });
    }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});