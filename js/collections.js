document.addEventListener('DOMContentLoaded', function () {

    var tabs = document.querySelectorAll('.collections-grid__tab')
    var cards = document.querySelectorAll('.collection-card')

    var hasCards = {}
    cards.forEach(function (card) {
        var name = card.querySelector('.collection-card__name')
        if (!name) return
        var letter = name.textContent.trim().charAt(0).toLowerCase()
        hasCards[letter] = true
    })

    tabs.forEach(function (tab) {
        var letter = tab.getAttribute('data-letter')
        if (letter !== 'all' && !hasCards[letter]) {
            tab.disabled = true
            tab.classList.add('collections-grid__tab--disabled')
        }
    })

    if (tabs.length && cards.length) {
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                if (tab.disabled) return
                tabs.forEach(function (t) {
                    t.classList.remove('collections-grid__tab--active')
                })
                tab.classList.add('collections-grid__tab--active')

                var letter = tab.getAttribute('data-letter')

                cards.forEach(function (card) {
                    var name = card.querySelector('.collection-card__name')
                    if (!name) return

                    if (letter === 'all') {
                        card.style.display = ''
                        return
                    }

                    var firstLetter = name.textContent.trim().charAt(0).toLowerCase()
                    card.style.display = firstLetter === letter ? '' : 'none'
                })
            })
        })
    }

})
