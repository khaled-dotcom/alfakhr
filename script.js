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

    /* --- 2. Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    const closeMobileMenu = () => {
        if (!mainNav || !mobileToggle) return;
        mainNav.classList.remove('menu-open');
        mobileToggle.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    };

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            const open = mainNav.classList.toggle('menu-open');
            mobileToggle.classList.toggle('is-open', open);
            mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        document.querySelectorAll('.main-nav a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMobileMenu();
        });
    }

    /* --- 3. Scroll Reveal --- */
    const revealElements = document.querySelectorAll('.fade-up, .reveal-right, .reveal-left');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));

    /* --- 4. Stats Counter --- */
    const statNumbers = document.querySelectorAll('.stat-num');
    let counted = false;

    const runCounter = () => {
        statNumbers.forEach((num) => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            if (Number.isNaN(target)) return;
            num.textContent = '0';

            const tick = () => {
                const count = parseInt(num.textContent, 10) || 0;
                const inc = Math.max(1, Math.ceil(target / 40));
                if (count < target) {
                    num.textContent = String(Math.min(count + inc, target));
                    window.setTimeout(tick, 40);
                } else {
                    num.textContent = String(target);
                }
            };
            tick();
        });
    };

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection && statNumbers.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    runCounter();
                }
            });
        }, { threshold: 0.35 });

        statsObserver.observe(statsSection);
    }

    /* --- 5. Active nav: أقسام بمعرّف + تذييل الاتصال (بدون includes الفارغ) --- */
    const spyTargets = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const updateActiveNav = () => {
        const y = window.scrollY + 140;
        let currentId = '';

        spyTargets.forEach((el) => {
            const id = el.getAttribute('id');
            if (!id) return;
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (y >= top - 90) {
                currentId = id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (currentId && href === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    };

    const onScroll = () => {
        if (navbar) {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        updateActiveNav();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
});
