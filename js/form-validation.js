/* ===== FormUtils (validate.js wrapper) =====
 * Обёртка правил validate.js: кастомные хуки rus_alpha/phone/valid_email + FormUtils.test().
 * Зависимость: js/lib/validate.min.js (window.FormValidator) — грузится раньше.
 */
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
    hooks.valid_email = function (field) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field.value)
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
})()

/* ===== Form Validation (shared: form.js-validate-form) =====
 * Единая валидация форм. Поля: `[data-validate]` (правила validate.js через FormUtils.test),
 * текст ошибки `data-error`, контейнер — span.form-error под полем (автосоздаётся модулем).
 * Поведение: ошибки — только после первого submit; далее live по вводу.
 * Нет обводок, нет зелёного success; чекбокс-согласие — только красная рамка маркера.
 * API: FormValidation.validate(form), FormValidation.reset(form), FormValidation.destroy(form).
 * ВНИМАНИЕ: window.FormValidator занят validate.js — не переопределять.
 */
;(function () {
    function isCheckbox (el) { return el.type === 'checkbox' }
    function rulesOf (el) {
        return (el.getAttribute('data-validate') || '').split('|').map(function (s) { return s.trim() }).filter(Boolean)
    }
    function isOptional (el) { return el.hasAttribute('data-optional') }
    function valueEmpty (el) { return !el.value || !el.value.trim() }

    function errorMsg (el) {
        var custom = el.getAttribute('data-error')
        if (custom) return custom
        var rules = rulesOf(el)
        if (rules.indexOf('valid_email') !== -1) return 'Введите корректный e-mail'
        if (rules.indexOf('phone') !== -1) return 'Введите корректный номер телефона'
        return 'Заполните поле'
    }

    function fieldWrap (el) {
        if (el._fvWrap) return el._fvWrap
        var p = el.parentNode
        if (p && p.classList && p.classList.contains('form-error__wrap')) {
            el._fvWrap = p
            return p
        }
        var wrap = document.createElement('div')
        wrap.className = 'form-error__wrap'
        p.insertBefore(wrap, el)
        wrap.appendChild(el)
        el._fvWrap = wrap
        return wrap
    }

    function errSpan (el) {
        if (el._fvErr) return el._fvErr
        var wrap = fieldWrap(el)
        var existing = wrap.querySelector('.form-error')
        if (existing) {
            el._fvErr = existing
            return existing
        }
        var span = document.createElement('span')
        span.className = 'form-error'
        wrap.appendChild(span)
        el._fvErr = span
        return span
    }

    function cbWrap (el) { return el.closest('.checkbox') }

    // Валиден ли текущий ввод поля (без показа ошибки).
    function checkField (el) {
        if (isCheckbox(el)) return el.checked
        var optional = isOptional(el)
        var empty = valueEmpty(el)
        if (empty) return optional
        var ruleStr = rulesOf(el).join('|')
        return !ruleStr || FormUtils.test(el.value, ruleStr)
    }

    // Показать/скрыть сообщения по всем полям формы.
    function applyVisualStatus (form) {
        form.querySelectorAll('[data-validate]').forEach(function (el) {
            if (isCheckbox(el)) {
                var cw = cbWrap(el)
                if (cw) cw.classList.toggle('is-invalid', !el.checked)
            } else {
                var span = errSpan(el)
                if (!checkField(el)) {
                    span.textContent = errorMsg(el)
                    span.classList.add('visible')
                } else {
                    span.classList.remove('visible')
                }
            }
        })
    }

    function attach (form) {
        if (form._fvDone) return
        form._fvDone = true
        var fields = form.querySelectorAll('[data-validate]')

        fields.forEach(function (el) {
            var live = function () {
                if (!form._fvSubmitted) return
                if (isCheckbox(el)) {
                    var cw = cbWrap(el)
                    if (cw) cw.classList.toggle('is-invalid', !el.checked)
                    return
                }
                var span = errSpan(el)
                if (checkField(el)) {
                    span.classList.remove('visible')
                } else {
                    span.textContent = errorMsg(el)
                    span.classList.add('visible')
                }
            }
            el.addEventListener('input', live)
            if (isCheckbox(el)) el.addEventListener('change', live)
        })
    }

    function validate (form) {
        if (!form) return true
        if (!form._fvDone) attach(form)
        form._fvSubmitted = true
        applyVisualStatus(form)
        var ok = true
        form.querySelectorAll('[data-validate]').forEach(function (el) {
            if (!checkField(el)) ok = false
        })
        return ok
    }

    window.FormValidation = {
        validate: validate,
        reset: function (form) {
            if (!form) return
            form._fvSubmitted = false
            form.querySelectorAll('[data-validate]').forEach(function (el) {
                if (isCheckbox(el)) {
                    var cw = cbWrap(el)
                    if (cw) cw.classList.remove('is-invalid')
                } else if (el._fvErr) {
                    el._fvErr.classList.remove('visible')
                }
            })
        },
        destroy: function (form) {
            if (form) form._fvDone = false
        },
        init: function () {
            var forms = document.querySelectorAll('form.js-validate-form')
            forms.forEach(attach)
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        FormValidation.init()
    })
})()