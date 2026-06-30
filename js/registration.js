;(function () {
    if (!window.FormValidator) return

    /* ===== Real-time validation helpers ===== */

    function fieldVal(el) { return el ? el.value.trim() : '' }

    function setError(el, errEl, msg) {
        if (el) el.classList.remove('reg-popup__input--success')
        if (el) el.classList.add('reg-popup__input--error')
        if (errEl) { errEl.textContent = msg; errEl.classList.add('reg-popup__error--visible') }
    }

    function setSuccess(el, errEl) {
        if (el) el.classList.remove('reg-popup__input--error')
        if (el) el.classList.add('reg-popup__input--success')
        if (errEl) errEl.classList.remove('reg-popup__error--visible')
    }

    function clearState(el, errEl) {
        if (el) el.classList.remove('reg-popup__input--error', 'reg-popup__input--success')
        if (errEl) errEl.classList.remove('reg-popup__error--visible')
    }

    /* ===== Fields ===== */

    var phoneInput = document.getElementById('regPhone')
    var phoneError = document.getElementById('regPhoneError')
    var nameInput = document.getElementById('regName')
    var nameError = document.getElementById('regNameError')
    var surnameInput = document.getElementById('regSurname')
    var surnameError = document.getElementById('regSurnameError')
    var emailInput = document.getElementById('regEmail')
    var emailError = document.getElementById('regEmailError')
    var step1Next = document.getElementById('regStep1Next')
    var step3Submit = document.getElementById('regStep3Submit')

    /* ===== Phone validation (step 1) ===== */

    function validatePhone() {
        var v = fieldVal(phoneInput)
        if (!v) { clearState(phoneInput, phoneError); return false }
        var digits = v.replace(/\D/g, '')
        if (digits.length < 11) {
            setError(phoneInput, phoneError, 'Введите корректный номер телефона, например +7 (999) 123-45-67')
            return false
        }
        var known = localStorage.getItem('reg_user_' + digits)
        setSuccess(phoneInput, phoneError)
        return true
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', validatePhone)
        phoneInput.addEventListener('input', function () {
            clearState(phoneInput, phoneError)
        })
    }

    /* ===== Name validation (step 3) ===== */

    function validateName() {
        var v = fieldVal(nameInput)
        if (!FormUtils.test(v, 'required')) { setError(nameInput, nameError, 'Введите имя'); return false }
        if (!FormUtils.test(v, 'min_length[2]')) { setError(nameInput, nameError, 'Имя должно содержать минимум 2 символа'); return false }
        if (!FormUtils.test(v, 'rus_alpha')) { setError(nameInput, nameError, 'Имя может содержать только буквы'); return false }
        setSuccess(nameInput, nameError)
        return true
    }

    if (nameInput) {
        nameInput.addEventListener('blur', validateName)
        nameInput.addEventListener('input', function () {
            clearState(nameInput, nameError)
            if (FormUtils.test(this.value.trim(), 'min_length[2]|rus_alpha')) setSuccess(nameInput, nameError)
        })
    }

    /* ===== Surname validation (step 3) ===== */

    function validateSurname() {
        var v = fieldVal(surnameInput)
        if (!FormUtils.test(v, 'required')) { setError(surnameInput, surnameError, 'Введите фамилию'); return false }
        if (!FormUtils.test(v, 'min_length[2]')) { setError(surnameInput, surnameError, 'Фамилия должна содержать минимум 2 символа'); return false }
        if (!FormUtils.test(v, 'rus_alpha')) { setError(surnameInput, surnameError, 'Фамилия может содержать только буквы'); return false }
        setSuccess(surnameInput, surnameError)
        return true
    }

    if (surnameInput) {
        surnameInput.addEventListener('blur', validateSurname)
        surnameInput.addEventListener('input', function () {
            clearState(surnameInput, surnameError)
            if (FormUtils.test(this.value.trim(), 'min_length[2]|rus_alpha')) setSuccess(surnameInput, surnameError)
        })
    }

    /* ===== Email validation (step 3) — using validate.js ===== */

    function validateEmail() {
        var v = fieldVal(emailInput)
        if (!v) {
            clearState(emailInput, emailError)
            return true
        }
        if (!FormUtils.test(v, 'valid_email')) {
            setError(emailInput, emailError, 'Введите корректный email, например name@domain.com')
            return false
        }
        setSuccess(emailInput, emailError)
        return true
    }

    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail)
        emailInput.addEventListener('input', function () {
            clearState(emailInput, emailError)
        })
    }

    /* ===== Step 1 submit guard ===== */

    function onStep1Next(e) {
        if (!validatePhone()) {
            e.stopImmediatePropagation()
            return
        }
        var consent = document.querySelector('[data-step="1"] .reg-popup__checkbox input[type="checkbox"]')
        if (!consent || !consent.checked) {
            if (consent) consent.closest('.reg-popup__checkbox').classList.add('is-invalid')
            e.stopImmediatePropagation()
        }
    }

    if (step1Next) {
        step1Next.addEventListener('click', onStep1Next)
    }

    /* ===== Step 3 submit guard ===== */

    function onStep3Submit(e) {
        var ok = true
        if (!validateName()) ok = false
        if (!validateSurname()) ok = false
        if (!validateEmail()) ok = false
        var consent3 = document.querySelector('[data-step="3"] .reg-popup__checkbox input[type="checkbox"]')
        if (!consent3 || !consent3.checked) {
            if (consent3) consent3.closest('.reg-popup__checkbox').classList.add('is-invalid')
            ok = false
        }
        if (!ok) e.stopImmediatePropagation()
    }

    if (step3Submit) {
        step3Submit.addEventListener('click', onStep3Submit)
    }

})()
