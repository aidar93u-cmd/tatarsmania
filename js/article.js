document.addEventListener('DOMContentLoaded', function () {

  // ===== PHOTO S SWIPER (mobile в‰¤768px) =====
  var photoSMedia = document.querySelector('.article-media--photo-s');
  var photoSGrid = photoSMedia ? photoSMedia.querySelector('.article-photo-s__grid') : null;
  var photoSSwiper = null;

  function initPhotoSSwiper() {
    if (window.innerWidth > 768 || !photoSGrid) return null;
    return new Swiper(photoSGrid, {
      slidesPerView: 1.2,
      spaceBetween: 6,
      speed: 600,
      navigation: {
        nextEl: photoSMedia.querySelector('.carousel-section__arrow--next'),
        prevEl: photoSMedia.querySelector('.carousel-section__arrow--prev'),
      },
      pagination: {
        el: photoSGrid.querySelector('.article-photo-s__pagination'),
        type: 'bullets',
        bulletClass: 'carousel-section__dot',
        bulletActiveClass: 'carousel-section__dot--active',
        clickable: true,
      },
    });
  }

  function destroyPhotoSSwiper() {
    if (photoSSwiper) {
      photoSSwiper.destroy(true, true);
      photoSSwiper = null;
    }
  }

  photoSSwiper = initPhotoSSwiper();

  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {
      destroyPhotoSSwiper();
      photoSSwiper = initPhotoSSwiper();
    } else {
      destroyPhotoSSwiper();
    }
  });

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

  // ===== AOS REFRESH AFTER ARTICLE SWIPERS =====
  if (typeof AOS !== 'undefined') {
    setTimeout(function () { AOS.refresh() }, 50)
  }
});
