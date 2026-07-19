document.addEventListener('DOMContentLoaded', function () {

    // ===== ADDRESS FAVORITE TOGGLE (dashboard) =====
    document.addEventListener('click', function (e) {
        var favBtn = e.target.closest('.js-address-fav')
        if (favBtn) {
            document.querySelectorAll('.js-address-fav').forEach(function (b) { b.classList.remove('is-active') })
            favBtn.classList.add('is-active')
        }
    })

    // ===== PROMOCODE COPY + TOAST (promocodes) =====
    var copyBtns = document.querySelectorAll('[data-copy]')
    if (copyBtns.length) {
        copyBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (this.classList.contains('promocode-card__copy--done')) return
                this.classList.add('promocode-card__copy--done')
                var textEl = this.querySelector('.promocode-card__copy-text')
                if (textEl) textEl.textContent = 'Скопировано'
                setTimeout(function () {
                    this.classList.remove('promocode-card__copy--done')
                    if (textEl) textEl.textContent = 'Скопировать'
                }.bind(this), 2000)
            })
        })

        var expiryToast = document.getElementById('expiryToast')
        var toastClose = document.getElementById('toastClose')
        if (expiryToast) {
            setTimeout(function () { expiryToast.classList.add('notification-toast--visible') }, 1000)
            if (toastClose) {
                toastClose.addEventListener('click', function () {
                    expiryToast.classList.remove('notification-toast--visible')
                })
            }
        }
    }

    // ===== TOGGLE NEWSLETTERS =====
    var toggles = document.querySelectorAll('.nl-toggle__input')
    if (toggles.length) {
        toggles.forEach(function (toggle) {
            toggle.addEventListener('change', function () {
                var row = this.closest('.nl-row')
                var label = row ? row.querySelector('.nl-row__label') : null
                var name = label ? label.textContent.trim() : 'Рассылка'
                var message = this.checked ? name + ' включена' : name + ' отключена'
                showToast(message)
            })
        })
    }

    // ===== SMS POPUP =====
    var smsPopup = document.getElementById('smsPopup')
    var smsPopupInput = document.getElementById('smsPopupInput')
    var smsPopupBtn = document.getElementById('smsPopupBtn')
    var smsPopupCheckbox = document.getElementById('smsPopupCheckbox')

    var smsPopupError = document.getElementById('smsPopupError')

    if (smsPopup) {
        function openSmsPopup(phoneValue, phoneSpan, row) {
            smsPopupInput.value = phoneValue || ''
            smsPopupInput.className = 'popup-input'
            smsPopupInput.disabled = false
            smsPopupBtn.disabled = false
            smsPopupBtn.classList.remove('is-loading')
            smsPopupCheckbox.checked = false
            smsPopupCheckbox.closest('.checkbox').classList.remove('is-invalid')
            if (smsPopupError) smsPopupError.classList.remove('visible')
            smsPopup.classList.add('popup--open')
            setTimeout(function () { smsPopupInput.focus() }, 200)

            function onSave() {
                if (smsPopupBtn.disabled) return
                var val = smsPopupInput.value.trim()

                if (!smsPopupCheckbox.checked) {
                    smsPopupCheckbox.closest('.checkbox').classList.add('is-invalid')
                    return
                }
                smsPopupCheckbox.closest('.checkbox').classList.remove('is-invalid')

                var digits = val.replace(/\D/g, '')
                if (digits.length < 11) {
                    smsPopupInput.classList.add('is-invalid')
                    if (smsPopupError) { smsPopupError.textContent = 'Введите корректный номер телефона'; smsPopupError.classList.add('visible') }
                    return
                }
                smsPopupInput.classList.remove('is-invalid')
                if (smsPopupError) smsPopupError.classList.remove('visible')
                smsPopupBtn.disabled = true
                smsPopupBtn.classList.add('is-loading')
                setTimeout(function () {
                    smsPopupBtn.classList.remove('is-loading')
                    phoneSpan.textContent = val
                    row.classList.add('nl-row--saved')
                    closeSmsPopup()
                    showToast('Номер телефона сохранён', 'success')
                    setTimeout(function () { row.classList.remove('nl-row--saved') }, 1200)
                }, 800)
            }

            // Phone mask
            function smsPhoneMask() {
                var x = smsPopupInput.value.replace(/\D/g, '').slice(0, 11)
                if (x.length === 0) { smsPopupInput.value = ''; return }
                var val = '+7'
                if (x.length > 1) val += ' (' + x.slice(1, 4)
                if (x.length >= 5) val += ') ' + x.slice(4, 7)
                if (x.length >= 8) val += '-' + x.slice(7, 9)
                if (x.length >= 10) val += '-' + x.slice(9, 11)
                smsPopupInput.value = val
            }
            if (!/^\+7\s/.test(smsPopupInput.value) && smsPopupInput.value) {
                smsPopupInput.value = '+7 (' + smsPopupInput.value.replace(/\D/g, '')
            }

            function onKeydown(e) {
                if (e.key === 'Enter') onSave()
                if (e.key === 'Backspace' && smsPopupInput.value.length <= 2) {
                    smsPopupInput.value = ''
                }
            }

            function onSmsInput() {
                smsPopupInput.classList.remove('is-invalid')
                if (smsPopupError) smsPopupError.classList.remove('visible')
                smsPhoneMask()
            }

            smsPopupBtn.addEventListener('click', onSave)
            smsPopupInput.addEventListener('keydown', onKeydown)
            smsPopupInput.addEventListener('input', onSmsInput)
            smsPopupCheckbox.addEventListener('change', function () {
                this.closest('.checkbox').classList.remove('is-invalid')
            })

            smsPopup._cleanup = function () {
                smsPopupBtn.removeEventListener('click', onSave)
                smsPopupInput.removeEventListener('keydown', onKeydown)
                smsPopupInput.removeEventListener('input', onSmsInput)
            }
        }

        function closeSmsPopup() {
            smsPopup.classList.remove('popup--open')
            if (smsPopup._cleanup) smsPopup._cleanup()
        }

        document.getElementById('smsPopupClose').addEventListener('click', closeSmsPopup)
        smsPopup.addEventListener('click', function (e) {
            if (e.target === smsPopup) closeSmsPopup()
        })
    }

    // ===== EMAIL POPUP =====
    var emailPopup = document.getElementById('emailPopup')
    var emailPopupInput = document.getElementById('emailPopupInput')
    var emailPopupBtn = document.getElementById('emailPopupBtn')
    var emailPopupCheckbox = document.getElementById('emailPopupCheckbox')
    var emailPopupError = document.getElementById('emailPopupError')

    if (emailPopup) {
        function openEmailPopup(emailValue, phoneSpan, row) {
            emailPopupInput.value = emailValue || ''
            emailPopupInput.className = 'popup-input'
            emailPopupInput.disabled = false
            emailPopupBtn.disabled = false
            emailPopupBtn.classList.remove('is-loading')
            emailPopupCheckbox.checked = false
            emailPopupCheckbox.closest('.checkbox').classList.remove('is-invalid')
            if (emailPopupError) emailPopupError.classList.remove('visible')
            emailPopup.classList.add('popup--open')
            setTimeout(function () { emailPopupInput.focus() }, 200)

            function onSave() {
                if (emailPopupBtn.disabled) return
                var val = emailPopupInput.value.trim()

                if (!emailPopupCheckbox.checked) {
                    emailPopupCheckbox.closest('.checkbox').classList.add('is-invalid')
                    return
                }
                emailPopupCheckbox.closest('.checkbox').classList.remove('is-invalid')

                if (!FormUtils.test(val, 'required|valid_email')) {
                    emailPopupInput.classList.add('is-invalid')
                    if (emailPopupError) { emailPopupError.textContent = 'Введите корректный e-mail'; emailPopupError.classList.add('visible') }
                    return
                }
                emailPopupInput.classList.remove('is-invalid')
                if (emailPopupError) emailPopupError.classList.remove('visible')
                emailPopupBtn.disabled = true
                emailPopupBtn.classList.add('is-loading')
                setTimeout(function () {
                    emailPopupBtn.classList.remove('is-loading')
                    phoneSpan.textContent = val
                    row.classList.add('nl-row--saved')
                    closeEmailPopup()
                    showToast('E-mail сохранён', 'success')
                    setTimeout(function () { row.classList.remove('nl-row--saved') }, 1200)
                }, 800)
            }

            function onKeydown(e) {
                if (e.key === 'Enter') onSave()
            }

            function onEmailInput() {
                emailPopupInput.classList.remove('is-invalid')
                if (emailPopupError) emailPopupError.classList.remove('visible')
            }

            emailPopupBtn.addEventListener('click', onSave)
            emailPopupInput.addEventListener('keydown', onKeydown)
            emailPopupInput.addEventListener('input', onEmailInput)
            emailPopupCheckbox.addEventListener('change', function () {
                this.closest('.checkbox').classList.remove('is-invalid')
            })

            emailPopup._cleanup = function () {
                emailPopupBtn.removeEventListener('click', onSave)
                emailPopupInput.removeEventListener('keydown', onKeydown)
                emailPopupInput.removeEventListener('input', onEmailInput)
            }
        }

        function closeEmailPopup() {
            emailPopup.classList.remove('popup--open')
            if (emailPopup._cleanup) emailPopup._cleanup()
        }

        document.getElementById('emailPopupClose').addEventListener('click', closeEmailPopup)
        emailPopup.addEventListener('click', function (e) {
            if (e.target === emailPopup) closeEmailPopup()
        })
    }

    // ===== PROFILE POPUP =====
    var profilePopup = document.getElementById('profilePopup')
    var profileFirstNameInput = document.getElementById('profileFirstNameInput')
    var profileFirstNameError = document.getElementById('profileFirstNameError')
    var profileLastNameInput = document.getElementById('profileLastNameInput')
    var profileLastNameError = document.getElementById('profileLastNameError')
    var profilePhoneInput = document.getElementById('profilePhoneInput')
    var profilePhoneError = document.getElementById('profilePhoneError')
    var profileEmailInput = document.getElementById('profileEmailInput')
    var profileEmailError = document.getElementById('profileEmailError')
    var profilePopupBtn = document.getElementById('profilePopupBtn')

    var profileValidators = [
        { el: profileFirstNameInput, err: profileFirstNameError, fn: function (v) { return FormUtils.test(v, 'min_length[2]') }, optional: false },
        { el: profileLastNameInput, err: profileLastNameError, fn: function (v) { return FormUtils.test(v, 'min_length[2]') }, optional: false },
        { el: profilePhoneInput, err: profilePhoneError, fn: function (v) { return FormUtils.test(v, 'phone') }, optional: false },
        { el: profileEmailInput, err: profileEmailError, fn: function (v) { return FormUtils.test(v, 'valid_email') }, optional: true }
    ]

    if (profilePopup) {
        function clearProfileErrors() {
            profileValidators.forEach(function (item) {
                item.el.classList.remove('is-invalid')
                if (item.err) item.err.classList.remove('visible')
            })
        }

        function validateProfileInput(item) {
            var val = item.el.value.trim()
            if (!val) {
                item.el.classList.remove('is-invalid')
                if (item.err) item.err.classList.remove('visible')
                return item.optional
            }
            if (!item.fn(val)) {
                item.el.classList.add('is-invalid')
                if (item.err) item.err.classList.add('visible')
                return false
            }
            item.el.classList.remove('is-invalid')
            if (item.err) item.err.classList.remove('visible')
            return true
        }

        function openProfilePopup(nameEl, phoneEl, emailEl) {
            var fullName = nameEl.textContent.trim()
            var spaceIdx = fullName.indexOf(' ')
            var firstName = spaceIdx > -1 ? fullName.substring(0, spaceIdx) : fullName
            var lastName = spaceIdx > -1 ? fullName.substring(spaceIdx + 1) : ''
            profileFirstNameInput.value = firstName
            profileLastNameInput.value = lastName
            profilePhoneInput.value = phoneEl.textContent.trim()
            profileEmailInput.value = emailEl.textContent.trim()
            clearProfileErrors()
            profilePopupBtn.disabled = false
            profilePopupBtn.classList.remove('is-loading')
            profilePopup.classList.add('popup--open')
            setTimeout(function () { profileFirstNameInput.focus() }, 200)

            // Phone mask for profile popup
            var profilePhoneHandler = function () {
                var x = profilePhoneInput.value.replace(/\D/g, '').slice(0, 11)
                if (x.length === 0) { profilePhoneInput.value = ''; return }
                var val = '+7'
                if (x.length > 1) val += ' (' + x.slice(1, 4)
                if (x.length >= 5) val += ') ' + x.slice(4, 7)
                if (x.length >= 8) val += '-' + x.slice(7, 9)
                if (x.length >= 10) val += '-' + x.slice(9, 11)
                profilePhoneInput.value = val
            }

            var inputHandlers = [{ el: profilePhoneInput, handler: profilePhoneHandler }]
            profilePhoneInput.addEventListener('input', profilePhoneHandler)

            profileValidators.forEach(function (item) {
                var handler = function () { validateProfileInput(item) }
                inputHandlers.push({ el: item.el, handler: handler })
                item.el.addEventListener('input', handler)
            })

            function onSave() {
                if (profilePopupBtn.disabled) return
                var firstName = profileFirstNameInput.value.trim()
                var lastName = profileLastNameInput.value.trim()
                var phone = profilePhoneInput.value.trim()
                var email = profileEmailInput.value.trim()

                var allValid = true
                profileValidators.forEach(function (item) {
                    var val = item.el.value.trim()
                    if (item.optional && !val) return
                    if (!val || !item.fn(val)) {
                        item.el.classList.add('is-invalid')
                        if (item.err && !val) item.err.classList.remove('visible')
                        if (item.err && val) item.err.classList.add('visible')
                        allValid = false
                    }
                })
                if (!allValid) return

                profilePopupBtn.disabled = true
                profilePopupBtn.classList.add('is-loading')
                setTimeout(function () {
                    profilePopupBtn.classList.remove('is-loading')
                    nameEl.textContent = firstName + ' ' + lastName
                    phoneEl.textContent = phone
                    emailEl.textContent = email
                    closeProfilePopup()
                    showToast('Профиль сохранён', 'success')
                }, 800)
            }

            function onKeydown(e) {
                if (e.key === 'Enter') onSave()
            }

            profilePopupBtn.addEventListener('click', onSave)
            profileFirstNameInput.addEventListener('keydown', onKeydown)
            profileLastNameInput.addEventListener('keydown', onKeydown)
            profilePhoneInput.addEventListener('keydown', onKeydown)
            profileEmailInput.addEventListener('keydown', onKeydown)

            profilePopup._cleanup = function () {
                profilePopupBtn.removeEventListener('click', onSave)
                profileFirstNameInput.removeEventListener('keydown', onKeydown)
                profileLastNameInput.removeEventListener('keydown', onKeydown)
                profilePhoneInput.removeEventListener('keydown', onKeydown)
                profileEmailInput.removeEventListener('keydown', onKeydown)
                inputHandlers.forEach(function (h) {
                    h.el.removeEventListener('input', h.handler)
                })
            }
        }

        function closeProfilePopup() {
            profilePopup.classList.remove('popup--open')
            if (profilePopup._cleanup) profilePopup._cleanup()
        }

        document.getElementById('profilePopupClose').addEventListener('click', closeProfilePopup)
        profilePopup.addEventListener('click', function (e) {
            if (e.target === profilePopup) closeProfilePopup()
        })
    }

    // ===== PROFILE EDIT BUTTON =====
    var profileEditBtns = document.querySelectorAll('.js-profile-edit')
    if (profileEditBtns.length) {
        profileEditBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var card = this.closest('.account-card')
                var fields = card.querySelectorAll('.account-field')
                var nameEl = fields[0].querySelector('.account-field__value')
                var phoneEl = fields[1].querySelector('.account-field__value')
                var emailEl = fields[2].querySelector('.account-field__value')
                openProfilePopup(nameEl, phoneEl, emailEl)
            })
        })
    }

    // ===== ADDRESS POPUP =====
    var addressPopup = document.getElementById('addressPopup')
    var addressPopupTitle = document.getElementById('addressPopupTitle')
    var addressPopupDefault = document.getElementById('addressPopupDefault')
    var addressNameInput = document.getElementById('addressNameInput')
    var addressNameError = document.getElementById('addressNameError')
    var addressCityInput = document.getElementById('addressCityInput')
    var addressCityError = document.getElementById('addressCityError')
    var addressStreetInput = document.getElementById('addressStreetInput')
    var addressStreetError = document.getElementById('addressStreetError')
    var addressHouseInput = document.getElementById('addressHouseInput')
    var addressHouseError = document.getElementById('addressHouseError')
    var addressBlockInput = document.getElementById('addressBlockInput')
    var addressEntranceInput = document.getElementById('addressEntranceInput')
    var addressFloorInput = document.getElementById('addressFloorInput')
    var addressApartmentInput = document.getElementById('addressApartmentInput')
    var addressApartmentError = document.getElementById('addressApartmentError')
    var addressCommentInput = document.getElementById('addressCommentInput')
    var addressPopupBtn = document.getElementById('addressPopupBtn')

    var addressValidators = [
        { el: addressNameInput, err: addressNameError, fn: function (v) { return FormUtils.test(v, 'min_length[2]') }, optional: false },
        { el: addressCityInput, err: addressCityError, fn: function (v) { return FormUtils.test(v, 'min_length[2]') }, optional: false },
        { el: addressStreetInput, err: addressStreetError, fn: function (v) { return FormUtils.test(v, 'min_length[2]') }, optional: false },
        { el: addressHouseInput, err: addressHouseError, fn: function (v) { return FormUtils.test(v, 'min_length[1]') }, optional: false },
        { el: addressApartmentInput, err: addressApartmentError, fn: function (v) { return FormUtils.test(v, 'min_length[1]') }, optional: false }
    ]

    if (addressPopup) {
        function clearAddressErrors() {
            addressValidators.forEach(function (item) {
                item.el.classList.remove('is-invalid')
                if (item.err) item.err.classList.remove('visible')
            })
        }

        function validateAddressInput(item) {
            var val = item.el.value.trim()
            if (!val) {
                item.el.classList.remove('is-invalid')
                if (item.err) item.err.classList.remove('visible')
                return item.optional
            }
            if (!item.fn(val)) {
                item.el.classList.add('is-invalid')
                if (item.err) item.err.classList.add('visible')
                return false
            }
            item.el.classList.remove('is-invalid')
            if (item.err) item.err.classList.remove('visible')
            return true
        }

        function openAddressPopup(card, isNew) {
            addressPopupTitle.textContent = isNew ? 'Новый адрес' : 'Редактировать адрес'
            if (isNew) {
                addressNameInput.value = ''
                addressCityInput.value = ''
                addressStreetInput.value = ''
                addressHouseInput.value = ''
                addressBlockInput.value = ''
                addressEntranceInput.value = ''
                addressFloorInput.value = ''
                addressApartmentInput.value = ''
                addressCommentInput.value = ''
                addressPopupDefault.checked = false
				} else {
					var fields = card.querySelectorAll('.account-field')
					addressNameInput.value = fields[0].querySelector('.account-field__value').textContent.trim()
					var addrEl = fields[1].querySelector('.account-field__value')
                    var parts = parseAddress(addrEl.textContent.trim())
                addressCityInput.value = parts.city
                addressStreetInput.value = parts.street
                addressHouseInput.value = parts.house
                addressBlockInput.value = parts.block || ''
                addressEntranceInput.value = parts.entrance || ''
                addressFloorInput.value = parts.floor || ''
                addressApartmentInput.value = parts.apartment || ''
                var commentText = fields[2].querySelector('.account-field__value').textContent.trim()
                addressCommentInput.value = (commentText === '—') ? '' : commentText
                addressPopupDefault.checked = card.querySelector('.js-address-fav') && card.querySelector('.js-address-fav').classList.contains('is-active')
            }
            clearAddressErrors()
            addressPopupBtn.disabled = false
            addressPopupBtn.classList.remove('is-loading')
            addressPopup.classList.add('popup--open')
            setTimeout(function () { addressNameInput.focus() }, 200)

            // Digit-only filter for numeric fields
            var digitFields = [addressEntranceInput, addressFloorInput, addressApartmentInput]
            var digitHandlers = {}
            digitFields.forEach(function (el) {
                if (!el) return
                var handler = function () { el.value = el.value.replace(/\D/g, '') }
                digitHandlers[el.id] = handler
                el.addEventListener('input', handler)
            })

            var inputHandlers = []
            addressValidators.forEach(function (item) {
                var handler = function () { validateAddressInput(item) }
                inputHandlers.push({ el: item.el, handler: handler })
                item.el.addEventListener('input', handler)
            })

            function onSave() {
                if (addressPopupBtn.disabled) return
                var name = addressNameInput.value.trim()
                var city = addressCityInput.value.trim()
                var street = addressStreetInput.value.trim()
                var house = addressHouseInput.value.trim()
                var block = addressBlockInput.value.trim()
                var entrance = addressEntranceInput.value.trim()
                var floor = addressFloorInput.value.trim()
                var apartment = addressApartmentInput.value.trim()
                var comment = addressCommentInput.value.trim()

                var allValid = true
                addressValidators.forEach(function (item) {
                    var val = item.el.value.trim()
                    if (item.optional && !val) return
                    if (!val || !item.fn(val)) {
                        item.el.classList.add('is-invalid')
                        if (item.err && !val) item.err.classList.remove('visible')
                        if (item.err && val) item.err.classList.add('visible')
                        allValid = false
                    }
                })
                if (!allValid) return

                    addressPopupBtn.disabled = true
                    addressPopupBtn.classList.add('is-loading')
                    setTimeout(function () {
                        addressPopupBtn.classList.remove('is-loading')
                        if (addressPopupDefault.checked) {
                            document.querySelectorAll('.js-address-fav').forEach(function (b) { b.classList.remove('is-active') })
                        }
                        if (isNew) {
                            var newCard = createAddressCard(name, city, street, house, block, entrance, floor, apartment, comment, addressPopupDefault.checked)
                            document.querySelector('.account-addresses').appendChild(newCard)
                        } else {
                            var fields = card.querySelectorAll('.account-field')
                            fields[0].querySelector('.account-field__value').textContent = name
                            var addrEl = fields[1].querySelector('.account-field__value')
                            addrEl.textContent = buildAddress(city, street, house, block, entrance, floor, apartment, comment)
                            var commentEl = fields[2].querySelector('.account-field__value')
                            commentEl.textContent = comment || '—'
                            var favBtn = card.querySelector('.js-address-fav')
                            if (favBtn && addressPopupDefault.checked) favBtn.classList.add('is-active')
                        }
                    closeAddressPopup()
                    showToast(isNew ? 'Адрес добавлен' : 'Адрес сохранён', 'success')
                }, 800)
            }

            function onKeydown(e) {
                if (e.key === 'Enter') onSave()
            }

            addressPopupBtn.addEventListener('click', onSave)
            addressNameInput.addEventListener('keydown', onKeydown)
            addressCityInput.addEventListener('keydown', onKeydown)
            addressStreetInput.addEventListener('keydown', onKeydown)
            addressHouseInput.addEventListener('keydown', onKeydown)
            addressApartmentInput.addEventListener('keydown', onKeydown)

            addressPopup._cleanup = function () {
                addressPopupBtn.removeEventListener('click', onSave)
                addressNameInput.removeEventListener('keydown', onKeydown)
                addressCityInput.removeEventListener('keydown', onKeydown)
                addressStreetInput.removeEventListener('keydown', onKeydown)
                addressHouseInput.removeEventListener('keydown', onKeydown)
                addressApartmentInput.removeEventListener('keydown', onKeydown)
                inputHandlers.forEach(function (h) {
                    h.el.removeEventListener('input', h.handler)
                })
                Object.keys(digitHandlers).forEach(function (id) {
                    var el = document.getElementById(id)
                    if (el) el.removeEventListener('input', digitHandlers[id])
                })
            }
        }

        function closeAddressPopup() {
            addressPopup.classList.remove('popup--open')
            if (addressPopup._cleanup) addressPopup._cleanup()
        }

        document.getElementById('addressPopupClose').addEventListener('click', closeAddressPopup)
        addressPopup.addEventListener('click', function (e) {
            if (e.target === addressPopup) closeAddressPopup()
        })
    }

	function parseAddress(str) {
		var parts = { city: '', street: '', house: '', block: '', entrance: '', floor: '', apartment: '', comment: '' }
		if (!str) return parts
		var cityMatch = str.match(/^г\.\s*([^,]+)/)
		if (cityMatch) parts.city = cityMatch[1].trim()
		var streetMatch = str.match(/ул\.\s*([^,]+)/)
		if (streetMatch) parts.street = 'ул. ' + streetMatch[1].trim()
		var houseMatch = str.match(/д\.\s*([^,\s]+)/)
		if (houseMatch) parts.house = houseMatch[1].trim()
		var blockMatch = str.match(/корп\.\s*([^,\s]+)/)
		if (blockMatch) parts.block = blockMatch[1].trim()
		var entranceMatch = str.match(/(\d+)\s*подъезд/)
		if (entranceMatch) parts.entrance = entranceMatch[1].trim()
		var floorMatch = str.match(/(\d+)\s*этаж/)
		if (floorMatch) parts.floor = floorMatch[1].trim()
		var apartmentMatch = str.match(/кв\.\s*([^,\s]+)/)
		if (apartmentMatch) parts.apartment = apartmentMatch[1].trim()
		return parts
	}

    function buildAddress(city, street, house, block, entrance, floor, apartment, comment) {
        var addr = 'г. ' + city + ', ' + street + ', д. ' + house
        if (block) addr += ', корп. ' + block
        if (entrance) addr += ', ' + entrance + ' подъезд'
        if (floor) addr += ', ' + floor + ' этаж'
        if (apartment) addr += ', кв. ' + apartment
        return addr
    }

    function createAddressCard(label, city, street, house, block, entrance, floor, apartment, comment, isDefault) {
        var div = document.createElement('div')
        div.className = 'account-card'
        div.innerHTML =
            '<div class="account-card__body">' +
                '<div class="account-card__actions">' +
                    '<button class="account-card__action js-address-fav' + (isDefault ? ' is-active' : '') + '" aria-label="Основной адрес">' +
                        '<svg width="13" height="13" viewBox="0 0 13 13" fill="none">' +
                            '<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 4.09377C12.5 8.38677 6.50025 12 6.50025 12C6.50025 12 0.5 8.33335 0.5 4.10247C0.5 2.37502 1.83333 1.00002 3.5 1.00002C5.16667 1.00002 6.5 3.06252 6.5 3.06252C6.5 3.06252 7.83333 1.00002 9.5 1.00002C11.1667 1.00002 12.5 2.37502 12.5 4.09377Z" fill="#212121" fill-opacity="0.2"/>' +
                        '</svg>' +
                    '</button>' +
                    '<button class="account-card__action js-address-edit" aria-label="Редактировать">' +
                        '<svg width="13" height="13" viewBox="0 0 13 13" fill="none">' +
                            '<path d="M6.64615 3.53089L1 9.17696V12L3.82307 12L9.46922 6.35392M6.64615 3.53089L8.67074 1.50631L8.67196 1.50511C8.95065 1.22642 9.09025 1.08683 9.25116 1.03454C9.39291 0.988486 9.54562 0.988486 9.68736 1.03454C9.84817 1.08679 9.9876 1.22622 10.2659 1.50452L11.4938 2.7324C11.7733 3.01189 11.9131 3.1517 11.9655 3.31285C12.0115 3.45459 12.0115 3.60728 11.9655 3.74903C11.9131 3.91006 11.7735 4.04966 11.4944 4.32875L11.4938 4.32935L9.46922 6.35392M6.64615 3.53089L9.46922 6.35392" stroke="#212121" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>' +
                        '</svg>' +
                    '</button>' +
                    '<button class="account-card__action" aria-label="Удалить">' +
                        '<svg width="13" height="13" viewBox="0 0 13 13" fill="none">' +
                            '<path d="M7.625 5.27778V9.55556M5.375 5.27778V9.55556M3.125 2.83333V10.0444C3.125 10.729 3.125 11.071 3.24762 11.3324C3.35548 11.5624 3.52745 11.7497 3.73914 11.8669C3.97955 12 4.29443 12 4.92326 12H8.07674C8.70557 12 9.01999 12 9.26041 11.8669C9.47209 11.7497 9.64464 11.5624 9.7525 11.3324C9.875 11.0712 9.875 10.7295 9.875 10.0463V2.83333M3.125 2.83333H4.25M3.125 2.83333H2M4.25 2.83333H8.75M4.25 2.83333C4.25 2.26385 4.25 1.97925 4.33564 1.75464C4.44982 1.45516 4.66868 1.21708 4.94434 1.09304C5.15108 1 5.41332 1 5.9375 1H7.0625C7.58668 1 7.84878 1 8.05552 1.09304C8.33118 1.21708 8.55013 1.45516 8.66431 1.75464C8.74994 1.97925 8.75 2.26385 8.75 2.83333M8.75 2.83333H9.875M9.875 2.83333H11" stroke="#212121" stroke-width="0.8" stroke-linejoin="round"/>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +
		'<div class="account-field"><span class="account-field__label">Название:</span><span class="account-field__value">' + escapeHtml(label) + '</span></div>' +
				'<div class="account-field"><span class="account-field__label">Адрес:</span><span class="account-field__value">' + escapeHtml(buildAddress(city, street, house, block, entrance, floor, apartment, comment)) + '</span></div>' +
				'<div class="account-field"><span class="account-field__label">Комментарий:</span><span class="account-field__value">' + (comment ? escapeHtml(comment) : '—') + '</span></div>' +
            '</div>'
        return div
    }

    function escapeHtml(str) {
        var div = document.createElement('div')
        div.appendChild(document.createTextNode(str))
        return div.innerHTML
    }

    // ===== ADDRESS ADD / EDIT BUTTONS =====
    var addAddressBtn = document.querySelector('.account-add-btn')
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function () {
            openAddressPopup(null, true)
        })
    }

    var addressEditBtns = document.querySelectorAll('.js-address-edit')
    if (addressEditBtns.length) {
        addressEditBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var card = this.closest('.account-card')
                openAddressPopup(card, false)
            })
        })
    }

    // ===== ESC key — close popups =====
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (smsPopup && smsPopup.classList.contains('popup--open')) closeSmsPopup()
            if (emailPopup && emailPopup.classList.contains('popup--open')) closeEmailPopup()
            if (profilePopup && profilePopup.classList.contains('popup--open')) closeProfilePopup()
            if (addressPopup && addressPopup.classList.contains('popup--open')) closeAddressPopup()
        }
    })

    // ===== EDIT BUTTONS → popup =====
    var editBtns = document.querySelectorAll('.nl-row__edit')
    if (editBtns.length) {
        editBtns.forEach(function (editBtn) {
            editBtn.addEventListener('click', function () {
                var row = this.closest('.nl-row')
                var phoneSpan = row.querySelector('.nl-row__phone')
                var label = row.querySelector('.nl-row__label')
                var isEmail = label && label.textContent.trim().indexOf('E-mail') === 0
                var currentValue = phoneSpan.textContent

                if (isEmail) {
                    openEmailPopup(currentValue, phoneSpan, row)
                } else {
                    openSmsPopup(currentValue, phoneSpan, row)
                }
            })
        })
    }

    // ===== NEWSLETTER SUBSCRIPTION FORM =====
    var nlForm = document.querySelector('.nl-form')
    if (nlForm) {
        var nlInput = nlForm.querySelector('.nl-form__input')
        var nlError = nlForm.querySelector('.nl-form__error')
        var nlCheckbox = nlForm.querySelector('.checkbox input[type="checkbox"]')

        function clearNlState() {
            if (nlInput) nlInput.classList.remove('is-invalid', 'nl-form__input--success')
            if (nlError) nlError.classList.remove('visible')
        }

        if (nlInput && nlError) {
            nlInput.addEventListener('input', clearNlState)
            nlInput.addEventListener('blur', function () {
                if (!nlInput.value.trim()) return
                if (!FormUtils.test(nlInput.value.trim(), 'valid_email')) {
                    nlInput.classList.add('is-invalid')
                    nlError.textContent = 'Введите корректный e-mail'
                    nlError.classList.add('visible')
                } else {
                    nlInput.classList.remove('is-invalid')
                    nlInput.classList.add('nl-form__input--success')
                    nlError.classList.remove('visible')
                }
            })
        }

        if (nlCheckbox) {
            nlCheckbox.addEventListener('change', function () {
                this.closest('.checkbox').classList.remove('is-invalid')
            })
        }

        nlForm.addEventListener('submit', function (e) {
            e.preventDefault()
            clearNlState()
            if (nlCheckbox) nlCheckbox.closest('.checkbox').classList.remove('is-invalid')

            var email = nlInput ? nlInput.value.trim() : ''

            if (nlCheckbox && !nlCheckbox.checked) {
                nlCheckbox.closest('.checkbox').classList.add('is-invalid')
                return
            }

            if (!FormUtils.test(email, 'required')) {
                nlInput.classList.add('is-invalid')
                nlError.textContent = 'Введите e-mail'
                nlError.classList.add('visible')
                return
            }

            if (!FormUtils.test(email, 'valid_email')) {
                nlInput.classList.add('is-invalid')
                nlError.textContent = 'Введите корректный e-mail'
                nlError.classList.add('visible')
                return
            }

            var submitBtn = nlForm.querySelector('.btn-primary')
            submitBtn.classList.add('is-loading')
            setTimeout(function () {
                submitBtn.classList.remove('is-loading')
                showToast('Вы подписались на рассылку', 'success')
            }, 1200)
        })
    }

    // ===== LOGOUT MODAL =====
    var overlay = document.getElementById('logoutModal');
    if (overlay) {
        var modal = overlay.querySelector('.logout-modal');
        var confirmBtn = overlay.querySelector('.logout-modal__confirm');
        var cancelBtn = overlay.querySelector('.logout-modal__cancel');
        var closeBtn = overlay.querySelector('.logout-modal__close');
        var trigger = document.querySelector('.account-nav__link--logout');

        function openModal() {
            overlay.classList.add('logout-overlay--visible');
            overlay.classList.remove('logout-overlay--hidden');
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(function () {
                modal.classList.add('logout-modal--visible');
            });
        }

        function closeModal() {
            modal.classList.remove('logout-modal--visible');
            overlay.classList.add('logout-overlay--hidden');
            document.body.style.overflow = '';
            setTimeout(function () {
                overlay.classList.remove('logout-overlay--visible');
            }, 300);
        }

        if (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                window.location.href = 'index.html';
            });
        }

        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('logout-overlay--visible')) closeModal();
        });
    }

    // ===== ORDER GALLERY SWIPER (dashboard) =====
    var orderGalleries = document.querySelectorAll('.js-order-gallery')
    if (orderGalleries.length) {
        orderGalleries.forEach(function (el) {
            if (el.querySelectorAll('.swiper-slide').length < 2) return
            if (!el._galleryClickGuard) {
                el._galleryClickGuard = true
                el.addEventListener('click', function (e) {
                    if (el.swiper && el.swiper.touches.diff !== 0) e.preventDefault()
                })
            }
            el.swiper = new Swiper(el, {
                slidesPerView: 3,
                spaceBetween: 6,
                speed: 400,
                simulateTouch: true,
                navigation: {
                    nextEl: el.querySelector('.js-gallery-next'),
                    prevEl: el.querySelector('.js-gallery-prev'),
                },
            })
        })
    }
})
