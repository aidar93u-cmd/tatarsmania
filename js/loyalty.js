$(function () {

    // ===== HISTORY SWIPER =====
    var historySwiperEl = document.querySelector('.loyalty-history-swiper');
    if (historySwiperEl) {
        new Swiper(historySwiperEl, {
            slidesPerView: 1,
            speed: 600,
            navigation: {
                prevEl: '.loyalty-history__arrow--prev',
                nextEl: '.loyalty-history__arrow--next',
            },
        });
    }

});
