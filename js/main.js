/* ===== FormUtils (validate.js wrapper) ===== */
;(function () {
    if (!window.FormValidator) return
    var hooks = FormValidator.prototype._hooks
    hooks.rus_alpha = function (field) {
        return /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(field.value)
    }
    hooks.phone = function (field) {
        var digits = field.value.replace(/\D/g, '')
        return digits.length >= 11 && digits.length <= 15
    }
    function testRule(val, rule, param) {
        var field = { value: val }
        if (hooks[rule]) {
            return param != null ? hooks[rule](field, param) : hooks[rule](field)
        }
        return true
    }
    window.FormUtils = {
        test: function (val, rules) {
            if (!rules) return true
            var list = rules.split('|')
            for (var i = 0; i < list.length; i++) {
                var r = list[i].trim()
                if (!r) continue
                var match = r.match(/^(.+?)\[(.+)\]$/)
                if (!testRule(val, match ? match[1] : r, match ? match[2] : null)) return false
            }
            return true
        }
    }
    window.showToast = function (text, type) {
        var container = document.getElementById('toastContainer')
        if (!container) {
            container = document.createElement('div')
            container.className = 'toast-container'
            container.id = 'toastContainer'
            document.body.appendChild(container)
        }
        var toast = document.createElement('div')
        toast.className = 'toast' + (type === 'success' ? ' toast--success' : '')
        toast.textContent = text
        container.appendChild(toast)
        requestAnimationFrame(function () {
            toast.classList.add('toast--visible')
        })
        setTimeout(function () {
            toast.classList.remove('toast--visible')
            toast.addEventListener('transitionend', function () {
                toast.remove()
            })
        }, 2500)
    }
})()

