/* ===== MEGA MENU ===== */
document.addEventListener('DOMContentLoaded', function() {
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

    // Handle cloned catalog button in header-fixed
    const headerFixed = document.querySelector('.header-fixed');
    if (headerFixed) {
        const catalogBtnClone = headerFixed.querySelector('.header__catalog-btn');
        if (catalogBtnClone && megaMenu) {
            catalogBtnClone.addEventListener('click', function(e) {
                e.stopPropagation();
                if (megaMenu.classList.contains('mega-menu--open')) {
                    closeMegaMenu();
                } else {
                    openMegaMenu();
                }
            });
        }
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
});
