$(function () {

    // ===== HISTORY SWIPER =====
    var historySwiperEl = document.querySelector('.about-history-swiper');
    if (historySwiperEl) {
        new Swiper(historySwiperEl, {
            slidesPerView: 1,
            speed: 600,
            navigation: {
                prevEl: '.about-history__arrow--prev',
                nextEl: '.about-history__arrow--next',
            },
        });
    }

    // ===== REVIEWS SWIPER =====
    var reviewsSwiperEl = document.querySelector('.about-reviews-swiper');
    if (reviewsSwiperEl) {
        new Swiper(reviewsSwiperEl, {
            slidesPerView: 3,
            spaceBetween: 6,
            speed: 600,
            navigation: {
                prevEl: '.about-reviews__arrow--prev',
                nextEl: '.about-reviews__arrow--next',
            },
            pagination: {
                el: '.about-reviews__pagination',
                clickable: true,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                },
            },
        });
    }

});
