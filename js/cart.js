/* ===== Cart Page ===== */
;(function () {
	'use strict'

	var cartEl = document.querySelector('.cart')
	var itemsCountEl = document.querySelector('.cart__items-count')

	// Qty controls
	document.querySelectorAll('.cart-item').forEach(function (item) {
		var minusBtn = item.querySelector('.cart-item__qty-btn--minus')
		var plusBtn = item.querySelector('.cart-item__qty-btn--plus')
		var valueEl = item.querySelector('.cart-item__qty-value')

		if (!minusBtn || !plusBtn || !valueEl) return

		minusBtn.addEventListener('click', function (e) {
			e.stopPropagation()
			e.preventDefault()
			var val = parseInt(valueEl.textContent, 10) || 1
			if (val > 1) {
				val--
				valueEl.textContent = val
			}
		})

		plusBtn.addEventListener('click', function (e) {
			e.stopPropagation()
			e.preventDefault()
			var val = parseInt(valueEl.textContent, 10) || 1
			val++
			valueEl.textContent = val
		})
	})

	// Undo state
	var undoEl = document.querySelector('.cart-undo')
	var undoText = undoEl ? undoEl.querySelector('.cart-undo__text') : null
	var undoBtn = undoEl ? undoEl.querySelector('.cart-undo__btn') : null
	var undoNumber = undoEl ? undoEl.querySelector('.cart-undo__number') : null
	var undoProgress = undoEl ? undoEl.querySelector('.cart-undo__progress') : null
	var undoTimer = null
	var undoCountdown = null
	var undoItem = null
	var undoCarouselEl = null

	function cancelUndo() {
		if (undoTimer) {
			clearTimeout(undoTimer)
			clearInterval(undoCountdown)
			undoTimer = null
			undoCountdown = null
		}
		undoEl.style.display = 'none'
		if (undoItem) {
			undoItem.style.display = ''
			undoItem = null
		}
		if (undoCarouselEl) {
			undoCarouselEl.style.display = ''
			undoCarouselEl = null
		}
	}

	function showUndo(item) {
		cancelUndo()

		undoItem = item
		var brand = item.querySelector('.cart-item__brand')
		var name = brand ? brand.textContent.trim() : 'товар'
		undoText.textContent = 'Товар ' + name + ' удален из корзины.'

		item.style.display = 'none'

		undoEl.style.display = 'flex'

		// Restart progress animation
		undoProgress.style.animation = 'none'
		void undoProgress.offsetHeight
		undoProgress.style.animation = 'cart-undo-timer 4s linear forwards'

		// Countdown number
		var seconds = 4
		undoNumber.textContent = seconds
		undoCountdown = setInterval(function () {
			seconds--
			if (seconds > 0) {
				undoNumber.textContent = seconds
			} else {
				clearInterval(undoCountdown)
			}
		}, 1000)

		// Auto-remove after 4s
		undoTimer = setTimeout(function () {
			undoEl.style.display = 'none'
			if (undoItem) {
				undoItem.remove()
				updateCartState()
			}
			undoItem = null
			undoCarouselEl = null
		}, 4000)
	}

	// Remove item
	document.querySelectorAll('.cart-item__remove').forEach(function (btn) {
		btn.addEventListener('click', function (e) {
			e.stopPropagation()
			e.preventDefault()
			var item = this.closest('.cart-item')
			if (item) {
				showUndo(item)
			}
		})
	})

	// Undo button
	if (undoBtn) {
		undoBtn.addEventListener('click', function (e) {
			e.stopPropagation()
			e.preventDefault()
			cancelUndo()
		})
	}

	// "Очистить" — remove all items
	var removeAllBtn = document.querySelector('.cart__action-btn--clear')
	if (removeAllBtn) {
		removeAllBtn.addEventListener('click', function () {
			cancelUndo()
			var items = document.querySelectorAll('.cart-item')
			if (items.length === 0) return
			items.forEach(function (item, index) {
				setTimeout(function () {
					item.style.transition = 'opacity 0.3s'
					item.style.opacity = '0'
					setTimeout(function () {
						item.remove()
						if (index === items.length - 1) {
							updateCartState()
						}
					}, 300)
				}, index * 100)
			})
		})
	}

	// Update cart state: badge, count, empty class
	function updateCartState() {
		var count = document.querySelectorAll('.cart-item').length

		// Cart badge in header
		document.querySelectorAll('.header__badge').forEach(function (badge) {
			badge.textContent = count
		})

		// Items count text
		if (itemsCountEl) {
			var word = count === 1 ? 'товар' : 'товара'
			itemsCountEl.textContent = 'Добавлено ' + count + ' ' + word + ':'
		}

		// Empty state
		if (cartEl) {
			cartEl.classList.toggle('cart--empty', count === 0)
		}
	}

	// Promo code
	var promoInput = document.querySelector('.cart__summary-promo-field')
	var promoBtn = document.querySelector('.cart__summary-promo-apply')
	var promoBox = document.querySelector('.cart__summary-promo-input')

	function handlePromo() {
		if (!promoInput || !promoBox) return
		var val = promoInput.value.trim()

		if (!val) {
			promoBox.classList.remove('cart__summary-promo-input--success')
			promoBox.classList.add('cart__summary-promo-input--error')
			if (window.showToast) showToast('Введите промокод')
			setTimeout(function () {
				promoBox.classList.remove('cart__summary-promo-input--error')
			}, 600)
			return
		}

		promoBox.classList.remove('cart__summary-promo-input--error')
		promoBox.classList.add('cart__summary-promo-input--success')
		promoInput.disabled = true
		promoBtn.disabled = true
		promoBtn.textContent = 'Применён'
		if (window.showToast) showToast('Промокод применён', 'success')
	}

	if (promoBtn) {
		promoBtn.addEventListener('click', handlePromo)
	}

	if (promoInput) {
		promoInput.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault()
				handlePromo()
			}
		})
	}
})()

