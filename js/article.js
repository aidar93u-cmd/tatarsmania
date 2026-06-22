document.addEventListener('DOMContentLoaded', function () {

  // ===== ARTICLE GALLERY SLIDER =====
  var sliderEl = document.querySelector('.media-slider__swiper');
  if (sliderEl) {
    var articleSwiper = new Swiper(sliderEl, {
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
          updateArticleProgress(this);
        },
        slideChange: function () {
          updateArticleProgress(this);
        },
      },
    });

    function updateArticleProgress(swiper) {
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
        articleSwiper.slideToLoop(index);
      });
    });
  }

  // ===== HITS SWIPER =====
  var hitsEl = document.querySelector('.hits-swiper');
  if (hitsEl) {
    new Swiper(hitsEl, {
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
    });
  }

});
