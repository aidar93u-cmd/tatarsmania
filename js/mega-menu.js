/* ===== MEGA MENU ===== */
(function() {
    'use strict';

    var megaMenu = document.getElementById('megaMenu');
    var megaMenuOverlay = document.getElementById('megaMenuOverlay');

    /* ---------- helpers ---------- */
    function setCatalogBtnIcon(type) {
        document.querySelectorAll('.header__catalog-btn').forEach(function(btn) {
            var svg = btn.querySelector('svg');
            if (!svg) return;
            if (type === 'close') {
                svg.innerHTML = '<line x1="1" y1="1" x2="12" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="1" x2="1" y2="12" stroke="currentColor" stroke-width="1.5"/>';
            } else {
                svg.innerHTML = '<rect x="0" y="4.5" width="13" height="1" fill="currentColor"/><rect x="0" y="7.5" width="13" height="1" fill="currentColor"/>';
            }
        });
    }

    function getMenuTop() {
        var hf = document.querySelector('.header-fixed');
        if (hf && hf.classList.contains('header-fixed--visible')) {
            return hf.getBoundingClientRect().bottom;
        }
        var header = document.querySelector('.header');
        return header ? (header.getBoundingClientRect().bottom+1): 0;
    }

    function closeMegaMenu() {
        if (!megaMenu) return;
        megaMenu.classList.remove('mega-menu--open');
        setCatalogBtnIcon('hamburger');
        document.querySelector('.header-group')?.classList.remove('white-header');
    }

    function openMegaMenu() {
        if (!megaMenu) return;
        var top = getMenuTop();
        megaMenu.style.top = top + 'px';
        var container = megaMenu.querySelector('.mega-menu__container');
      //  if (container) container.style.maxHeight = 'calc(100vh - ' + top + 'px)';
        megaMenu.classList.add('mega-menu--open');
        setCatalogBtnIcon('close');
        document.querySelector('.header-group')?.classList.add('white-header');
    }

    function toggleMegaMenu() {
        if (megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        } else {
            openMegaMenu();
        }
    }

    /* ---------- Level 1: sidebar click ---------- */
    function initLevel1Nav() {
        var items = document.querySelectorAll('.mega-menu__nav-item');
        items.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                var panelId = this.getAttribute('data-panel');
                if (!panelId) return;

                // active state
                items.forEach(function(i) { i.classList.remove('mega-menu__nav-item--active'); });
                this.classList.add('mega-menu__nav-item--active');

                // show/hide panels
                document.querySelectorAll('.mega-menu__panel').forEach(function(p) { p.style.display = 'none'; });
                var target = document.getElementById('panel-' + panelId);
                if (target) target.style.display = '';

                // show default banner, hide specific banners
                document.querySelectorAll('.mega-menu__banner').forEach(function(b) { b.classList.remove('visible'); });
                var def = document.getElementById('banner-default');
                if (def) def.classList.add('visible');
            });
        });
    }

    /* ---------- Type 1: Level 2 sidebar → Level 3 content ---------- */
    function initType1Nav() {
        var items = document.querySelectorAll('.mega-menu__type1-item');
        items.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                var l3 = this.getAttribute('data-l3');
                if (!l3) return;

                // active state
                items.forEach(function(i) { i.classList.remove('active'); });
                this.classList.add('active');

                // toggle L3 panels
                var parent = this.closest('.mega-menu__panel--type1');
                if (parent) {
                    parent.querySelectorAll('.mega-menu__l3-panel').forEach(function(p) { p.classList.remove('active'); });
                    var target = parent.querySelector('#l3-' + l3);
                    if (target) target.classList.add('active');
                }

                // show banner for this L3 category
                document.querySelectorAll('.mega-menu__banner').forEach(function(b) { b.classList.remove('visible'); });
                var banner = document.querySelector('.mega-menu__banner[data-banner="' + l3 + '"]');
                if (banner) {
                    banner.classList.add('visible');
                } else {
                    var def = document.getElementById('banner-default');
                    if (def) def.classList.add('visible');
                }
            });
        });
    }

    /* ---------- events ---------- */
    // Delegated click on document — handles both original and dynamically cloned catalog buttons
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.header__catalog-btn');
        if (btn && megaMenu) {
            e.stopPropagation();
            toggleMegaMenu();
        }
    });

    if (megaMenuOverlay) {
        megaMenuOverlay.addEventListener('click', closeMegaMenu);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && megaMenu && megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        }
    });

    // Close mega menu on scroll
    window.addEventListener('scroll', function() {
        if (megaMenu && megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        }
    });

    // Init navigation
    initLevel1Nav();
    initType1Nav();
})();
