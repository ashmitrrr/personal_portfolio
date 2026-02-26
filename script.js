/* ════════════════════════════════════════════════
   ASHMIT RAINA PORTFOLIO — MAIN SCRIPT
   ════════════════════════════════════════════════ */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/* ══════════════════════════════════════════
   TERMINAL LOADER
══════════════════════════════════════════ */
(function initLoader() {
    const loader   = document.getElementById('loader');
    const linesEl  = document.getElementById('loader-lines');
    const typingEl = document.getElementById('loader-typing');
    const caretEl  = document.getElementById('prompt-caret');

    if (!loader) return;
    document.body.style.overflow = 'hidden';

    // FAILSAFE: no matter what, exit after 6 seconds
    const failsafe = setTimeout(exitLoader, 6000);

    const lines = [
        { html: '<span class="ll-prefix">→</span> <span class="ll-gray">loading environment...</span>' },
        { html: '<span class="ll-prefix">→</span> <span class="ll-cmd">npm run build</span>' },
        { html: '<span class="ll-gray">&nbsp;&nbsp; compiled in 1.2s</span>' },
        { html: '<span class="ll-prefix">→</span> <span class="ll-gray">initialising renderer</span>' },
        { html: '<span class="ll-ok">✔</span> <span class="ll-gray">context acquired</span>' },
        { html: '<span class="ll-prefix">→</span> <span class="ll-gray">mounting components...</span>' },
        { html: '<span class="ll-ok">✔</span> <span class="ll-gray">all systems nominal</span>' },
    ];

    function addLine(idx) {
        try {
            if (idx >= lines.length) { startTyping(); return; }
            const div = document.createElement('div');
            div.className = 'loader-line';
            div.style.cssText = 'opacity:1;display:block;';
            div.innerHTML = lines[idx].html;
            linesEl.appendChild(div);
            setTimeout(() => addLine(idx + 1), 200);
        } catch(e) { exitLoader(); }
    }

    addLine(0);

    function startTyping() {
        try {
            const cmd = 'open portfolio --mode=production';
            let i = 0;
            function tick() {
                typingEl.textContent = cmd.slice(0, i);
                if (i < cmd.length) { i++; setTimeout(tick, 48); }
                else { setTimeout(exitLoader, 600); }
            }
            setTimeout(tick, 150);
        } catch(e) { exitLoader(); }
    }

    function exitLoader() {
        clearTimeout(failsafe);
        try { caretEl.style.display = 'none'; } catch(e){}
        loader.style.cssText = 'transition:opacity .55s ease;opacity:0;pointer-events:none;';
        document.body.style.overflow = '';
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    }
})();

/* ══════════════════════════════════════════
   THREE.JS — PARTICLE FIELD
══════════════════════════════════════════ */
(function initThree() {
    try {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 700;

        const COUNT = 1400;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(COUNT * 3);
        const sizes     = new Float32Array(COUNT);

        for (let i = 0; i < COUNT; i++) {
            positions[i*3]   = (Math.random()-.5)*2400;
            positions[i*3+1] = (Math.random()-.5)*2400;
            positions[i*3+2] = (Math.random()-.5)*1200;
            sizes[i] = Math.random()*1.6+0.5;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

        // Use PointsMaterial instead of ShaderMaterial — more compatible
        const mat = new THREE.PointsMaterial({
            color: 0xff6347,
            size: 1.4,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const pts = new THREE.Points(geo, mat);
        scene.add(pts);

        let mx = 0, my = 0, lx = 0, ly = 0;
        document.addEventListener('mousemove', e => {
            mx = (e.clientX / window.innerWidth  - .5) * 80;
            my = (e.clientY / window.innerHeight - .5) * 60;
        });

        const clock = new THREE.Clock();
        (function loop() {
            requestAnimationFrame(loop);
            const t = clock.getElapsedTime();
            lx += (mx - lx) * .04;
            ly += (my - ly) * .04;
            pts.rotation.y = t * .012 + lx * .001;
            pts.rotation.x = t * .006 + ly * .001;
            renderer.render(scene, camera);
        })();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } catch(e) {
        console.warn('Three.js init failed:', e);
    }
})();

/* ══════════════════════════════════════════
   CROSSHAIR CURSOR
══════════════════════════════════════════ */
(function initCursor() {
    const cursor  = document.getElementById('cursor');
    const label   = document.getElementById('c-label');

    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    (function loop() {
        requestAnimationFrame(loop);
        cx += (tx-cx)*.18; cy += (ty-cy)*.18;
        cursor.style.left = cx+'px';
        cursor.style.top  = cy+'px';
    })();

    // hover state on interactive elements
    const hoverables = document.querySelectorAll('a, button, [data-tilt]');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
            // show label from data-cursor attribute or inner text snippet
            const lbl = el.getAttribute('data-cursor') || '';
            label.textContent = lbl;
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
            label.textContent = '';
        });
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity='1'; });
})();