/* ===== Checkout — Delivery Tabs ===== */
;(function () {
	'use strict'

	var tabsContainer = document.querySelector('.checkout-delivery__tabs')
	if (!tabsContainer) return

	var tabs = tabsContainer.querySelectorAll('.checkout-delivery__tab')
	var contents = document.querySelectorAll('.checkout-delivery__content')

	tabs.forEach(function (tab) {
		tab.addEventListener('click', function () {
			var target = this.getAttribute('data-tab')

			tabs.forEach(function (t) { t.classList.remove('checkout-delivery__tab--active') })
			this.classList.add('checkout-delivery__tab--active')

			contents.forEach(function (c) {
				c.style.display = c.getAttribute('data-tab-content') === target ? 'block' : 'none'
			})
		})
	})

	// activate first tab
	if (tabs.length) tabs[0].click()
})()

/* ===== Checkout — Accordions (same pattern as product/production) ===== */
;(function () {
	'use strict'

	function slideToggle(el, duration) {
		if (el.classList.contains('is-open')) {
			el.style.overflow = 'hidden'
			el.style.height = el.scrollHeight + 'px'
			el.style.transition = 'height ' + duration + 'ms ease'
			el.classList.remove('is-open')
			requestAnimationFrame(function () {
				el.style.height = '0px'
			})
			setTimeout(function () {
				el.style.display = 'none'
				el.style.height = ''
				el.style.overflow = ''
				el.style.transition = ''
			}, duration)
		} else {
			el.style.overflow = 'hidden'
			el.style.height = '0px'
			el.style.display = 'block'
			el.style.transition = 'height ' + duration + 'ms ease'
			el.classList.add('is-open')
			requestAnimationFrame(function () {
				el.style.height = el.scrollHeight + 'px'
			})
			setTimeout(function () {
				el.style.height = ''
				el.style.overflow = ''
				el.style.transition = ''
			}, duration)
		}
	}

	document.querySelectorAll('.checkout-accordion').forEach(function (accordion) {
		var body = accordion.querySelector('.checkout-accordion__content')
		if (body && accordion.classList.contains('checkout-accordion--open')) {
			body.style.display = 'block'
			body.classList.add('is-open')
			body.style.height = body.scrollHeight + 'px'
		}
		var header = accordion.querySelector('.checkout-accordion__btn')
		if (header && body) {
			header.addEventListener('click', function () {
				accordion.classList.toggle('checkout-accordion--open')
				slideToggle(body, 600)
			})
		}
	})
})()

