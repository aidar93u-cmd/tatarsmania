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
})()
