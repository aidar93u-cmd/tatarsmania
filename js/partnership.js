(function () {
    'use strict'

    // ===== Hits Swiper =====
    if (document.querySelector('.hits-swiper')) {
        new Swiper('.hits-swiper', {
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: 16,
            pagination: {
                el: '.hits__pagination',
                type: 'bullets',
                clickable: true,
            },
            navigation: {
                prevEl: '.product-other__arrow--prev',
                nextEl: '.product-other__arrow--next',
            },
            breakpoints: {
                769: { slidesPerView: 4 },
                0: { slidesPerView: 1.2, slidesPerGroup: 1 },
            },
        })
    }

})()
