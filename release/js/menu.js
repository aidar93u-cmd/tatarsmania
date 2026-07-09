/* ===== MOBILE MENU ===== */
document.addEventListener('DOMContentLoaded', function () {
	var mobileMenu = document.getElementById('mobileMenu')
	var track = document.getElementById('mobileMenuTrack')
	var backBtn = document.getElementById('mobileMenuBack')
	var closeBtn = document.getElementById('mobileMenuClose')
	var titleEl = document.getElementById('mobileMenuTitle')
	var footer = document.getElementById('mobileMenuFooter')

	if (!mobileMenu || !track) return

	var levelOrder = []
	var levels = track.querySelectorAll('.mobile-menu__level')
	levels.forEach(function (lvl) {
		levelOrder.push(lvl.getAttribute('data-level'))
	})

	var currentIndex = 0
	var navStack = []

	function openMobileMenu() {
		mobileMenu.classList.add('mobile-menu--open')
		document.body.style.overflow = 'hidden'
	}

	function closeMobileMenu() {
		mobileMenu.classList.remove('mobile-menu--open')
		document.body.style.overflow = ''
		if (currentIndex !== 0) {
			currentIndex = 0
			navStack = []
			updateMenu()
		}
	}

	function navigateTo(levelId) {
		var idx = levelOrder.indexOf(levelId)
		if (idx === -1) return
		navStack.push(currentIndex)
		currentIndex = idx
		updateMenu()
	}

	function goBack() {
		if (navStack.length > 0) {
			currentIndex = navStack.pop()
			updateMenu()
		}
	}

	function updateMenu() {
		var levelId = levelOrder[currentIndex]
		track.style.transform = 'translateX(-' + currentIndex * 100 + '%)'

		var activeLevel = track.querySelector('.mobile-menu__level[data-level="' + levelId + '"]')
		if (activeLevel) {
			titleEl.textContent = activeLevel.getAttribute('data-title') || 'РњРµРЅСЋ'
		}

		backBtn.style.display = currentIndex > 0 ? 'block' : 'none'
		footer.style.display = levelId === 'main' ? '' : 'none'
	}

	document.addEventListener('click', function (e) {
		var burger = e.target.closest('.header-mobile__burger')
		if (!burger) return
		openMobileMenu()
	})

	if (closeBtn) {
		closeBtn.addEventListener('click', closeMobileMenu)
	}

	if (backBtn) {
		backBtn.addEventListener('click', goBack)
	}

	mobileMenu.addEventListener('click', function (e) {
		var item = e.target.closest('.mobile-menu__nav-item')
		if (!item) return
		var level = item.getAttribute('data-level')
		if (level) {
			e.preventDefault()
			navigateTo(level)
		}
	})

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
			closeMobileMenu()
		}
	})

	updateMenu()
});

