/* ===== Cart Page ===== */
;(function () {
	'use strict'

	var cartEl = document.querySelector('.cart')
	var itemsCountEl = document.querySelector('.cart__items-count')
	var summaryTotalLabel = document.querySelector('.cart__summary-total-label')
	var summaryTotalPrice = document.querySelector('.cart__summary-total-price')
	var summarySplit = document.querySelector('.cart__summary-split')

	var checkoutCountLabel = document.querySelector('.checkout-summary__count-label')
	var checkoutSubtotal = document.querySelector('.checkout-summary__subtotal')

	function parsePrice(str) {
		if (!str) return 0
		return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0
	}

	function formatPrice(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' \u20BD'
	}

	function pluralize(count, forms) {
		var n = Math.abs(count) % 100
		var n1 = n % 10
		if (n > 10 && n < 20) return forms[2]
		if (n1 > 1 && n1 < 5) return forms[1]
		if (n1 === 1) return forms[0]
		return forms[2]
	}

	function recalcItemPrice(item) {
		var qty = parseInt(item.querySelector('.cart-item__qty-value').textContent, 10) || 1
		var unitPrice = parseFloat(item.getAttribute('data-unit-price')) || 0
		var unitPriceOld = parseFloat(item.getAttribute('data-unit-price-old')) || 0

		var pricesWrap = item.querySelector('.cart-item__prices')
		if (pricesWrap) {
			var priceEl = pricesWrap.querySelector('.cart-item__price:not(.cart-item__price--old)') || pricesWrap.querySelector('.cart-item__price')
			var oldPriceEl = pricesWrap.querySelector('.cart-item__price--old')
			if (priceEl) priceEl.textContent = formatPrice(unitPrice * qty)
			if (oldPriceEl && unitPriceOld > 0) oldPriceEl.textContent = formatPrice(unitPriceOld * qty)
		} else {
			var priceEl = item.querySelector('.cart-item__price')
			if (priceEl) priceEl.textContent = formatPrice(unitPrice * qty)
		}
	}

	function recalcCartTotal() {
		var items = document.querySelectorAll('.cart-item')
		var total = 0
		var count = 0

		items.forEach(function (item) {
			var qty = parseInt(item.querySelector('.cart-item__qty-value').textContent, 10) || 1
			var unitPrice = parseFloat(item.getAttribute('data-unit-price')) || 0
			total += unitPrice * qty
			count += qty
		})

		var word = pluralize(count, ['товар', 'товара', 'товаров'])

		if (itemsCountEl) {
			itemsCountEl.textContent = 'Добавлено ' + count + ' ' + word + ':'
		}

		if (summaryTotalLabel) {
			summaryTotalLabel.textContent = count + ' ' + word + ' на сумму:'
		}

		if (summaryTotalPrice) {
			summaryTotalPrice.textContent = formatPrice(total)
		}

		if (summarySplit) {
			summarySplit.textContent = 'По ' + formatPrice(Math.round(total / 4)) + ' — 4 платежа в Сплит'
		}

		document.querySelectorAll('.header__badge').forEach(function (badge) {
			badge.textContent = items.length
		})

		if (checkoutCountLabel) {
			checkoutCountLabel.textContent = count + ' ' + word + ' на сумму:'
		}

		if (checkoutSubtotal) {
			checkoutSubtotal.textContent = formatPrice(total)
		}

		if (cartEl) {
			cartEl.classList.toggle('cart--empty', items.length === 0)
		}
	}

	function initItem(item) {
		var pricesWrap = item.querySelector('.cart-item__prices')
		var priceEl, oldPriceEl

		if (pricesWrap) {
			priceEl = pricesWrap.querySelector('.cart-item__price:not(.cart-item__price--old)') || pricesWrap.querySelector('.cart-item__price')
			oldPriceEl = pricesWrap.querySelector('.cart-item__price--old')
		} else {
			priceEl = item.querySelector('.cart-item__price')
		}

		if (priceEl && !item.hasAttribute('data-unit-price')) {
			item.setAttribute('data-unit-price', parsePrice(priceEl.textContent))
		}

		if (oldPriceEl && !item.hasAttribute('data-unit-price-old')) {
			item.setAttribute('data-unit-price-old', parsePrice(oldPriceEl.textContent))
		}
	}

	// Init all items
	document.querySelectorAll('.cart-item').forEach(initItem)

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
				recalcItemPrice(item)
				recalcCartTotal()
			}
		})

		plusBtn.addEventListener('click', function (e) {
			e.stopPropagation()
			e.preventDefault()
			var val = parseInt(valueEl.textContent, 10) || 1
			val++
			valueEl.textContent = val
			recalcItemPrice(item)
			recalcCartTotal()
		})
	})

	// Undo — independent bar per deletion
	var undoTemplate = document.querySelector('.cart-undo')
	var undoInstances = []

	function cancelUndo() {
		undoInstances.forEach(function (inst) {
			clearTimeout(inst.timer)
			clearInterval(inst.countdown)
			if (inst.item && inst.item.parentNode) {
				inst.item.style.display = ''
			}
			if (inst.undoEl && inst.undoEl.parentNode) {
				inst.undoEl.remove()
			}
		})
		undoInstances = []
		recalcCartTotal()
	}

	function removeItemWithUndo(item) {
		if (!item) return

		var undoEl = undoTemplate.cloneNode(true)
		undoEl.style.display = 'flex'

		item.parentNode.insertBefore(undoEl, item)

		var brand = item.querySelector('.cart-item__brand')
		var name = brand ? brand.textContent.trim() : 'товар'
		var undoText = undoEl.querySelector('.cart-undo__text')
		if (undoText) undoText.textContent = 'Товар ' + name + ' удален из корзины.'

		item.style.display = 'none'
		recalcCartTotal()

		var undoProgress = undoEl.querySelector('.cart-undo__progress')
		if (undoProgress) {
			undoProgress.style.animation = 'none'
			void undoProgress.offsetHeight
			undoProgress.style.animation = 'cart-undo-timer 4s linear forwards'
		}

		var undoNumber = undoEl.querySelector('.cart-undo__number')
		var seconds = 4
		if (undoNumber) undoNumber.textContent = seconds
		var countdown = setInterval(function () {
			seconds--
			if (seconds > 0) {
				if (undoNumber) undoNumber.textContent = seconds
			} else {
				clearInterval(countdown)
			}
		}, 1000)

		var instance = { item: item, undoEl: undoEl, countdown: countdown }
		undoInstances.push(instance)

		var undoBtn = undoEl.querySelector('.cart-undo__btn')
		if (undoBtn) {
			undoBtn.addEventListener('click', function (e) {
				e.stopPropagation()
				e.preventDefault()
				clearTimeout(instance.timer)
				clearInterval(instance.countdown)
				if (undoEl.parentNode) undoEl.remove()
				item.style.display = ''
				var idx = undoInstances.indexOf(instance)
				if (idx > -1) undoInstances.splice(idx, 1)
				recalcCartTotal()
			})
		}

		instance.timer = setTimeout(function () {
			clearInterval(instance.countdown)
			if (undoEl.parentNode) undoEl.remove()
			if (item.parentNode) item.remove()
			var idx = undoInstances.indexOf(instance)
			if (idx > -1) undoInstances.splice(idx, 1)
			recalcCartTotal()
		}, 4000)
	}

	// Remove item
	document.querySelectorAll('.cart-item__remove').forEach(function (btn) {
		btn.addEventListener('click', function (e) {
			e.stopPropagation()
			e.preventDefault()
			var item = this.closest('.cart-item')
			if (item) {
				removeItemWithUndo(item)
			}
		})
	})

	// "Очистить" — remove all items
	var removeAllBtn = document.querySelector('.cart__action-btn--clear')
	if (removeAllBtn) {
		removeAllBtn.addEventListener('click', function () {
			cancelUndo()
			var items = document.querySelectorAll('.cart-item')
			if (items.length === 0) return
			items.forEach(function (item, index) {
				setTimeout(function () {
					item.style.transition = 'all 0.4s'
					item.style.opacity = '0'
					setTimeout(function () {
						item.remove()
						if (index === items.length - 1) {
							recalcCartTotal()
						}
					}, 300)
				}, index * 100)
			})
		})
	}

	recalcCartTotal()

	// Promo code
	var promoInput = document.querySelector('.cart__summary-promo-field')
	var promoBtn = document.querySelector('.cart__summary-promo-apply')
	var promoBox = document.querySelector('.cart__summary-promo-input')
	var promoApplied = document.querySelector('.cart__summary-promo-applied')
	var promoCode = document.querySelector('.cart__summary-promo-code')
	var promoCancel = document.querySelector('.cart__summary-promo-cancel')
	var discountsEl = document.querySelector('.cart__summary-discounts')

	function applyPromo(code) {
		if (promoBox) promoBox.classList.add('cart__summary-promo-input--success')
		if (promoInput) { promoInput.style.display = 'none'; promoInput.disabled = true }
		if (promoBtn) { promoBtn.style.display = 'none'; promoBtn.disabled = true }
		if (promoCode) promoCode.textContent = code
		if (promoApplied) promoApplied.style.display = 'flex'
		if (discountsEl) discountsEl.style.display = 'flex'
		if (window.showToast) showToast('Промокод применён', 'success')
	}

	function cancelPromo() {
		if (promoBox) promoBox.classList.remove('cart__summary-promo-input--success')
		if (promoInput) { promoInput.style.display = ''; promoInput.disabled = false }
		if (promoBtn) { promoBtn.style.display = ''; promoBtn.disabled = false; promoBtn.textContent = 'Применить' }
		if (promoApplied) promoApplied.style.display = 'none'
		if (discountsEl) discountsEl.style.display = 'none'
	}

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
		applyPromo(val)
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

	if (promoCancel) {
		promoCancel.addEventListener('click', function (e) {
			e.stopPropagation()
			e.preventDefault()
			cancelPromo()
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
	var paymentRadios = document.querySelectorAll('.checkout-payment input[name="payment"]')
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

	var invoiceRadio = document.querySelector('.checkout-payment input[value="invoice"]')
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

	var errs = {
		name: document.getElementById('recipientNameErr'),
		phone: document.getElementById('recipientPhoneErr'),
		email: document.getElementById('recipientEmailErr')
	}

	function clearAllErrs() {
		Object.keys(errs).forEach(function (k) { if (errs[k]) errs[k].classList.remove('visible') })
	}

	function open() {
		if (nameInput && nameDisplay) nameInput.value = nameDisplay.textContent.trim()
		if (phoneInput && phoneDisplay) phoneInput.value = phoneDisplay.textContent.trim()
		if (emailInput && emailDisplay) emailInput.value = emailDisplay.textContent.trim()
		clearAllErrs()
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
			clearAllErrs()
			var valid = true
			if (!nameVal) { if (errs.name) errs.name.classList.add('visible'); valid = false }
			if (!phoneVal || !FormUtils.test(phoneVal, 'phone')) { if (errs.phone) errs.phone.classList.add('visible'); valid = false }
			if (emailVal && !FormUtils.test(emailVal, 'valid_email')) { if (errs.email) errs.email.classList.add('visible'); valid = false }
			if (!valid) return
			if (nameDisplay) nameDisplay.textContent = nameVal
			if (phoneDisplay) phoneDisplay.textContent = phoneVal
			if (emailDisplay) emailDisplay.textContent = emailVal || emailDisplay.textContent
			close()
		})
	}

	/* ===== Clear errors on input ===== */
	var inputToErr = [
		{ inp: nameInput, err: errs.name },
		{ inp: phoneInput, err: errs.phone },
		{ inp: emailInput, err: errs.email }
	]
	inputToErr.forEach(function (pair) {
		if (pair.inp && pair.err) {
			pair.inp.addEventListener('input', function () { pair.err.classList.remove('visible') })
		}
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

	var fields = [
		{ input: document.getElementById('addrName'), err: document.getElementById('addrNameErr') },
		{ input: document.getElementById('addrCity'), err: document.getElementById('addrCityErr') },
		{ input: document.getElementById('addrStreet'), err: document.getElementById('addrStreetErr') },
		{ input: document.getElementById('addrHouse'), err: document.getElementById('addrHouseErr') }
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
		fields.forEach(function (f) { if (f.err) f.err.classList.remove('visible') })
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

			fields.forEach(function (f) { if (f.err) f.err.classList.remove('visible') })
			var valid = true
			if (!nameVal) { if (fields[0].err) fields[0].err.classList.add('visible'); valid = false }
			if (!cityVal) { if (fields[1].err) fields[1].err.classList.add('visible'); valid = false }
			if (!streetVal) { if (fields[2].err) fields[2].err.classList.add('visible'); valid = false }
			if (!houseVal) { if (fields[3].err) fields[3].err.classList.add('visible'); valid = false }
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
		if (f.input && f.err) {
			f.input.addEventListener('input', function () { f.err.classList.remove('visible') })
		}
	})

	/* ===== Escape key ===== */
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && popup.classList.contains('popup--open')) close()
	})
})()


