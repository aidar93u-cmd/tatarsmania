$(function () {
  /* ===== SKELETON LOADING ===== */
  var $productGrid = $('.catalog-listing__product-grid');
  var $skeletonGrid = $('.catalog-listing__skeleton-grid');
  var skeletonTimer = null;

  function showSkeleton() {
    if (skeletonTimer) clearTimeout(skeletonTimer);
    $productGrid.css('opacity', '0');
    $skeletonGrid.show();
    skeletonTimer = setTimeout(function () {
      $skeletonGrid.hide();
      $productGrid.css('opacity', '1');
      skeletonTimer = null;
    }, 1500);
  }

  if ($productGrid.length && $skeletonGrid.length) {
    $skeletonGrid.show();
    setTimeout(function () {
      $skeletonGrid.hide();
      $productGrid.css('opacity', '1');
    }, 1500);
  }

  /* ===== SORT DROPDOWN ===== */
  var $sortTrigger = $('.catalog-listing__sort-trigger');
  var $sortContainer = $('.catalog-listing__sort');

  if ($sortTrigger.length) {
    $sortTrigger.on('click', function (e) {
      e.stopPropagation();
      $sortContainer.toggleClass('active');
    });
    $(document).on('click', function () {
      $sortContainer.removeClass('active');
    });
  }

  /* ===== FILTER BAR SYNC ===== */
  var $filterBar = $('.catalog-listing__filter-bar');
  var $activeFilters = $filterBar.find('.catalog-listing__active-filters');
  var $resetBtn = $filterBar.find('.catalog-listing__reset-all');

  function getFilterLabel(input) {
    var $label = $(input).closest('.filter-checkbox, .filter-radio');
    if (!$label.length) return '';
    var $textSpan = $label.find('span').not('.filter-checkbox__mark').not('.filter-radio__mark').first();
    return $textSpan.length ? $textSpan.text().trim() : '';
  }

  function getSectionTitle(input) {
    var $section = $(input).closest('.filter-section');
    if (!$section.length) return '';
    var $title = $section.find('.filter-section__title');
    return $title.length ? $title.text().trim() : '';
  }

  function getFilterId(input) {
    return $(input).attr('data-filter-id') || '';
  }

  function getTagText(input) {
    var label = getFilterLabel(input);
    var section = getSectionTitle(input);
    return section ? section + ' \u2014 ' + label : label;
  }

  function createTagEl(id, text) {
    return $('<span>').addClass('filter-tag').attr('data-filter-id', id).html(text + ' <button class="filter-tag__remove" aria-label="РЈРґР°Р»РёС‚СЊ">&times;</button>');
  }

  function addFilterTag(input) {
    if (!$activeFilters.length) return;
    var checked = $(input).prop('checked');
    if (!checked) {
      removeFilterTag(getFilterId(input));
      return;
    }
    var id = getFilterId(input);
    if (!id) return;
    if ($activeFilters.find('[data-filter-id="' + id + '"]').length) return;
    var $tag = createTagEl(id, getTagText(input));
    $resetBtn.length ? $tag.insertBefore($resetBtn) : $activeFilters.append($tag);
    updateFilterBarVisibility();
  }

  function removeFilterTag(id) {
    if (!$activeFilters.length) return;
    var $tag = $activeFilters.find('[data-filter-id="' + id + '"]');
    if ($tag.length) {
      $tag.remove();
      updateFilterBarVisibility();
    }
  }

  function removeFilterById(id) {
    var $input = $('[data-filter-id="' + id + '"]');
    if ($input.length) {
      $input.prop('checked', false);
      $input.closest('.filter-checkbox, .filter-radio').removeClass('filter-checkbox--checked filter-radio--checked');
      removeFilterTag(id);
      return;
    }
    if (id.indexOf('range-') === 0) {
      var name = id.replace('range-', '');
      $('[data-filter-range]').each(function () {
        var $c = $(this);
        var $section = $c.closest('.filter-section');
        var title = $section.length ? $section.find('.filter-section__title').text().trim() : '';
        if (title === name) {
          var $minInput = $c.find('.filter-range__label:first-child .filter-range__input');
          var $maxInput = $c.find('.filter-range__label:last-child .filter-range__input');
          if ($minInput.length) $minInput.val($minInput.attr('min') || 0).trigger('change');
          if ($maxInput.length) $maxInput.val($maxInput.attr('max') || 100).trigger('change');
        }
      });
      removeFilterTag(id);
    }
  }

  function updateFilterBarVisibility() {
    if (!$activeFilters.length) return;
    var hasTags = $activeFilters.find('.filter-tag').length;
    hasTags ? $activeFilters.show() : $activeFilters.hide();
    $('.catalog-listing__filter-placeholder').toggle(!hasTags);
  }

  function syncRangeTag(container, sectionTitle) {
    var $c = $(container);
    var $minInput = $c.find('.filter-range__label:first-child .filter-range__input');
    var $maxInput = $c.find('.filter-range__label:last-child .filter-range__input');
    if (!$minInput.length || !$maxInput.length) return;
    var id = 'range-' + sectionTitle;
    var $tag = $activeFilters.length ? $activeFilters.find('[data-filter-id="' + id + '"]') : $();
    if ($tag.length) {
      $tag.html(sectionTitle + ': ' + $minInput.val() + ' \u2014 ' + $maxInput.val() + ' <button class="filter-tag__remove" aria-label="РЈРґР°Р»РёС‚СЊ">&times;</button>');
    }
  }

  function addRangeTag(sectionTitle, minVal, maxVal, container) {
    if (!$activeFilters.length || !container) return;
    var id = 'range-' + sectionTitle;
    var $c = $(container);
    var $minInput = $c.find('.filter-range__label:first-child .filter-range__input');
    var $maxInput = $c.find('.filter-range__label:last-child .filter-range__input');
    var absMin = parseFloat($minInput.length ? $minInput.attr('min') || 0 : 0);
    var absMax = parseFloat($maxInput.length ? $maxInput.attr('max') || 100 : 100);
    if (parseFloat(minVal) <= absMin && parseFloat(maxVal) >= absMax) {
      removeFilterTag(id);
      return;
    }
    if ($activeFilters.find('[data-filter-id="' + id + '"]').length) {
      syncRangeTag(container, sectionTitle);
      return;
    }
    var $tag = $('<span>').addClass('filter-tag').attr('data-filter-id', id).html(sectionTitle + ': ' + minVal + ' \u2014 ' + maxVal + ' <button class="filter-tag__remove" aria-label="РЈРґР°Р»РёС‚СЊ">&times;</button>');
    $resetBtn.length ? $tag.insertBefore($resetBtn) : $activeFilters.append($tag);
    updateFilterBarVisibility();
  }

  /* ===== DELEGATED CLICKS ===== */
  $(document).on('click', function (e) {
    var $removeBtn = $(e.target).closest('.filter-tag__remove');
    if ($removeBtn.length) {
      var $tag = $removeBtn.closest('.filter-tag');
      if ($tag.length) removeFilterById($tag.attr('data-filter-id'));
      showSkeleton();
      return;
    }
    if ($(e.target).closest('.catalog-listing__reset-all').length) {
      $('.filter-checkbox input:checked, .filter-radio input:checked').each(function () {
        $(this).prop('checked', false);
        $(this).closest('.filter-checkbox').removeClass('filter-checkbox--checked');
        $(this).closest('.filter-radio').removeClass('filter-radio--checked');
      });
      $('[data-filter-range]').each(function () {
        var $c = $(this);
        var $minInput = $c.find('.filter-range__label:first-child .filter-range__input');
        var $maxInput = $c.find('.filter-range__label:last-child .filter-range__input');
        if ($minInput.length) $minInput.val($minInput.attr('min') || 0).trigger('change');
        if ($maxInput.length) $maxInput.val($maxInput.attr('max') || 100).trigger('change');
      });
      $activeFilters.find('.filter-tag').remove();
      updateFilterBarVisibility();
      showSkeleton();
    }
  });

  /* ===== CHECKBOX ===== */
  $(document).on('change', '.filter-checkbox input', function () {
    $(this).closest('.filter-checkbox').toggleClass('filter-checkbox--checked', this.checked);
    addFilterTag(this);
    showSkeleton();
  });

  /* ===== RADIO ===== */
  $(document).on('change', '.filter-radio input', function () {
    var name = this.name;
    $('.filter-radio input[name="' + name + '"]').each(function () {
      $(this).closest('.filter-radio').removeClass('filter-radio--checked');
      removeFilterTag($(this).attr('data-filter-id'));
    });
    $(this).closest('.filter-radio').addClass('filter-radio--checked');
    addFilterTag(this);
    showSkeleton();
  });

  /* ===== RANGE INPUTS ===== */
  $(document).on('change', '.filter-range__input', function () {
    var $container = $(this).closest('[data-filter-range]');
    if (!$container.length) return;
    var title = $container.closest('.filter-section').find('.filter-section__title').text().trim();
    addRangeTag(title, $container.find('.filter-range__label:first-child .filter-range__input').val(), $container.find('.filter-range__label:last-child .filter-range__input').val(), $container[0]);
    showSkeleton();
  });

  /* ===== RANGE SLIDER DRAG ===== */
  $('.filter-range__slider').each(function () {
    var $slider = $(this);
    var $fill = $slider.find('.filter-range__fill');
    var $thumbMin = $slider.find('.filter-range__thumb--min');
    var $thumbMax = $slider.find('.filter-range__thumb--max');
    var $rangeContainer = $slider.closest('.filter-range').find('[data-filter-range]');
    if (!$rangeContainer.length || !$thumbMin.length || !$thumbMax.length) return;
    var sectionTitle = $rangeContainer.closest('.filter-section').find('.filter-section__title').text().trim();
    var $inputMin = $rangeContainer.find('.filter-range__label:first-child .filter-range__input');
    var $inputMax = $rangeContainer.find('.filter-range__label:last-child .filter-range__input');
    var absMin = parseFloat($inputMin.length ? $inputMin.attr('min') || 0 : 0);
    var absMax = parseFloat($inputMax.length ? $inputMax.attr('max') || 100 : 100);
    var minPct = 0, maxPct = 100;

    function valToPct(val) {
      return ((val - absMin) / (absMax - absMin)) * 100;
    }

    function pctToVal(pct) {
      return Math.round(absMin + (pct / 100) * (absMax - absMin));
    }

    function syncThumbs() {
      minPct = valToPct(parseFloat($inputMin.val()));
      maxPct = valToPct(parseFloat($inputMax.val()));
      $thumbMin.css('left', minPct + '%');
      $thumbMax.css('left', maxPct + '%');
      $fill.css('left', minPct + '%').css('width', Math.max(0, maxPct - minPct) + '%');
    }

    function initThumb($thumb, isMin) {
      function onMove(e) {
        var clientX = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
        var rect = $slider[0].getBoundingClientRect();
        var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        if (isMin) pct = Math.min(pct, maxPct);
        else pct = Math.max(pct, minPct);
        $thumb.css('left', pct + '%');
        if (isMin) minPct = pct; else maxPct = pct;
        $fill.css('left', minPct + '%').css('width', Math.max(0, maxPct - minPct) + '%');
        var newVal = pctToVal(pct);
        if (isMin) $inputMin.val(newVal);
        else $inputMax.val(newVal);
        addRangeTag(sectionTitle, $inputMin.val(), $inputMax.val(), $rangeContainer[0]);
      }

      function onEnd() {
        $(document).off('mousemove touchmove', onMove);
        $(document).off('mouseup touchend', onEnd);
        showSkeleton();
      }

      $thumb.on('mousedown touchstart', function (e) {
        e.preventDefault();
        $(document).on('mousemove touchmove', onMove);
        $(document).on('mouseup touchend', onEnd);
      });
    }

    initThumb($thumbMin, true);
    initThumb($thumbMax, false);
    syncThumbs();

    $inputMin.add($inputMax).on('change', function () {
      syncThumbs();
    });
  });

  /* ===== SHOW MORE COLORS ===== */
  $(document).on('click', '.filter-section__show-more', function () {
    var $extra = $(this).closest('.filter-section').find('.filter-section__extra-colors').first();
    if (!$extra.length) return;
    var hidden = $extra.css('display') === 'none' || $extra.css('display') === '';
    $extra.css('display', hidden ? 'block' : 'none');
    $(this).hide();
  });

  /* ===== INIT ===== */
  if ($activeFilters.length) {
    $activeFilters.find('.filter-tag').remove();
    $('.filter-checkbox input:checked, .filter-radio input:checked').each(function () {
      addFilterTag(this);
    });
    updateFilterBarVisibility();
  }

  /* ===== LOAD MORE ===== */
  var $loadMore = $('.catalog-listing__load-more');
  if ($loadMore.length) {
    $loadMore.on('click', function () {
      showSkeleton();
      $loadMore.text('Р—Р°РіСЂСѓР·РєР°...').prop('disabled', true);
      setTimeout(function () {
        $loadMore.text('Р·Р°РіСЂСѓР·РёС‚СЊ РµС‰Рµ').prop('disabled', false);
      }, 1500);
    });
  }

  /* ===== PAGINATION ===== */
  function updateArrowState() {
    $('.catalog-listing__page-nav').each(function () {
      var $nav = $(this);
      var $links = $nav.find('.catalog-listing__page-link');
      var $prev = $nav.find('.catalog-listing__page-arrow--prev');
      var $next = $nav.find('.catalog-listing__page-arrow--next');
      var $active = $links.filter('.catalog-listing__page-link--active');
      var activeIdx = $links.index($active);
      $prev.toggleClass('catalog-listing__page-arrow--disabled', activeIdx <= 0);
      $next.toggleClass('catalog-listing__page-arrow--disabled', activeIdx >= $links.length - 1);
    });
  }

  $(document).on('click', '.catalog-listing__page-link', function (e) {
    e.preventDefault();
    $('.catalog-listing__page-link').removeClass('catalog-listing__page-link--active');
    $(this).addClass('catalog-listing__page-link--active');
    updateArrowState();
    showSkeleton();
  });

  $(document).on('click', '.catalog-listing__page-arrow--prev:not(.catalog-listing__page-arrow--disabled)', function (e) {
    e.preventDefault();
    var $nav = $(this).closest('.catalog-listing__page-nav');
    var $links = $nav.find('.catalog-listing__page-link');
    var $active = $links.filter('.catalog-listing__page-link--active');
    var activeIdx = $links.index($active);
    $active.removeClass('catalog-listing__page-link--active');
    $links.eq(activeIdx - 1).addClass('catalog-listing__page-link--active');
    updateArrowState();
    showSkeleton();
  });

  $(document).on('click', '.catalog-listing__page-arrow--next:not(.catalog-listing__page-arrow--disabled)', function (e) {
    e.preventDefault();
    var $nav = $(this).closest('.catalog-listing__page-nav');
    var $links = $nav.find('.catalog-listing__page-link');
    var $active = $links.filter('.catalog-listing__page-link--active');
    var activeIdx = $links.index($active);
    $active.removeClass('catalog-listing__page-link--active');
    $links.eq(activeIdx + 1).addClass('catalog-listing__page-link--active');
    updateArrowState();
    showSkeleton();
  });

  updateArrowState();

  /* ===== MOBILE FILTER & SORT ===== */
  var $mobileSortPopup = $('#mobileSortPopup');
  var $mobileFilterDrawer = $('#mobileFilterDrawer');
  var $mobileFilterBody = $('#mobileFilterBody');

  function moveSidebarToDrawer() {
    var $sidebar = $('.catalog-listing__sidebar');
    if (!$sidebar.length || !$mobileFilterBody.length) return;
    if ($mobileFilterBody.children().length) return;
    $mobileFilterBody.append($sidebar.children());
  }

  function moveSidebarBack() {
    var $sidebar = $('.catalog-listing__sidebar');
    if (!$sidebar.length || !$mobileFilterBody.length) return;
    if (!$mobileFilterBody.children().length) return;
    $sidebar.append($mobileFilterBody.children());
  }

  function handleMobileResize() {
    if (window.innerWidth <= 768) {
      moveSidebarToDrawer();
    } else {
      moveSidebarBack();
    }
  }

  handleMobileResize();
  $(window).on('resize', handleMobileResize);

  /* Mobile sort */
  $('.catalog-listing__mobile-sort').on('click', function () {
    $mobileSortPopup.addClass('open');
  });
  $mobileSortPopup.on('click', '.catalog-listing__mobile-sort-overlay, .catalog-listing__mobile-sort-close', function () {
    $mobileSortPopup.removeClass('open');
  });

  /* ===== SORT LOGIC (desktop + mobile) ===== */
  function sortProducts(sortKey) {
    var $grid = $('.catalog-listing__product-grid');
    var $cards = $grid.children('.product-card');
    if (!$cards.length) return;

    var sorted = $cards.toArray().sort(function (a, b) {
      var $a = $(a), $b = $(b);

      switch (sortKey) {
        case 'alphabet-az':
          return $a.find('.product-card__title').text().trim().localeCompare($b.find('.product-card__title').text().trim());
        case 'alphabet-ya':
          return $b.find('.product-card__title').text().trim().localeCompare($a.find('.product-card__title').text().trim());
        case 'expensive': {
          var pa = parseFloat($a.find('.product-card__price').text().trim().replace(/[^\d]/g, '')) || 0;
          var pb = parseFloat($b.find('.product-card__price').text().trim().replace(/[^\d]/g, '')) || 0;
          return pb - pa;
        }
        case 'cheap': {
          var pa = parseFloat($a.find('.product-card__price').text().trim().replace(/[^\d]/g, '')) || 0;
          var pb = parseFloat($b.find('.product-card__price').text().trim().replace(/[^\d]/g, '')) || 0;
          return pa - pb;
        }
        case 'collection':
          var ca = $a.data('collection') || '';
          var cb = $b.data('collection') || '';
          return ca.localeCompare(cb);
        case 'new':
        default:
          return 0;
      }
    });

    $.each(sorted, function (i, el) {
      $grid.append(el);
    });
  }

  function onSortSelect(sortKey, label) {
    $('.catalog-listing__sort-option').removeClass('active');
    $('.catalog-listing__sort-option[data-sort="' + sortKey + '"]').addClass('active');
    $('.catalog-listing__mobile-sort-option').removeClass('active');
    $('.catalog-listing__mobile-sort-option[data-sort="' + sortKey + '"]').addClass('active');
    $('.catalog-listing__mobile-sort-label').text(label);
    $('.catalog-listing__sort-trigger span').text(label);
    sortProducts(sortKey);
    $('.catalog-listing__sort').removeClass('active');
    $mobileSortPopup.removeClass('open');
    showSkeleton();
  }

  /* Desktop sort dropdown clicks */
  $(document).on('click', '.catalog-listing__sort-option', function (e) {
    e.preventDefault();
    var sortKey = $(this).data('sort');
    var label = $(this).text().trim();
    onSortSelect(sortKey, label);
  });

  /* Mobile sort option clicks */
  $(document).on('click', '.catalog-listing__mobile-sort-option', function () {
    var $this = $(this);
    var sortKey = $this.data('sort');
    var label = $this.text().trim();
    onSortSelect(sortKey, label);
  });

  /* Mobile filter */
  $('.catalog-listing__mobile-filter-btn').on('click', function () {
    $mobileFilterDrawer.addClass('open');
    document.body.style.overflow = 'hidden';
  });
  $mobileFilterDrawer.on('click', '.catalog-listing__mobile-filter-overlay, .catalog-listing__mobile-filter-close', function () {
    $mobileFilterDrawer.removeClass('open');
    document.body.style.overflow = '';
  });
  $('.catalog-listing__mobile-filter-apply').on('click', function () {
    $mobileFilterDrawer.removeClass('open');
    document.body.style.overflow = '';
  });
  $('.catalog-listing__mobile-filter-reset').on('click', function () {
    $('.filter-checkbox input:checked, .filter-radio input:checked').each(function () {
      $(this).prop('checked', false);
      $(this).closest('.filter-checkbox').removeClass('filter-checkbox--checked');
      $(this).closest('.filter-radio').removeClass('filter-radio--checked');
    });
    $('[data-filter-range]').each(function () {
      var $c = $(this);
      var $minInput = $c.find('.filter-range__label:first-child .filter-range__input');
      var $maxInput = $c.find('.filter-range__label:last-child .filter-range__input');
      if ($minInput.length) $minInput.val($minInput.attr('min') || 0).trigger('change');
      if ($maxInput.length) $maxInput.val($maxInput.attr('max') || 100).trigger('change');
    });
    $activeFilters.find('.filter-tag').remove();
    updateFilterBarVisibility();
    showSkeleton();
  });

  /* Filter count badge */
  function updateFilterCount() {
    var count = $('.filter-checkbox input:checked, .filter-radio input:checked').length;
    $('[data-filter-range]').each(function () {
      var $min = $(this).find('.filter-range__label:first-child .filter-range__input');
      var $max = $(this).find('.filter-range__label:last-child .filter-range__input');
      if ($min.length && $max.length) {
        var absMin = parseFloat($min.attr('min') || 0);
        var absMax = parseFloat($max.attr('max') || 100);
        if (parseFloat($min.val()) > absMin || parseFloat($max.val()) < absMax) count++;
      }
    });
    $('.catalog-listing__mobile-filter-count').text(count || '').toggle(count > 0);
  }
  $(document).on('change', '.filter-checkbox input, .filter-radio input, .filter-range__input', updateFilterCount);
  updateFilterCount();
});