/* ══════════════════════════════════════════
   NAVBAR — scroll effect + mobile menu
══════════════════════════════════════════ */
(function initNav() {
    const nav       = document.getElementById('navbar');
    const burger    = document.getElementById('hamburger');
    const mobMenu   = document.getElementById('mobile-menu');
    const mobLinks  = document.querySelectorAll('.mob-link');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    burger.addEventListener('click', () => {
        const open = burger.classList.toggle('open');
        mobMenu.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    mobLinks.forEach(l => l.addEventListener('click', () => {
        burger.classList.remove('open');
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
    }));
})();

/* ══════════════════════════════════════════
   ROTATING TEXT
══════════════════════════════════════════ */
(function initRotating() {
    const el = document.getElementById('rotating-text');
    if (!el) return;
    const phrases = [
        'build AI systems.',
        'turn raw data into insights.',
        'ship cloud-native apps.',
        'craft clean interfaces.',
        'solve real problems.',
    ];
    let idx=0, charIdx=0, deleting=false, delay=100;
    function tick() {
        const cur = phrases[idx];
        if (deleting) {
            el.textContent = cur.substring(0, charIdx--);
            delay = 50;
        } else {
            el.textContent = cur.substring(0, charIdx++);
            delay = 90;
        }
        if (!deleting && charIdx === cur.length+1) { delay=1900; deleting=true; }
        else if (deleting && charIdx===0) { deleting=false; idx=(idx+1)%phrases.length; delay=350; }
        setTimeout(tick, delay);
    }
    setTimeout(tick, 2800); // start after loader clears
})();

/* ══════════════════════════════════════════
   TICKER
══════════════════════════════════════════ */
(function initTicker() {
    const el = document.getElementById('ticker-inner');
    if (!el) return;
    const items = [
        'Python','PyTorch','AWS','Google Cloud','Docker',
        'React','Node.js','Supabase','BERT','Streamlit',
        'Pandas','Plotly','spaCy','Machine Learning','NLP',
        'Deep Learning','Data Analytics','Computer Vision',
    ];
    const html = [...items,...items].map(i =>
        `<div class="t-item"><span class="t-sep">✦</span>${i}</div>`
    ).join('');
    el.innerHTML = html;
})();

/* ══════════════════════════════════════════
   SCROLL REVEAL — Intersection Observer
══════════════════════════════════════════ */
(function initReveal() {
    const targets = document.querySelectorAll('.reveal-up');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay||0);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold:.1, rootMargin:'0px 0px -50px 0px' });
    targets.forEach(t => obs.observe(t));
})();

/* ══════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════ */
(function initCounters() {
    const counters = document.querySelectorAll('.stat-n');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                let start;
                const step = ts => {
                    if (!start) start = ts;
                    const p = Math.min((ts-start)/1200, 1);
                    el.textContent = Math.round((1-(1-p)**3)*target);
                    if (p<1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                obs.unobserve(el);
            }
        });
    }, { threshold:.5 });
    counters.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════
   HORIZONTAL SCROLL — Projects
══════════════════════════════════════════ */
(function initHorizontalScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const outer   = document.getElementById('hscroll-outer');
    const sticky  = document.getElementById('hscroll-sticky');
    const inner   = document.getElementById('hscroll-inner');
    const dots    = document.querySelectorAll('.hscroll-dot');
    const dotsWrap = document.getElementById('hscroll-dots');
    const counter  = document.getElementById('hscroll-counter');
    const curEl    = document.getElementById('hscroll-cur');
    const cards    = document.querySelectorAll('.hcard');

    if (!outer || !sticky || !inner) return;

    const totalCards = cards.length;
    const scrollDist = window.innerWidth * (totalCards - 1);

    gsap.to(inner, {
        x: () => -scrollDist,
        ease: 'none',
        scrollTrigger: {
            trigger: outer,
            start: 'top top',
            end: () => '+=' + scrollDist,
            scrub: 1,
            pin: sticky,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter:     () => { dotsWrap?.classList.add('visible'); counter?.classList.add('visible'); },
            onLeave:     () => { dotsWrap?.classList.remove('visible'); counter?.classList.remove('visible'); },
            onEnterBack: () => { dotsWrap?.classList.add('visible'); counter?.classList.add('visible'); },
            onLeaveBack: () => { dotsWrap?.classList.remove('visible'); counter?.classList.remove('visible'); },
            onUpdate: (self) => {
                const idx = Math.round(self.progress * (totalCards - 1));
                // update dots
                dots.forEach((d, i) => d.classList.toggle('active', i === idx));
                // update counter
                if (curEl) curEl.textContent = String(idx + 1).padStart(2, '0');
                // update active card accent line
                cards.forEach((c, i) => c.classList.toggle('active', i === idx));
            }
        }
    });

    window.addEventListener('resize', () => ScrollTrigger.refresh());
})();

/* ══════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth' });
        }
    });
});