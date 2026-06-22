(function () {
    'use strict'

    // ===== Accordion Toggle =====
    var accordionHeaders = document.querySelectorAll('.partnership-accordion__header')
    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var accordion = this.closest('.partnership-accordion')
            if (accordion) {
                accordion.classList.toggle('partnership-accordion--open')
            }
        })
    })

    // ===== Partners Swiper =====
    if (document.querySelector('.partners-swiper')) {
        new Swiper('.partners-swiper', {
            slidesPerView: 5,
            slidesPerGroup: 1,
            spaceBetween: 6,
            speed: 600,
            loop: true,
            pagination: {
                el: '.designers-partners__pagination',
                type: 'bullets',
                clickable: true,
            },
            navigation: {
                prevEl: '.designers-partners__arrows .designers__arrow--prev',
                nextEl: '.designers-partners__arrows .designers__arrow--next',
            },
            breakpoints: {
                993: { slidesPerView: 5 },
                769: { slidesPerView: 3 },
                0: { slidesPerView: 1.3, slidesPerGroup: 1 },
            },
        })
    }

    // ===== Projects Swiper =====
    if (document.querySelector('.projects-swiper')) {
        new Swiper('.projects-swiper', {
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: 6,
            speed: 600,
            loop: true,
            pagination: {
                el: '.designers-projects__pagination',
                type: 'bullets',
                clickable: true,
            },
            navigation: {
                prevEl: '.designers-projects__arrows .designers__arrow--prev',
                nextEl: '.designers-projects__arrows .designers__arrow--next',
            },
            breakpoints: {
                993: { slidesPerView: 4 },
                769: { slidesPerView: 2 },
                0: { slidesPerView: 1.3, slidesPerGroup: 1 },
            },
        })
    }

})()
