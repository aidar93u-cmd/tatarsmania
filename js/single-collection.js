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
  var otherSwiper = new Swiper('.single-collection-other__swiper', {
    slidesPerView: 4,
    spaceBetween: 16,
    speed: 600,
    navigation: {
      prevEl: '.single-collection-other__arrow--prev',
      nextEl: '.single-collection-other__arrow--next',
    },
    pagination: {
      el: '.single-collection-other__dots',
      clickable: true,
      bulletClass: 'single-collection-other__dot',
      bulletActiveClass: 'single-collection-other__dot--active',
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
  });
});
