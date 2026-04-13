(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-fill');
    const bar = document.getElementById('preloader-bar');
    if (!preloader || !fill) return;

    const body = document.body;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minDisplayMs = reduceMotion ? 0 : 1050;
    const startedAt = performance.now();
    let progressTimer;

    function setProgress(percent) {
        const v = Math.min(100, Math.max(0, percent));
        fill.style.width = `${v}%`;
        if (bar) bar.setAttribute('aria-valuenow', String(Math.round(v)));
    }

    if (!reduceMotion) {
        let simulated = 4;
        setProgress(simulated);
        progressTimer = window.setInterval(() => {
            if (simulated >= 80) return;
            simulated += 4 + Math.random() * 9;
            setProgress(Math.min(simulated, 80));
        }, 140);
    } else {
        setProgress(100);
    }

    function dismiss() {
        if (progressTimer) window.clearInterval(progressTimer);
        setProgress(100);
        body.classList.remove('is-loading');
        preloader.classList.add('preloader--done');
        preloader.setAttribute('aria-busy', 'false');

        const backupRemove = window.setTimeout(() => {
            if (preloader.parentNode) preloader.remove();
        }, 2500);

        const onTransitionEnd = (e) => {
            if (e.target !== preloader || e.propertyName !== 'opacity') return;
            window.clearTimeout(backupRemove);
            preloader.remove();
            preloader.removeEventListener('transitionend', onTransitionEnd);
        };
        preloader.addEventListener('transitionend', onTransitionEnd);
    }

    window.addEventListener(
        'load',
        () => {
            const elapsed = performance.now() - startedAt;
            window.setTimeout(dismiss, Math.max(0, minDisplayMs - elapsed));
        },
        { once: true }
    );
})();

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Navbar & Header Shadow --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 2. Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    mobileToggle.addEventListener('click', () => {
        const open = mainNav.classList.toggle('menu-open');
        mobileToggle.classList.toggle('is-open', open);
        mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu on link click
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('menu-open');
            mobileToggle.classList.remove('is-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    /* --- 3. Advanced Scroll Reveal Observer --- */
    const revealElements = document.querySelectorAll('.fade-up, .reveal-right, .reveal-left');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- 4. Counter Animation for Stats --- */
    const statNumbers = document.querySelectorAll('.stat-num');
    let counted = false;

    const runCounter = () => {
        statNumbers.forEach(num => {
            const updateCount = () => {
                const target = +num.getAttribute('data-target');
                const count = +num.innerText;

                // Calculate increment speed based on target
                const inc = target / 40;

                if (count < target) {
                    num.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 40);
                } else {
                    num.innerText = target;
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                runCounter();
                counted = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    /* --- 5. Active Link Underline Update --- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 4)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
