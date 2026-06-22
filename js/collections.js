document.addEventListener('DOMContentLoaded', function () {

    var tabs = document.querySelectorAll('.collections-grid__tab')
    var cards = document.querySelectorAll('.collection-card')
    var grid = document.getElementById('collectionsGrid')

    /* Store original order for "default" sort */
    var originalOrder = []
    cards.forEach(function (card) { originalOrder.push(card) })

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

    /* ===== SORT DROPDOWN ===== */
    var sortTrigger = document.querySelector('.collections-grid__sort-trigger')
    var sortContainer = document.querySelector('.collections-grid__sort')

    if (sortTrigger) {
        sortTrigger.addEventListener('click', function (e) {
            e.stopPropagation()
            sortContainer.classList.toggle('active')
        })
        document.addEventListener('click', function () {
            sortContainer.classList.remove('active')
        })
    }

    /* ===== SORT LOGIC ===== */
    function sortCollections(sortKey) {
        var arr = Array.from(grid.children)
        var sorted

        switch (sortKey) {
            case 'alphabet-az':
                sorted = arr.sort(function (a, b) {
                    var na = a.querySelector('.collection-card__name')
                    var nb = b.querySelector('.collection-card__name')
                    return (na ? na.textContent.trim() : '').localeCompare(nb ? nb.textContent.trim() : '')
                })
                break
            case 'alphabet-za':
                sorted = arr.sort(function (a, b) {
                    var na = a.querySelector('.collection-card__name')
                    var nb = b.querySelector('.collection-card__name')
                    return (nb ? nb.textContent.trim() : '').localeCompare(na ? na.textContent.trim() : '')
                })
                break
            case 'default':
            default:
                sorted = originalOrder.filter(function (el) { return el.parentNode === grid })
                break
        }

        sorted.forEach(function (el) {
            grid.appendChild(el)
        })
    }

    function onSortSelect(sortKey, label, triggerEl) {
        document.querySelectorAll('.collections-grid__sort-option').forEach(function (o) {
            o.classList.remove('active')
        })
        if (triggerEl) triggerEl.classList.add('active')
        sortCollections(sortKey)
        sortContainer.classList.remove('active')
        sortTrigger.querySelector('span').textContent = label
    }

    document.addEventListener('click', function (e) {
        var option = e.target.closest('.collections-grid__sort-option')
        if (!option) return
        e.preventDefault()
        var sortKey = option.getAttribute('data-sort')
        var label = option.textContent.trim()
        onSortSelect(sortKey, label, option)
    })

    var pages = document.querySelectorAll('.collections-grid__page:not(.collections-grid__page--disabled)')

    pages.forEach(function (page) {
        page.addEventListener('click', function () {
            pages.forEach(function (p) {
                p.classList.remove('collections-grid__page--current')
            })
            page.classList.add('collections-grid__page--current')
        })
    })

    document.querySelectorAll('.carousel-section.hits').forEach(function (section) {
        var swiperEl = section.querySelector('.carousel-section__swiper')
        if (swiperEl) {
            new Swiper(swiperEl, {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 16,
                pagination: {
                    el: section.querySelector('.carousel-section__pagination'),
                    type: 'bullets',
                    bulletClass: 'carousel-section__dot',
                    bulletActiveClass: 'carousel-section__dot--active',
                    clickable: true,
                },
                navigation: {
                    prevEl: section.querySelector('.carousel-section__arrow--prev'),
                    nextEl: section.querySelector('.carousel-section__arrow--next'),
                },
                breakpoints: {
                    769: { slidesPerView: 4 },
                    0: { slidesPerView: 1.2, slidesPerGroup: 1 },
                },
            })
        }
    })

})