/* ===== Checkout — Map ↔ Select linking ===== */
;(function () {
	'use strict'

	var select = document.querySelector('.checkout-delivery__select')
	if (!select) return

	select.addEventListener('change', function () {
		var idx = parseInt(this.value, 10)
		if (isNaN(idx)) return
		if (!window.__checkoutMap || !window.__checkoutMarkers) return

		var placemark = window.__checkoutMarkers[idx]
		if (!placemark) return

		window.__checkoutMap.panTo(placemark.geometry.getCoordinates(), {
			delay: 300,
		})
		placemark.balloon.open()
	})
})()

/* ===== Checkout — Split Panel toggle ===== */
;(function () {
	'use strict'
	var paymentRadios = document.querySelectorAll('.checkout-payment__radio input[name="payment"]')
	var splitPanel = document.getElementById('splitPanel')
	if (!paymentRadios.length || !splitPanel) return
	function toggleSplit() {
		var isSplit = false
		paymentRadios.forEach(function (r) { if (r.checked && r.value === 'split') isSplit = true })
		splitPanel.classList.toggle('checkout-payment__split-panel--visible', isSplit)
	}
	paymentRadios.forEach(function (r) { r.addEventListener('change', toggleSplit) })
	toggleSplit()
})()

/* ===== Checkout — Invoice Popup ===== */
;(function () {
	'use strict'

	var invoiceRadio = document.querySelector('.checkout-payment__radio input[value="invoice"]')
	var popup = document.getElementById('invoicePopup')
	var closeBtn = popup ? popup.querySelector('.checkout-popup__close') : null
	var overlay = popup

	function openPopup() {
		if (popup) popup.classList.add('popup--open')
		document.body.style.overflow = 'hidden'
	}

	function closePopup() {
		if (popup) popup.classList.remove('popup--open')
		document.body.style.overflow = ''
	}

	if (invoiceRadio && popup) {
		invoiceRadio.addEventListener('change', function () {
			if (invoiceRadio.checked) {
				openPopup()
			}
		})
	}

	if (closeBtn) {
		closeBtn.addEventListener('click', closePopup)
	}

	if (overlay) {
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) closePopup()
		})
	}

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && popup && popup.classList.contains('popup--open')) {
			closePopup()
		}
	})

	/* ===== Toggle company-type form fields ===== */
	var legalRadio = popup ? popup.querySelector('input[name="company-type"][value="legal"]') : null
	var individualRadio = popup ? popup.querySelector('input[name="company-type"][value="individual"]') : null
	var fieldsLegal = document.getElementById('popupFieldsLegal')
	var fieldsIndividual = document.getElementById('popupFieldsIndividual')

	function toggleCompanyFields() {
		if (individualRadio && individualRadio.checked) {
			if (fieldsLegal) fieldsLegal.style.display = 'none'
			if (fieldsIndividual) fieldsIndividual.style.display = 'flex'
		} else {
			if (fieldsLegal) fieldsLegal.style.display = 'flex'
			if (fieldsIndividual) fieldsIndividual.style.display = 'none'
		}
	}

	if (legalRadio) legalRadio.addEventListener('change', toggleCompanyFields)
	if (individualRadio) individualRadio.addEventListener('change', toggleCompanyFields)

	/* ===== Validation ===== */
	var orderBtn = popup ? popup.querySelector('.checkout-popup__btn-primary') : null

	function validateField(input, errEl, testFn) {
		var valid = testFn(input.value.trim())
		input.classList.toggle('is-invalid', !valid)
		if (errEl) errEl.classList.toggle('visible', !valid)
		return valid
	}

	function validateAll() {
		var isLegal = legalRadio ? legalRadio.checked : true
		var allValid = true

		if (isLegal) {
			allValid = validateField(document.getElementById('invLegalName'), document.getElementById('invLegalNameErr'), function (v) { return v.length > 0 }) && allValid
			allValid = validateField(document.getElementById('invLegalInn'), document.getElementById('invLegalInnErr'), function (v) { return /^\d{10,12}$/.test(v) }) && allValid
			allValid = validateField(document.getElementById('invLegalKpp'), document.getElementById('invLegalKppErr'), function (v) { return /^\d{9}$/.test(v) }) && allValid
			allValid = validateField(document.getElementById('invLegalOgrn'), document.getElementById('invLegalOgrnErr'), function (v) { return /^\d{13,15}$/.test(v) }) && allValid
			allValid = validateField(document.getElementById('invLegalAddress'), document.getElementById('invLegalAddressErr'), function (v) { return v.length > 0 }) && allValid
			allValid = validateField(document.getElementById('invLegalEmail'), document.getElementById('invLegalEmailErr'), function (v) { return FormUtils.test(v, 'valid_email') }) && allValid
		} else {
			allValid = validateField(document.getElementById('invIndFio'), document.getElementById('invIndFioErr'), function (v) { return v.length > 0 }) && allValid
			allValid = validateField(document.getElementById('invIndInn'), document.getElementById('invIndInnErr'), function (v) { return /^\d{10,12}$/.test(v) }) && allValid
			allValid = validateField(document.getElementById('invIndOgrnip'), document.getElementById('invIndOgrnipErr'), function (v) { return /^\d{15}$/.test(v) }) && allValid
			allValid = validateField(document.getElementById('invIndAddress'), document.getElementById('invIndAddressErr'), function (v) { return v.length > 0 }) && allValid
			allValid = validateField(document.getElementById('invIndEmail'), document.getElementById('invIndEmailErr'), function (v) { return FormUtils.test(v, 'valid_email') }) && allValid
		}

		return allValid
	}

	if (orderBtn) {
		orderBtn.addEventListener('click', function (e) {
			e.preventDefault()
			if (validateAll()) {
				closePopup()
				if (typeof window.showToast === 'function') {
					window.showToast('Заказ оформлен', 'success')
				}
			}
		})
	}

	/* ===== File upload ===== */
	var fileInput = document.getElementById('invFileInput')
	var fileBtn = document.getElementById('invFileBtn')
	var fileLoading = document.getElementById('invFileLoading')
	var fileInfo = document.getElementById('invFileInfo')
	var fileName = document.getElementById('invFileName')
	var fileSize = document.getElementById('invFileSize')
	var fileRemove = document.getElementById('invFileRemove')

	function formatFileSize(bytes) {
		if (bytes < 1024) return bytes + ' Б'
		if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Кб'
		return (bytes / 1048576).toFixed(1) + ' мб'
	}

	function resetFileUpload() {
		if (fileLoading) fileLoading.classList.remove('checkout-popup__file-loading--active')
		if (fileInfo) fileInfo.style.display = 'none'
		if (fileBtn) fileBtn.style.display = ''
		if (fileInput) fileInput.value = ''
	}

	if (fileBtn) {
		fileBtn.addEventListener('click', function () {
			if (fileInput) fileInput.click()
		})
	}

	if (fileInput) {
		fileInput.addEventListener('change', function () {
			var file = fileInput.files && fileInput.files[0]
			if (!file) return

			if (fileLoading) fileLoading.classList.add('checkout-popup__file-loading--active')

			setTimeout(function () {
				if (fileLoading) fileLoading.classList.remove('checkout-popup__file-loading--active')
				if (fileName) fileName.textContent = file.name
				if (fileSize) fileSize.textContent = formatFileSize(file.size)
				if (fileInfo) fileInfo.style.display = 'flex'
			}, 1200)
		})
	}

	if (fileRemove) {
		fileRemove.addEventListener('click', resetFileUpload)
	}
})()

