document.addEventListener('DOMContentLoaded', function() {

    // ===== FANCYBOX INIT =====
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox]', {
            Thumbs: false,
            Toolbar: false,
        });
    }

    // ===== INTERSECTION OBSERVER =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = Array.from(entry.target.parentElement.children)
                    .filter(el => el.classList.contains('animate-in'))
                    .indexOf(entry.target);
                entry.target.style.animationDelay = `${delay * 0.1}s`;
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-target').forEach(el => observer.observe(el));

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

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && megaMenu.classList.contains('mega-menu--open')) {
                megaMenu.classList.remove('mega-menu--open');
                document.body.style.overflow = '';
            }
        });

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
            document.querySelectorAll('.mega-menu__filter-btn').forEach(b => b.classList.remove('mega-menu__filter-btn--active'));
            this.classList.add('mega-menu__filter-btn--active');
            document.querySelectorAll('.mega-menu__tab-content').forEach(c => c.classList.remove('mega-menu__tab-content--active'));
            document.getElementById('tab-' + tab).classList.add('mega-menu__tab-content--active');
        });
    });

    // ===== SCROLL HEADER =====
    let lastScroll = 0;
    const header = document.querySelector('.header');
    const scrollOffset = 300;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            if (currentScroll > scrollOffset) {
                header.classList.add('header--scrolled');
                if (currentScroll > lastScroll && currentScroll > scrollOffset + 50) {
                    header.classList.add('header--hidden');
                    header.classList.remove('header--visible');
                } else if (currentScroll < lastScroll) {
                    header.classList.remove('header--hidden');
                    header.classList.add('header--visible');
                }
            } else {
                header.classList.remove('header--scrolled', 'header--hidden', 'header--visible');
            }
            lastScroll = currentScroll;
        });
    }

    // ===== FEATURED TABS — SMOOTH SWITCH =====
    const featuredSection = document.querySelector('.featured');
    const featuredParent = featuredSection ? featuredSection.querySelector('.container') : null;
    if (featuredParent) {
        const tabs = Array.from(featuredParent.querySelectorAll('.featured__tab-content'));
        if (tabs.length) {
            const wrapper = document.createElement('div');
            wrapper.className = 'featured__tabs-container';
            wrapper.style.transition = 'height 0.4s ease';
            tabs.forEach(t => wrapper.appendChild(t));
            featuredParent.appendChild(wrapper);

        function setActiveTab(tabId) {
            const allTabs = wrapper.querySelectorAll('.featured__tab-content');
            const activeTab = wrapper.querySelector('#' + tabId);
            const activeBtn = document.querySelector(`.btn-filter[data-tab="${tabId}"]`);

            allTabs.forEach(t => t.classList.remove('featured__tab-content--active'));
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('btn-filter--active'));

            // Briefly measure height of target tab
            activeTab.style.position = 'relative';
            activeTab.style.visibility = 'hidden';
            activeTab.style.display = 'block';
            const h = activeTab.offsetHeight;
            activeTab.style.display = '';
            activeTab.style.position = '';
            activeTab.style.visibility = '';

            // Set container height to match, then animate
            wrapper.style.height = h + 'px';

            requestAnimationFrame(() => {
                activeTab.classList.add('featured__tab-content--active');
                if (activeBtn) activeBtn.classList.add('btn-filter--active');
            });

            wrapper.addEventListener('transitionend', function handler() {
                wrapper.style.height = '';
                wrapper.removeEventListener('transitionend', handler);
            });
        }

        // Init with active tab height
        const initialActive = wrapper.querySelector('.featured__tab-content--active');
        if (initialActive) {
            wrapper.style.height = initialActive.offsetHeight + 'px';
            wrapper.style.transition = 'height 0.4s ease';
        }

        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                if (!tab) return;
                setActiveTab(tab);
            });
        });
        }
    }

    // ===== SHOWROOMS — AUTO OPEN/CLOSED =====
    function updateShowroomStatus() {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        document.querySelectorAll('.showroom-card').forEach(card => {
            const open = card.dataset.open;
            const close = card.dataset.close;
            if (!open || !close) return;

            const [oh, om] = open.split(':').map(Number);
            const [ch, cm] = close.split(':').map(Number);
            const openMin = oh * 60 + om;
            const closeMin = ch * 60 + cm;

            const statusEl = card.querySelector('.showroom-card__status');
            if (!statusEl) return;

            if (currentMinutes >= openMin && currentMinutes < closeMin) {
                statusEl.className = 'showroom-card__status showroom-card__status--open';
                statusEl.textContent = 'Открыто';
            } else {
                statusEl.className = 'showroom-card__status showroom-card__status--closed';
                statusEl.textContent = 'Закрыто';
            }
        });
    }

    updateShowroomStatus();
    setInterval(updateShowroomStatus, 60000);

    // ===== SWIPER INITIALIZATION =====
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        speed: 800,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: {
            el: '.hero .hero__pagination',
            type: 'bullets',
            bulletClass: 'hero__dot',
            bulletActiveClass: 'hero__dot--active',
            clickable: true,
        },
        navigation: { nextEl: '.hero .hero__arrow--next', prevEl: '.hero .hero__arrow--prev' },
        effect: 'fade',
        fadeEffect: { crossFade: true },
    });

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
        navigation: { nextEl: '.categories-small .categories-small__arrow--next', prevEl: '.categories-small .categories-small__arrow--prev' },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 6 },
            768: { slidesPerView: 2, spaceBetween: 6 },
            1024: { slidesPerView: 3, spaceBetween: 6 },
            1200: { slidesPerView: 4, spaceBetween: 6 },
        },
    });

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
        navigation: { nextEl: '.collections .collections__arrow--next', prevEl: '.collections .collections__arrow--prev' },
    });

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
        navigation: { nextEl: '.blog .blog__arrow--next', prevEl: '.blog .blog__arrow--prev' },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 6 },
            768: { slidesPerView: 2, spaceBetween: 6 },
            1024: { slidesPerView: 3, spaceBetween: 6 },
            1200: { slidesPerView: 4, spaceBetween: 6 },
        },
    });

    // Legacy dots fallback
    document.querySelectorAll('.categories-small__dot, .collections__dot, .blog__dot, .hero__dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.dot, [class*="__dot"]').forEach(d => {
                d.classList.remove('categories-small__dot--active', 'collections__dot--active', 'blog__dot--active', 'hero__dot--active');
            });
            this.classList.add(this.className.replace('--active', '') || this.className.split(' ')[0] + '--active');
        });
    });

    // Product card favorites
    document.querySelectorAll('.product-card__fav').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Newsletter form
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
            }
        });
    }
});
