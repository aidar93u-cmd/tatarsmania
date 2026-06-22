/* ===== GALLERY HOVER — global functions, used by search-popup ===== */
function initCompactCardGallery(root) {
	root = root || document
	root.querySelectorAll('.product-card--compact').forEach(function (card) {
		var galleryEl = card.querySelector('.product-card--compact__gallery')
		var progressEl = card.querySelector('.product-card--compact__progress')
		var images = galleryEl ? galleryEl.querySelectorAll('img') : []
		var bars = progressEl ? progressEl.querySelectorAll('.product-card--compact__progress-bar') : []
		var count = images.length
		if (count < 2) return

		function setActiveSlide(idx) {
			if (idx < 0) idx = 0
			if (idx >= count) idx = count - 1
			images.forEach(function (img) {
				img.classList.toggle('active', parseInt(img.dataset.index) === idx)
			})
			bars.forEach(function (bar, i) {
				bar.classList.toggle('active', i === idx)
			})
		}

		card.addEventListener('mousemove', function (e) {
			var rect = card.getBoundingClientRect()
			var x = e.clientX - rect.left
			var zoneWidth = rect.width / count
			var idx = Math.floor(x / zoneWidth)
			setActiveSlide(idx)
		})

		card.addEventListener('mouseleave', function () {
			setActiveSlide(0)
		})
	})
}

function initCatalogCardGallery(root) {
	root = root || document
	root.querySelectorAll('.product-card--default').forEach(function (card) {
		var galleryEl = card.querySelector('.product-card--default__gallery')
		var progressEl = card.querySelector('.product-card--default__progress')
		var images = galleryEl ? galleryEl.querySelectorAll('img') : []
		var bars = progressEl ? progressEl.querySelectorAll('.product-card--default__progress-bar') : []
		var count = images.length
		if (count < 2) return

		function setActiveSlide(idx) {
			if (idx < 0) idx = 0
			if (idx >= count) idx = count - 1
			images.forEach(function (img) {
				img.classList.toggle('active', parseInt(img.dataset.index) === idx)
			})
			bars.forEach(function (bar, i) {
				bar.classList.toggle('active', i === idx)
			})
		}

		card.addEventListener('mousemove', function (e) {
			var rect = card.getBoundingClientRect()
			var x = e.clientX - rect.left
			var zoneWidth = rect.width / count
			var idx = Math.floor(x / zoneWidth)
			setActiveSlide(idx)
		})

		card.addEventListener('mouseleave', function () {
			setActiveSlide(0)
		})
	})
}