/* ===== Checkout — Recipient Popup ===== */
;(function () {
	'use strict'

	var editBtns = document.querySelectorAll('.checkout-recipient__edit')
	var popup = document.getElementById('recipientPopup')
	var closeBtn = document.getElementById('recipientPopupClose')
	var overlay = popup
	var nameInput = document.getElementById('recipientName')
	var phoneInput = document.getElementById('recipientPhone')
	var emailInput = document.getElementById('recipientEmail')
	var saveBtn = document.getElementById('recipientPopupBtn')

	if (!popup) return

	var nameDisplay = document.querySelector('.checkout-recipient__row:nth-child(1) .checkout-recipient__value')
	var phoneDisplay = document.querySelector('.checkout-recipient__row:nth-child(2) .checkout-recipient__value')
	var emailDisplay = document.querySelector('.checkout-recipient__row:nth-child(3) .checkout-recipient__value')

	function open() {
		if (nameInput && nameDisplay) nameInput.value = nameDisplay.textContent.trim()
		if (phoneInput && phoneDisplay) phoneInput.value = phoneDisplay.textContent.trim()
		if (emailInput && emailDisplay) emailInput.value = emailDisplay.textContent.trim()
		popup.classList.add('popup--open')
		document.body.style.overflow = 'hidden'
	}

	function close() {
		popup.classList.remove('popup--open')
		document.body.style.overflow = ''
	}

	editBtns.forEach(function (btn) {
		btn.addEventListener('click', open)
	})

	if (closeBtn) closeBtn.addEventListener('click', close)
	if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) close() })

	if (saveBtn) {
		saveBtn.addEventListener('click', function () {
			var nameVal = nameInput ? nameInput.value.trim() : ''
			var phoneVal = phoneInput ? phoneInput.value.trim() : ''
			var emailVal = emailInput ? emailInput.value.trim() : ''
			var valid = true
			if (!nameVal) { nameInput.classList.add('is-invalid'); valid = false } else { nameInput.classList.remove('is-invalid') }
			if (!phoneVal || !FormUtils.test(phoneVal, 'phone')) { phoneInput.classList.add('is-invalid'); valid = false } else { phoneInput.classList.remove('is-invalid') }
			if (emailVal && !FormUtils.test(emailVal, 'valid_email')) { emailInput.classList.add('is-invalid'); valid = false } else { emailInput.classList.remove('is-invalid') }
			if (!valid) return
			if (nameDisplay) nameDisplay.textContent = nameVal
			if (phoneDisplay) phoneDisplay.textContent = phoneVal
			if (emailDisplay) emailDisplay.textContent = emailVal || emailDisplay.textContent
			close()
		})
	}

	/* ===== Clear errors on input ===== */
	if (nameInput) nameInput.addEventListener('input', function () { nameInput.classList.remove('is-invalid') })
	if (phoneInput) phoneInput.addEventListener('input', function () { phoneInput.classList.remove('is-invalid') })
	if (emailInput) emailInput.addEventListener('input', function () { emailInput.classList.remove('is-invalid') })

	/* ===== Escape key ===== */
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && popup.classList.contains('popup--open')) close()
	})
})()

