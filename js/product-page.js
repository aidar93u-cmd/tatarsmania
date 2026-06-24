document.addEventListener('DOMContentLoaded', function () {
  /* ===== ACCORDION TOGGLE ===== */
  var $accordions = $('.product-accordion');

  $accordions.each(function () {
    var $this = $(this);
    if ($this.hasClass('product-accordion--open')) {
      $this.find('.product-accordion__content').show();
    }
  });

  $('.product-accordion__header').on('click', function () {
    var $accordion = $(this).closest('.product-accordion');
    var $body = $accordion.find('.product-accordion__content');
    $accordion.toggleClass('product-accordion--open');
    $body.stop(true, true).slideToggle(600);
  });

  /* ===== MOBILE GALLERY SWIPER (reuses .product-gallery) ===== */
  var galleryEl = document.querySelector('.product-gallery')
  var gallerySwiper = null
  var galleryOriginalHTML = null

  function initMobileGallery() {
    if (window.innerWidth > 768) return null
    if (!galleryEl) return null
    if (galleryEl.classList.contains('swiper')) return null

    galleryOriginalHTML = galleryEl.innerHTML

    var wrapper = document.createElement('div')
    wrapper.className = 'swiper-wrapper'

    var items = galleryEl.querySelectorAll('.product-gallery__item')
    items.forEach(function (item) {
      var slide = document.createElement('div')
      slide.className = 'swiper-slide'
      slide.appendChild(item)
      wrapper.appendChild(slide)
    })

    galleryEl.innerHTML = ''
    galleryEl.classList.add('swiper')
    galleryEl.appendChild(wrapper)

    var pag = document.createElement('div')
    pag.className = 'product-gallery__pagination'
    galleryEl.appendChild(pag)

    return new Swiper(galleryEl, {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      pagination: {
        el: '.product-gallery__pagination',
        clickable: true,
      },
    })
  }

  function destroyMobileGallery() {
    if (gallerySwiper) {
      gallerySwiper.destroy(true, true)
      gallerySwiper = null
    }
    if (galleryEl && galleryOriginalHTML) {
      galleryEl.classList.remove('swiper')
      galleryEl.innerHTML = galleryOriginalHTML
      galleryOriginalHTML = null
    }
  }

  gallerySwiper = initMobileGallery()

  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {
      destroyMobileGallery()
      gallerySwiper = initMobileGallery()
    } else {
      destroyMobileGallery()
    }
  })

  /* ===== SIZE SELECTOR ===== */
  var sizeBtns = document.querySelectorAll('.product-size-btn');
  sizeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sizeBtns.forEach(function (b) {
        b.classList.remove('product-size-btn--active');
      });
      this.classList.add('product-size-btn--active');
    });
  });

  /* ===== SWATCH SELECTOR ===== */
  document.querySelectorAll('.product-option').forEach(function (group) {
    var label = group.querySelector('.product-option__label');
    var swatches = group.querySelectorAll('.product-swatch');
    var labelPrefix = label ? label.textContent.replace(/:.+/, '') : '';

    swatches.forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        swatches.forEach(function (s) {
          s.classList.remove('product-swatch--selected');
        });
        this.classList.add('product-swatch--selected');
        if (label) {
          var name = this.getAttribute('aria-label');
          label.innerHTML = labelPrefix + ': <span style="color: var(--copper)">' + name + '</span>';
        }
      });
    });
  });

  /* ===== SHOW MORE COLORS ===== */
  var moreBtn = document.getElementById('moreColorsBtn');
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      document.querySelectorAll('.product-swatch-wrap--hidden').forEach(function (w) {
        w.classList.remove('product-swatch-wrap--hidden');
      });
      this.style.display = 'none';
    });
  }

  /* ===== FAVORITE TOGGLE ===== */
  var favBtn = document.querySelector('.product-favorite');
  if (favBtn) {
    favBtn.addEventListener('click', function () {
      this.classList.toggle('product-favorite--active');
      if (window.updateFavBadge) window.updateFavBadge();
    });
  }

  /* ===== INTERIOR SLIDER (Swiper, progress bars) ===== */
  var interiorAutoplayDelay = 5000;
  var interiorProgressEl = document.querySelector('.product-interior__progress');
  var interiorSlideCount = document.querySelectorAll('.product-interior-swiper .swiper-wrapper > .swiper-slide').length;

  if (interiorProgressEl) {
    for (var i = 0; i < interiorSlideCount; i++) {
      var bar = document.createElement('div');
      bar.className = 'product-interior__progress-bar';
      var fill = document.createElement('div');
      fill.className = 'product-interior__progress-fill';
      bar.appendChild(fill);
      interiorProgressEl.appendChild(bar);
    }
  }

  function interiorStartProgressFill(activeIndex) {
    var bars = document.querySelectorAll('.product-interior__progress-bar');
    bars.forEach(function (bar, i) {
      var fill = bar.querySelector('.product-interior__progress-fill');
      if (!fill) return;
      if (i < activeIndex) {
        fill.style.transition = 'none';
        fill.style.width = '100%';
      } else if (i === activeIndex) {
        fill.style.transition = 'none';
        fill.style.width = '0%';
        void fill.offsetWidth;
        fill.style.transition = 'width ' + interiorAutoplayDelay + 'ms linear';
        fill.style.width = '100%';
      } else {
        fill.style.transition = 'none';
        fill.style.width = '0%';
      }
    });
  }

  function interiorSyncActiveBar(activeIndex) {
    document.querySelectorAll('.product-interior__progress-bar').forEach(function (bar, i) {
      bar.classList.toggle('product-interior__progress-bar--active', i === activeIndex);
    });
  }

  var interiorSwiperEl = document.querySelector('.product-interior-swiper');
  if (interiorSwiperEl && typeof Swiper !== 'undefined') {
    var interiorSwiper = new Swiper(interiorSwiperEl, {
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: interiorAutoplayDelay, disableOnInteraction: false },
      speed: 600,
      navigation: {
        nextEl: '.product-interior__btn--next',
        prevEl: '.product-interior__btn--prev',
      },
      on: {
        init: function () {
          var idx = this.realIndex;
          interiorSyncActiveBar(idx);
          interiorStartProgressFill(idx);
        },
        slideChangeTransitionEnd: function () {
          var idx = this.realIndex;
          interiorSyncActiveBar(idx);
          interiorStartProgressFill(idx);
        },
      },
    });

    // Click progress bar to navigate
    if (interiorProgressEl) {
      interiorProgressEl.addEventListener('click', function (e) {
        var bar = e.target.closest('.product-interior__progress-bar');
        if (!bar) return;
        var bars = Array.from(interiorProgressEl.children);
        var idx = bars.indexOf(bar);
        if (idx !== -1) {
          interiorSwiper.slideToLoop(idx);
        }
      });
    }
  }

  /* ===== OTHER MODELS TABS ===== */
  var section = document.querySelector('.carousel-section.product-other');
  if (section) {
    var otherTabs = section.querySelectorAll('.carousel-section__tabs .btn-filter');
    var otherContents = section.querySelectorAll('.carousel-section__tabpanel');

    otherTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = this.getAttribute('data-tab');

        otherTabs.forEach(function (t) {
          t.classList.remove('btn-filter--active');
        });
        this.classList.add('btn-filter--active');

        otherContents.forEach(function (c) {
          c.classList.remove('carousel-section__tabpanel--active');
        });

        var target = document.getElementById(targetId);
        if (target) {
          target.classList.add('carousel-section__tabpanel--active');
          var newSwiperEl = target.querySelector('.carousel-section__swiper');
          if (newSwiperEl && newSwiperEl.swiper) {
            newSwiperEl.swiper.update();
          }
        }
      });
    });
  }

  /* ===== OTHER MODELS GALLERY HOVER ===== */
  document.querySelectorAll('.carousel-section.product-other .product-card--default').forEach(function (card) {
    var gallery = card.querySelector('.product-card--default__gallery');
    var images = gallery ? gallery.querySelectorAll('img') : [];
    var bars = card.querySelectorAll('.product-card--default__progress-bar');
    var imageWrap = card.querySelector('.product-card__image');
    var currentZone = -1;

    function setImage(index) {
      images.forEach(function (img) {
        img.classList.remove('active');
      });
      bars.forEach(function (bar) {
        bar.classList.remove('active');
      });
      if (images[index]) images[index].classList.add('active');
      if (bars[index]) bars[index].classList.add('active');
    }

    if (imageWrap) {
      imageWrap.addEventListener('mouseleave', function () {
        currentZone = -1;
        setImage(0);
      });

      imageWrap.addEventListener('mousemove', function (e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var zoneWidth = rect.width / images.length;
        var zone = Math.min(Math.floor(x / zoneWidth), images.length - 1);
        if (zone !== currentZone) {
          currentZone = zone;
          setImage(zone);
        }
      });
    }
  });

  /* ===== FANCYBOX GALLERY ===== */
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox="product"]', {
      Thumbs: {
        autoStart: true,
      },
      dragToClose: false,
    });
  }
});
