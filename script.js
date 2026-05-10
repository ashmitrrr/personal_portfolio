const projects = [
    {
        title: "BlueCrewAI",
        cat: "Agentic AI · Full-Stack",
        desc: "AI agents for the Australian trades industry. Voice/text to LLM-generated itemized quotes and automated PDF delivery.",
        stack: ["Next.js", "Supabase", "Vercel", "Anthropic Claude"],
        link: "https://bluecrewai.com"
    },
    {
        title: "PPP Candidate BriefinhgAgent",
        cat: "Agentic Loops · NLP",
        desc: "Built a candidate research agent thay uses two-step agentic ML pipeline (web research → structured JSON briefing) for a Sydney-based executive search firm(Platinum Pacififc Partners).",
        stack: ["Python", "Claude API", "Streamlit"],
        link: "#"
    },
    {
        title: "Autonomous Drone Navigation",
        cat: "Computer Vision · Deep Learning",
        desc: "Trained YOLOv8 model on HighRPD dataset for autonomous drone navigation, obstacle avoidance and path planning.",
        stack: ["Python", "YOLOv8", "PyTorch", "OpenCV"],
        link: "#"
    },
    {
        title: "CampChat",
        cat: "Full-Stack · Real-Time",
        desc: "Anonymous verified student chat platform for campus communities with passcode auth and real-time messaging.",
        stack: ["React", "Node.js", "Supabase"],
        link: "#"
    },
    {
        title: "AI Guardian Cam",
        cat: "Computer Vision · Security",
        desc: "Real-time AI security camera system powered by YOLOv8. Transforms any Mac into an intelligent security monitor.",
        stack: ["Python", "YOLOv8", "OpenCV", "WebSocket"],
        link: "https://github.com/ashmitrrr/guardiancam"
    },
    {
        title: "Gesture AR Fight",
        cat: "Computer Vision · AR",
        desc: "Real-time hand gesture fighting game using your webcam. No controllers — just your hands.",
        stack: ["Python", "MediaPipe", "OpenCV", "NumPy"],
        link: "https://github.com/ashmitrrr/gesture_fight"
    },
    {
        title: "AI Sentiment Trade",
        cat: "NLP · Finance",
        desc: "Real-time dashboard correlating stock prices with news sentiment using FinBERT.",
        stack: ["Python", "Streamlit", "FinBERT", "Yahoo Finance"],
        link: "https://github.com/ashmitrrr/SentimenTrade"
    },
    {
        title: "Layover AI",
        cat: "Cloud Native · Algorithms",
        desc: "Cloud-native travel agent turning layovers into mini-vacations using custom scheduling algorithms.",
        stack: ["Python", "GCP", "Docker", "SBERT"],
        link: "https://github.com/ashmitrrr/LayoverAI"
    },
    {
        title: "AI Resume Analyzer",
        cat: "NLP · Semantic AI",
        desc: "Evaluates semantic compatibility between resumes and job descriptions using SBERT.",
        stack: ["Python", "Docker", "BERT", "spaCy"],
        link: "https://github.com/ashmitrrr/Resume_Analyzer"
    },
    {
        title: "AI Expense Tracker",
        cat: "Data Viz · NLP",
        desc: "Intelligent finance dashboard with 'Smart Add' natural language expense logging.",
        stack: ["Python", "Streamlit", "Pandas", "Plotly"],
        link: "https://github.com/ashmitrrr/Expense_Tracker"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader Animation ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const tlLoader = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('no-scroll');
                preloader.style.display = 'none';
            }
        });

        const line1 = document.getElementById('term-line-1');
        const line2 = document.getElementById('term-line-2');
        const line3 = document.getElementById('term-line-3');
        const bug = document.getElementById('the-bug');
        const explosion = document.getElementById('the-explosion');

        // Type line 1
        tlLoader.to(line1, { text: "$ git add .", duration: 0.5, ease: "none", delay: 0.5 })
        // Type line 2
        .to(line2, { text: "$ git commit -m \"fixed minor bug\"", duration: 1, ease: "none", delay: 0.2 })
        // Type line 3
        .to(line3, { text: "$ git push", duration: 0.5, ease: "none", delay: 0.2 })
        // Squish the bug
        .to(bug, { scaleY: 0, opacity: 0, transformOrigin: "bottom", duration: 0.1, ease: "power4.in" }, "+=0.2")
        // Explosion
        .to(explosion, { opacity: 1, scale: 1.5, duration: 0.2, ease: "back.out(2)" }, "<")
        .to(explosion, { opacity: 0, scale: 2, duration: 0.3 }, "+=0.2")
        // Slide out loader
        .to(preloader, { yPercent: -100, duration: 0.8, ease: "power3.inOut" }, "+=0.3");
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobLinks = document.querySelectorAll('.mob-link');

    if(hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        mobLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- Interactive Particle Network Background ---
    const canvas = document.getElementById('bg-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const numParticles = 80;
        const connectionDistance = 150;
        const mouse = { x: -1000, y: -1000, radius: 200 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
                
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const dirX = dx / distance;
                    const dirY = dy / distance;
                    this.x -= dirX * force * 5;
                    this.y -= dirY * force * 5;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 107, 0, 0.4)';
                ctx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 107, 0, ${0.15 * (1 - distance/connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- GSAP Setup ---
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    gsap.to(".reveal-down", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });

    gsap.utils.toArray('.reveal-up').forEach((elem) => {
        gsap.to(elem, {
            scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
        });
    });

    // --- Spiral Skills Animation ---
    const skillContainers = document.querySelectorAll('.skill-category-interactive');
    skillContainers.forEach(container => {
        const btn = container.querySelector('.skill-cat-btn');
        const nodes = container.querySelectorAll('.skill-node');
        let isOpen = false;

        btn.addEventListener('click', () => {
            isOpen = !isOpen;
            container.classList.toggle('active', isOpen);
            
            if(isOpen) {
                const total = nodes.length;
                const radius = window.innerWidth < 768 ? 100 : 150;
                // Distribute nodes in an arc
                nodes.forEach((node, i) => {
                    // Spread from -90 to 90 degrees on the right side
                    const angle = (-Math.PI / 2) + (Math.PI / (total - 1)) * i;
                    const x = Math.cos(angle) * radius + 100; // offset right
                    const y = Math.sin(angle) * radius;
                    
                    gsap.to(node, {
                        x: x, y: y,
                        scale: 1, opacity: 1,
                        duration: 0.5,
                        ease: "back.out(1.5)",
                        delay: i * 0.05
                    });
                });
            } else {
                nodes.forEach((node, i) => {
                    gsap.to(node, {
                        x: 0, y: 0,
                        scale: 0, opacity: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    });
                });
            }
        });
    });

    // --- Interactive Tabbed Timeline ---
    const expTabs = document.querySelectorAll('.exp-tab');
    const expPanels = document.querySelectorAll('.exp-panel');

    expTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            expTabs.forEach(t => t.classList.remove('active'));
            expPanels.forEach(p => {
                p.classList.remove('active');
                gsap.to(p, { opacity: 0, y: 20, duration: 0.3 });
            });

            // Add active to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            
            if(targetPanel) {
                targetPanel.classList.add('active');
                gsap.to(targetPanel, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power2.out" });
            }
        });
    });

    // --- 3D Projects Carousel ---
    const carouselContainer = document.getElementById('carousel-container');
    const wrapper = document.getElementById('projects-3d-wrapper');
    
    if(carouselContainer && wrapper) {
        const radius = window.innerWidth < 768 ? 350 : 500;
        const total = projects.length;
        const theta = (2 * Math.PI) / total;
        
        projects.forEach((proj, i) => {
            const card = document.createElement('div');
            card.className = 'project-card-3d';
            
            const angle = i * theta;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const rotationY = angle * (180 / Math.PI);
            
            card.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rotationY}deg)`;
            
            let stackHtml = proj.stack.map(s => `<span>${s}</span>`).join('');
            
            card.innerHTML = `
                <div class="pc-cat">${proj.cat}</div>
                <h3 class="pc-title">${proj.title}</h3>
                <p class="pc-desc">${proj.desc}</p>
                <div class="pc-stack">${stackHtml}</div>
                ${proj.link !== '#' ? `<a href="${proj.link}" target="_blank" class="pc-link">View Project ↗</a>` : ''}
            `;
            
            carouselContainer.appendChild(card);
        });
        
        let isDragging = false;
        let startX = 0;
        let currentRotation = 0;
        let targetRotation = 0;
        
        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            wrapper.style.cursor = 'grabbing';
        });
        window.addEventListener('mouseup', () => { isDragging = false; wrapper.style.cursor = 'grab'; });
        window.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            const dist = e.pageX - startX;
            targetRotation += dist * 0.2;
            startX = e.pageX;
        });

        wrapper.addEventListener('touchstart', (e) => { isDragging = true; startX = e.touches[0].pageX; });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('touchmove', (e) => {
            if(!isDragging) return;
            const dist = e.touches[0].pageX - startX;
            targetRotation += dist * 0.3;
            startX = e.touches[0].pageX;
        });
        
        function animate() {
            if(!isDragging) targetRotation += 0.05;
            currentRotation += (targetRotation - currentRotation) * 0.1;
            carouselContainer.style.transform = `translateZ(${-radius}px) rotateY(${currentRotation}deg)`;
            requestAnimationFrame(animate);
        }
        
        targetRotation = 30;
        animate();
    }
});