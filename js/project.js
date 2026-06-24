document.addEventListener('DOMContentLoaded', function () {

  // ===== PROJECT GALLERY SLIDER =====
  var sliderEl = document.querySelector('.media-slider__swiper');
  if (sliderEl) {
    var projectSwiper = new Swiper(sliderEl, {
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
          updateProjectProgress(this);
        },
        slideChange: function () {
          updateProjectProgress(this);
        },
      },
    });

    function updateProjectProgress(swiper) {
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
        projectSwiper.slideToLoop(index);
      });
    });
  }

});
