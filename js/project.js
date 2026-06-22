document.addEventListener('DOMContentLoaded', function () {

  // ===== PROJECT GALLERY SLIDER =====
  var sliderEl = document.querySelector('.project-slider__swiper');
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
        prevEl: '.project-slider__btn--prev',
        nextEl: '.project-slider__btn--next',
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
      var bars = document.querySelectorAll('.project-slider__progress-bar');
      var realIndex = swiper.realIndex;
      bars.forEach(function (bar, i) {
        if (i === realIndex) {
          bar.classList.add('project-slider__progress-bar--active');
        } else {
          bar.classList.remove('project-slider__progress-bar--active');
        }
      });
    }

    document.querySelectorAll('.project-slider__progress-bar').forEach(function (bar, index) {
      bar.addEventListener('click', function () {
        projectSwiper.slideToLoop(index);
      });
    });
  }

  // ===== OTHER MODELS SWIPER =====
  var modelsEl = document.querySelector('.project-other-models__swiper');
  if (modelsEl) {
    new Swiper(modelsEl, {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 16,
      pagination: {
        el: '.project-other-models__pagination',
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        prevEl: '.project-other-models__arrow--prev',
        nextEl: '.project-other-models__arrow--next',
      },
      breakpoints: {
        769: { slidesPerView: 4 },
        0: { slidesPerView: 1.2, slidesPerGroup: 1 },
      },
    });
  }

  // ===== OTHER PROJECTS SWIPER =====
  var projectsEl = document.querySelector('.other-projects__swiper');
  if (projectsEl) {
    new Swiper(projectsEl, {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 6,
      navigation: {
        prevEl: '.other-projects__arrow--prev',
        nextEl: '.other-projects__arrow--next',
      },
      breakpoints: {
        769: { slidesPerView: 4 },
        0: { slidesPerView: 1.2, slidesPerGroup: 1 },
      },
    });
  }

});
