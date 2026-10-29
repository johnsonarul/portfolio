/**
 * Johnson Arul K | Data Analyst & BI Specialist Portfolio
 * Interactive 3D Three.js Background, Parallax, VanillaTilt & Dynamic UI
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 850,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80
        });
    }

    // 2. Initialize Typed.js for the dynamic Hero Subtitle
    if (typeof Typed !== 'undefined') {
        new Typed('.typing', {
            strings: [
                'Power BI Specialist',
                'SQL & Database Engineer',
                'Python & Excel Analyst',
                'Data Storyteller',
                'Business Intelligence Developer'
            ],
            typeSpeed: 60,
            backSpeed: 35,
            backDelay: 1800,
            loop: true
        });
    }

    // 3. Three.js Interactive 3D Background: Connected Data Node Grid
    initThreeJsBackground();

    // 4. Initialize 3D Card Tilt with VanillaTilt
    initVanillaTilt();

    // 5. Navbar Sticky & ScrollSpy
    initNavigation();

    // 6. Mobile Menu Drawer
    initMobileMenu();

    // 7. Interactive Contact Form
    initContactForm();

    // 8. Stat Number Counter on Scroll
    initStatsCounter();
});

/**
 * Three.js 3D Interactive Data Particles & Constellation
 */
function initThreeJsBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle network (representing data points)
    const particleCount = window.innerWidth < 768 ? 60 : 130;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const range = 260;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * range * 1.8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * range * 1.4;
        positions[i * 3 + 2] = (Math.random() - 0.5) * range;

        velocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material with Cyan Glow
    const pMaterial = new THREE.PointsMaterial({
        color: 0x00f2fe,
        size: 2.8,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Line mesh connecting close particles
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3a86ff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    let linesMesh;

    // Mouse Parallax tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.04;
        targetY = (e.clientY - window.innerHeight / 2) * 0.04;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        // Smooth camera follow mouse
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        camera.position.x = currentX;
        camera.position.y = -currentY;
        camera.lookAt(scene.position);

        // Update particle positions
        const pos = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] += velocities[i].x;
            pos[i * 3 + 1] += velocities[i].y;
            pos[i * 3 + 2] += velocities[i].z;

            // Bounce boundary
            if (Math.abs(pos[i * 3]) > range) velocities[i].x *= -1;
            if (Math.abs(pos[i * 3 + 1]) > range * 0.8) velocities[i].y *= -1;
            if (Math.abs(pos[i * 3 + 2]) > range * 0.6) velocities[i].z *= -1;
        }
        geometry.attributes.position.needsUpdate = true;

        // Dynamic Connecting Lines between nearby nodes
        if (linesMesh) scene.remove(linesMesh);

        const linePositions = [];
        const maxDist = 55;
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDist) {
                    linePositions.push(
                        pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
                        pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
                    );
                }
            }
        }

        if (linePositions.length > 0) {
            const lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
            scene.add(linesMesh);
        }

        particles.rotation.y += 0.0006;
        particles.rotation.x += 0.0003;

        renderer.render(scene, camera);
    }

    animate();
}

/**
 * Initialize 3D Card Tilt Effects
 */
function initVanillaTilt() {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.profile-3d-card'), {
            max: 12,
            speed: 500,
            perspective: 1000,
            glare: true,
            'max-glare': 0.18,
            scale: 1.02
        });

        VanillaTilt.init(document.querySelectorAll('.stat-3d-card, .info-card-3d'), {
            max: 14,
            speed: 400,
            perspective: 900,
            glare: true,
            'max-glare': 0.15,
            scale: 1.03
        });

        VanillaTilt.init(document.querySelectorAll('.project-3d-card, .exp-card'), {
            max: 8,
            speed: 400,
            perspective: 1100,
            glare: true,
            'max-glare': 0.12
        });

        VanillaTilt.init(document.querySelectorAll('.cert-3d-card, .skill-category-card'), {
            max: 10,
            speed: 450,
            perspective: 1000,
            glare: true,
            'max-glare': 0.12
        });

        VanillaTilt.init(document.querySelectorAll('.featured-award-banner'), {
            max: 5,
            speed: 500,
            perspective: 1200,
            glare: true,
            'max-glare': 0.15
        });
    }
}

/**
 * Navbar Sticky Scroll & Active Section Highlighting
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Navbar Effect
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section ScrollSpy
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('close-mobile');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!mobileToggle || !mobileNav) return;

    mobileToggle.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * Interactive Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;
        submitBtn.disabled = true;

        const name = document.getElementById('name').value.trim();

        // Simulate API Dispatch
        setTimeout(() => {
            feedback.className = 'form-feedback success';
            feedback.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, <strong>${name}</strong>! Your message has been received. Johnson will connect with you via email shortly.`;
            
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Auto-hide feedback after 6 seconds
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 6000);
        }, 1200);
    });
}

/**
 * Animated Stat Number Counters on Scroll
 */
function initStatsCounter() {
    const statCards = document.querySelectorAll('.stat-3d-card');
    if (!statCards.length) return;

    let animated = false;

    window.addEventListener('scroll', () => {
        if (animated) return;

        const firstCard = statCards[0];
        const rect = firstCard.getBoundingClientRect();

        if (rect.top < window.innerHeight - 80) {
            animated = true;
            statCards.forEach(card => {
                const numElement = card.querySelector('.stat-number');
                if (!numElement) return;

                const text = numElement.innerText.trim();
                const hasPlus = text.includes('+');
                const targetValue = parseFloat(text);

                if (isNaN(targetValue)) return;

                let start = 0;
                const duration = 1500;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quadratic
                    const currentProgress = 1 - (1 - progress) * (1 - progress);
                    const currentVal = targetValue * currentProgress;

                    if (text.includes('.')) {
                        numElement.innerText = currentVal.toFixed(2);
                    } else {
                        numElement.innerText = Math.floor(currentVal) + (hasPlus ? '+' : '');
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        numElement.innerText = text;
                    }
                }

                requestAnimationFrame(update);
            });
        }
    });
}
