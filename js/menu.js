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
			titleEl.textContent = activeLevel.getAttribute('data-title') || 'Меню'
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

    function openMegaMenu() {
        if (!megaMenu) return;
        var top = getMenuTop();
        megaMenu.style.top = top + 'px';
        megaMenu.classList.add('mega-menu--open');
        setCatalogBtnIcon('close');
        document.querySelector('.header-group')?.classList.add('white-header');
        document.getElementById('catalogBtn')?.classList.add('is-open');
    }

    function closeMegaMenu() {
        if (!megaMenu) return;
        megaMenu.classList.remove('mega-menu--open');
        setCatalogBtnIcon('hamburger');
        document.querySelector('.header-group')?.classList.remove('white-header');
        document.getElementById('catalogBtn')?.classList.remove('is-open');
    }

    function toggleMegaMenu() {
        if (megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        } else {
            openMegaMenu();
        }
    }

    function initLevel1Nav() {
        var items = document.querySelectorAll('.mega-menu__nav-item');
        items.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                var panelId = this.getAttribute('data-panel');
                if (!panelId) return;

                items.forEach(function(i) { i.classList.remove('mega-menu__nav-item--active'); });
                this.classList.add('mega-menu__nav-item--active');

                document.querySelectorAll('.mega-menu__panel').forEach(function(p) { p.style.display = 'none'; });
                var target = document.getElementById('panel-' + panelId);
                if (target) target.style.display = '';

                document.querySelectorAll('.mega-menu__banner').forEach(function(b) { b.classList.remove('visible'); });
                var def = document.getElementById('banner-default');
                if (def) def.classList.add('visible');
            });
        });
    }

    function initType1Nav() {
        var items = document.querySelectorAll('.mega-menu__type1-item');
        items.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                var l3 = this.getAttribute('data-l3');
                if (!l3) return;

                items.forEach(function(i) { i.classList.remove('active'); });
                this.classList.add('active');

                var parent = this.closest('.mega-menu__panel--type1');
                if (parent) {
                    parent.querySelectorAll('.mega-menu__l3-panel').forEach(function(p) { p.classList.remove('active'); });
                    var target = parent.querySelector('#l3-' + l3);
                    if (target) target.classList.add('active');
                }

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

    window.addEventListener('scroll', function() {
        if (megaMenu && megaMenu.classList.contains('mega-menu--open')) {
            closeMegaMenu();
        }
    });

    initLevel1Nav();
    initType1Nav();
})();
