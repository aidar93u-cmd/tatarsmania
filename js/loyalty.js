var loyaltyHistoryEl = document.querySelector('.loyalty-history-swiper')
if (loyaltyHistoryEl) {
    var loyaltyTabs = loyaltyHistoryEl.querySelectorAll('.loyalty-history__tab')
    var loyaltySwiper = new Swiper(loyaltyHistoryEl, {
        slidesPerView: 1,
        speed: 600,
        navigation: {
            prevEl: '.loyalty-history__arrow--prev',
            nextEl: '.loyalty-history__arrow--next',
        },
        on: {
            slideChange: function () {
                loyaltyTabs.forEach(function (tab, i) {
                    tab.classList.toggle(
                        'loyalty-history__tab--active',
                        i === loyaltySwiper.activeIndex,
                    )
                })
            },
        },
    })
    loyaltyTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            loyaltySwiper.slideTo(parseInt(tab.getAttribute('data-slide')))
        })
    })
}
