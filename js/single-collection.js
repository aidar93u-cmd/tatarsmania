document.addEventListener('DOMContentLoaded', function () {

  // ===== HERO SLIDER =====
  var heroSwiper = new Swiper('.media-slider__swiper', {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
    },
    allowTouchMove: true,
    navigation: {
      prevEl: '.media-slider__btn--prev',
      nextEl: '.media-slider__btn--next',
    },
    on: {
      init: function () {
        updateProgress(this);
      },
      slideChange: function () {
        updateProgress(this);
      },
    },
  });

  function updateProgress(swiper) {
    var bars = document.querySelectorAll('.media-slider__progress-bar');
    var realIndex = swiper.realIndex;
    bars.forEach(function (bar, i) {
      if (i === realIndex) {
        bar.classList.add('media-slider__progress-bar--active');
      } else {
        bar.classList.remove('media-slider__progress-bar--active');
      }
    });
  }

  document.querySelectorAll('.media-slider__progress-bar').forEach(function (bar, index) {
    bar.addEventListener('click', function () {
      heroSwiper.slideToLoop(index);
    });
  });


  // ===== OTHER COLLECTIONS SWIPER =====
  document.querySelectorAll('.carousel-section.collections').forEach(function (section) {
    var swiperEl = section.querySelector('.carousel-section__swiper')
    if (swiperEl) {
      new Swiper(swiperEl, {
        slidesPerView: 4,
        spaceBetween: 16,
        speed: 600,
        navigation: {
          prevEl: section.querySelector('.carousel-section__arrow--prev'),
          nextEl: section.querySelector('.carousel-section__arrow--next'),
        },
        pagination: {
          el: section.querySelector('.carousel-section__pagination'),
          clickable: true,
          bulletClass: 'carousel-section__dot',
          bulletActiveClass: 'carousel-section__dot--active',
        },
        breakpoints: {
          320: {
            slidesPerView: 1.3,
            spaceBetween: 8,
          },
          769: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
        },
      })
    }
  })
});
