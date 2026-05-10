/* ===== PRELOADER ===== */
(function() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.body.classList.add('preloader-active');
    preloader.classList.add('is-active');

    setTimeout(function() {
        preloader.classList.add('is-hidden');
        document.body.classList.remove('preloader-active');
    }, 6000);
})();

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

    function closeMegaMenu() {
        if (megaMenu) {
            megaMenu.classList.remove('mega-menu--open');
            document.body.style.overflow = '';
        }
        // Reset catalog button to hamburger (both original and cloned)
        document.querySelectorAll('.header__catalog-btn').forEach(btn => {
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.innerHTML = '<rect x="0" y="4.5" width="13" height="1" fill="#fff"/><rect x="0" y="7.5" width="13" height="1" fill="#fff"/>';
            }
        });
        // Reset active states
        document.querySelectorAll('.mega-menu__nav-item').forEach(item => item.classList.remove('mega-menu__nav-item--active'));
        document.querySelectorAll('.mega-menu__level2').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.mega-menu__level3').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.mega-menu__banner').forEach(el => el.classList.remove('visible'));
    }

    function openMegaMenu() {
        if (megaMenu) {
            megaMenu.classList.add('mega-menu--open');
            document.body.style.overflow = 'hidden';
        }
        // Change all catalog buttons to X
        document.querySelectorAll('.header__catalog-btn').forEach(btn => {
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.innerHTML = '<line x1="1" y1="1" x2="12" y2="12" stroke="#fff" stroke-width="1.5"/><line x1="12" y1="1" x2="1" y2="12" stroke="#fff" stroke-width="1.5"/>';
            }
        });
    }

    if (catalogBtn && megaMenu) {
        catalogBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (megaMenu.classList.contains('mega-menu--open')) {
                closeMegaMenu();
            } else {
                openMegaMenu();
            }
        });
    }

    if (megaMenuOverlay) {
        megaMenuOverlay.addEventListener('click', closeMegaMenu);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && megaMenu && megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        }
    });

    // Level 1 navigation
    document.querySelectorAll('.mega-menu__nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const level1 = this.dataset.level1;

            // Update active state
            document.querySelectorAll('.mega-menu__nav-item').forEach(i => i.classList.remove('mega-menu__nav-item--active'));
            this.classList.add('mega-menu__nav-item--active');

            // Hide all level2 and level3
            document.querySelectorAll('.mega-menu__level2').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.mega-menu__level3').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.mega-menu__banner').forEach(el => el.classList.remove('visible'));

            // Show corresponding level2
            const level2 = document.getElementById('level2-' + level1);
            if (level2) level2.style.display = 'flex';

            // Show default banner
            const defaultBanner = document.getElementById('banner-default');
            if (defaultBanner) defaultBanner.classList.add('visible');
        });
    });

    // Level 2 navigation (show level3)
    document.querySelectorAll('.mega-menu__col-item[data-level2]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const level2 = this.dataset.level2;

            // Hide all level3
            document.querySelectorAll('.mega-menu__level3').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.mega-menu__banner').forEach(el => el.classList.remove('visible'));

            // Show corresponding level3
            const level3 = document.getElementById('level3-' + level2);
            if (level3) level3.style.display = 'flex';

            // Show banner for this level3
            const banner = level3 ? level3.querySelector('.mega-menu__banner') : null;
            if (banner) banner.classList.add('visible');
        });

        // Hover effect for level2 items to show banner
        item.addEventListener('mouseenter', function() {
            const level2 = this.dataset.level2;
            const level3 = document.getElementById('level3-' + level2);
            if (level3) {
                const banner = level3.querySelector('.mega-menu__banner');
                if (banner) {
                    document.querySelectorAll('.mega-menu__banner').forEach(el => el.classList.remove('visible'));
                    banner.classList.add('visible');
                }
            }
        });
    });

    // ===== SCROLL HEADER =====
    const header = document.querySelector('.header');
    const topbar = document.querySelector('.topbar');
    const scrollOffset = 300;

    if (header && topbar) {
        // Create fixed header block containing both topbar and header
        const fixedBlock = document.createElement('div');
        fixedBlock.className = 'header-fixed';
        const topbarClone = topbar.cloneNode(true);
        const headerClone = header.cloneNode(true);
        fixedBlock.appendChild(topbarClone);
        fixedBlock.appendChild(headerClone);
        document.body.appendChild(fixedBlock);

        // Add event listeners to cloned elements (catalog button, etc.)
        const catalogBtnClone = headerClone.querySelector('#catalogBtn');
        if (catalogBtnClone) {
            catalogBtnClone.removeAttribute('id');
            catalogBtnClone.addEventListener('click', function(e) {
                e.stopPropagation();
                if (megaMenu) {
                    if (megaMenu.classList.contains('mega-menu--open')) {
                        closeMegaMenu();
                    } else {
                        openMegaMenu();
                    }
                }
            });
        }

        const topbarHeight = topbar.offsetHeight;
        const headerHeight = header.offsetHeight;
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > scrollOffset) {
                fixedBlock.classList.add('header-fixed--visible');
                document.body.classList.add('header-fixed-active');

                if (fixedBlock.classList.contains('header-fixed--hide-topbar')) {
                    document.body.style.paddingTop = headerHeight + 'px';
                } else {
                    document.body.style.paddingTop = (topbarHeight + headerHeight) + 'px';
                }

                if (currentScroll > lastScroll && currentScroll > scrollOffset + 50) {
                    fixedBlock.classList.add('header-fixed--hide-topbar');
                    document.body.style.paddingTop = headerHeight + 'px';
                } else if (currentScroll < lastScroll) {
                    fixedBlock.classList.remove('header-fixed--hide-topbar');
                    document.body.style.paddingTop = (topbarHeight + headerHeight) + 'px';
                }
            } else {
                fixedBlock.classList.remove('header-fixed--visible', 'header-fixed--hide-topbar');
                document.body.classList.remove('header-fixed-active');
                document.body.style.paddingTop = '0';
            }
            lastScroll = currentScroll;
        });
    }

    // ===== FEATURED TABS — SMOOTH SWITCH =====
    const featuredSection = document.querySelector('.featured');
    const featuredContainer = featuredSection ? featuredSection.querySelector('.container') : null;
    const featuredWrapper = featuredContainer ? featuredContainer.querySelector('.featured__tabs-container') : null;

    if (featuredWrapper) {
        featuredWrapper.style.transition = 'height 0.4s ease';

        function setActiveTab(tabId) {
            const allTabs = featuredWrapper.querySelectorAll('.featured__tab-content');
            const activeTab = featuredWrapper.querySelector('#' + tabId);
            const activeBtn = document.querySelector(`.btn-filter[data-tab="${tabId}"]`);
            if (!activeTab) return;

            allTabs.forEach(t => t.classList.remove('featured__tab-content--active'));
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('btn-filter--active'));

            activeTab.style.position = 'relative';
            activeTab.style.visibility = 'hidden';
            activeTab.style.display = 'block';
            const h = activeTab.offsetHeight;
            activeTab.style.display = '';
            activeTab.style.position = '';
            activeTab.style.visibility = '';

            featuredWrapper.style.height = h + 'px';

            requestAnimationFrame(() => {
                activeTab.classList.add('featured__tab-content--active');
                if (activeBtn) activeBtn.classList.add('btn-filter--active');
            });

            featuredWrapper.addEventListener('transitionend', function handler() {
                featuredWrapper.style.height = '';
                featuredWrapper.removeEventListener('transitionend', handler);
            });
        }

        const initialActive = featuredWrapper.querySelector('.featured__tab-content--active');
        if (initialActive) {
            featuredWrapper.style.height = initialActive.offsetHeight + 'px';
        }

        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                if (!tab) return;
                setActiveTab(tab);
            });
        });
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

    // ===== YANDEX MAP — CUSTOM MARKERS & BALLOONS =====
    ymaps.ready(initYandexMap);

    function initYandexMap() {
        var mapCenter = [55.7790, 49.1240];

        var map = new ymaps.Map('showroomMap', {
            center: mapCenter,
            zoom: 13,
            controls: ['zoomControl']
        }, {
            suppressMapOpenBlock: true
        });

        map.behaviors.disable('scrollZoom');

        var pinSvg =
            '<svg width="23" height="30" viewBox="0 0 23 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 11.7073C23 20.4878 11.5 30 11.5 30C11.5 30 0 20.4878 0 11.7073C0 5.24154 5.14873 0 11.5 0C17.8513 0 23 5.24154 23 11.7073Z" fill="#212121"/><path d="M11.425 18H10.5218V9.69413C10.2071 9.71035 9.86674 9.75993 9.49303 9.84426C8.18112 10.1406 7.37109 9.95273 7 9.79282V9.16175C7.08941 9.20984 7.78405 9.43237 9.11813 9.27021C9.62691 9.20841 10.1172 9 10.7556 9H11.425V18ZM12.2444 9C12.8828 9 13.3731 9.20841 13.8819 9.27021C15.2158 9.43235 15.9104 9.20988 16 9.16175V9.79282C15.6289 9.95272 14.8188 10.1405 13.507 9.84426C13.1333 9.75993 12.7929 9.71034 12.4782 9.69413V18H11.575V9H12.2444Z" fill="white"/></svg>';

        var isMobile = window.innerWidth <= 690;
        var iconSize = isMobile ? [23, 30] : [23, 30];
        var iconOffset = isMobile ? [-25, -50] : [-16, -40];

        document.querySelectorAll('.showroom-card[data-lat][data-lng]').forEach(function(card) {
            var lat = parseFloat(card.dataset.lat);
            var lng = parseFloat(card.dataset.lng);
            var name = card.querySelector('.showroom-card__name').textContent;
            var address = card.querySelector('.showroom-card__address').textContent;
            var phone = card.querySelector('.showroom-card__phone').textContent;
            var hours = card.querySelector('.showroom-card__hours').textContent;
            var phoneRaw = phone.replace(/\s|\(|\)|-/g, '');

            var balloonHtml =
                '<div class="map-balloon">' +
                    '<div class="map-balloon__body">' +
                        '<div class="map-balloon__row">' +
                            '<span>' + address + '</span>' +
                        '</div>' +
                        '<div class="map-balloon__row">' +
                            '<a href="tel:' + phoneRaw + '" class="map-balloon__phone">' + phone + '</a>' +
                        '</div>' +
                        '<div class="map-balloon__row">' + hours + '</div>' +
                    '</div>' +
                '</div>';

            var placemark = new ymaps.Placemark(
                [lat, lng],
                { balloonContent: balloonHtml, hintContent: name },
                {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSvg),
                    iconImageSize: iconSize,
                    iconImageOffset: iconOffset,
                    balloonShadow: false
                }
            );

            placemark.events.add('click', function() {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            map.geoObjects.add(placemark);
        });
    }

    // ===== SWIPER INITIALIZATION =====
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        speed: 800,
       /* autoplay: { delay: 5000, disableOnInteraction: false },*/
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
            parent.querySelectorAll('[class*="__dot"]').forEach(d => {
                d.classList.remove('categories-small__dot--active', 'collections__dot--active', 'blog__dot--active', 'hero__dot--active');
            });
            this.classList.add(this.className.replace('--active', '') || this.className.split(' ')[0] + '--active');
        });
    });

    // Product card favorites
    document.querySelectorAll('.product-card__fav').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
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

    // Newsletter form validation
    const emailForm = document.getElementById('newsletterForm');
    if (emailForm) {
        const emailInput = document.getElementById('newsletterEmail');
        const errorMsg = document.getElementById('newsletterError');
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

        function clearValidation() {
            emailInput.classList.remove('is-valid', 'is-invalid');
            errorMsg.classList.remove('visible');
            const successMsg = emailForm.querySelector('.footer__email-success');
            if (successMsg) successMsg.remove();
        }

        emailInput.addEventListener('input', function() {
            this.classList.remove('is-invalid', 'is-valid');
            errorMsg.classList.remove('visible');
            const successMsg = emailForm.querySelector('.footer__email-success');
            if (successMsg) successMsg.remove();
        });

        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            const successMsg = emailForm.querySelector('.footer__email-success');
            if (successMsg) successMsg.remove();

            if (!email) {
                emailInput.classList.remove('is-valid');
                emailInput.classList.add('is-invalid');
                errorMsg.textContent = 'Введите e-mail';
                errorMsg.classList.add('visible');
                return;
            }

            if (!emailRegex.test(email)) {
                emailInput.classList.remove('is-valid');
                emailInput.classList.add('is-invalid');
                errorMsg.textContent = 'Введите корректный e-mail';
                errorMsg.classList.add('visible');
                return;
            }

            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
            errorMsg.classList.remove('visible');

            const successEl = document.createElement('span');
            successEl.className = 'footer__email-success visible';
            successEl.textContent = 'Спасибо! Мы будем держать вас в курсе новостей.';
            emailForm.querySelector('.footer__email-wrap').appendChild(successEl);

            emailInput.value = '';
        });
    }
});