/* ===== Checkout — Address Popup ===== */
;(function () {
	'use strict'

	var editBtns = document.querySelectorAll('.checkout-delivery__address-edit')
	var popup = document.getElementById('addressPopup')
	var closeBtn = document.getElementById('addressPopupClose')
	var overlay = popup
	var saveBtn = document.getElementById('addressPopupBtn')

	if (!popup) return

	var fields = [
		{ input: document.getElementById('addrName'), err: null },
		{ input: document.getElementById('addrCity'), err: null },
		{ input: document.getElementById('addrStreet'), err: null },
		{ input: document.getElementById('addrHouse'), err: null }
	]

	function getAddressCard(btn) {
		return btn.closest('.checkout-delivery__address-card')
	}

	function open() {
		var card = getAddressCard(this)
		if (!card) return
		document.getElementById('addrName').value = card.querySelector('.checkout-delivery__address-row:nth-child(1) .checkout-delivery__address-value').textContent.trim()
		var commentEl = card.querySelector('.checkout-delivery__address-row:nth-child(3) .checkout-delivery__address-value')
		if (commentEl) document.getElementById('addrComment').value = commentEl.textContent.trim()
		fields.forEach(function (f) { if (f.input) f.input.classList.remove('is-invalid') })
		popup.classList.add('popup--open')
		document.body.style.overflow = 'hidden'
	}

	function close() {
		popup.classList.remove('popup--open')
		document.body.style.overflow = ''
	}

	editBtns.forEach(function (btn) {
		btn.addEventListener('click', open)
	})

	if (closeBtn) closeBtn.addEventListener('click', close)
	if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) close() })

	if (saveBtn) {
		saveBtn.addEventListener('click', function () {
			var nameVal = document.getElementById('addrName').value.trim()
			var cityVal = document.getElementById('addrCity').value.trim()
			var streetVal = document.getElementById('addrStreet').value.trim()
			var houseVal = document.getElementById('addrHouse').value.trim()
			var apartmentVal = document.getElementById('addrApartment').value.trim()
			var commentVal = document.getElementById('addrComment').value.trim()

			var valid = true
			if (!nameVal) { document.getElementById('addrName').classList.add('is-invalid'); valid = false }
			if (!cityVal) { document.getElementById('addrCity').classList.add('is-invalid'); valid = false }
			if (!streetVal) { document.getElementById('addrStreet').classList.add('is-invalid'); valid = false }
			if (!houseVal) { document.getElementById('addrHouse').classList.add('is-invalid'); valid = false }
			if (!valid) return

			var card = editBtns.length ? editBtns[0].closest('.checkout-delivery__address-card') : null
			if (!card) return

			card.querySelector('.checkout-delivery__address-row:nth-child(1) .checkout-delivery__address-value').textContent = nameVal
			var addr = 'г. ' + cityVal + ', ' + streetVal + ' д. ' + houseVal
			var blockVal = document.getElementById('addrBlock').value.trim()
			if (blockVal) addr += ' к. ' + blockVal
			if (apartmentVal) addr += ' кв. ' + apartmentVal
			card.querySelector('.checkout-delivery__address-row:nth-child(2) .checkout-delivery__address-value').textContent = addr
			var commentEl = card.querySelector('.checkout-delivery__address-row:nth-child(3) .checkout-delivery__address-value')
			if (commentEl) commentEl.textContent = commentVal || '—'
			close()
		})
	}

	/* ===== Clear errors on input ===== */
	fields.forEach(function (f) {
		if (f.input) f.input.addEventListener('input', function () { f.input.classList.remove('is-invalid') })
	})

	/* ===== Escape key ===== */
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && popup.classList.contains('popup--open')) close()
	})
})()

