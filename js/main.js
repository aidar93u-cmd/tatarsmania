document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = Array.from(entry.target.parentElement.children)
                    .filter(el => el.classList.contains('animate-in'))
                    .indexOf(entry.target);
                entry.target.style.animationDelay = `${delay * 0.1}s`;
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-target').forEach(el => {
        observer.observe(el);
    });

    // ===== MEGA MENU =====
    const catalogBtn = document.getElementById('catalogBtn');
    const megaMenu = document.getElementById('megaMenu');
    const megaMenuOverlay = document.getElementById('megaMenuOverlay');

    if (catalogBtn && megaMenu) {
        catalogBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            megaMenu.classList.toggle('mega-menu--open');
            document.body.style.overflow = megaMenu.classList.contains('mega-menu--open') ? 'hidden' : '';
        });

        if (megaMenuOverlay) {
            megaMenuOverlay.addEventListener('click', function() {
                megaMenu.classList.remove('mega-menu--open');
                document.body.style.overflow = '';
            });
        }

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && megaMenu.classList.contains('mega-menu--open')) {
                megaMenu.classList.remove('mega-menu--open');
                document.body.style.overflow = '';
            }
        });

        // Close when clicking any link inside mega menu
        megaMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                megaMenu.classList.remove('mega-menu--open');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== MEGA MENU TABS =====
    document.querySelectorAll('.mega-menu__filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;

            // Update active button
            document.querySelectorAll('.mega-menu__filter-btn').forEach(b => b.classList.remove('mega-menu__filter-btn--active'));
            this.classList.add('mega-menu__filter-btn--active');

            // Show/hide tab content
            document.querySelectorAll('.mega-menu__tab-content').forEach(content => {
                content.classList.remove('mega-menu__tab-content--active');
            });
            document.getElementById('tab-' + tab).classList.add('mega-menu__tab-content--active');
        });
    });

    // ===== SCROLL-BASED HEADER BEHAVIOR =====
    let lastScroll = 0;
    const header = document.querySelector('.header');
    const topbar = document.querySelector('.topbar');
    const scrollOffset = 300;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollOffset) {
                header.classList.add('header--scrolled');

                if (currentScroll > lastScroll && currentScroll > scrollOffset + 50) {
                    // Scrolling down - hide header
                    header.classList.add('header--hidden');
                    header.classList.remove('header--visible');
                } else if (currentScroll < lastScroll) {
                    // Scrolling up - show header
                    header.classList.remove('header--hidden');
                    header.classList.add('header--visible');
                }
            } else {
                header.classList.remove('header--scrolled', 'header--hidden', 'header--visible');
            }

            lastScroll = currentScroll;
        });
    }

    // ===== SWIPER INITIALIZATION =====

    // Hero Swiper
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero .hero__pagination',
            type: 'bullets',
            bulletClass: 'hero__dot',
            bulletActiveClass: 'hero__dot--active',
            clickable: true,
        },
        navigation: {
            nextEl: '.hero .hero__arrow--next',
            prevEl: '.hero .hero__arrow--prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
    });

    // Categories Small Swiper
    const categoriesSmallSwiper = new Swiper('.categories-small-swiper', {
        slidesPerView: 4,
        spaceBetween: 6,
        speed: 600,
        pagination: {
            el: '.categories-small .categories-small__pagination',
            type: 'bullets',
            bulletClass: 'categories-small__dot',
            bulletActiveClass: 'categories-small__dot--active',
            clickable: true,
        },
        navigation: {
            nextEl: '.categories-small .categories-small__arrow--next',
            prevEl: '.categories-small .categories-small__arrow--prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 6,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 6,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 6,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 6,
            },
        },
    });

    // Collections Swiper
    const collectionsSwiper = new Swiper('.collections-swiper', {
        loop: true,
        speed: 600,
        pagination: {
            el: '.collections .collections__pagination',
            type: 'bullets',
            bulletClass: 'collections__dot',
            bulletActiveClass: 'collections__dot--active',
            clickable: true,
        },
        navigation: {
            nextEl: '.collections .collections__arrow--next',
            prevEl: '.collections .collections__arrow--prev',
        },
    });

    // Blog Swiper
    const blogSwiper = new Swiper('.blog-swiper', {
        slidesPerView: 4,
        spaceBetween: 6,
        speed: 600,
        pagination: {
            el: '.blog .blog__pagination',
            type: 'bullets',
            bulletClass: 'blog__dot',
            bulletActiveClass: 'blog__dot--active',
            clickable: true,
        },
        navigation: {
            nextEl: '.blog .blog__arrow--next',
            prevEl: '.blog .blog__arrow--prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 6,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 6,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 6,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 6,
            },
        },
    });

    // Slider dots click behavior (legacy fallback)
    document.querySelectorAll('.categories-small__dot, .collections__dot, .blog__dot, .hero__dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.dot, [class*="__dot"]').forEach(d => {
                d.classList.remove('categories-small__dot--active', 'collections__dot--active', 'blog__dot--active', 'hero__dot--active');
            });
            this.classList.add(this.className.replace('--active', '') || this.className.split(' ')[0] + '--active');
        });
    });

    // Filter buttons behavior (Featured section tabs)
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            if (!tab) return;

            // Update active button
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('btn-filter--active'));
            this.classList.add('btn-filter--active');

            // Show/hide tab content
            document.querySelectorAll('.featured__tab-content').forEach(content => {
                content.classList.remove('featured__tab-content--active');
            });
            document.getElementById(tab).classList.add('featured__tab-content--active');
        });
    });

    // Product card favorites toggle
    document.querySelectorAll('.product-card__fav').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Email validation for footer newsletter
    const emailForm = document.querySelector('.footer__newsletter-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.footer__email-input').value;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!emailRegex.test(email)) {
                this.querySelector('.footer__email-input').classList.add('error');
            } else {
                this.querySelector('.footer__email-input').classList.remove('error');
                // Submit logic here
            }
        });
    }
});