document.addEventListener('DOMContentLoaded', function () {
	// ===== PRELOADER =====
	var preloader = document.getElementById('preloader')
	if (preloader) {
		document.body.classList.add('preloader-active')
		setTimeout(function () {
			preloader.classList.add('fade-out')
			document.body.classList.remove('preloader-active')
		}, 2500)
	}

	// ===== AOS =====
	if (typeof AOS !== 'undefined') {
		AOS.init({
			duration: 500,
			easing: 'ease-out-cubic',
			offset: 0,
			once: true,
		})
	}

	// ===== FANCYBOX =====
	if (typeof Fancybox !== 'undefined') {
		Fancybox.bind('[data-fancybox]', {
			Thumbs: false,
			Toolbar: false,
		})
	}

	// ===== INTERSECTION OBSERVER =====
	var observer = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					var children = Array.from(entry.target.parentElement.children)
					var delay = children.filter(function (el) { return el.classList.contains('animate-in') }).indexOf(entry.target)
					entry.target.style.animationDelay = delay * 0.1 + 's'
					entry.target.classList.add('visible')
				}
			})
		},
		{ threshold: 0.1 }
	)
	document.querySelectorAll('.animate-target').forEach(function (el) { observer.observe(el) })

	// ===== SMOOTH SCROLL =====
	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		anchor.addEventListener('click', function (e) {
			var href = this.getAttribute('href')
			if (href !== '#') {
				e.preventDefault()
				var target = document.querySelector(href)
				if (target) target.scrollIntoView({ behavior: 'smooth' })
			}
		})
	})

	// ===== FAVORITES =====
	window.updateFavBadge = function () {
		var cardFavs = document.querySelectorAll('.product-card__fav.active').length
		var productFavs = document.querySelectorAll('.product-favorite.product-favorite--active').length
		var count = cardFavs + productFavs
		document.querySelectorAll('.header__icon[aria-label="Избранное"] .header__badge').forEach(function (b) {
			b.textContent = count
		})
	}

	document.addEventListener('click', function (e) {
		var btn = e.target.closest('.product-card__fav')
		if (!btn) return
		e.stopPropagation()
		e.preventDefault()
		btn.classList.toggle('active')
		window.updateFavBadge()
	})

	window.updateFavBadge()

	// ===== SCROLL HEADER =====
	var header = document.querySelector('.header')
	var topbar = document.querySelector('.topbar')
	var headerMobile = document.querySelector('.header-mobile')
	var scrollOffset = 300

	if (header && topbar) {
		var fixedBlock = document.createElement('div')
		fixedBlock.className = 'header-fixed'
		var topbarClone = topbar.cloneNode(true)
		var headerClone = header.cloneNode(true)
		var clonedBtn = headerClone.querySelector('#catalogBtn');
		if (clonedBtn) clonedBtn.removeAttribute('id');
		fixedBlock.appendChild(topbarClone)
		fixedBlock.appendChild(headerClone)
		if (headerMobile) {
			var hmClone = headerMobile.cloneNode(true);
			var burgerClone = hmClone.querySelector('[id]');
			if (burgerClone) burgerClone.removeAttribute('id');
			fixedBlock.appendChild(hmClone);
		}
		document.body.appendChild(fixedBlock)

		var topbarHeight = topbar.offsetHeight
		var headerHeight = header.offsetHeight
		var mobileHeaderHeight = headerMobile ? headerMobile.offsetHeight : 0
		var lastScroll = 0

		function updateStickyTop() {
			var hf = document.querySelector('.header-fixed')
			if (hf && hf.classList.contains('header-fixed--visible')) {
				var rect = hf.getBoundingClientRect()
				document.documentElement.style.setProperty('--sticky-top', rect.bottom + 'px')
			} else {
				document.documentElement.style.setProperty('--sticky-top', '0px')
			}
		}

		window.addEventListener('scroll', function () {
			var currentScroll = window.pageYOffset || document.documentElement.scrollTop
			var isMobile = window.innerWidth <= 992
			if (currentScroll > scrollOffset) {
				fixedBlock.classList.add('header-fixed--visible')
				document.body.classList.add('header-fixed-active')

				if (isMobile) {
					document.body.style.paddingTop = mobileHeaderHeight + 'px'
				}

				if (!isMobile && currentScroll > lastScroll && currentScroll > scrollOffset + 50) {
					fixedBlock.classList.add('header-fixed--hide-topbar')
				} else if (currentScroll < lastScroll) {
					fixedBlock.classList.remove('header-fixed--hide-topbar')
				}
			} else {
				fixedBlock.classList.remove('header-fixed--visible', 'header-fixed--hide-topbar')
				document.body.classList.remove('header-fixed-active')
				document.body.style.removeProperty('padding-top')
			}
			updateStickyTop()
			lastScroll = currentScroll
		})

		updateStickyTop()
	}

	// ===== GALLERY HOVER INIT =====
	initCompactCardGallery()
	initCatalogCardGallery()

	// ===== NEWSLETTER =====
	var emailForm = document.getElementById('newsletterForm')
	if (emailForm) {
		var emailInput = document.getElementById('newsletterEmail')
		var errorMsg = document.getElementById('newsletterError')
		var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

		function clearValidation() {
			emailInput.classList.remove('is-valid', 'is-invalid')
			errorMsg.classList.remove('visible')
			var successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()
		}

		emailInput.addEventListener('input', function () {
			this.classList.remove('is-invalid', 'is-valid')
			errorMsg.classList.remove('visible')
			var successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()
		})

		emailForm.addEventListener('submit', function (e) {
			e.preventDefault()
			var email = emailInput.value.trim()
			var successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()

			if (!email) {
				emailInput.classList.remove('is-valid')
				emailInput.classList.add('is-invalid')
				errorMsg.textContent = 'Введите e-mail'
				errorMsg.classList.add('visible')
				return
			}

			if (!emailRegex.test(email)) {
				emailInput.classList.remove('is-valid')
				emailInput.classList.add('is-invalid')
				errorMsg.textContent = 'Введите корректный e-mail'
				errorMsg.classList.add('visible')
				return
			}

			emailInput.classList.remove('is-invalid')
			emailInput.classList.add('is-valid')
			errorMsg.classList.remove('visible')

			var successEl = document.createElement('span')
			successEl.className = 'footer__email-success visible'
			successEl.textContent = 'Спасибо! Мы будем держать вас в курсе новостей.'
			emailForm.querySelector('.footer__email-wrap').appendChild(successEl)

			emailInput.value = ''
		})
	}

	// ===== FOOTER ACCORDION =====
	document.addEventListener('click', function (e) {
		var title = e.target.closest('.footer__links-title')
		if (!title) return
		var col = title.closest('.footer__menu-col')
		if (!col) return
		if (window.innerWidth > 768) return
		e.preventDefault()
		col.classList.toggle('footer__menu-col--open')
	})

	// ===== SWIPERS =====
	if (typeof Swiper !== 'undefined') {
		var heroSwiperEl = document.querySelector('.hero-swiper')
		if (heroSwiperEl) {
			var AUTOPLAY_DELAY = 5000
			var heroProgressEl = document.querySelector('.hero__progress')
			var heroSlideCount = heroSwiperEl.querySelectorAll('.swiper-wrapper > .swiper-slide').length

			if (heroProgressEl) {
				for (var i = 0; i < heroSlideCount; i++) {
					var bar = document.createElement('div')
					bar.className = 'hero__progress-bar'
					var fill = document.createElement('div')
					fill.className = 'hero__progress-fill'
					bar.appendChild(fill)
					heroProgressEl.appendChild(bar)
				}
			}

			function startProgressFill(activeIndex) {
				var bars = document.querySelectorAll('.hero__progress-bar')
				bars.forEach(function (bar, i) {
					var fill = bar.querySelector('.hero__progress-fill')
					if (!fill) return
					if (i < activeIndex) {
						fill.style.transition = 'none'
						fill.style.width = '100%'
					} else if (i === activeIndex) {
						fill.style.transition = 'none'
						fill.style.width = '0%'
						void fill.offsetWidth
						fill.style.transition = 'width ' + AUTOPLAY_DELAY + 'ms linear'
						fill.style.width = '100%'
					} else {
						fill.style.transition = 'none'
						fill.style.width = '0%'
					}
				})
			}

			function syncActiveBar(activeIndex) {
				document.querySelectorAll('.hero__progress-bar').forEach(function (bar, i) {
					bar.classList.toggle('hero__progress-bar--active', i === activeIndex)
				})
			}

			var heroSwiper = new Swiper('.hero-swiper', {
				loop: true,
				speed: 800,
				autoplay: { delay: AUTOPLAY_DELAY, disableOnInteraction: false },
				navigation: {
					nextEl: '.hero .hero__arrow--next',
					prevEl: '.hero .hero__arrow--prev',
				},
				effect: 'fade',
				fadeEffect: { crossFade: true },
				on: {
					init: function () {
						var idx = this.realIndex
						syncActiveBar(idx)
						startProgressFill(idx)
					},
					slideChangeTransitionEnd: function () {
						var idx = this.realIndex
						syncActiveBar(idx)
						startProgressFill(idx)
					},
				},
			})

			if (heroProgressEl) {
				heroProgressEl.addEventListener('click', function (e) {
					var bar = e.target.closest('.hero__progress-bar')
					if (!bar) return
					var bars = Array.from(heroProgressEl.children)
					var idx = bars.indexOf(bar)
					if (idx !== -1) {
						heroSwiper.slideToLoop(idx)
					}
				})
			}
		}

		if (document.querySelector('.categories-small-swiper')) {
			new Swiper('.categories-small-swiper', {
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
					320: { slidesPerView: 1.5, spaceBetween: 6 },
					768: { slidesPerView: 2, spaceBetween: 6 },
					1024: { slidesPerView: 3, spaceBetween: 6 },
					1200: { slidesPerView: 4, spaceBetween: 6 },
				},
			})
		}

		if (document.querySelector('.collections-swiper')) {
			new Swiper('.collections-swiper', {
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
			})
		}

		document.querySelectorAll('.carousel-section.blog').forEach(function (section) {
			var swiperEl = section.querySelector('.carousel-section__swiper')
			if (swiperEl) {
				new Swiper(swiperEl, {
					slidesPerView: 4,
					spaceBetween: 6,
					speed: 600,
					pagination: {
						el: section.querySelector('.carousel-section__pagination'),
						type: 'bullets',
						bulletClass: 'carousel-section__dot',
						bulletActiveClass: 'carousel-section__dot--active',
						clickable: true,
					},
					navigation: {
						nextEl: section.querySelector('.carousel-section__arrow--next'),
						prevEl: section.querySelector('.carousel-section__arrow--prev'),
					},
					breakpoints: {
						320: { slidesPerView: 1.5, spaceBetween: 6 },
						768: { slidesPerView: 2, spaceBetween: 6 },
						1024: { slidesPerView: 3, spaceBetween: 6 },
						1200: { slidesPerView: 4, spaceBetween: 6 },
					},
				})
			}
		})

		document.querySelectorAll('.carousel-section.promotions').forEach(function (section) {
			var promotionsSwiperInstance = null

			function initPromotionsSwiper() {
				if (window.innerWidth > 992) return null
				var grid = section.querySelector('.carousel-section__grid')
				if (!grid || grid.swiper) return null
				return new Swiper(grid, {
					slidesPerView: 1.5,
					spaceBetween: 6,
					speed: 600,
					navigation: {
						nextEl: section.querySelector('.carousel-section__arrow--next'),
						prevEl: section.querySelector('.carousel-section__arrow--prev'),
					},
					pagination: {
						el: section.querySelector('.carousel-section__pagination'),
						type: 'bullets',
						bulletClass: 'carousel-section__dot',
						bulletActiveClass: 'carousel-section__dot--active',
						clickable: true,
					},
				})
			}

			function destroyPromotionsSwiper() {
				if (promotionsSwiperInstance) {
					promotionsSwiperInstance.destroy(true, true)
					promotionsSwiperInstance = null
				}
			}

			promotionsSwiperInstance = initPromotionsSwiper()

			window.addEventListener('resize', function () {
				if (window.innerWidth <= 992) {
					destroyPromotionsSwiper()
					promotionsSwiperInstance = initPromotionsSwiper()
				} else {
					destroyPromotionsSwiper()
				}
			})
		})

		document.querySelectorAll('.catalog-cat-s').forEach(function (section) {
			var catCatSwiperInstance = null

			function initCatCatSwiper() {
				if (window.innerWidth > 992) return null
				var grid = section.querySelector('.catalog-cat-s__grid')
				if (!grid || grid.swiper) return null
				return new Swiper(grid, {
					slidesPerView: 1.3,
					spaceBetween: 6,
					speed: 600,
					navigation: {
						nextEl: section.querySelector('.carousel-section__arrow--next'),
						prevEl: section.querySelector('.carousel-section__arrow--prev'),
					},
					pagination: {
						el: section.querySelector('.catalog-cat-s__pagination'),
						type: 'bullets',
						bulletClass: 'carousel-section__dot',
						bulletActiveClass: 'carousel-section__dot--active',
						clickable: true,
					},
				})
			}

			function destroyCatCatSwiper() {
				if (catCatSwiperInstance) {
					catCatSwiperInstance.destroy(true, true)
					catCatSwiperInstance = null
				}
			}

			catCatSwiperInstance = initCatCatSwiper()

			window.addEventListener('resize', function () {
				if (window.innerWidth <= 992) {
					destroyCatCatSwiper()
					catCatSwiperInstance = initCatCatSwiper()
				} else {
					destroyCatCatSwiper()
				}
			})
		})

		document.querySelectorAll('.categories-small__dot, .collections__dot, .carousel-section__dot').forEach(function (dot) {
			dot.addEventListener('click', function () {
				var parent = this.parentElement
				parent.querySelectorAll('[class*="__dot"]').forEach(function (d) {
					d.classList.remove('categories-small__dot--active', 'collections__dot--active', 'carousel-section__dot--active')
				})
				this.classList.add(this.className.replace('--active', '') || this.className.split(' ')[0] + '--active')
			})
		})
	}

	// ===== SEARCH POPUP =====
	var searchPopup = document.getElementById('searchPopup')
	var searchInput = document.getElementById('searchInput')
	var searchForm = document.getElementById('searchForm')
	var searchResults = document.getElementById('searchResults')
	var searchResultsGrid = document.getElementById('searchResultsGrid')
	var searchResultsHeader = document.getElementById('searchResultsHeader')
	var searchEmptyState = document.getElementById('searchEmptyState')
	var searchEmptyText = document.getElementById('searchEmptyText')
	var searchResetBtn = document.getElementById('searchReset')

	if (searchPopup && searchInput && searchForm) {
		var magnifier = searchPopup.querySelector('.search-popup__magnifier')
		var spinner = searchPopup.querySelector('.search-popup__spinner')

		function searchResetState() {
			searchResults.style.display = 'none'
			if (searchResultsHeader) searchResultsHeader.style.display = 'none'
			if (searchEmptyState) searchEmptyState.style.display = 'none'
		}

		function updateResetBtn() {
			if (!searchResetBtn) return
			searchResetBtn.style.display = searchInput.value.trim() ? '' : 'none'
		}

		document.addEventListener('click', function (e) {
			var btn = e.target.closest('.header-mobile__icon[aria-label="Поиск"], .header__icon[aria-label="Поиск"]')
			if (!btn) return
			e.preventDefault()

			searchResetState()
			updateResetBtn()
			searchInput.value = ''
			if (magnifier) magnifier.style.display = ''
			if (spinner) spinner.style.display = 'none'

			Fancybox.show([{ src: '#searchPopup', type: 'inline' }], {
				mainClass: 'fancybox-search-popup',
				Toolbar: false,
				closeButton: false,
				maxWidth: 1000,
				on: {
					close: function () {
						searchResetState()
						updateResetBtn()
						searchInput.value = ''
						if (magnifier) magnifier.style.display = ''
						if (spinner) spinner.style.display = 'none'
					}
				}
			})
		})

		if (searchResetBtn) {
			searchResetBtn.addEventListener('click', function () {
				searchInput.value = ''
				updateResetBtn()
				searchResetState()
				searchInput.focus()
			})
		}

		searchPopup.addEventListener('click', function (e) {
			var tag = e.target.closest('[data-search-tag]')
			if (!tag) return
			searchInput.value = tag.getAttribute('data-search-tag')
			performSearch(searchInput.value)
		})

		searchForm.addEventListener('submit', function (e) {
			e.preventDefault()
			var q = searchInput.value.trim()
			if (!q) return
			performSearch(q)
		})

		searchInput.addEventListener('input', function () {
			searchResetState()
			updateResetBtn()
		})

		var mockProducts = [
			{ id: 'product-1', name: 'Диван-кровать VELVET, 220 см, с подъёмным механизмом, микровелюр (виноградный)', image: 'assets/images/product-1.png', price: '138.000 руб', oldPrice: '152.000 руб', month: '34.500 руб/мес', badgeSale: true, badgeNew: true },
			{ id: 'product-2', name: 'Диван VELVET угловой, 260 см', image: 'assets/images/product-2.png', price: '168.000 руб', oldPrice: '185.000 руб', month: '42.000 руб/мес', badgeSale: false, badgeNew: true },
			{ id: 'product-3', name: 'Диван-кровать VELVET, 180 см, микровелюр (светло-серый)', image: 'assets/images/product-3.png', price: '118.000 руб', oldPrice: '', month: '29.500 руб/мес', badgeSale: false, badgeNew: false },
			{ id: 'product-5', name: 'Кресло VELVET', image: 'assets/images/product-5.png', price: '68.000 руб', oldPrice: '75.000 руб', month: '17.000 руб/мес', badgeSale: true, badgeNew: false },
		]

		function buildProductCard(item) {
			var badges = ''
			if (item.badgeSale) {
				badges += '<span class="product-card__badge sale">Sale</span><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="5.5" y="5.5" width="2" height="2" rx="1" fill="#BF6E34"/></svg>'
			}
			if (item.badgeNew) {
				badges += '<span class="product-card__badge new">New</span>'
			}
			var prices = '<span class="product-card__price">' + item.price + '</span>'
			if (item.oldPrice) {
				prices += '<span class="product-card__price-old">' + item.oldPrice + '</span>'
			}
			return '<article class="product-card product-card--default">' +
				'<a href="#" class="product-card--default__inner">' +
					'<div class="product-card--default__image-wrap">' +
						'<div class="product-card--default__image">' +
							'<img class="product-card--default__image-main" src="' + item.image + '" alt="' + item.name + '" loading="lazy">' +
							'<div class="product-card--default__gallery">' +
								'<img src="assets/images/product-1.png" data-index="0" class="active">' +
								'<img src="assets/images/product-2.png" data-index="1">' +
								'<img src="assets/images/product-3.png" data-index="2">' +
							'</div>' +
						'</div>' +
						'<div class="product-card--default__progress">' +
							'<div class="product-card--default__progress-bar active"></div>' +
							'<div class="product-card--default__progress-bar"></div>' +
							'<div class="product-card--default__progress-bar"></div>' +
						'</div>' +
						'<div class="product-card__badges">' + badges + '</div>' +
						'<button class="product-card__fav" aria-label="В избранное"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 4.09377C12.5 8.38677 6.50025 12 6.50025 12C6.50025 12 0.5 8.33335 0.5 4.10247C0.5 2.37502 1.83333 1.00002 3.5 1.00002C5.16667 1.00002 6.5 3.06252 6.5 3.06252C6.5 3.06252 7.83333 1.00002 9.5 1.00002C11.1667 1.00002 12.5 2.37502 12.5 4.09377Z" fill="#212121" fill-opacity="0.2"/></svg></button>' +
					'</div>' +
					'<div class="product-card--default__body">' +
						'<span class="product-card--default__title">' + item.name + '</span>' +
						'<div class="product-card__colors">' +
							'<span class="product-card__color" style="background-image: url(\'assets/images/background-color1.jpg\')"></span>' +
							'<span class="product-card__color" style="background-image: url(\'assets/images/background-color2.jpg\')"></span>' +
							'<span class="product-card__color" style="background-image: url(\'assets/images/background-color3.jpg\')"></span>' +
							'<span class="product-card__body-colors-label">20+ цветов</span>' +
						'</div>' +
						'<div class="product-card__price-split">' + item.month + ' в Сплит</div>' +
						'<div class="product-card--default__body-prices">' + prices + '</div>' +
						'<div class="product-card--default__hover-actions">' +
							'<button class="btn btn-primary"><svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M2.87604 1.14134C2.20672 1.166 0.619907 1.21604 0 1.49547L1.25331 0.355529C1.6081 0.280265 2.11161 0.0394284 3.04634 0.00476976C4.17327 -0.0370151 5.31442 0.201482 6.35032 0.495039C9.08692 1.27092 11.8555 0.437224 12 0.355529L10.7467 1.61354C10.1215 1.87453 8.44463 2.35334 5.69832 1.57472C4.5756 1.25615 3.67088 1.11186 2.87604 1.14134Z" fill="white"/></svg><span>В корзину</span></button>' +
							'<button class="btn btn-white"><svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M2.87604 1.14134C2.20672 1.166 0.619907 1.21604 0 1.49547L1.25331 0.355529C1.6081 0.280265 2.11161 0.0394284 3.04634 0.00476976C4.17327 -0.0370151 5.31442 0.201482 6.35032 0.495039C9.08692 1.27092 11.8555 0.437224 12 0.355529L10.7467 1.61354C10.1215 1.87453 8.44463 2.35334 5.69832 1.57472C4.5756 1.25615 3.67088 1.11186 2.87604 1.14134Z" fill="white"/></svg><span>заказать в 1 клик</span></button>' +
						'</div>' +
					'</div>' +
				'</a>' +
			'</article>'
		}

		function performSearch(query) {
			if (magnifier) magnifier.style.display = 'none'
			if (spinner) spinner.style.display = 'block'

			setTimeout(function () {
				if (magnifier) magnifier.style.display = ''
				if (spinner) spinner.style.display = 'none'

				var matched = []
				var lower = query.toLowerCase()

				// TEST: only "velvet" returns results — delete this block for real search
				if (lower.indexOf('velvet') !== -1 || lower.indexOf('вельвет') !== -1) {
					matched = mockProducts
				}

				searchResetState()

				if (matched.length) {
					if (searchResultsHeader) {
						searchResultsHeader.innerHTML = '<span>По запросу «<span class="search-popup__query">' + query + '</span>» найдено:</span><span class="count_products">' + matched.length + ' товара</span>'
						searchResultsHeader.style.display = ''
					}

					searchResultsGrid.innerHTML = ''
					matched.forEach(function (item) {
						searchResultsGrid.innerHTML += buildProductCard(item)
					})
					if (typeof initCatalogCardGallery === 'function') {
						initCatalogCardGallery(searchResultsGrid)
					}
					searchResults.style.display = ''
				} else {
					if (searchEmptyState) {
						if (searchEmptyText) searchEmptyText.innerHTML = 'По запросу «<span class="search-popup__query">' + query + '</span>» ничего не найдено:'
						searchEmptyState.style.display = ''
					}
				}

				updateResetBtn()
			}, 300)
		}
	}

	// ===== FEATURED TABS =====
	var featuredSection = document.querySelector('.featured')
	var featuredContainer = featuredSection ? featuredSection.querySelector('.container') : null
	var featuredWrapper = featuredContainer ? featuredContainer.querySelector('.featured__tabs-container') : null

	if (featuredWrapper) {
		var featuredSwiperInstance = null

		function initFeaturedSwiper(container) {
			var isMobile = window.innerWidth <= 992
			if (!isMobile) return null
			if (!container) return null
			var grid = container.querySelector('.featured__grid')
			if (!grid || grid.swiper) return null
			return new Swiper(grid, {
				slidesPerView: 1.5,
				spaceBetween: 6,
				navigation: {
					prevEl: '.featured__arrow--prev',
					nextEl: '.featured__arrow--next',
				},
			})
		}

		function destroyFeaturedSwiper() {
			if (featuredSwiperInstance) {
				featuredSwiperInstance.destroy(true, true)
				featuredSwiperInstance = null
			}
		}

		featuredWrapper.style.transition = 'height 0.4s ease'

		function setActiveTab(tabId) {
			destroyFeaturedSwiper()

			var allTabs = featuredWrapper.querySelectorAll('.featured__tab-content')
			var activeTab = featuredWrapper.querySelector('#' + tabId)
			var activeBtn = document.querySelector('.btn-filter[data-tab="' + tabId + '"]')
			if (!activeTab) return

			allTabs.forEach(function (t) { t.classList.remove('featured__tab-content--active') })
			document.querySelectorAll('.btn-filter').forEach(function (b) { b.classList.remove('btn-filter--active') })

			if (window.innerWidth > 992) {
				activeTab.style.position = 'relative'
				activeTab.style.visibility = 'hidden'
				activeTab.style.display = 'block'
				var h = activeTab.offsetHeight
				activeTab.style.display = ''
				activeTab.style.position = ''
				activeTab.style.visibility = ''

				featuredWrapper.style.height = h + 'px'

				requestAnimationFrame(function () {
					activeTab.classList.add('featured__tab-content--active')
					if (activeBtn) activeBtn.classList.add('btn-filter--active')
				})

				featuredWrapper.addEventListener('transitionend', function handler() {
					featuredWrapper.style.height = ''
					featuredWrapper.removeEventListener('transitionend', handler)
				})
			} else {
				activeTab.classList.add('featured__tab-content--active')
				if (activeBtn) activeBtn.classList.add('btn-filter--active')
				featuredSwiperInstance = initFeaturedSwiper(activeTab)
			}
		}

		var initialActive = featuredWrapper.querySelector('.featured__tab-content--active')
		if (initialActive) {
			if (window.innerWidth > 992) {
				featuredWrapper.style.height = initialActive.offsetHeight + 'px'
			}
			featuredSwiperInstance = initFeaturedSwiper(initialActive)
		}

		document.querySelectorAll('.btn-filter').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var tab = this.dataset.tab
				if (!tab) return
				setActiveTab(tab)
			})
		})

		window.addEventListener('resize', function () {
			var activeTab = featuredWrapper.querySelector('.featured__tab-content--active')
			if (window.innerWidth <= 992) {
				if (activeTab) {
					destroyFeaturedSwiper()
					featuredSwiperInstance = initFeaturedSwiper(activeTab)
				}
			} else {
				destroyFeaturedSwiper()
			}
		})
	}

	// ===== SHOWROOMS =====
	window.updateShowroomStatus = function () {
		var now = new Date()
		var currentMinutes = now.getHours() * 60 + now.getMinutes()

		document.querySelectorAll('.showroom-card').forEach(function (card) {
			var open = card.dataset.open
			var close = card.dataset.close
			if (!open || !close) return

			var oh = parseInt(open.split(':')[0], 10)
			var om = parseInt(open.split(':')[1], 10)
			var ch = parseInt(close.split(':')[0], 10)
			var cm = parseInt(close.split(':')[1], 10)
			var openMin = oh * 60 + om
			var closeMin = ch * 60 + cm

			var statusEl = card.querySelector('.showroom-card__status')
			if (!statusEl) return

			if (currentMinutes >= openMin && currentMinutes < closeMin) {
				statusEl.className = 'showroom-card__status showroom-card__status--open'
				statusEl.textContent = 'Открыто'
			} else {
				statusEl.className = 'showroom-card__status showroom-card__status--closed'
				statusEl.textContent = 'Закрыто'
			}
		})
	}

	window.updateShowroomStatus()
	setInterval(window.updateShowroomStatus, 60000)
})
