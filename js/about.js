$(function () {

    // ===== HISTORY SWIPER =====
    var historySwiperEl = document.querySelector('.about-history-swiper');
    if (historySwiperEl) {
        var tabs = historySwiperEl.querySelectorAll('.about-history__tab');
        var swiper = new Swiper(historySwiperEl, {
            slidesPerView: 1,
            speed: 600,
            navigation: {
                prevEl: '.about-history__arrow--prev',
                nextEl: '.about-history__arrow--next',
            },
            on: {
                slideChange: function () {
                    tabs.forEach(function (tab, i) {
                        tab.classList.toggle('about-history__tab--active', i === swiper.activeIndex);
                    });
                },
            },
        });

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                swiper.slideTo(parseInt(tab.getAttribute('data-slide')));
            });
        });
    }

});