/* ===== GALLERY HOVER — global functions, used by search-popup ===== */
function initCompactCardGallery(root) {
	root = root || document
	root.querySelectorAll('.product-card--compact').forEach(function (card) {
		var galleryEl = card.querySelector('.product-card--compact__gallery')
		var progressEl = card.querySelector('.product-card--compact__progress')
		var images = galleryEl ? galleryEl.querySelectorAll('img') : []
		var bars = progressEl
			? progressEl.querySelectorAll('.product-card--compact__progress-bar')
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
}

function initCatalogCardGallery(root) {
	root = root || document
	root.querySelectorAll('.product-card--default').forEach(function (card) {
		var galleryEl = card.querySelector('.product-card--default__gallery')
		var progressEl = card.querySelector('.product-card--default__progress')
		var images = galleryEl ? galleryEl.querySelectorAll('img') : []
		var bars = progressEl
			? progressEl.querySelectorAll('.product-card--default__progress-bar')
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
}

document.addEventListener('DOMContentLoaded', function () {
	// ===== PRELOADER (homepage only, once per session) =====
	var preloader = document.getElementById('preloader')
	var preloaderActive = false

	if (preloader && document.body.classList.contains('home')) {
		if (sessionStorage.getItem('preloaderShown')) {
			preloader.style.display = 'none'
		} else {
			preloaderActive = true
			document.body.classList.add('preloader-active')
			sessionStorage.setItem('preloaderShown', '1')
			setTimeout(function () {
				preloader.classList.add('fade-out')
				document.body.classList.remove('preloader-active')
				preloaderActive = false
				initHeroSwiper && initHeroSwiper()
			}, 2500)
		}
	} else if (preloader) {
		preloader.style.display = 'none'
	}

	// Skip preloader on bfcache restore (back/forward)
	window.addEventListener('pageshow', function (e) {
		if (e.persisted && preloader && !preloader.classList.contains('fade-out')) {
			preloader.classList.add('fade-out')
			document.body.classList.remove('preloader-active')
		}
	})

	// Hide badge when count is 0
	document.querySelectorAll('.header__badge').forEach(function (badge) {
		if (badge.textContent.trim() === '0' || badge.textContent.trim() === '') {
			badge.style.display = 'none'
		}
	})

	// ===== AOS =====
	if (typeof fixShowroomCards === 'function') fixShowroomCards()
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
		document
			.querySelectorAll('.sidebar-nav__dropdown--open')
			.forEach(function (d) {
				if (d !== dropdown) d.classList.remove('sidebar-nav__dropdown--open')
			})

		if (dropdown) {
			dropdown.classList.toggle('sidebar-nav__dropdown--open')
		}
	})

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
		var productFavs = document.querySelectorAll(
			'.product-favorite.product-favorite--active',
		).length
		var count = cardFavs + productFavs
		document
			.querySelectorAll('.header__icon[aria-label="Избранное"] .header__badge')
			.forEach(function (b) {
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
	var headerGroup = document.querySelector('.header-group')
	var header = document.querySelector('.header')
	var megaMenu = document.getElementById('megaMenu')
	var scrollOffset = 100

	if (headerGroup) {
		var lastScroll = 0

		function syncMegaMenuHideTopbar() {
			if (!megaMenu) return
			if (headerGroup.classList.contains('header-group--hide-topbar')) {
				megaMenu.classList.add('header-group--hide-topbar')
			} else {
				megaMenu.classList.remove('header-group--hide-topbar')
			}
		}

		function updateStickyTop() {
			var topbar = document.querySelector('.topbar')
			var header = document.querySelector('.header')
			var topbarH = topbar ? topbar.offsetHeight : 0
			var headerH = header ? header.offsetHeight : 0
			document.documentElement.style.setProperty('--sticky-top', (topbarH + headerH) + 'px')
		} 

		window.addEventListener('scroll', function () {
			var currentScroll =
				window.pageYOffset || document.documentElement.scrollTop

			if (currentScroll > scrollOffset) {
				headerGroup.classList.add('header-group--scrolled')
				if (currentScroll > lastScroll && currentScroll > scrollOffset + 50) {
					headerGroup.classList.add('header-group--hide-topbar')
					syncMegaMenuHideTopbar()
				}
			} else {
				headerGroup.classList.remove('header-group--scrolled')
				headerGroup.classList.remove('header-group--hide-topbar')
				syncMegaMenuHideTopbar()
			}
			if (currentScroll < lastScroll) {
				headerGroup.classList.remove('header-group--hide-topbar')
				syncMegaMenuHideTopbar()
			}
			lastScroll = currentScroll
		})

		updateStickyTop()

		/* Sync --sticky-top after hide-topbar slide transition completes */
		headerGroup.addEventListener('transitionend', function (e) {
			if (e.propertyName === 'transform') {
				updateStickyTop()
			}
		})
	}

	// ===== GALLERY HOVER INIT =====
	initCompactCardGallery()
	initCatalogCardGallery()

	// ===== CONTACTS / PARTNERSHIP FORM =====
	document.querySelectorAll('.contacts-form__form').forEach(function (form) {
		var nameInput = form.querySelector('input[type="text"]')
		var phoneInput = form.querySelector('input[type="tel"]')
		var emailInput = form.querySelector('input[type="email"]')
		var checkboxInput = form.querySelector('.contacts-form__checkbox input[type="checkbox"]')

		if (checkboxInput) {
			checkboxInput.addEventListener('change', function () {
				this.closest('.contacts-form__checkbox').classList.remove('is-invalid')
			})
		}

		// ===== PHONE MASK =====
		if (phoneInput) {
			phoneInput.addEventListener('input', function () {
				var x = this.value.replace(/\D/g, '').slice(0, 11)
				if (x.length === 0) {
					this.value = ''
					return
				}
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
		}

		form.querySelectorAll('.contacts-form__input').forEach(function (inp) {
			inp.addEventListener('input', function () {
				this.classList.remove('is-invalid', 'is-valid')
				var e = getErr(this)
				if (e) {
					e.textContent = ''
					e.classList.remove('contacts-form__error--visible')
				}
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
				if (err) {
					err.textContent = 'Введите имя'
					err.classList.add('contacts-form__error--visible')
				}
				valid = false
			} else if (nameInput) {
				nameInput.classList.add('is-valid')
			}

			if (phoneInput && !phone) {
				phoneInput.classList.add('is-invalid')
				var err = getErr(phoneInput)
				if (err) {
					err.textContent = 'Введите телефон'
					err.classList.add('contacts-form__error--visible')
				}
				valid = false
			} else if (phoneInput && !FormUtils.test(phone, 'phone')) {
				phoneInput.classList.add('is-invalid')
				var err = getErr(phoneInput)
				if (err) {
					err.textContent = 'Введите корректный телефон'
					err.classList.add('contacts-form__error--visible')
				}
				valid = false
			} else if (phoneInput) {
				phoneInput.classList.add('is-valid')
			}

			if (emailInput && email && !FormUtils.test(email, 'valid_email')) {
				emailInput.classList.add('is-invalid')
				var err = getErr(emailInput)
				if (err) {
					err.textContent = 'Введите корректный e-mail'
					err.classList.add('contacts-form__error--visible')
				}
				valid = false
			} else if (emailInput && email) {
				emailInput.classList.add('is-valid')
			}

			if (checkboxInput && !checkboxInput.checked) {
				checkboxInput.closest('.contacts-form__checkbox').classList.add('is-invalid')
				valid = false
			}

			if (!valid) return

			showToast('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success')
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
		var agreeCheckbox = emailForm.parentElement.querySelector(
			'.footer__checkbox input[type="checkbox"]',
		)

		function clearValidation() {
			emailInput.classList.remove('is-valid', 'is-invalid')
			errorMsg.classList.remove('visible')
			if (agreeCheckbox)
				agreeCheckbox
					.closest('.footer__checkbox')
					.classList.remove('is-invalid')
		}

		emailInput.addEventListener('input', function () {
			this.classList.remove('is-invalid', 'is-valid')
			errorMsg.classList.remove('visible')
		})

		if (agreeCheckbox) {
			agreeCheckbox.addEventListener('change', function () {
				this.closest('.footer__checkbox').classList.remove('is-invalid')
			})
		}

		emailForm.addEventListener('submit', function (e) {
			e.preventDefault()
			var email = emailInput.value.trim()
			var hasError = false

			if (agreeCheckbox && !agreeCheckbox.checked) {
				agreeCheckbox.closest('.footer__checkbox').classList.add('is-invalid')
				hasError = true
			}

			if (!email) {
				emailInput.classList.remove('is-valid')
				emailInput.classList.add('is-invalid')
				errorMsg.textContent = 'Введите e-mail'
				errorMsg.classList.add('visible')
				hasError = true
			} else if (!FormUtils.test(email, 'valid_email')) {
				emailInput.classList.remove('is-valid')
				emailInput.classList.add('is-invalid')
				errorMsg.textContent = 'Введите корректный e-mail'
				errorMsg.classList.add('visible')
				hasError = true
			}

			if (hasError) return

			emailInput.classList.remove('is-invalid')
			emailInput.classList.add('is-valid')
			errorMsg.classList.remove('visible')
			showToast('Спасибо! Мы будем держать вас в курсе новостей.', 'success')
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
	var initHeroSwiper
	if (typeof Swiper !== 'undefined') {
		initHeroSwiper = function () {
			var heroSwiperEl = document.querySelector('.hero-swiper')
			if (!heroSwiperEl) return
			var AUTOPLAY_DELAY = 5000
			var heroProgressEl = document.querySelector('.hero__progress')
			var heroSlideCount = heroSwiperEl.querySelectorAll(
				'.swiper-wrapper > .swiper-slide',
			).length

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
				document
					.querySelectorAll('.hero__progress-bar')
					.forEach(function (bar, i) {
						bar.classList.toggle(
							'hero__progress-bar--active',
							i === activeIndex,
						)
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

		if (!preloaderActive) initHeroSwiper()

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

			section
				.querySelectorAll('.carousel-section__swiper')
				.forEach(function (swiperEl) {
					var config = {
						slidesPerView: 4,
						spaceBetween: 6,
						speed: 600,
						loop: loop,
						pagination: {
							el:
								swiperEl.querySelector('.carousel-section__pagination') ||
								swiperEl.parentElement.querySelector(
									'.carousel-section__pagination',
								),
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

		document.querySelectorAll('.about-reviews').forEach(function (section) {
			var reviewsSwiperInstance = null
			var swiperEl = section.querySelector('.about-reviews-swiper')

			function initReviewsSwiper() {
				if (!swiperEl || swiperEl.swiper) return null
				var config = {
					spaceBetween: 6,
					speed: 600,
					navigation: {
						nextEl: section.querySelector('.about-reviews__arrow--next'),
						prevEl: section.querySelector('.about-reviews__arrow--prev'),
					},
				}
				if (window.innerWidth > 992) {
					config.slidesPerView = 3
				} else {
					config.slidesPerView = 1.2
					config.breakpoints = {
						768: { slidesPerView: 2, spaceBetween: 6 },
					}
				}
				config.pagination = {
					el: section.querySelector('.about-reviews__pagination'),
					type: 'bullets',
					bulletClass: 'swiper-pagination-bullet',
					bulletActiveClass: 'swiper-pagination-bullet-active',
					clickable: true,
				}
				return new Swiper(swiperEl, config)
			}

			function destroyReviewsSwiper() {
				if (reviewsSwiperInstance) {
					reviewsSwiperInstance.destroy(true, true)
					reviewsSwiperInstance = null
				}
			}

			reviewsSwiperInstance = initReviewsSwiper()

			window.addEventListener('resize', function () {
				destroyReviewsSwiper()
				reviewsSwiperInstance = initReviewsSwiper()
			})
		})

		/* ===== REVIEW POPUP ===== */
		var reviewPopupStars = document.getElementById('reviewPopupStars')
		var reviewPopupText = document.getElementById('reviewPopupText')
		var reviewPopupName = document.getElementById('reviewPopupName')
		var reviewPopupProduct = document.getElementById('reviewPopupProduct')
		var reviewPopupGallery = document.getElementById('reviewPopupGallery')
		var reviewPopupProgress = document.getElementById('reviewPopupProgress')
		var reviewGallerySwiper = null
		var reviewFancyboxInstance = null
		var popupStarsHtml = ''
		for (var si = 0; si < 5; si++) {
			popupStarsHtml += '<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8.5 4.5L12.5 5L9.5 8L10 12L6.5 10L3 12L3.5 8L0.5 5L4.5 4.5L6.5 1Z" fill="#BF6E34"/></svg>'
		}

		document.querySelectorAll('.about-reviews__card-more').forEach(function (btn) {
			btn.addEventListener('click', function (e) {
				e.preventDefault()
				var card = btn.closest('.about-reviews__card')
				if (!card) return

				var text
				var titleTextEl = card.querySelector('.about-reviews__card-title-text')
				var descEl = card.querySelector('.about-reviews__card-desc')
				if (titleTextEl && descEl) {
					text = titleTextEl.textContent + '\n\n' + descEl.textContent
				} else {
					text = card.querySelector('.about-reviews__card-text').textContent
				}

				var name = card.querySelector('.about-reviews__card-name').textContent
				var product = card.querySelector('.about-reviews__card-product').textContent

				reviewPopupStars.innerHTML = popupStarsHtml
				reviewPopupText.textContent = text
				reviewPopupName.textContent = name
				reviewPopupProduct.textContent = product

				// Build gallery
				var galleryImgs = []
				try {
					galleryImgs = JSON.parse(btn.getAttribute('data-gallery') || '[]')
				} catch (e) {}

				reviewPopupGallery.innerHTML = ''
				galleryImgs.forEach(function (src) {
					var slide = document.createElement('div')
					slide.className = 'swiper-slide'
					var img = document.createElement('img')
					img.src = src
					img.alt = ''
					img.loading = 'lazy'
					slide.appendChild(img)
					reviewPopupGallery.appendChild(slide)
				})

				// Build progress bars
				reviewPopupProgress.innerHTML = ''
				galleryImgs.forEach(function () {
					var bar = document.createElement('div')
					bar.className = 'review-popup-progress-bar'
					var fill = document.createElement('div')
					fill.className = 'review-popup-progress-fill'
					bar.appendChild(fill)
					reviewPopupProgress.appendChild(bar)
				})

				// Destroy previous swiper if any
				if (reviewGallerySwiper) {
					reviewGallerySwiper.destroy(true, true)
					reviewGallerySwiper = null
				}

				// Open fancybox
				reviewFancyboxInstance = Fancybox.show([{ src: '#reviewPopupPanel', type: 'inline' }], {
					mainClass: 'fancybox-review-popup',
					closeButton: true,
					on: {
						done: function () {
							var gallerySwiperEl = document.querySelector('.review-popup-swiper')
							if (gallerySwiperEl && galleryImgs.length > 0 && typeof Swiper !== 'undefined') {
								reviewGallerySwiper = new Swiper(gallerySwiperEl, {
									loop: true,
									effect: 'fade',
									fadeEffect: { crossFade: true },
									autoplay: { delay: 5000, disableOnInteraction: false },
									speed: 600,
									navigation: {
										nextEl: '.review-popup-arrow--next',
										prevEl: '.review-popup-arrow--prev',
									},
									on: {
										init: function () {
											syncProgressBar(this.realIndex, galleryImgs.length)
										},
										slideChangeTransitionEnd: function () {
											syncProgressBar(this.realIndex, galleryImgs.length)
										},
									},
								})
							}
						},
						destroy: function () {
							if (reviewGallerySwiper) {
								reviewGallerySwiper.destroy(true, true)
								reviewGallerySwiper = null
							}
						},
					},
				})
			})
		})

		function syncProgressBar(activeIndex, totalSlides) {
			var bars = reviewPopupProgress.querySelectorAll('.review-popup-progress-bar')
			bars.forEach(function (bar, i) {
				var fill = bar.querySelector('.review-popup-progress-fill')
				if (!fill) return
				bar.classList.toggle('review-popup-progress-bar--active', i === activeIndex % totalSlides)
				if (i < activeIndex % totalSlides) {
					fill.style.transition = 'none'
					fill.style.width = '100%'
				} else if (i === activeIndex % totalSlides) {
					fill.style.transition = 'none'
					fill.style.width = '0%'
					void fill.offsetWidth
					fill.style.transition = 'width 5000ms linear'
					fill.style.width = '100%'
				} else {
					fill.style.transition = 'none'
					fill.style.width = '0%'
				}
			})
		}

		// Delegated progress bar navigation (attached once)
		if (reviewPopupProgress) {
			reviewPopupProgress.addEventListener('click', function (e) {
				var bar = e.target.closest('.review-popup-progress-bar')
				if (!bar || !reviewGallerySwiper) return
				var bars = Array.from(reviewPopupProgress.children)
				var idx = bars.indexOf(bar)
				if (idx !== -1) {
					reviewGallerySwiper.slideToLoop(idx)
				}
			})
		}

		document
			.querySelectorAll('.carousel-section.promotions')
			.forEach(function (section) {
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

		/* catalog-cat-s show all */
		document.querySelectorAll('.js-catalog-cat-s-show-all').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var section = btn.closest('.catalog-cat-s')
				if (!section) return
				var hidden = section.querySelectorAll('.catalog-cat-s__slide--hidden')
				hidden.forEach(function (el) { el.classList.remove('catalog-cat-s__slide--hidden') })
				if (typeof AOS !== 'undefined') {
					AOS.refresh()
				}
				btn.style.display = 'none'
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

		document
			.querySelectorAll('.carousel-section.production-photos')
			.forEach(function (section) {
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

		document
			.querySelectorAll(
				'.categories-small__dot, .collections__dot, .carousel-section__dot',
			)
			.forEach(function (dot) {
				dot.addEventListener('click', function () {
					var parent = this.parentElement
					parent.querySelectorAll('[class*="__dot"]').forEach(function (d) {
						d.classList.remove(
							'categories-small__dot--active',
							'collections__dot--active',
							'carousel-section__dot--active',
						)
					})
					this.classList.add(
						this.className.replace('--active', '') ||
							this.className.split(' ')[0] + '--active',
					)
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
			var btn = e.target.closest(
				'.header-mobile__icon[aria-label="Поиск"], .header__icon[aria-label="Поиск"]',
			)
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
					},
				},
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
			{
				id: 'product-1',
				name: 'Диван-кровать VELVET, 220 см, с подъёмным механизмом, микровелюр (виноградный)',
				image: 'assets/images/product-1.png',
				price: '138.000 руб',
				oldPrice: '152.000 руб',
				month: '34.500 руб/мес',
				badgeSale: true,
				badgeNew: true,
			},
			{
				id: 'product-2',
				name: 'Диван VELVET угловой, 260 см',
				image: 'assets/images/product-2.png',
				price: '168.000 руб',
				oldPrice: '185.000 руб',
				month: '42.000 руб/мес',
				badgeSale: false,
				badgeNew: true,
			},
			{
				id: 'product-3',
				name: 'Диван-кровать VELVET, 180 см, микровелюр (светло-серый)',
				image: 'assets/images/product-3.png',
				price: '118.000 руб',
				oldPrice: '',
				month: '29.500 руб/мес',
				badgeSale: false,
				badgeNew: false,
			},
			{
				id: 'product-5',
				name: 'Кресло VELVET',
				image: 'assets/images/product-5.png',
				price: '68.000 руб',
				oldPrice: '75.000 руб',
				month: '17.000 руб/мес',
				badgeSale: true,
				badgeNew: false,
			},
		]

		function buildProductCard(item) {
			var badges = ''
			if (item.badgeSale) {
				badges +=
					'<span class="product-card__badge sale">Sale</span><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="5.5" y="5.5" width="2" height="2" rx="1" fill="#BF6E34"/></svg>'
			}
			if (item.badgeNew) {
				badges += '<span class="product-card__badge new">New</span>'
			}
			var prices = '<span class="product-card__price">' + item.price + '</span>'
			if (item.oldPrice) {
				prices +=
					'<span class="product-card__price-old">' + item.oldPrice + '</span>'
			}
			return (
				'<article class="product-card product-card--default">' +
				'<a href="#" class="product-card--default__inner">' +
				'<div class="product-card--default__image-wrap">' +
				'<div class="product-card--default__image">' +
				'<img class="product-card--default__image-main" src="' +
				item.image +
				'" alt="' +
				item.name +
				'" loading="lazy">' +
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
				'<div class="product-card__badges">' +
				badges +
				'</div>' +
				'<button class="product-card__fav" aria-label="В избранное"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 4.09377C12.5 8.38677 6.50025 12 6.50025 12C6.50025 12 0.5 8.33335 0.5 4.10247C0.5 2.37502 1.83333 1.00002 3.5 1.00002C5.16667 1.00002 6.5 3.06252 6.5 3.06252C6.5 3.06252 7.83333 1.00002 9.5 1.00002C11.1667 1.00002 12.5 2.37502 12.5 4.09377Z" fill="#212121" fill-opacity="0.2"/></svg></button>' +
				'</div>' +
				'<div class="product-card--default__body">' +
				'<span class="product-card--default__title">' +
				item.name +
				'</span>' +
				'<div class="product-card__colors">' +
				'<span class="product-card__color" style="background-image: url(\'assets/images/background-color1.jpg\')"></span>' +
				'<span class="product-card__color" style="background-image: url(\'assets/images/background-color2.jpg\')"></span>' +
				'<span class="product-card__color" style="background-image: url(\'assets/images/background-color3.jpg\')"></span>' +
				'<span class="product-card__body-colors-label">20+ цветов</span>' +
				'</div>' +
				'<div class="product-card__price-split">' +
				item.month +
				' в Сплит</div>' +
				'<div class="product-card--default__body-prices">' +
				prices +
				'</div>' +
				'<div class="product-card--default__hover-actions">' +
				'<button class="btn btn-primary"><svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M2.87604 1.14134C2.20672 1.166 0.619907 1.21604 0 1.49547L1.25331 0.355529C1.6081 0.280265 2.11161 0.0394284 3.04634 0.00476976C4.17327 -0.0370151 5.31442 0.201482 6.35032 0.495039C9.08692 1.27092 11.8555 0.437224 12 0.355529L10.7467 1.61354C10.1215 1.87453 8.44463 2.35334 5.69832 1.57472C4.5756 1.25615 3.67088 1.11186 2.87604 1.14134Z" fill="white"/></svg><span>В корзину</span></button>' +
				'<button class="btn btn-white"><svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M2.87604 1.14134C2.20672 1.166 0.619907 1.21604 0 1.49547L1.25331 0.355529C1.6081 0.280265 2.11161 0.0394284 3.04634 0.00476976C4.17327 -0.0370151 5.31442 0.201482 6.35032 0.495039C9.08692 1.27092 11.8555 0.437224 12 0.355529L10.7467 1.61354C10.1215 1.87453 8.44463 2.35334 5.69832 1.57472C4.5756 1.25615 3.67088 1.11186 2.87604 1.14134Z" fill="white"/></svg><span>заказать в 1 клик</span></button>' +
				'</div>' +
				'</div>' +
				'</a>' +
				'</article>'
			)
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
						searchResultsHeader.innerHTML =
							'<span>По запросу «<span class="search-popup__query">' +
							query +
							'</span>» найдено:</span><span class="count_products">' +
							matched.length +
							' товара</span>'
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
						if (searchEmptyText)
							searchEmptyText.innerHTML =
								'По запросу «<span class="search-popup__query">' +
								query +
								'</span>» ничего не найдено:'
						searchEmptyState.style.display = ''
					}
				}

				updateResetBtn()
			}, 300)
		}
	}

	// ===== FEATURED TABS =====
	var featuredSection = document.querySelector('.featured')
	var featuredContainer = featuredSection
		? featuredSection.querySelector('.container')
		: null
	var featuredWrapper = featuredContainer
		? featuredContainer.querySelector('.featured__tabs-container')
		: null

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
			var activeBtn = document.querySelector(
				'.btn-filter[data-tab="' + tabId + '"]',
			)
			if (!activeTab) return

			allTabs.forEach(function (t) {
				t.classList.remove('featured__tab-content--active')
			})
			document.querySelectorAll('.btn-filter').forEach(function (b) {
				b.classList.remove('btn-filter--active')
			})

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

		var initialActive = featuredWrapper.querySelector(
			'.featured__tab-content--active',
		)
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
			var activeTab = featuredWrapper.querySelector(
				'.featured__tab-content--active',
			)
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
				statusEl.className =
					'showroom-card__status showroom-card__status--closed'
				statusEl.textContent = 'Закрыто'
			}
		})
	}

	function fixShowroomCards() {
		document.querySelectorAll('.showroom-card').forEach(function (card) {
			var lat = card.getAttribute('data-lat')
			var lng = card.getAttribute('data-lng')
			if (!lat || !lng) return

			var btn = card.querySelector('.btn-yandex')
			if (!btn) return

			var expectedUrl = 'https://yandex.ru/maps/?rtext=~' + lat + ',' + lng
			if (btn.getAttribute('href') !== expectedUrl) {
				btn.setAttribute('href', expectedUrl)
			}

			btn.removeAttribute('data-aos')
			btn.removeAttribute('data-aos-delay')
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
	var regCodeSection = document.getElementById('regCodeSection')
	var regCodeDesc = document.getElementById('regCodeDesc')
	var regCodeWrap = document.getElementById('regCodeWrap')
	var regCodeError = document.getElementById('regCodeError')
	var regTimer = document.getElementById('regTimer')
	var regTimerCount = document.getElementById('regTimerCount')
	var regResend = document.getElementById('regResend')
	var regDataSection = document.getElementById('regDataSection')
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

	function regClearCodeError() {
		regCodeInputs = regCodeWrap
			? regCodeWrap.querySelectorAll('.reg-popup__code-input')
			: []
		regCodeInputs.forEach(function (inp) {
			inp.classList.remove('reg-popup__code-input--error')
		})
		if (regCodeError) regCodeError.classList.remove('reg-popup__error--visible')
	}

	function regShowCodeError() {
		regCodeInputs = regCodeWrap
			? regCodeWrap.querySelectorAll('.reg-popup__code-input')
			: []
		regCodeInputs.forEach(function (inp) {
			inp.value = ''
			inp.classList.add('reg-popup__code-input--error')
		})
		if (regCodeInputs.length) regCodeInputs[0].focus()
		if (regCodeError) regCodeError.classList.add('reg-popup__error--visible')
	}

	function regGetCode() {
		var code = ''
		regCodeInputs = regCodeWrap
			? regCodeWrap.querySelectorAll('.reg-popup__code-input')
			: []
		regCodeInputs.forEach(function (inp) {
			code += inp.value
		})
		return code
	}

	function regSubmitCode() {
		regClearCodeError()
		var code = regGetCode()
		if (code.length < 6) return
		// TODO: replace with real SMS code verification
		// Test code: 123456 is correct, anything else is wrong
		if (code !== '123456') {
			regShowCodeError()
			return
		}
		var rawPhone = regPhoneInput ? regPhoneInput.value.replace(/\D/g, '') : ''
		var known = localStorage.getItem('reg_user_' + rawPhone)
		if (known) {
			// Existing user — log in directly
			regCompleteAuth()
		} else {
			// New user — show data section
			regShowDataSection()
		}
	}

	function regCompleteAuth() {
		var rawPhone = regPhoneInput ? regPhoneInput.value.replace(/\D/g, '') : ''
		if (rawPhone) {
			localStorage.setItem('reg_user_' + rawPhone, 'registered')
		}
		// Update profile icon
		document
			.querySelectorAll(
				'.header__icon[aria-label="Профиль"], .header-mobile__icon[aria-label="Профиль"]',
			)
			.forEach(function (icon) {
				icon.classList.add(
					'header__icon--logged',
					'header-mobile__icon--logged',
				)
			})
		Fancybox.close()
		window.location.href = 'account-dashboard.html'
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
			if (window.regClearPhoneError) window.regClearPhoneError()
		})
	}

	function regShowCodeSection() {
		if (regCodeSection) regCodeSection.style.display = ''
		if (regPhoneStep3)
			regPhoneStep3.value = regPhoneInput ? regPhoneInput.value : ''
		if (regCodeDesc && regPhoneInput) {
			regCodeDesc.textContent =
				'Подтвердите номер ' + regPhoneInput.value + ', введя код из SMS:'
		}
		regCodeInputs = regCodeWrap
			? regCodeWrap.querySelectorAll('.reg-popup__code-input')
			: []
		regCodeInputs.forEach(function (inp) {
			inp.value = ''
		})
		if (regCodeInputs.length) regCodeInputs[0].focus()
		regClearCodeError()
		regStartTimer()
	}

	function regShowDataSection() {
		if (regDataSection) regDataSection.style.display = ''
		if (regStep1Next) regStep1Next.style.display = 'none'
		if (regStep3Submit) regStep3Submit.style.display = ''
		if (regTimer) regTimer.style.display = 'none'
		clearInterval(regTimerInterval)
		// Scroll to top of form-body
		var body = document.querySelector('.reg-popup__form-body')
		if (body) body.scrollTop = 0
		if (window.regClearStep3Errors) window.regClearStep3Errors()
	}

	function regResetPopup() {
		if (regCodeSection) regCodeSection.style.display = 'none'
		if (regDataSection) regDataSection.style.display = 'none'
		if (regStep1Next) regStep1Next.style.display = ''
		if (regStep3Submit) regStep3Submit.style.display = 'none'
		clearInterval(regTimerInterval)
		if (regTimer) regTimer.style.display = 'none'
		if (regResend) regResend.style.display = 'none'
		regClearCodeError()
		if (regPhoneInput) {
			regPhoneInput.value = ''
			regPhoneInput.classList.remove('reg-popup__input--error')
		}
		if (regPhoneError)
			regPhoneError.classList.remove('reg-popup__error--visible')
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
			if (!window.regValidatePhone || !window.regValidatePhone()) return
			var consent = document.querySelector(
				'.reg-popup__checkbox input[type="checkbox"]',
			)
			if (!consent || !consent.checked) {
				consent.closest('.reg-popup__checkbox').classList.add('is-invalid')
				return
			}
			regShowCodeSection()
		})
	}

	if (regCodeWrap) {
		regCodeWrap.addEventListener('input', function (e) {
			var input = e.target
			if (!input.classList.contains('reg-popup__code-input')) return
			input.value = input.value.replace(/\D/g, '')
			if (
				input.value &&
				input.nextElementSibling &&
				input.nextElementSibling.classList.contains('reg-popup__code-input')
			) {
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
			if (
				e.key === 'Backspace' &&
				!input.value &&
				input.previousElementSibling &&
				input.previousElementSibling.classList.contains('reg-popup__code-input')
			) {
				input.previousElementSibling.focus()
			}
		})
		regCodeWrap.addEventListener('paste', function (e) {
			e.preventDefault()
			var paste = (e.clipboardData || window.clipboardData)
				.getData('text')
				.replace(/\D/g, '')
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
			var ok = true
			if (window.regValidateName) { if (!window.regValidateName()) ok = false }
			if (window.regValidateSurname) { if (!window.regValidateSurname()) ok = false }
			if (window.regValidateEmail) { if (!window.regValidateEmail()) ok = false }
			var consent3 = document.querySelector(
				'.reg-popup__checkbox input[type="checkbox"]',
			)
			if (!consent3 || !consent3.checked) {
				var label = consent3
					? consent3.closest('.reg-popup__checkbox')
					: null
				if (label) label.classList.add('is-invalid')
				ok = false
			}
			if (!ok) return
			regCompleteAuth()
		})
	}

	document.querySelectorAll('.reg-popup__checkbox input[type="checkbox"]').forEach(function (cb) {
		cb.addEventListener('change', function () {
			this.closest('.reg-popup__checkbox').classList.remove(
				'is-invalid',
			)
		})
	})

	document.addEventListener('click', function (e) {
		var btn = e.target.closest(
			'a.header__icon[aria-label="Профиль"], ' +
				'a.header-mobile__icon[aria-label="Профиль"], ' +
				'button.mobile-menu__account-btn',
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

		regResetPopup()
		clearInterval(regTimerInterval)

		Fancybox.show([{ src: '#registrationPopup', type: 'inline' }], {
			mainClass: 'fancybox-reg-popup',
			Toolbar: false,
			closeButton: false,
			on: {
				close: function () {
					clearInterval(regTimerInterval)
				},
			},
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
			document
				.querySelectorAll(
					'.header__icon[aria-label="Профиль"], .header-mobile__icon[aria-label="Профиль"]',
				)
				.forEach(function (icon) {
					icon.classList.add(
						'header__icon--logged',
						'header-mobile__icon--logged',
					)
				})
		}
	})();


/* ===== FAVORITES PAGE ===== */
;(function () {
	var tabs = document.querySelectorAll('.favorites__tab')
	var gridFav = document.querySelector('.favorites__grid--fav')
	var gridRecent = document.querySelector('.favorites__grid--recent')
	var countEl = document.querySelector('.favorites__count')
	var emptyFav = document.querySelector('.favorites__empty')
	var emptyRecent = document.querySelector('.favorites__empty--recent')
	var sortTrigger = document.querySelector('.favorites__sort-trigger')
	var sortContainer = document.querySelector('.favorites__sort')
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
		var cards = grid.querySelectorAll(
			'.product-card--default:not([style*="display: none"])',
		)
		if (empty) empty.style.display = cards.length ? 'none' : ''
	}

	function updateCount() {
		var grid = getActiveGrid()
		var cards = grid.querySelectorAll(
			'.product-card--default:not([style*="display: none"])',
		)
		if (countEl) countEl.textContent = 'Всего ' + cards.length + ' товаров'
		updateEmptyState()
	}

	tabs.forEach(function (tab) {
		tab.addEventListener('click', function () {
			tabs.forEach(function (t) {
				t.classList.remove('favorites__tab--active')
			})
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
	document
		.querySelector('.favorites__content')
		.addEventListener('click', function (e) {
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

	if (sortContainer) {
		sortTrigger.addEventListener('click', function (e) {
			e.stopPropagation()
			sortContainer.classList.toggle('active')
		})
	}

	document.addEventListener('click', function () {
		if (sortContainer)
			sortContainer.classList.remove('active')
	})

	if (sortContainer) {
		sortContainer.querySelector('.favorites__sort-dropdown').addEventListener('click', function (e) {
			e.stopPropagation()
		})
	}

	sortLinks.forEach(function (link) {
		link.addEventListener('click', function (e) {
			e.preventDefault()
			var sortKey = link.getAttribute('data-sort')
			sortLinks.forEach(function (l) {
				l.classList.remove('active')
			})
			link.classList.add('active')
			var textEl = sortTrigger.querySelector('span')
			if (textEl) textEl.textContent = link.textContent
			if (sortContainer) sortContainer.classList.remove('active')

			var grid = getActiveGrid()
			var cards = Array.from(
				grid.querySelectorAll(
					'.product-card--default:not([style*="display: none"])',
				),
			)
			if (sortKey === 'default') {
				cards.sort(function (a, b) {
					return (
						parseInt(
							a
								.getAttribute('data-filter-id')
								.replace(/^(product|recent)-/, ''),
						) -
						parseInt(
							b
								.getAttribute('data-filter-id')
								.replace(/^(product|recent)-/, ''),
						)
					)
				})
			} else if (sortKey === 'alphabet-az') {
				cards.sort(function (a, b) {
					return a
						.querySelector('.product-card--default__title')
						.textContent.trim()
						.localeCompare(
							b
								.querySelector('.product-card--default__title')
								.textContent.trim(),
						)
				})
			} else if (sortKey === 'expensive' || sortKey === 'cheap') {
				var mul = sortKey === 'expensive' ? -1 : 1
				cards.sort(function (a, b) {
					var pa =
						parseInt(
							(a.querySelector('.product-card__price').textContent || '')
								.replace(/\s/g, '')
								.replace(/[^0-9]/g, ''),
						) || 0
					var pb =
						parseInt(
							(b.querySelector('.product-card__price').textContent || '')
								.replace(/\s/g, '')
								.replace(/[^0-9]/g, ''),
						) || 0
					return (pa - pb) * mul
				})
			}

			cards.forEach(function (card) {
				grid.appendChild(card)
			})
		})
	})

	if (window.updateFavBadge) window.updateFavBadge()
})()
;(function () {
	/* ===== SHARED SLIDE TOGGLE (vanilla replacement for jQuery) ===== */
	function slideToggle(el, duration) {
		if (el._slideTimer) {
			clearTimeout(el._slideTimer)
			el._slideTimer = null
		}
		el.style.transition = ''
		el.style.overflow = ''
		el.style.height = ''
		if (el.classList.contains('is-open')) {
			el.style.overflow = 'hidden'
			el.style.height = el.scrollHeight + 'px'
			el.classList.remove('is-open')
			requestAnimationFrame(function () {
				el.style.transition = 'height ' + duration + 'ms ease'
				el.style.height = '0px'
			})
			el._slideTimer = setTimeout(function () {
				el.style.display = 'none'
				el.style.height = ''
				el.style.overflow = ''
				el.style.transition = ''
				el._slideTimer = null
			}, duration)
		} else {
			el.style.display = 'block'
			el.style.overflow = 'hidden'
			el.style.height = '0px'
			el.classList.add('is-open')
			requestAnimationFrame(function () {
				el.style.transition = 'height ' + duration + 'ms ease'
				el.style.height = el.scrollHeight + 'px'
			})
			el._slideTimer = setTimeout(function () {
				el.style.height = ''
				el.style.overflow = ''
				el.style.transition = ''
				el._slideTimer = null
			}, duration)
		}
	}

	/* ===== SHARED MEDIA SLIDER (.media-slider__swiper) ===== */
	var mediaSliderEl = document.querySelector('.media-slider__swiper')
	if (mediaSliderEl) {
		function updateMediaProgress(swiper) {
			var bars = document.querySelectorAll('.media-slider__progress-bar')
			var realIndex = swiper.realIndex
			bars.forEach(function (bar, i) {
				bar.classList.toggle(
					'media-slider__progress-bar--active',
					i === realIndex,
				)
			})
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
				init: function () {
					updateMediaProgress(this)
				},
				slideChange: function () {
					updateMediaProgress(this)
				},
			},
		})

		document
			.querySelectorAll('.media-slider__progress-bar')
			.forEach(function (bar, index) {
				bar.addEventListener('click', function () {
					mediaSwiper.slideToLoop(index)
				})
			})
	}

	/* ===== ACCORDION (shared across designers, production, product pages) ===== */
	var accordionConfigs = [
		{
			items: '.partnership-accordion',
			openClass: 'partnership-accordion--open',
			header: '.partnership-accordion__header',
			body: '.partnership-accordion__body',
		},
		{
			items: '.production-accordion__item',
			openClass: 'production-accordion__item--open',
			header: '.production-accordion__header',
			body: '.production-accordion__body',
		},
		{
			items: '.product-accordion',
			openClass: 'product-accordion--open',
			header: '.product-accordion__header',
			body: '.product-accordion__content',
		},
	]

	accordionConfigs.forEach(function (cfg) {
		var items = document.querySelectorAll(cfg.items)
		items.forEach(function (item) {
			var body = item.querySelector(cfg.body)
			if (body) {
				if (item.classList.contains(cfg.openClass)) {
					body.style.display = 'block'
					body.classList.add('is-open')
					body.style.height = body.scrollHeight + 'px'
				} else {
					body.style.display = 'none'
				}
			}
			var header = item.querySelector(cfg.header)
			if (header && body) {
				header.addEventListener('click', function () {
					item.classList.toggle(cfg.openClass)
					slideToggle(body, 600)
				})
			}
		})
	})

	/* ===== ABOUT HISTORY SWIPER (was about.js) ===== */
	var aboutHistoryEl = document.querySelector('.about-history-swiper')
	if (aboutHistoryEl) {
		var aboutTabs = aboutHistoryEl.querySelectorAll('.about-history__tab')
		var aboutSwiper = new Swiper(aboutHistoryEl, {
			slidesPerView: 1,
			speed: 600,
			navigation: {
				prevEl: '.about-history__arrow--prev',
				nextEl: '.about-history__arrow--next',
			},
			on: {
				slideChange: function () {
					aboutTabs.forEach(function (tab, i) {
						tab.classList.toggle(
							'about-history__tab--active',
							i === aboutSwiper.activeIndex,
						)
					})
				},
			},
		})
		aboutTabs.forEach(function (tab) {
			tab.addEventListener('click', function () {
				aboutSwiper.slideTo(parseInt(tab.getAttribute('data-slide')))
			})
		})
	}

	/* ===== ARTICLE PHOTO SWIPER (was article.js) ===== */
	var photoSMedia = document.querySelector('.article-media--photo-s')
	var photoSGrid = photoSMedia
		? photoSMedia.querySelector('.article-photo-s__grid')
		: null
	var photoSSwiper = null
	function initPhotoSSwiper() {
		if (window.innerWidth > 768 || !photoSGrid) return null
		return new Swiper(photoSGrid, {
			slidesPerView: 1.2,
			spaceBetween: 6,
			speed: 600,
			navigation: {
				nextEl: photoSMedia.querySelector('.carousel-section__arrow--next'),
				prevEl: photoSMedia.querySelector('.carousel-section__arrow--prev'),
			},
			pagination: {
				el: photoSGrid.querySelector('.article-photo-s__pagination'),
				type: 'bullets',
				bulletClass: 'carousel-section__dot',
				bulletActiveClass: 'carousel-section__dot--active',
				clickable: true,
			},
		})
	}
	function destroyPhotoSSwiper() {
		if (photoSSwiper) {
			photoSSwiper.destroy(true, true)
			photoSSwiper = null
		}
	}
	photoSSwiper = initPhotoSSwiper()
	window.addEventListener('resize', function () {
		if (window.innerWidth <= 768) {
			destroyPhotoSSwiper()
			photoSSwiper = initPhotoSSwiper()
		} else {
			destroyPhotoSSwiper()
		}
	})
	if (typeof AOS !== 'undefined') {
		setTimeout(function () {
			AOS.refresh()
		}, 50)
	}

	/* ===== OTHER COLLECTIONS CAROUSEL (was single-collection.js) ===== */
	document
		.querySelectorAll('.carousel-section.collections')
		.forEach(function (section) {
			var swiperEl = section.querySelector('.carousel-section__swiper')
			if (swiperEl) {
				new Swiper(swiperEl, {
					slidesPerView: 4,
					spaceBetween: 16,
					speed: 600,
					navigation: {
						prevEl: section.querySelector('.carousel-section__arrow--prev'),
						nextEl: section.querySelector('.carousel-section__arrow--next'),
					},
					pagination: {
						el: section.querySelector('.carousel-section__pagination'),
						clickable: true,
						bulletClass: 'carousel-section__dot',
						bulletActiveClass: 'carousel-section__dot--active',
					},
					breakpoints: {
						320: { slidesPerView: 1.3, spaceBetween: 8 },
						769: { slidesPerView: 4, spaceBetween: 16 },
					},
				})
			}
	})
})();

	initPagination()
});



/* ===== OverlayScrollbars для блоков .os-custom ===== */
;(function () {
	if (typeof OverlayScrollbars === 'undefined') return
	document.querySelectorAll('.os-custom').forEach(function (el) {
		OverlayScrollbars(el, {
			className: 'os-theme-tm',
			scrollbars: {
				visibility: 'visible',
				autoHide: 'never',
			},
		})
	})
})();

// ===== CITY POPUP =====
;(function () {
	var cityTrigger = document.querySelector('.topbar__city')
	if (!cityTrigger) return

	var saved = localStorage.getItem('selectedCity')
	if (saved) {
		document.querySelectorAll('.topbar__city-text').forEach(function (el) {
			el.textContent = saved
		})
	}

	cityTrigger.addEventListener('click', function (e) {
		e.preventDefault()
		Fancybox.show([{ src: '#cityPopup', type: 'inline' }], {
			mainClass: 'fancybox-city-popup',
			Toolbar: false,
			closeButton: false,
		})
	})

	document.addEventListener('click', function (e) {
		var item = e.target.closest('.city-popup__item, .city-popup__tip')
		if (!item) return
		var city = item.getAttribute('data-city')
		if (!city) return
		document.querySelectorAll('.topbar__city-text').forEach(function (el) {
			el.textContent = city
		})
		localStorage.setItem('selectedCity', city)
		Fancybox.close()
	})

	var cityTips = document.querySelector('.city-popup__tips')
	var cityPopularLabel = document.querySelector('.city-popup__popular-label')
	var searchTimer

	// Event delegation for input (catches visible input in Fancybox clone)
	document.addEventListener('input', function (e) {
		if (!e.target.closest('.fancybox-city-popup')) return
		var input = e.target.closest('#citySearchInput')
		if (!input) return

		var q = input.value.trim()
		clearTimeout(searchTimer)

		var icon = document.querySelector('.fancybox-city-popup #citySearchIcon')
		var spinner = document.querySelector('.fancybox-city-popup #citySpinner')
		if (icon) icon.style.display = 'none'
		if (spinner) spinner.style.display = ''

		searchTimer = setTimeout(function () {
			if (icon) icon.style.display = ''
			if (spinner) spinner.style.display = 'none'
			filterCities(q)
		}, 300)
	})

	// Tip click — fill search
	document.addEventListener('click', function (e) {
		var tip = e.target.closest('.city-popup__tip')
		if (!tip) return
		var container = tip.closest('.fancybox-city-popup')
		if (!container) return
		var city = tip.getAttribute('data-city')
		if (!city) return

		var input = container.querySelector('#citySearchInput')
		if (!input) return
		input.value = city

		var icon = container.querySelector('#citySearchIcon')
		var spinner = container.querySelector('#citySpinner')
		if (icon) icon.style.display = 'none'
		if (spinner) spinner.style.display = ''

		clearTimeout(searchTimer)
		searchTimer = setTimeout(function () {
			if (icon) icon.style.display = ''
			if (spinner) spinner.style.display = 'none'
			filterCities(city)
		}, 300)
	})

	function filterCities(q) {
		var container = document.querySelector('.fancybox-city-popup .fancybox__content')
		if (!container) return

		var items = container.querySelectorAll('.city-popup__item')
		var resultsHeader = container.querySelector('#cityResultsHeader')
		var queryText = container.querySelector('#cityQueryText')
		var resultsCount = container.querySelector('#cityResultsCount')
		var tips = container.querySelector('.city-popup__tips')
		var popularLabel = container.querySelector('.city-popup__popular-label')
		var matchCount = 0

		items.forEach(function (item) {
			var match = !q || item.textContent.toLowerCase().indexOf(q.toLowerCase()) !== -1
			item.style.display = match ? '' : 'none'
			if (match) matchCount++
		})

		if (resultsHeader && queryText && resultsCount) {
			if (q) {
				queryText.textContent = q
				var label = container.querySelector('#cityResultsLabel')
				if (matchCount === 0) {
					if (label) label.textContent = '\u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e'
					resultsCount.textContent = '\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441'
					resultsCount.style.color = 'var(--copper)'
				} else {
					if (label) label.textContent = '\u043d\u0430\u0439\u0434\u0435\u043d\u043e:'
					var word = '\u0433\u043e\u0440\u043e\u0434\u043e\u0432'
					if (matchCount === 1) word = '\u0433\u043e\u0440\u043e\u0434'
					if (matchCount >= 2 && matchCount <= 4) word = '\u0433\u043e\u0440\u043e\u0434\u0430'
					resultsCount.textContent = matchCount + ' ' + word
					resultsCount.style.color = ''
				}
				resultsHeader.style.display = 'flex'
				if (tips) tips.style.display = 'none'
				if (popularLabel) popularLabel.style.display = 'none'
			} else {
				resultsHeader.style.display = 'none'
				if (tips) tips.style.display = ''
				if (popularLabel) popularLabel.style.display = ''
				items.forEach(function (item) { item.style.display = '' })
			}
		}
	}

	/* ===== Shared Pagination ===== */
	function initPagination() {
		function getTotalPages(nav) {
			var pagination = nav.closest('.pagination')
			if (pagination && pagination.dataset.paginationTotal) {
				return parseInt(pagination.dataset.paginationTotal, 10)
			}
			var links = nav.querySelectorAll('.pagination__link')
			var last = links[links.length - 1]
			return last ? parseInt(last.textContent.trim(), 10) : 1
		}

		function getCurrentPage(nav) {
			var active = nav.querySelector('.pagination__link--active')
			return active ? parseInt(active.textContent.trim(), 10) : 1
		}

		function renderPagination(nav, current, total) {
			var prevBtn = nav.querySelector('.pagination__arrow--prev')
			var nextBtn = nav.querySelector('.pagination__arrow--next')
			if (!prevBtn || !nextBtn) return

			var items = []
			items.push(1)

			if (total > 2) {
				if (current > 3) items.push('...')
				var start = Math.max(2, current - 1)
				var end = Math.min(total - 1, current + 1)
				if (current <= 2) end = Math.max(end, Math.min(3, total - 1))
				if (current >= total - 1) start = Math.min(start, Math.max(2, total - 2))
				for (var i = start; i <= end; i++) {
					items.push(i)
				}
				if (current < total - 2) items.push('...')
			}

			if (total > 1) items.push(total)

			var node = prevBtn.nextSibling
			while (node && node !== nextBtn) {
				var nextNode = node.nextSibling
				node.parentNode.removeChild(node)
				node = nextNode
			}

			for (var j = 0; j < items.length; j++) {
				var val = items[j]
				var el
				if (val === '...') {
					el = document.createElement('span')
					el.className = 'pagination__ellipsis'
					el.textContent = '...'
				} else {
					el = document.createElement('a')
					el.href = '#'
					el.className = 'pagination__link body-l-strong'
					if (val === current) el.classList.add('pagination__link--active')
					el.textContent = val
				}
				nav.insertBefore(el, nextBtn)
			}

			if (prevBtn) prevBtn.classList.toggle('pagination__arrow--disabled', current <= 1)
			if (nextBtn) nextBtn.classList.toggle('pagination__arrow--disabled', current >= total)
		}

		function fireChange(nav) {
			var current = getCurrentPage(nav)
			var total = getTotalPages(nav)
			renderPagination(nav, current, total)
			document.dispatchEvent(new CustomEvent('pagination:change', {
				detail: {
					nav: nav,
					pagination: nav.closest('.pagination'),
					page: current
				}
			}))
		}

		document.querySelectorAll('.pagination__nav:not([data-pagination-manual])').forEach(function (nav) {
			var total = getTotalPages(nav)
			var current = getCurrentPage(nav)
			renderPagination(nav, current, total)

			nav.addEventListener('click', function (e) {
				var link = e.target.closest('.pagination__link')
				if (!link) return
				e.preventDefault()
				var page = parseInt(link.textContent.trim(), 10)
				if (page && page !== getCurrentPage(nav)) {
					renderPagination(nav, page, total)
					fireChange(nav)
				}
			})
		})

		document.addEventListener('click', function (e) {
			var prev = e.target.closest('.pagination__arrow--prev:not(.pagination__arrow--disabled)')
			if (prev) {
				e.preventDefault()
				var nav = prev.closest('.pagination__nav')
				if (!nav) return
				var cur = getCurrentPage(nav)
				if (cur > 1) {
					renderPagination(nav, cur - 1, getTotalPages(nav))
					fireChange(nav)
				}
			}
			var next = e.target.closest('.pagination__arrow--next:not(.pagination__arrow--disabled)')
			if (next) {
				e.preventDefault()
				var nav = next.closest('.pagination__nav')
				if (!nav) return
				var cur = getCurrentPage(nav)
				var total = getTotalPages(nav)
				if (cur < total) {
					renderPagination(nav, cur + 1, total)
					fireChange(nav)
				}
			}
		})
	}

	window.initPagination = initPagination

	/* ===== FOOTER BANNER PARALLAX (GSAP) ===== */
	if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
		var footerBg = document.querySelector('.footer-banner__bg')
		if (footerBg) {
			gsap.registerPlugin(ScrollTrigger)
			gsap.to(footerBg, {
				backgroundPositionY: '30%',
				ease: 'none',
				scrollTrigger: {
					trigger: footerBg,
					start: 'top bottom',
					end: 'bottom top',
					scrub: 1,
				},
			})
		}
	}
})();
