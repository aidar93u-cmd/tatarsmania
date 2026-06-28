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

	// ===== SIDEBAR NAV DROPDOWN (mobile) =====
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('.sidebar-nav__dropdown-btn')
		var dropdown = btn ? btn.closest('.sidebar-nav__dropdown') : null

		// close all dropdowns
		document.querySelectorAll('.sidebar-nav__dropdown--open').forEach(function (d) {
			if (d !== dropdown) d.classList.remove('sidebar-nav__dropdown--open')
		})

		if (dropdown) {
			dropdown.classList.toggle('sidebar-nav__dropdown--open')
		}
	})

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

	// ===== CONTACTS / PARTNERSHIP FORM =====
	var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

	document.querySelectorAll('.contacts-form__form').forEach(function (form) {

		var nameInput = form.querySelector('input[type="text"]')
		var phoneInput = form.querySelector('input[type="tel"]')
		var emailInput = form.querySelector('input[type="email"]')

		// ===== PHONE MASK =====
		if (phoneInput) {
			phoneInput.addEventListener('input', function () {
				var x = this.value.replace(/\D/g, '').slice(0, 11)
				if (x.length === 0) { this.value = ''; return }
				var val = '+7'
				if (x.length > 1) val += ' (' + x.slice(1, 4)
				if (x.length >= 5) val += ') ' + x.slice(4, 7)
				if (x.length >= 8) val += '-' + x.slice(7, 9)
				if (x.length >= 10) val += '-' + x.slice(9, 11)
				this.value = val
			})

			phoneInput.addEventListener('keydown', function (e) {
				if (e.key === 'Backspace' && this.value.length <= 2) {
					this.value = ''
				}
			})
		}

		form.querySelectorAll('.contacts-form__field').forEach(function (field) {
			var err = document.createElement('span')
			err.className = 'contacts-form__error'
			field.appendChild(err)
		})

		function getField(input) {
			return input ? input.closest('.contacts-form__field') : null
		}

		function getErr(input) {
			var f = getField(input)
			return f ? f.querySelector('.contacts-form__error') : null
		}

		function clearFormValidation() {
			form.querySelectorAll('.contacts-form__input').forEach(function (inp) {
				inp.classList.remove('is-invalid', 'is-valid')
			})
			form.querySelectorAll('.contacts-form__error').forEach(function (e) {
				e.textContent = ''
				e.classList.remove('contacts-form__error--visible')
			})
			var successMsg = form.querySelector('.contacts-form__success')
			if (successMsg) successMsg.remove()
		}

		form.querySelectorAll('.contacts-form__input').forEach(function (inp) {
			inp.addEventListener('input', function () {
				this.classList.remove('is-invalid', 'is-valid')
				var e = getErr(this)
				if (e) { e.textContent = ''; e.classList.remove('contacts-form__error--visible') }
				var s = form.querySelector('.contacts-form__success')
				if (s) s.remove()
			})
		})

		form.addEventListener('submit', function (e) {
			e.preventDefault()
			clearFormValidation()

			var name = nameInput ? nameInput.value.trim() : ''
			var phone = phoneInput ? phoneInput.value.trim() : ''
			var email = emailInput ? emailInput.value.trim() : ''
			var valid = true

			if (nameInput && !name) {
				nameInput.classList.add('is-invalid')
				var err = getErr(nameInput)
				if (err) { err.textContent = 'Введите имя'; err.classList.add('contacts-form__error--visible') }
				valid = false
			} else if (nameInput) {
				nameInput.classList.add('is-valid')
			}

			if (phoneInput && !phone) {
				phoneInput.classList.add('is-invalid')
				var err = getErr(phoneInput)
				if (err) { err.textContent = 'Введите телефон'; err.classList.add('contacts-form__error--visible') }
				valid = false
			} else if (phoneInput && phone.replace(/[\s()\-]/g, '').length < 10) {
				phoneInput.classList.add('is-invalid')
				var err = getErr(phoneInput)
				if (err) { err.textContent = 'Введите корректный телефон'; err.classList.add('contacts-form__error--visible') }
				valid = false
			} else if (phoneInput) {
				phoneInput.classList.add('is-valid')
			}

			if (emailInput && email && !emailRegex.test(email)) {
				emailInput.classList.add('is-invalid')
				var err = getErr(emailInput)
				if (err) { err.textContent = 'Введите корректный e-mail'; err.classList.add('contacts-form__error--visible') }
				valid = false
			} else if (emailInput && email) {
				emailInput.classList.add('is-valid')
			}

			if (!valid) return

			var successEl = document.createElement('span')
			successEl.className = 'contacts-form__success'
			successEl.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.'
			form.querySelector('.contacts-form__inputs').after(successEl)

			if (nameInput) nameInput.value = ''
			if (phoneInput) phoneInput.value = ''
			if (emailInput) emailInput.value = ''
		})
	})

	// ===== NEWSLETTER =====
	var emailForm = document.getElementById('newsletterForm')
	if (emailForm) {
		var emailInput = document.getElementById('newsletterEmail')
		var errorMsg = document.getElementById('newsletterError')
		var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
		var agreeCheckbox = emailForm.parentElement.querySelector('.footer__checkbox input[type="checkbox"]')

		function clearValidation() {
			emailInput.classList.remove('is-valid', 'is-invalid')
			errorMsg.classList.remove('visible')
			if (agreeCheckbox) agreeCheckbox.closest('.footer__checkbox').classList.remove('is-invalid')
			var successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()
		}

		emailInput.addEventListener('input', function () {
			this.classList.remove('is-invalid', 'is-valid')
			errorMsg.classList.remove('visible')
			var successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()
		})

		if (agreeCheckbox) {
			agreeCheckbox.addEventListener('change', function () {
				this.closest('.footer__checkbox').classList.remove('is-invalid')
			})
		}

		emailForm.addEventListener('submit', function (e) {
			e.preventDefault()
			var email = emailInput.value.trim()
			var successMsg = emailForm.querySelector('.footer__email-success')
			if (successMsg) successMsg.remove()

			if (agreeCheckbox && !agreeCheckbox.checked) {
				agreeCheckbox.closest('.footer__checkbox').classList.add('is-invalid')
				return
			}

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
					320: { slidesPerView: 1.2, spaceBetween: 6 },
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
				spaceBetween: 6,
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

		document.querySelectorAll('.carousel-section').forEach(function (section) {
			var prevEl = section.querySelector('.carousel-section__arrow--prev')
			var nextEl = section.querySelector('.carousel-section__arrow--next')
			var loop = section.getAttribute('data-loop') === 'true'

			section.querySelectorAll('.carousel-section__swiper').forEach(function (swiperEl) {
				var config = {
					slidesPerView: 4,
					spaceBetween: 6,
					speed: 600,
					loop: loop,
					pagination: {
						el: swiperEl.querySelector('.carousel-section__pagination') || swiperEl.parentElement.querySelector('.carousel-section__pagination'),
						type: 'bullets',
						bulletClass: 'carousel-section__dot',
						bulletActiveClass: 'carousel-section__dot--active',
						clickable: true,
					},
					breakpoints: {
						320: { slidesPerView: 1.2, spaceBetween: 6 },
						768: { slidesPerView: 2, spaceBetween: 6 },
						1024: { slidesPerView: 3, spaceBetween: 6 },
						1200: { slidesPerView: 4, spaceBetween: 6 },
					},
				}
				if (prevEl && nextEl) {
					config.navigation = { prevEl: prevEl, nextEl: nextEl }
				}
				new Swiper(swiperEl, config)
			})
		})

		if (document.querySelector('.about-reviews-swiper')) {
			new Swiper('.about-reviews-swiper', {
				slidesPerView: 2,
				spaceBetween: 6,
				speed: 600,
				pagination: {
					el: '.about-reviews .about-reviews__pagination',
					type: 'bullets',
					bulletClass: 'swiper-pagination-bullet',
					bulletActiveClass: 'swiper-pagination-bullet-active',
					clickable: true,
				},
				navigation: {
					nextEl: '.about-reviews .about-reviews__arrow--next',
					prevEl: '.about-reviews .about-reviews__arrow--prev',
				},
				breakpoints: {
					320: { slidesPerView: 1.2, spaceBetween: 6 },
					768: { slidesPerView: 2, spaceBetween: 6 },
					1024: { slidesPerView: 3, spaceBetween: 6 },
					1200: { slidesPerView: 3, spaceBetween: 6 },
				},
			})
		}

		document.querySelectorAll('.carousel-section.promotions').forEach(function (section) {
			var promotionsSwiperInstance = null

			function initPromotionsSwiper() {
				if (window.innerWidth > 992) return null
				var grid = section.querySelector('.carousel-section__grid')
				if (!grid || grid.swiper) return null
				return new Swiper(grid, {
					slidesPerView: 1.2,
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

		document.querySelectorAll('.about-people').forEach(function (section) {
			var peopleSwiperInstance = null

			function initPeopleSwiper() {
				if (window.innerWidth > 992) return null
				var grid = section.querySelector('.about-people__grid')
				if (!grid || grid.swiper) return null
				return new Swiper(grid, {
					slidesPerView: 1.2,
					spaceBetween: 6,
					speed: 600,
					navigation: {
						nextEl: section.querySelector('.carousel-section__arrow--next'),
						prevEl: section.querySelector('.carousel-section__arrow--prev'),
					},
					pagination: {
						el: section.querySelector('.about-people__pagination'),
						type: 'bullets',
						bulletClass: 'carousel-section__dot',
						bulletActiveClass: 'carousel-section__dot--active',
						clickable: true,
					},
				})
			}

			function destroyPeopleSwiper() {
				if (peopleSwiperInstance) {
					peopleSwiperInstance.destroy(true, true)
					peopleSwiperInstance = null
				}
			}

			peopleSwiperInstance = initPeopleSwiper()

			window.addEventListener('resize', function () {
				if (window.innerWidth <= 992) {
					destroyPeopleSwiper()
					peopleSwiperInstance = initPeopleSwiper()
				} else {
					destroyPeopleSwiper()
				}
			})
		})

		document.querySelectorAll('.carousel-section.production-photos').forEach(function (section) {
			var photoSwiperInstance = null

			function initPhotoSwiper() {
				if (window.innerWidth > 768) return null
				var grid = section.querySelector('.carousel-section__grid')
				if (!grid || grid.swiper) return null
				return new Swiper(grid, {
					slidesPerView: 1.2,
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

			function destroyPhotoSwiper() {
				if (photoSwiperInstance) {
					photoSwiperInstance.destroy(true, true)
					photoSwiperInstance = null
				}
			}

			photoSwiperInstance = initPhotoSwiper()

			window.addEventListener('resize', function () {
				if (window.innerWidth <= 768) {
					destroyPhotoSwiper()
					photoSwiperInstance = initPhotoSwiper()
				} else {
					destroyPhotoSwiper()
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
				slidesPerView: 1.2,
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

	/* ===== REGISTRATION POPUP ===== */
	var regPhoneInput = document.getElementById('regPhone')
	var regPhoneError = document.getElementById('regPhoneError')
	var regPhoneStep3 = document.getElementById('regPhoneStep3')
	var regStep1Next = document.getElementById('regStep1Next')
	var regStep3Submit = document.getElementById('regStep3Submit')
	var regCodeDesc = document.getElementById('regCodeDesc')
	var regCodeWrap = document.getElementById('regCodeWrap')
	var regCodeError = document.getElementById('regCodeError')
	var regTimer = document.getElementById('regTimer')
	var regTimerCount = document.getElementById('regTimerCount')
	var regResend = document.getElementById('regResend')
	var regCodeInputs

	var regNameInput = document.getElementById('regName')
	var regNameError = document.getElementById('regNameError')
	var regSurnameInput = document.getElementById('regSurname')
	var regSurnameError = document.getElementById('regSurnameError')
	var regEmailInput = document.getElementById('regEmail')
	var regEmailError = document.getElementById('regEmailError')

	var regTimerInterval
	var regTimerValue = 43

	function regPhoneMask(val) {
		var digits = val.replace(/\D/g, '')
		if (digits.length === 0) return ''
		var d = digits.slice(0, 11)
		var masked = '+7'
		if (d.length > 1) masked += ' (' + d.slice(1, 4)
		if (d.length >= 5) masked += ') ' + d.slice(4, 7)
		if (d.length >= 8) masked += '-' + d.slice(7, 9)
		if (d.length >= 10) masked += '-' + d.slice(9, 11)
		return masked
	}

	function regClearPhoneError() {
		if (regPhoneInput) regPhoneInput.classList.remove('reg-popup__input--error')
		if (regPhoneError) regPhoneError.classList.remove('reg-popup__error--visible')
	}

	function regShowPhoneError() {
		if (regPhoneInput) regPhoneInput.classList.add('reg-popup__input--error')
		if (regPhoneError) regPhoneError.classList.add('reg-popup__error--visible')
	}

	function regClearCodeError() {
		regCodeInputs = regCodeWrap ? regCodeWrap.querySelectorAll('.reg-popup__code-input') : []
		regCodeInputs.forEach(function (inp) { inp.classList.remove('reg-popup__code-input--error') })
		if (regCodeError) regCodeError.classList.remove('reg-popup__error--visible')
	}

	function regShowCodeError() {
		regCodeInputs = regCodeWrap ? regCodeWrap.querySelectorAll('.reg-popup__code-input') : []
		regCodeInputs.forEach(function (inp) { inp.classList.add('reg-popup__code-input--error') })
		if (regCodeError) regCodeError.classList.add('reg-popup__error--visible')
	}

	function regClearStep3Errors() {
		if (regNameInput) regNameInput.classList.remove('reg-popup__input--error')
		if (regNameError) regNameError.classList.remove('reg-popup__error--visible')
		if (regSurnameInput) regSurnameInput.classList.remove('reg-popup__input--error')
		if (regSurnameError) regSurnameError.classList.remove('reg-popup__error--visible')
		if (regEmailInput) regEmailInput.classList.remove('reg-popup__input--error')
		if (regEmailError) regEmailError.classList.remove('reg-popup__error--visible')
	}

	function regValidateStep3() {
		var valid = true
		if (!regNameInput || !regNameInput.value.trim()) {
			if (regNameInput) regNameInput.classList.add('reg-popup__input--error')
			if (regNameError) regNameError.classList.add('reg-popup__error--visible')
			valid = false
		}
		if (!regSurnameInput || !regSurnameInput.value.trim()) {
			if (regSurnameInput) regSurnameInput.classList.add('reg-popup__input--error')
			if (regSurnameError) regSurnameError.classList.add('reg-popup__error--visible')
			valid = false
		}
		if (regEmailInput && regEmailInput.value.trim()) {
			var emailRe = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
			if (!emailRe.test(regEmailInput.value.trim())) {
				regEmailInput.classList.add('reg-popup__input--error')
				if (regEmailError) regEmailError.classList.add('reg-popup__error--visible')
				valid = false
			}
		}
		return valid
	}

	function regGetCode() {
		var code = ''
		regCodeInputs = regCodeWrap ? regCodeWrap.querySelectorAll('.reg-popup__code-input') : []
		regCodeInputs.forEach(function (inp) { code += inp.value })
		return code
	}

	function regSubmitCode() {
		regClearCodeError()
		var code = regGetCode()
		if (code.length < 6) return
		// Simulate code verification — any 6 digits work
		var rawPhone = regPhoneInput ? regPhoneInput.value.replace(/\D/g, '') : ''
		var known = localStorage.getItem('reg_user_' + rawPhone)
		if (known) {
			// Existing user — log in directly
			regCompleteAuth()
		} else {
			// New user — go to step 3
			regGoToStep(3)
		}
	}

	function regCompleteAuth() {
		var rawPhone = regPhoneInput ? regPhoneInput.value.replace(/\D/g, '') : ''
		if (rawPhone) {
			localStorage.setItem('reg_user_' + rawPhone, 'registered')
		}
		// Update profile icon
		document.querySelectorAll('.header__icon[aria-label="Профиль"], .header-mobile__icon[aria-label="Профиль"]').forEach(function (icon) {
			icon.classList.add('header__icon--logged', 'header-mobile__icon--logged')
		})
		Fancybox.close()
	}

	if (regPhoneInput) {
		regPhoneInput.addEventListener('input', function () {
			var cursor = regPhoneInput.selectionStart
			var prevLen = regPhoneInput.value.length
			regPhoneInput.value = regPhoneMask(regPhoneInput.value)
			var newLen = regPhoneInput.value.length
			if (cursor < prevLen) {
				var diff = newLen - prevLen
				regPhoneInput.setSelectionRange(cursor + diff, cursor + diff)
			}
			regClearPhoneError()
		})
	}

	function regGoToStep(step) {
		document.querySelectorAll('.reg-popup__step').forEach(function (s) {
			s.classList.toggle('reg-popup__step--active', parseInt(s.dataset.step, 10) === step)
		})
		// Re-trigger animation
		var activeEl = document.querySelector('.reg-popup__step--active')
		if (activeEl) {
			activeEl.style.animation = 'none'
			void activeEl.offsetWidth
			activeEl.style.animation = ''
		}
		if (step === 2) {
			if (regPhoneStep3) regPhoneStep3.value = regPhoneInput ? regPhoneInput.value : ''
			if (regCodeDesc && regPhoneInput) {
				regCodeDesc.textContent = 'Подтвердите номер ' + regPhoneInput.value + ', введя код из SMS:'
			}
			regCodeInputs = regCodeWrap ? regCodeWrap.querySelectorAll('.reg-popup__code-input') : []
			regCodeInputs.forEach(function (inp) { inp.value = '' })
			if (regCodeInputs.length) regCodeInputs[0].focus()
			regClearCodeError()
			regStartTimer()
		}
		if (step === 3) {
			regClearStep3Errors()
		}
	}

	function regStartTimer() {
		regTimerValue = 43
		if (regTimer) regTimer.style.display = ''
		if (regResend) regResend.style.display = 'none'
		clearInterval(regTimerInterval)
		if (regTimerCount) regTimerCount.textContent = regTimerValue
		regTimerInterval = setInterval(function () {
			regTimerValue--
			if (regTimerCount) regTimerCount.textContent = regTimerValue
			if (regTimerValue <= 0) {
				clearInterval(regTimerInterval)
				if (regTimer) regTimer.style.display = 'none'
				if (regResend) regResend.style.display = ''
			}
		}, 1000)
	}

	if (regStep1Next) {
		regStep1Next.addEventListener('click', function () {
			if (!regPhoneInput || regPhoneInput.value.replace(/\D/g, '').length < 11) {
				regShowPhoneError()
				return
			}
			regGoToStep(2)
		})
	}

	if (regCodeWrap) {
		regCodeWrap.addEventListener('input', function (e) {
			var input = e.target
			if (!input.classList.contains('reg-popup__code-input')) return
			if (input.value && input.nextElementSibling && input.nextElementSibling.classList.contains('reg-popup__code-input')) {
				input.nextElementSibling.focus()
			}
			regClearCodeError()
			// Auto-submit when all 6 digits entered
			if (regGetCode().length === 6) {
				setTimeout(regSubmitCode, 300)
			}
		})
		regCodeWrap.addEventListener('keydown', function (e) {
			var input = e.target
			if (!input.classList.contains('reg-popup__code-input')) return
			if (e.key === 'Backspace' && !input.value && input.previousElementSibling && input.previousElementSibling.classList.contains('reg-popup__code-input')) {
				input.previousElementSibling.focus()
			}
		})
		regCodeWrap.addEventListener('paste', function (e) {
			e.preventDefault()
			var paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '')
			var inputs = regCodeWrap.querySelectorAll('.reg-popup__code-input')
			for (var i = 0; i < inputs.length && i < paste.length; i++) {
				inputs[i].value = paste[i]
				if (i < inputs.length - 1) inputs[i + 1].focus()
			}
		})
	}

	if (regResend) {
		regResend.addEventListener('click', function () {
			regStartTimer()
		})
	}

	if (regStep3Submit) {
		regStep3Submit.addEventListener('click', function () {
			if (!regValidateStep3()) return
			regCompleteAuth()
		})
	}

	// Clear step 3 errors on input
	if (regNameInput) {
		regNameInput.addEventListener('input', function () {
			this.classList.remove('reg-popup__input--error')
			if (regNameError) regNameError.classList.remove('reg-popup__error--visible')
		})
	}
	if (regSurnameInput) {
		regSurnameInput.addEventListener('input', function () {
			this.classList.remove('reg-popup__input--error')
			if (regSurnameError) regSurnameError.classList.remove('reg-popup__error--visible')
		})
	}
	if (regEmailInput) {
		regEmailInput.addEventListener('input', function () {
			this.classList.remove('reg-popup__input--error')
			if (regEmailError) regEmailError.classList.remove('reg-popup__error--visible')
		})
	}

	document.addEventListener('click', function (e) {
		var btn = e.target.closest(
			'a.header__icon[aria-label="Профиль"], ' +
			'a.header-mobile__icon[aria-label="Профиль"], ' +
			'button.mobile-menu__account-btn'
		)
		if (!btn) return
		// Only intercept on pages with the popup
		var popupEl = document.getElementById('registrationPopup')
		if (!popupEl) return
		e.preventDefault()

		var mobileMenu = document.getElementById('mobileMenu')
		if (mobileMenu) {
			mobileMenu.classList.remove('mobile-menu--open')
			document.body.style.overflow = ''
		}

		regGoToStep(1)
		if (regPhoneInput) {
			regPhoneInput.value = ''
			regPhoneInput.classList.remove('reg-popup__input--error')
		}
		if (regPhoneError) regPhoneError.classList.remove('reg-popup__error--visible')
		clearInterval(regTimerInterval)

		Fancybox.show([{ src: '#registrationPopup', type: 'inline' }], {
			mainClass: 'fancybox-reg-popup',
			Toolbar: false,
			closeButton: false,
			on: {
				close: function () {
					clearInterval(regTimerInterval)
				}
			}
		})
	})

	// Restore logged state on page load
	;(function regRestoreLoggedState() {
		var hasUser = false
		for (var key in localStorage) {
			if (key.indexOf('reg_user_') === 0 && localStorage.getItem(key)) {
				hasUser = true
				break
			}
		}
		if (hasUser) {
			document.querySelectorAll('.header__icon[aria-label="Профиль"], .header-mobile__icon[aria-label="Профиль"]').forEach(function (icon) {
				icon.classList.add('header__icon--logged', 'header-mobile__icon--logged')
			})
		}
	})()
})

/* ===== FAVORITES PAGE ===== */
;(function () {
	var tabs = document.querySelectorAll('.favorites__tab')
	var gridFav = document.querySelector('.favorites__grid--fav')
	var gridRecent = document.querySelector('.favorites__grid--recent')
	var countEl = document.querySelector('.favorites__count')
	var emptyFav = document.querySelector('.favorites__empty')
	var emptyRecent = document.querySelector('.favorites__empty--recent')
	var sortTrigger = document.querySelector('.favorites__sort-trigger')
	var sortOptions = document.querySelector('.favorites__sort-options')
	var sortLinks = document.querySelectorAll('.favorites__sort-option')

	if (!gridFav || !gridRecent) return

	var activeTab = 'favorites'

	function getActiveGrid() {
		return activeTab === 'favorites' ? gridFav : gridRecent
	}

	function getActiveEmpty() {
		return activeTab === 'favorites' ? emptyFav : emptyRecent
	}

	function getInactiveGrid() {
		return activeTab === 'favorites' ? gridRecent : gridFav
	}

	function getInactiveEmpty() {
		return activeTab === 'favorites' ? emptyRecent : emptyFav
	}

	function updateEmptyState() {
		var grid = getActiveGrid()
		var empty = getActiveEmpty()
		var cards = grid.querySelectorAll('.product-card--default:not([style*="display: none"])')
		if (empty) empty.style.display = cards.length ? 'none' : ''
	}

	function updateCount() {
		var grid = getActiveGrid()
		var cards = grid.querySelectorAll('.product-card--default:not([style*="display: none"])')
		if (countEl) countEl.textContent = 'Всего ' + cards.length + ' товаров'
		updateEmptyState()
	}

	tabs.forEach(function (tab) {
		tab.addEventListener('click', function () {
			tabs.forEach(function (t) { t.classList.remove('favorites__tab--active') })
			tab.classList.add('favorites__tab--active')
			activeTab = tab.getAttribute('data-tab')

			getActiveGrid().style.display = ''
			getInactiveGrid().style.display = 'none'
			if (getActiveEmpty()) getActiveEmpty().style.display = 'none'
			if (getInactiveEmpty()) getInactiveEmpty().style.display = 'none'

			updateCount()
		})
	})

	// Click on active favorite → remove card (favorites grid only)
	document.querySelector('.favorites__content').addEventListener('click', function (e) {
		var btn = e.target.closest('.product-card__fav.active')
		if (!btn) return
		e.preventDefault()
		e.stopPropagation()
		var card = btn.closest('.product-card--default')
		if (card) card.style.display = 'none'
		btn.classList.remove('active')
		updateCount()
		if (window.updateFavBadge) window.updateFavBadge()
	})

	if (sortTrigger) {
		sortTrigger.addEventListener('click', function (e) {
			e.stopPropagation()
			sortOptions.classList.toggle('favorites__sort-options--open')
		})
	}

	document.addEventListener('click', function () {
		if (sortOptions) sortOptions.classList.remove('favorites__sort-options--open')
	})

	if (sortOptions) {
		sortOptions.addEventListener('click', function (e) { e.stopPropagation() })
	}

	sortLinks.forEach(function (link) {
		link.addEventListener('click', function (e) {
			e.preventDefault()
			var sortKey = link.getAttribute('data-sort')
			sortLinks.forEach(function (l) { l.style.fontWeight = '' })
			link.style.fontWeight = '500'
			var textEl = sortTrigger.querySelector('span')
			if (textEl) textEl.textContent = link.textContent
			sortOptions.classList.remove('favorites__sort-options--open')

			var grid = getActiveGrid()
			var cards = Array.from(grid.querySelectorAll('.product-card--default:not([style*="display: none"])'))
			if (sortKey === 'default') {
				cards.sort(function (a, b) {
					return parseInt(a.getAttribute('data-filter-id').replace(/^(product|recent)-/, '')) - parseInt(b.getAttribute('data-filter-id').replace(/^(product|recent)-/, ''))
				})
			} else if (sortKey === 'alphabet-az') {
				cards.sort(function (a, b) {
					return a.querySelector('.product-card--default__title').textContent.trim().localeCompare(b.querySelector('.product-card--default__title').textContent.trim())
				})
			} else if (sortKey === 'expensive' || sortKey === 'cheap') {
				var mul = sortKey === 'expensive' ? -1 : 1
				cards.sort(function (a, b) {
					var pa = parseInt((a.querySelector('.product-card__price').textContent || '').replace(/\s/g, '').replace(/[^0-9]/g, '')) || 0
					var pb = parseInt((b.querySelector('.product-card__price').textContent || '').replace(/\s/g, '').replace(/[^0-9]/g, '')) || 0
					return (pa - pb) * mul
				})
			}

			cards.forEach(function (card) { grid.appendChild(card) })
		})
	})

	if (window.updateFavBadge) window.updateFavBadge()
})()

;(function () {
  /* ===== SHARED SLIDE TOGGLE (vanilla replacement for jQuery) ===== */
  function slideToggle(el, duration) {
    if (el.classList.contains('is-open')) {
      el.style.transition = 'height ' + duration + 'ms ease';
      el.style.height = el.scrollHeight + 'px';
      requestAnimationFrame(function () {
        el.style.height = '0px';
      });
      el.classList.remove('is-open');
      setTimeout(function () {
        el.style.display = 'none';
        el.style.height = '';
        el.style.transition = '';
      }, duration);
    } else {
      el.style.display = '';
      var full = el.scrollHeight;
      el.style.height = '0px';
      el.style.overflow = 'hidden';
      el.style.transition = 'height ' + duration + 'ms ease';
      el.classList.add('is-open');
      requestAnimationFrame(function () {
        el.style.height = full + 'px';
      });
      setTimeout(function () {
        el.style.height = '';
        el.style.overflow = '';
        el.style.transition = '';
      }, duration);
    }
  }

  /* ===== SHARED MEDIA SLIDER (.media-slider__swiper) ===== */
  var mediaSliderEl = document.querySelector('.media-slider__swiper');
  if (mediaSliderEl) {
    function updateMediaProgress(swiper) {
      var bars = document.querySelectorAll('.media-slider__progress-bar');
      var realIndex = swiper.realIndex;
      bars.forEach(function (bar, i) {
        bar.classList.toggle('media-slider__progress-bar--active', i === realIndex);
      });
    }

    var mediaSwiper = new Swiper(mediaSliderEl, {
      loop: true,
      speed: 800,
      autoplay: { delay: 5000, disableOnInteraction: true },
      allowTouchMove: true,
      navigation: {
        prevEl: '.media-slider__btn--prev',
        nextEl: '.media-slider__btn--next',
      },
      on: {
        init: function () { updateMediaProgress(this) },
        slideChange: function () { updateMediaProgress(this) },
      },
    });

    document.querySelectorAll('.media-slider__progress-bar').forEach(function (bar, index) {
      bar.addEventListener('click', function () {
        mediaSwiper.slideToLoop(index);
      });
    });
  }

  /* ===== ACCORDION (shared across designers, production, product pages) ===== */
  var accordionConfigs = [
    { items: '.partnership-accordion', openClass: 'partnership-accordion--open', header: '.partnership-accordion__header', body: '.partnership-accordion__body' },
    { items: '.production-accordion__item', openClass: 'production-accordion__item--open', header: '.production-accordion__header', body: '.production-accordion__body' },
    { items: '.product-accordion', openClass: 'product-accordion--open', header: '.product-accordion__header', body: '.product-accordion__content' },
  ];

  accordionConfigs.forEach(function (cfg) {
    var items = document.querySelectorAll(cfg.items);
    items.forEach(function (item) {
      var body = item.querySelector(cfg.body);
      if (body) {
        if (item.classList.contains(cfg.openClass)) {
          body.style.display = '';
          body.classList.add('is-open');
          body.style.height = body.scrollHeight + 'px';
        } else {
          body.style.display = 'none';
        }
      }
      var header = item.querySelector(cfg.header);
      if (header && body) {
        header.addEventListener('click', function () {
          item.classList.toggle(cfg.openClass);
          slideToggle(body, 600);
        });
      }
    });
  });

  /* ===== LOYALTY HISTORY SWIPER (was loyalty.js) ===== */
  var loyaltyEl = document.querySelector('.loyalty-history-swiper');
  if (loyaltyEl) {
    new Swiper(loyaltyEl, {
      slidesPerView: 1, speed: 600,
      navigation: { prevEl: '.loyalty-history__arrow--prev', nextEl: '.loyalty-history__arrow--next' },
    });
  }

  /* ===== ABOUT HISTORY SWIPER (was about.js) ===== */
  var aboutHistoryEl = document.querySelector('.about-history-swiper');
  if (aboutHistoryEl) {
    var aboutTabs = aboutHistoryEl.querySelectorAll('.about-history__tab');
    var aboutSwiper = new Swiper(aboutHistoryEl, {
      slidesPerView: 1, speed: 600,
      navigation: { prevEl: '.about-history__arrow--prev', nextEl: '.about-history__arrow--next' },
      on: { slideChange: function () {
        aboutTabs.forEach(function (tab, i) { tab.classList.toggle('about-history__tab--active', i === aboutSwiper.activeIndex); });
      }},
    });
    aboutTabs.forEach(function (tab) {
      tab.addEventListener('click', function () { aboutSwiper.slideTo(parseInt(tab.getAttribute('data-slide'))); });
    });
  }

  /* ===== ARTICLE PHOTO SWIPER (was article.js) ===== */
  var photoSMedia = document.querySelector('.article-media--photo-s');
  var photoSGrid = photoSMedia ? photoSMedia.querySelector('.article-photo-s__grid') : null;
  var photoSSwiper = null;
  function initPhotoSSwiper() {
    if (window.innerWidth > 768 || !photoSGrid) return null;
    return new Swiper(photoSGrid, {
      slidesPerView: 1.2, spaceBetween: 6, speed: 600,
      navigation: { nextEl: photoSMedia.querySelector('.carousel-section__arrow--next'), prevEl: photoSMedia.querySelector('.carousel-section__arrow--prev') },
      pagination: { el: photoSGrid.querySelector('.article-photo-s__pagination'), type: 'bullets', bulletClass: 'carousel-section__dot', bulletActiveClass: 'carousel-section__dot--active', clickable: true },
    });
  }
  function destroyPhotoSSwiper() { if (photoSSwiper) { photoSSwiper.destroy(true, true); photoSSwiper = null; } }
  photoSSwiper = initPhotoSSwiper();
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) { destroyPhotoSSwiper(); photoSSwiper = initPhotoSSwiper(); }
    else { destroyPhotoSSwiper(); }
  });
  if (typeof AOS !== 'undefined') { setTimeout(function () { AOS.refresh() }, 50); }

  /* ===== OTHER COLLECTIONS CAROUSEL (was single-collection.js) ===== */
  document.querySelectorAll('.carousel-section.collections').forEach(function (section) {
    var swiperEl = section.querySelector('.carousel-section__swiper');
    if (swiperEl) {
      new Swiper(swiperEl, {
        slidesPerView: 4, spaceBetween: 16, speed: 600,
        navigation: { prevEl: section.querySelector('.carousel-section__arrow--prev'), nextEl: section.querySelector('.carousel-section__arrow--next') },
        pagination: { el: section.querySelector('.carousel-section__pagination'), clickable: true, bulletClass: 'carousel-section__dot', bulletActiveClass: 'carousel-section__dot--active' },
        breakpoints: { 320: { slidesPerView: 1.3, spaceBetween: 8 }, 769: { slidesPerView: 4, spaceBetween: 16 } },
      });
    }
  });

  /* ===== PRODUCTION VIDEO CONTROLS (was production.js) ===== */
  var prodVideoWrap = document.querySelector('.production-video__wrap');
  if (prodVideoWrap) {
    var prodVideo = prodVideoWrap.querySelector('.production-video__video');
    var prodPlay = prodVideoWrap.querySelector('.production-video__play');
    var prodPause = prodVideoWrap.querySelector('.production-video__pause');
    var prodMute = prodVideoWrap.querySelector('.production-video__mute');
    var prodContent = prodVideoWrap.closest('.production-video__holder').querySelector('.production-video__content');
    if (prodVideo && prodPlay && prodPause && prodMute && prodContent) {
      var muteOn = prodMute.querySelector('.production-video__mute-on');
      var muteOff = prodMute.querySelector('.production-video__mute-off');
      prodPlay.addEventListener('click', function () { prodVideo.play(); prodVideoWrap.classList.add('is-playing'); prodContent.classList.add('is-playing'); });
      prodPause.addEventListener('click', function () { prodVideo.pause(); prodVideoWrap.classList.remove('is-playing'); prodContent.classList.remove('is-playing'); });
      prodMute.addEventListener('click', function () {
        prodVideo.muted = !prodVideo.muted;
        muteOn.style.display = prodVideo.muted ? 'none' : 'block';
        muteOff.style.display = prodVideo.muted ? 'block' : 'none';
        prodMute.setAttribute('aria-label', prodVideo.muted ? '\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0432\u0443\u043A' : '\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0432\u0443\u043A');
      });
      prodVideoWrap.addEventListener('click', function (e) {
        if (e.target === prodPlay || prodPlay.contains(e.target)) return;
        if (e.target === prodPause || prodPause.contains(e.target)) return;
        if (e.target === prodMute || prodMute.contains(e.target)) return;
        if (prodVideo.paused) { prodVideo.play(); prodVideoWrap.classList.add('is-playing'); prodContent.classList.add('is-playing'); }
        else { prodVideo.pause(); prodVideoWrap.classList.remove('is-playing'); prodContent.classList.remove('is-playing'); }
      });
    }
  }

  /* ===== PRODUCTION STEPS GSAP (was production-steps.js) ===== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    var stepWrappers = gsap.utils.toArray('.production-steps__card-wrapper');
    var stepCards = gsap.utils.toArray('.production-steps__card');
    if (stepWrappers.length) {
      stepWrappers.forEach(function (wrapper, i) {
        var card = stepCards[i];
        var scale = (i !== stepCards.length - 1) ? 0.9 + 0.025 * i : 1;
        gsap.to(card, {
          scale: scale, x: 0, transformOrigin: 'top center', ease: 'none',
          scrollTrigger: {
            trigger: wrapper, start: 'top ' + (100 + 120 * i), end: 'bottom 1200',
            endTrigger: '.production-steps__list', scrub: true, pin: wrapper, pinSpacing: false, id: i + 1,
          },
        });
      });
    }
  }
})()
