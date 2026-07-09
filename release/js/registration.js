;(function () {
    /* ===== Helpers ===== */

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
        if (el && errEl) {
            el.classList.remove('reg-popup__input--error', 'reg-popup__input--success')
            errEl.classList.remove('reg-popup__error--visible')
        }
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

    /* ===== Exposed validation functions ===== */

    window.regValidatePhone = function () {
        var v = fieldVal(phoneInput)
        if (!v) { clearState(phoneInput, phoneError); return false }
        var digits = v.replace(/\D/g, '')
        if (digits.length < 11) {
            setError(phoneInput, phoneError, 'Некорректный номер телефона')
            return false
        }
        setSuccess(phoneInput, phoneError)
        return true
    }

    window.regClearPhoneError = function () {
        clearState(phoneInput, phoneError)
    }

    window.regShowPhoneError = function () {
        setError(phoneInput, phoneError, 'Некорректный номер телефона')
    }

    window.regValidateName = function () {
        var v = fieldVal(nameInput)
        if (!FormUtils.test(v, 'required')) { setError(nameInput, nameError, 'Введите имя'); return false }
        if (!FormUtils.test(v, 'min_length[2]')) { setError(nameInput, nameError, 'Неправильное Имя'); return false }
        if (!FormUtils.test(v, 'rus_alpha')) { setError(nameInput, nameError, 'Неправильное Имя '); return false }
        setSuccess(nameInput, nameError)
        return true
    }

    window.regClearNameError = function () {
        clearState(nameInput, nameError)
    }

    window.regValidateSurname = function () {
        var v = fieldVal(surnameInput)
        if (!FormUtils.test(v, 'required')) { setError(surnameInput, surnameError, 'Введите фамилию'); return false }
        if (!FormUtils.test(v, 'min_length[2]')) { setError(surnameInput, surnameError, 'Неправильная Фамилия'); return false }
        if (!FormUtils.test(v, 'rus_alpha')) { setError(surnameInput, surnameError, 'Неправильная Фамилия'); return false }
        setSuccess(surnameInput, surnameError)
        return true
    }

    window.regClearSurnameError = function () {
        clearState(surnameInput, surnameError)
    }

    window.regValidateEmail = function () {
        var v = fieldVal(emailInput)
        if (!v) {
            clearState(emailInput, emailError)
            return true
        }
        if (!FormUtils.test(v, 'valid_email')) {
            setError(emailInput, emailError, 'Некорректный email')
            return false
        }
        setSuccess(emailInput, emailError)
        return true
    }

    window.regClearEmailError = function () {
        clearState(emailInput, emailError)
    }

    window.regClearStep3Errors = function () {
        clearState(nameInput, nameError)
        clearState(surnameInput, surnameError)
        clearState(emailInput, emailError)
    }

    /* ===== Real-time blur validation ===== */

    if (phoneInput) {
        phoneInput.addEventListener('blur', window.regValidatePhone)
        phoneInput.addEventListener('input', window.regClearPhoneError)
    }
    if (nameInput) {
        nameInput.addEventListener('blur', window.regValidateName)
        nameInput.addEventListener('input', window.regClearNameError)
    }
    if (surnameInput) {
        surnameInput.addEventListener('blur', window.regValidateSurname)
        surnameInput.addEventListener('input', window.regClearSurnameError)
    }
    if (emailInput) {
        emailInput.addEventListener('blur', window.regValidateEmail)
        emailInput.addEventListener('input', window.regClearEmailError)
    }

})()
