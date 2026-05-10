/* ===== PRELOADER ===== */
(function() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.body.classList.add('preloader-active');

    setTimeout(function() {
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloader-active');
    }, 2500);
})();

document.addEventListener('DOMContentLoaded', function() {
	// ===== FANCYBOX INIT =====
	if (typeof Fancybox !== 'undefined') {
		Fancybox.bind('[data-fancybox]', {
			Thumbs: false,
			Toolbar: false,
		})
	}

	// ===== INTERSECTION OBSERVER =====
	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const delay = Array.from(entry.target.parentElement.children)
						.filter(el => el.classList.contains('animate-in'))
						.indexOf(entry.target)
					entry.target.style.animationDelay = `${delay * 0.1}s`
					entry.target.classList.add('visible')
				}
			})
		},
		{ threshold: 0.1 },
	)

	document
		.querySelectorAll('.animate-target')
		.forEach(el => observer.observe(el))

	// ===== SCROLL HEADER =====
	const header = document.querySelector('.header')
	const topbar = document.querySelector('.topbar')
	const scrollOffset = 300

	if (header && topbar) {
		// Create fixed header block containing both topbar and header
		const fixedBlock = document.createElement('div')
		fixedBlock.className = 'header-fixed'
		const topbarClone = topbar.cloneNode(true)
		const headerClone = header.cloneNode(true)
		fixedBlock.appendChild(topbarClone)
		fixedBlock.appendChild(headerClone)
		document.body.appendChild(fixedBlock)

		const topbarHeight = topbar.offsetHeight
		const headerHeight = header.offsetHeight
		let lastScroll = 0

		window.addEventListener('scroll', function () {
			const currentScroll =
				window.pageYOffset || document.documentElement.scrollTop
			if (currentScroll > scrollOffset) {
				fixedBlock.classList.add('header-fixed--visible')
				document.body.classList.add('header-fixed-active')

				if (fixedBlock.classList.contains('header-fixed--hide-topbar')) {
					document.body.style.paddingTop = headerHeight + 'px'
				} else {
					document.body.style.paddingTop = topbarHeight + headerHeight + 'px'
				}

				if (currentScroll > lastScroll && currentScroll > scrollOffset + 50) {
					fixedBlock.classList.add('header-fixed--hide-topbar')
					//      document.body.style.paddingTop = headerHeight + 'px';
				} else if (currentScroll < lastScroll) {
					fixedBlock.classList.remove('header-fixed--hide-topbar')
					//    document.body.style.paddingTop = (topbarHeight + headerHeight) + 'px';
				}
			} else {
				fixedBlock.classList.remove(
					'header-fixed--visible',
					'header-fixed--hide-topbar',
				)
				document.body.classList.remove('header-fixed-active')
				document.body.style.removeProperty('padding-top')
			}
			lastScroll = currentScroll
		})
	}

	// ===== FEATURED TABS — SMOOTH SWITCH =====
	const featuredSection = document.querySelector('.featured')
	const featuredContainer = featuredSection
		? featuredSection.querySelector('.container')
		: null
	const featuredWrapper = featuredContainer
		? featuredContainer.querySelector('.featured__tabs-container')
		: null

	if (featuredWrapper) {
		featuredWrapper.style.transition = 'height 0.4s ease'

		function setActiveTab(tabId) {
			const allTabs = featuredWrapper.querySelectorAll('.featured__tab-content')
			const activeTab = featuredWrapper.querySelector('#' + tabId)
			const activeBtn = document.querySelector(
				`.btn-filter[data-tab="${tabId}"]`,
			)
			if (!activeTab) return

			allTabs.forEach(t => t.classList.remove('featured__tab-content--active'))
			document
				.querySelectorAll('.btn-filter')
				.forEach(b => b.classList.remove('btn-filter--active'))

			activeTab.style.position = 'relative'
			activeTab.style.visibility = 'hidden'
			activeTab.style.display = 'block'
			const h = activeTab.offsetHeight
			activeTab.style.display = ''
			activeTab.style.position = ''
			activeTab.style.visibility = ''

			featuredWrapper.style.height = h + 'px'

			requestAnimationFrame(() => {
				activeTab.classList.add('featured__tab-content--active')
				if (activeBtn) activeBtn.classList.add('btn-filter--active')
			})

			featuredWrapper.addEventListener('transitionend', function handler() {
				featuredWrapper.style.height = ''
				featuredWrapper.removeEventListener('transitionend', handler)
			})
		}

		const initialActive = featuredWrapper.querySelector(
			'.featured__tab-content--active',
		)
		if (initialActive) {
			featuredWrapper.style.height = initialActive.offsetHeight + 'px'
		}

		document.querySelectorAll('.btn-filter').forEach(btn => {
			btn.addEventListener('click', function () {
				const tab = this.dataset.tab
				if (!tab) return
				setActiveTab(tab)
			})
		})
	}

	// ===== SHOWROOMS — AUTO OPEN/CLOSED =====
	function updateShowroomStatus() {
		const now = new Date()
		const currentMinutes = now.getHours() * 60 + now.getMinutes()

		document.querySelectorAll('.showroom-card').forEach(card => {
			const open = card.dataset.open
			const close = card.dataset.close
			if (!open || !close) return

			const [oh, om] = open.split(':').map(Number)
			const [ch, cm] = close.split(':').map(Number)
			const openMin = oh * 60 + om
			const closeMin = ch * 60 + cm

			const statusEl = card.querySelector('.showroom-card__status')
			if (!statusEl) return

			if (currentMinutes >= openMin && currentMinutes < closeMin) {
				statusEl.className = 'showroom-card__status showroom-card__status--open'
				statusEl.textContent = 'Открыто'
			} else {
				statusEl.className =
					'showroom-card__status showroom-card__status--closed'
				statusEl.textContent = 'Закрыто'
			}
		})
	}

	updateShowroomStatus()
	setInterval(updateShowroomStatus, 60000)

	// ===== SWIPER INITIALIZATION =====
	var AUTOPLAY_DELAY = 5000
	var heroProgressEl = document.querySelector('.hero__progress')
	var heroSlideCount = document.querySelectorAll(
		'.hero-swiper .swiper-wrapper > .swiper-slide',
	).length

	// Generate progress bars
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
				// Completed slides — stay white
				fill.style.transition = 'none'
				fill.style.width = '100%'
			} else if (i === activeIndex) {
				// Current slide — animate fill
				fill.style.transition = 'none'
				fill.style.width = '0%'
				void fill.offsetWidth
				fill.style.transition = 'width ' + AUTOPLAY_DELAY + 'ms linear'
				fill.style.width = '100%'
			} else {
				// Future slides — empty
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

	// Click progress bar to navigate
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
			320: { slidesPerView: 1, spaceBetween: 6 },
			768: { slidesPerView: 2, spaceBetween: 6 },
			1024: { slidesPerView: 3, spaceBetween: 6 },
			1200: { slidesPerView: 4, spaceBetween: 6 },
		},
	})

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
	})

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
			320: { slidesPerView: 1, spaceBetween: 6 },
			768: { slidesPerView: 2, spaceBetween: 6 },
			1024: { slidesPerView: 3, spaceBetween: 6 },
			1200: { slidesPerView: 4, spaceBetween: 6 },
		},
	})

	// Legacy dots fallback
	document
		.querySelectorAll('.categories-small__dot, .collections__dot, .blog__dot')
		.forEach(dot => {
			dot.addEventListener('click', function () {
				const parent = this.parentElement
				parent.querySelectorAll('[class*="__dot"]').forEach(d => {
					d.classList.remove(
						'categories-small__dot--active',
						'collections__dot--active',
						'blog__dot--active',
					)
				})
				this.classList.add(
					this.className.replace('--active', '') ||
						this.className.split(' ')[0] + '--active',
				)
			})
		})

	// Product card favorites (delegated)
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

	// ===== FEATURED CARD GALLERY ON HOVER =====
	document.querySelectorAll('.featured__card').forEach(function (card) {
		var galleryEl = card.querySelector('.featured__card-gallery')
		var progressEl = card.querySelector('.featured__card-progress')
		var images = galleryEl ? galleryEl.querySelectorAll('img') : []
		var bars = progressEl
			? progressEl.querySelectorAll('.featured__card-progress-bar')
			: []
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

	// ===== FEATURED CARD GALLERY ON HOVER =====
	document.querySelectorAll('.catalog__card').forEach(function (card) {
		var galleryEl = card.querySelector('.catalog__card-gallery')
		var progressEl = card.querySelector('.catalog__card-progress')
		var images = galleryEl ? galleryEl.querySelectorAll('img') : []
		var bars = progressEl
			? progressEl.querySelectorAll('.catalog__card-progress-bar')
			: []
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
	// Smooth scroll for anchors
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			const href = this.getAttribute('href')
			if (href !== '#') {
				e.preventDefault()
				const target = document.querySelector(href)
				if (target) target.scrollIntoView({ behavior: 'smooth' })
			}
		})
	})

	// Newsletter form validation
	const emailForm = document.getElementById('newsletterForm')
	if (emailForm) {
		const emailInput = document.getElementById('newsletterEmail')
		const errorMsg = document.getElementById('newsletterError')
		const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

		function clearValidation() {
			emailInput.classList.remove('is-valid', 'is-invalid')
			errorMsg.classList.remove('visible')
			const successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()
		}

		emailInput.addEventListener('input', function () {
			this.classList.remove('is-invalid', 'is-valid')
			errorMsg.classList.remove('visible')
			const successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()
		})

		emailForm.addEventListener('submit', function (e) {
			e.preventDefault()
			const email = emailInput.value.trim()
			const successMsg = emailForm.querySelector('.footer__email-success')
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

			const successEl = document.createElement('span')
			successEl.className = 'footer__email-success visible'
			successEl.textContent = 'Спасибо! Мы будем держать вас в курсе новостей.'
			emailForm.querySelector('.footer__email-wrap').appendChild(successEl)

			emailInput.value = ''
		})
	}
});
