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
        mainNav.classList.toggle('menu-open');
        // Simple animation logic for lines could be added here
    });

    // Close menu on link click
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('menu-open');
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