/* ===== Checkout — Address Popup ===== */
;(function () {
	'use strict'

	var editBtns = document.querySelectorAll('.checkout-delivery__address-edit')
	var popup = document.getElementById('addressPopup')
	var closeBtn = document.getElementById('addressPopupClose')
	var overlay = popup
	var saveBtn = document.getElementById('addressPopupBtn')

	if (!popup) return

	function getAddressCard(btn) {
		return btn.closest('.checkout-delivery__address-card')
	}

	function open() {
		var card = getAddressCard(this)
		if (!card) return
		document.getElementById('addrName').value = card.querySelector('.checkout-delivery__address-row:nth-child(1) .checkout-delivery__address-value').textContent.trim()
		var fullAddr = card.querySelector('.checkout-delivery__address-row:nth-child(2) .checkout-delivery__address-value').textContent.trim()
		var commentEl = card.querySelector('.checkout-delivery__address-row:nth-child(3) .checkout-delivery__address-value')
		if (commentEl) document.getElementById('addrComment').value = commentEl.textContent.trim()
		popup.style.display = 'flex'
		document.body.style.overflow = 'hidden'
	}

	function close() {
		popup.style.display = 'none'
		document.body.style.overflow = ''
	}

	editBtns.forEach(function (btn) {
		btn.addEventListener('click', open)
	})

	if (closeBtn) closeBtn.addEventListener('click', close)
	if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) close() })

	if (saveBtn) {
		saveBtn.addEventListener('click', function () {
			var card = editBtns.length ? editBtns[0].closest('.checkout-delivery__address-card') : null
			if (!card) return
			var nameVal = document.getElementById('addrName').value.trim()
			var cityVal = document.getElementById('addrCity').value.trim()
			var streetVal = document.getElementById('addrStreet').value.trim()
			var houseVal = document.getElementById('addrHouse').value.trim()
			var blockVal = document.getElementById('addrBlock').value.trim()
			var apartmentVal = document.getElementById('addrApartment').value.trim()
			var commentVal = document.getElementById('addrComment').value.trim()
			if (nameVal) card.querySelector('.checkout-delivery__address-row:nth-child(1) .checkout-delivery__address-value').textContent = nameVal
			var addr = 'г. ' + cityVal + ', ' + streetVal + ' д. ' + houseVal
			if (blockVal) addr += ' к. ' + blockVal
			if (apartmentVal) addr += ' кв. ' + apartmentVal
			card.querySelector('.checkout-delivery__address-row:nth-child(2) .checkout-delivery__address-value').textContent = addr
			var commentEl = card.querySelector('.checkout-delivery__address-row:nth-child(3) .checkout-delivery__address-value')
			if (commentEl) commentEl.textContent = commentVal || '—'
			close()
		})
	}
})()