/* ===== MEGA MENU ===== */
;(function() {
    'use strict';

    var megaMenu = document.getElementById('megaMenu');
    var megaMenuOverlay = document.getElementById('megaMenuOverlay');
    var defaultBanner = document.getElementById('banner-default');
    var closeTimer;

    function isDesktop() {
        return window.innerWidth > 992;
    }

    function setCatalogBtnIcon(type) {
        var ns = 'http://www.w3.org/2000/svg';
        document.querySelectorAll('.header__catalog-btn').forEach(function(btn) {
            var svg = btn.querySelector('svg');
            if (!svg) return;
            while (svg.firstChild) svg.removeChild(svg.firstChild);
            if (type === 'close') {
                svg.appendChild(createSvgElement(ns, 'line', { x1: '1', y1: '1', x2: '12', y2: '12', stroke: 'currentColor', 'stroke-width': '1.5' }));
                svg.appendChild(createSvgElement(ns, 'line', { x1: '12', y1: '1', x2: '1', y2: '12', stroke: 'currentColor', 'stroke-width': '1.5' }));
            } else {
                svg.appendChild(createSvgElement(ns, 'rect', { x: '0', y: '4.5', width: '13', height: '1', fill: 'currentColor' }));
                svg.appendChild(createSvgElement(ns, 'rect', { x: '0', y: '7.5', width: '13', height: '1', fill: 'currentColor' }));
            }
        });
        function createSvgElement(ns, tag, attrs) {
            var el = document.createElementNS(ns, tag);
            for (var k in attrs) el.setAttribute(k, attrs[k]);
            return el;
        }
    }


    function openMegaMenu() {
        if (!megaMenu) return;
        megaMenu.classList.add('mega-menu--open');
        megaMenu.setAttribute('aria-hidden', 'false');
        if (megaMenuOverlay) megaMenuOverlay.classList.add('visible');
        setCatalogBtnIcon('close');
        document.querySelector('.header-group')?.classList.add('white-header');
        var catalogBtn = document.getElementById('catalogBtn');
        if (catalogBtn) { catalogBtn.classList.add('is-open'); catalogBtn.setAttribute('aria-expanded', 'true'); }
        var h = document.querySelector('.header');
    }

    function closeMegaMenu() {
        if (!megaMenu) return;
        megaMenu.classList.remove('mega-menu--open');
        megaMenu.setAttribute('aria-hidden', 'true');
        if (megaMenuOverlay) megaMenuOverlay.classList.remove('visible');
        setCatalogBtnIcon('hamburger');
        document.querySelector('.header-group')?.classList.remove('white-header');
        var catalogBtn = document.getElementById('catalogBtn');
        if (catalogBtn) { catalogBtn.classList.remove('is-open'); catalogBtn.setAttribute('aria-expanded', 'false'); }
        document.querySelectorAll('.mega-menu__panel').forEach(function(p) { p.classList.remove('visible'); });
        document.querySelectorAll('.mega-menu__sidebar-item').forEach(function(i) { i.classList.remove('mega-menu__sidebar-item--active'); });
        clearSubItems();
    }

    function toggleMegaMenu() {
        if (megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        } else {
            openMegaMenu();
        }
    }

    function clearSubItems() {
        document.querySelectorAll('.mega-menu__l3-panel').forEach(function(p) { p.classList.remove('active'); });
        document.querySelectorAll('.mega-menu__type1-sidebar-item').forEach(function(i) { i.classList.remove('active'); });
        document.querySelectorAll('.mega-menu__type1-panels').forEach(function(p) { p.classList.remove('mega-menu__type1-panels--hidden'); });
        document.querySelectorAll('.mega-menu__banner-area').forEach(function(a) { a.classList.remove('mega-menu__banner-area--full'); });
        document.querySelectorAll('.mega-menu__banner').forEach(function(b) { b.classList.remove('visible', 'mega-menu__banner--no-text'); });
    }

    function activateType1Item(item, l3) {
        var parent = item.closest('.mega-menu__panel--type1');
        if (!parent) return;

        var panels = parent.querySelector('.mega-menu__type1-panels');
        var bannerArea = parent.querySelector('.mega-menu__banner-area');
        var l3Panel = parent.querySelector('#l3-' + l3);

        if (l3Panel) {
            panels.classList.remove('mega-menu__type1-panels--hidden');
            bannerArea.classList.remove('mega-menu__banner-area--full');
            parent.querySelectorAll('.mega-menu__l3-panel').forEach(function(p) { p.classList.remove('active'); });
            l3Panel.classList.add('active');
        } else {
            panels.classList.add('mega-menu__type1-panels--hidden');
            bannerArea.classList.add('mega-menu__banner-area--full');
        }

        document.querySelectorAll('.mega-menu__banner').forEach(function(b) { b.classList.remove('visible'); });
        var banner = document.querySelector('.mega-menu__banner[data-banner="' + l3 + '"]');
        if (banner) {
            banner.classList.add('visible');
            if (!l3Panel) {
                banner.classList.add('mega-menu__banner--no-text');
            }
        } else if (defaultBanner) {
            defaultBanner.classList.add('visible');
            if (!l3Panel) {
                defaultBanner.classList.add('mega-menu__banner--no-text');
            }
        }
    }

    /* ---- NAVIGATION ---- */
    function initNav() {
        var catalogBtn = document.getElementById('catalogBtn');
        var sidebarItems = document.querySelectorAll('.mega-menu__sidebar-item');
        var panels = document.querySelectorAll('.mega-menu__panel');
        var banners = document.querySelectorAll('.mega-menu__banner');
        var type1Items = document.querySelectorAll('.mega-menu__type1-sidebar-item');

        /* Catalog button: hover to open (desktop), click to toggle (all) */
        if (catalogBtn) {
            catalogBtn.addEventListener('mouseenter', function() {
                if (!isDesktop()) return;
                clearTimeout(closeTimer);
                if (!megaMenu.classList.contains('mega-menu--open')) {
                    openMegaMenu();
                }
            });
        }

        /* Mega menu: hover zone for closing */
        if (megaMenu) {
            megaMenu.addEventListener('mouseenter', function() {
                if (!isDesktop()) return;
                clearTimeout(closeTimer);
            });
            megaMenu.addEventListener('mouseleave', function() {
                if (!isDesktop()) return;
                clearTimeout(closeTimer);
                closeTimer = setTimeout(function() {
                    closeMegaMenu();
                }, 300);
            });
        }

        /* L1 sidebar items */
        sidebarItems.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                if (!isDesktop()) return;
                var panelId = this.getAttribute('data-panel');
                if (!panelId) return;

                sidebarItems.forEach(function(i) { i.classList.remove('mega-menu__sidebar-item--active'); });
                this.classList.add('mega-menu__sidebar-item--active');

                panels.forEach(function(p) { p.classList.remove('visible'); });
                var target = document.getElementById('panel-' + panelId);
                if (target) target.classList.add('visible');

                banners.forEach(function(b) { b.classList.remove('visible'); });
                clearSubItems();
            });

            item.addEventListener('click', function(e) {
                if (isDesktop()) return;
                e.preventDefault();
                var panelId = this.getAttribute('data-panel');
                if (!panelId) return;

                sidebarItems.forEach(function(i) { i.classList.remove('mega-menu__sidebar-item--active'); });
                this.classList.add('mega-menu__sidebar-item--active');

                panels.forEach(function(p) { p.classList.remove('visible'); });
                var target = document.getElementById('panel-' + panelId);
                if (target) target.classList.add('visible');

                banners.forEach(function(b) { b.classList.remove('visible'); });
                clearSubItems();
            });
        });

        /* L2 type1 sidebar items */
        type1Items.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                if (!isDesktop()) return;
                var l3 = this.getAttribute('data-l3');
                if (!l3) return;

                type1Items.forEach(function(i) { i.classList.remove('active'); });
                this.classList.add('active');

                activateType1Item(this, l3);
            });

            item.addEventListener('click', function(e) {
                if (isDesktop()) return;
                e.preventDefault();
                var l3 = this.getAttribute('data-l3');
                if (!l3) return;

                type1Items.forEach(function(i) { i.classList.remove('active'); });
                this.classList.add('active');

                activateType1Item(this, l3);
            });
        });
    }

    initNav();

    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.header__catalog-btn');
        if (btn && megaMenu) {
            e.stopPropagation();
            toggleMegaMenu();
        }
    });

    if (megaMenuOverlay) {
        megaMenuOverlay.addEventListener('click', function() {
            closeMegaMenu();
            clearTimeout(closeTimer);
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && megaMenu && megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        }
    });
})();
