document.addEventListener('DOMContentLoaded', function () {
  /* ===== SKELETON LOADING ===== */
  var productGrid = document.querySelector('.catalog-listing__product-grid');
  var skeletonGrid = document.querySelector('.catalog-listing__skeleton-grid');
  var skeletonTimer = null;

  function showSkeleton() {
    if (skeletonTimer) clearTimeout(skeletonTimer);
    if (productGrid) productGrid.style.opacity = '0';
    if (skeletonGrid) skeletonGrid.style.display = 'grid';
    skeletonTimer = setTimeout(function () {
      if (skeletonGrid) skeletonGrid.style.display = 'none';
      if (productGrid) productGrid.style.opacity = '1';
      skeletonTimer = null;
    }, 1500);
  }

  if (productGrid && skeletonGrid) {
    skeletonGrid.style.display = 'grid';
    setTimeout(function () {
      skeletonGrid.style.display = 'none';
      productGrid.style.opacity = '1';
    }, 1500);
  }

  /* ===== SUBCATEGORY FILTER ===== */
  var subcatBtns = document.querySelectorAll('.btn-subcategories[data-subcategory]');
  var productCards = document.querySelectorAll('.js-product-card');
  var activeSubcategory = null;

  function updateSubcategoryCounts() {
    subcatBtns.forEach(function (btn) {
      var cat = btn.getAttribute('data-subcategory');
      var count = 0;
      productCards.forEach(function (card) {
        if (card.getAttribute('data-subcategory') === cat) count++;
      });
      var countEl = btn.querySelector('.btn-secondary__count');
      if (countEl) countEl.textContent = '+' + count;
    });
  }

  function filterBySubcategory(cat) {
    if (activeSubcategory === cat) {
      activeSubcategory = null;
    } else {
      activeSubcategory = cat;
    }
    subcatBtns.forEach(function (btn) {
      var c = btn.getAttribute('data-subcategory');
      btn.classList.toggle('active', c === activeSubcategory);
    });
    productCards.forEach(function (card) {
      if (!activeSubcategory || card.getAttribute('data-subcategory') === activeSubcategory) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
    if (activeSubcategory) {
      var grid = document.querySelector('.catalog-listing__grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (typeof AOS !== 'undefined') {
      setTimeout(function () { AOS.refresh(); }, 100);
    }
  }

  subcatBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-subcategory');
      filterBySubcategory(cat);
    });
  });

  updateSubcategoryCounts();

  /* ===== SORT DROPDOWN ===== */
  var sortTrigger = document.querySelector('.catalog-listing__sort-trigger');
  var sortContainer = document.querySelector('.catalog-listing__sort');

  if (sortTrigger) {
    sortTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      sortContainer.classList.toggle('active');
    });
    document.addEventListener('click', function () {
      sortContainer.classList.remove('active');
    });
  }

  /* ===== FILTER BAR SYNC ===== */
  var filterBar = document.querySelector('.catalog-listing__filter-bar');
  var activeFilters = filterBar ? filterBar.querySelector('.catalog-listing__active-filters') : null;
  var resetBtn = filterBar ? filterBar.querySelector('.catalog-listing__reset-all') : null;

  function getFilterLabel(input) {
    var label = input.closest('.filter-checkbox, .filter-radio');
    if (!label) return '';
    var spans = label.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      if (!spans[i].classList.contains('filter-checkbox__mark') && !spans[i].classList.contains('filter-radio__mark')) {
        return spans[i].textContent.trim();
      }
    }
    return '';
  }

  function getSectionTitle(input) {
    var section = input.closest('.filter-section');
    if (!section) return '';
    var title = section.querySelector('.filter-section__title');
    return title ? title.textContent.trim() : '';
  }

  function getFilterId(input) {
    return input.getAttribute('data-filter-id') || '';
  }

  function getTagText(input) {
    var label = getFilterLabel(input);
    var section = getSectionTitle(input);
    return section ? section + ' \u2014 ' + label : label;
  }

  function createTagEl(id, text) {
    var span = document.createElement('span');
    span.className = 'filter-tag';
    span.setAttribute('data-filter-id', id);
    span.innerHTML = text + ' <button class="filter-tag__remove" aria-label="\u0423\u0434\u0430\u043B\u0438\u0442\u044C"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.69111 8.64089L8.64085 3.69115L9.30889 4.35919L4.35915 9.30893L3.69111 8.64089ZM3.6928 4.3575L4.35746 3.69284L9.3072 8.64258L8.64254 9.30724L3.6928 4.3575Z" fill="#212121"/></svg></button>';
    return span;
  }

  function addFilterTag(input) {
    if (!activeFilters) return;
    var checked = input.checked;
    if (!checked) {
      removeFilterTag(getFilterId(input));
      return;
    }
    var id = getFilterId(input);
    if (!id) return;
    if (activeFilters.querySelector('[data-filter-id="' + id + '"]')) return;
    var tag = createTagEl(id, getTagText(input));
    if (resetBtn) {
      resetBtn.parentNode.insertBefore(tag, resetBtn);
    } else {
      activeFilters.appendChild(tag);
    }
    updateFilterBarVisibility();
  }

  function removeFilterTag(id) {
    if (!activeFilters) return;
    var tag = activeFilters.querySelector('[data-filter-id="' + id + '"]');
    if (tag) {
      tag.remove();
      updateFilterBarVisibility();
    }
  }

  function removeFilterById(id) {
    var input = document.querySelector('[data-filter-id="' + id + '"]');
    if (input) {
      input.checked = false;
      var wrapper = input.closest('.filter-checkbox, .filter-radio');
      if (wrapper) wrapper.classList.remove('filter-checkbox--checked', 'filter-radio--checked');
      removeFilterTag(id);
      return;
    }
    if (id.indexOf('range-') === 0) {
      var name = id.replace('range-', '');
      document.querySelectorAll('[data-filter-range]').forEach(function (container) {
        var section = container.closest('.filter-section');
        var title = section ? section.querySelector('.filter-section__title') : null;
        if (title && title.textContent.trim() === name) {
          var labels = container.querySelectorAll('.filter-range__label');
          var minInput = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
          var maxInput = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
          if (minInput) { minInput.value = minInput.getAttribute('min') || 0; minInput.dispatchEvent(new Event('change')); }
          if (maxInput) { maxInput.value = maxInput.getAttribute('max') || 100; maxInput.dispatchEvent(new Event('change')); }
        }
      });
      removeFilterTag(id);
    }
  }

  function updateFilterBarVisibility() {
    if (!activeFilters) return;
    var hasTags = activeFilters.querySelectorAll('.filter-tag').length > 0;
    activeFilters.style.display = hasTags ? '' : 'none';
    var placeholder = document.querySelector('.catalog-listing__filter-placeholder');
    if (placeholder) placeholder.style.display = hasTags ? 'none' : '';
  }

  function syncRangeTag(container, sectionTitle) {
    var labels = container.querySelectorAll('.filter-range__label');
    var minInput = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
    var maxInput = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
    if (!minInput || !maxInput) return;
    var id = 'range-' + sectionTitle;
    var tag = activeFilters ? activeFilters.querySelector('[data-filter-id="' + id + '"]') : null;
    if (tag) {
      tag.innerHTML = sectionTitle + ': ' + minInput.value + ' \u2014 ' + maxInput.value + ' <button class="filter-tag__remove" aria-label="\u0423\u0434\u0430\u043B\u0438\u0442\u044C"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.69111 8.64089L8.64085 3.69115L9.30889 4.35919L4.35915 9.30893L3.69111 8.64089ZM3.6928 4.3575L4.35746 3.69284L9.3072 8.64258L8.64254 9.30724L3.6928 4.3575Z" fill="#212121"/></svg></button>';
    }
  }

  function addRangeTag(sectionTitle, minVal, maxVal, container) {
    if (!activeFilters || !container) return;
    var id = 'range-' + sectionTitle;
    var labels = container.querySelectorAll('.filter-range__label');
    var minInput = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
    var maxInput = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
    var absMin = parseFloat(minInput ? minInput.getAttribute('min') || 0 : 0);
    var absMax = parseFloat(maxInput ? maxInput.getAttribute('max') || 100 : 100);
    if (parseFloat(minVal) <= absMin && parseFloat(maxVal) >= absMax) {
      removeFilterTag(id);
      return;
    }
    if (activeFilters.querySelector('[data-filter-id="' + id + '"]')) {
      syncRangeTag(container, sectionTitle);
      return;
    }
    var tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.setAttribute('data-filter-id', id);
    tag.innerHTML = sectionTitle + ': ' + minVal + ' \u2014 ' + maxVal + ' <button class="filter-tag__remove" aria-label="\u0423\u0434\u0430\u043B\u0438\u0442\u044C"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.69111 8.64089L8.64085 3.69115L9.30889 4.35919L4.35915 9.30893L3.69111 8.64089ZM3.6928 4.3575L4.35746 3.69284L9.3072 8.64258L8.64254 9.30724L3.6928 4.3575Z" fill="#212121"/></svg></button>';
    if (resetBtn) {
      resetBtn.parentNode.insertBefore(tag, resetBtn);
    } else {
      activeFilters.appendChild(tag);
    }
    updateFilterBarVisibility();
  }

  /* ===== DELEGATED CLICKS ===== */
  document.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('.filter-tag__remove');
    if (removeBtn) {
      var tag = removeBtn.closest('.filter-tag');
      if (tag) removeFilterById(tag.getAttribute('data-filter-id'));
      showSkeleton();
      return;
    }
    if (e.target.closest('.catalog-listing__reset-all')) {
      document.querySelectorAll('.filter-checkbox input:checked, .filter-radio input:checked').forEach(function (el) {
        el.checked = false;
        var wrapper = el.closest('.filter-checkbox');
        if (wrapper) wrapper.classList.remove('filter-checkbox--checked');
        wrapper = el.closest('.filter-radio');
        if (wrapper) wrapper.classList.remove('filter-radio--checked');
      });
      document.querySelectorAll('[data-filter-range]').forEach(function (container) {
        var labels = container.querySelectorAll('.filter-range__label');
        var minInput = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
        var maxInput = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
        if (minInput) { minInput.value = minInput.getAttribute('min') || 0; minInput.dispatchEvent(new Event('change')); }
        if (maxInput) { maxInput.value = maxInput.getAttribute('max') || 100; maxInput.dispatchEvent(new Event('change')); }
      });
      if (activeFilters) {
        activeFilters.querySelectorAll('.filter-tag').forEach(function (t) { t.remove(); });
      }
      updateFilterBarVisibility();
      showSkeleton();
    }
  });

  /* ===== CHECKBOX ===== */
  document.addEventListener('change', function (e) {
    var checkbox = e.target.closest('.filter-checkbox input');
    if (checkbox) {
      checkbox.closest('.filter-checkbox').classList.toggle('filter-checkbox--checked', checkbox.checked);
      addFilterTag(checkbox);
      showSkeleton();
    }
  });

  /* ===== RADIO ===== */
  document.addEventListener('change', function (e) {
    var radio = e.target.closest('.filter-radio input');
    if (radio) {
      var name = radio.name;
      document.querySelectorAll('.filter-radio input[name="' + name + '"]').forEach(function (el) {
        el.closest('.filter-radio').classList.remove('filter-radio--checked');
        removeFilterTag(el.getAttribute('data-filter-id'));
      });
      radio.closest('.filter-radio').classList.add('filter-radio--checked');
      addFilterTag(radio);
      showSkeleton();
    }
  });

  /* ===== RANGE INPUTS ===== */
  document.addEventListener('change', function (e) {
    var rangeInput = e.target.closest('.filter-range__input');
    if (!rangeInput) return;
    var container = rangeInput.closest('[data-filter-range]');
    if (!container) return;
    var title = container.closest('.filter-section').querySelector('.filter-section__title').textContent.trim();
    var labels = container.querySelectorAll('.filter-range__label');
    var minInput = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
    var maxInput = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
    addRangeTag(title, minInput ? minInput.value : '', maxInput ? maxInput.value : '', container);
    showSkeleton();
  });

  /* ===== RANGE SLIDER DRAG ===== */
  document.querySelectorAll('.filter-range__slider').forEach(function (slider) {
    var fill = slider.querySelector('.filter-range__fill');
    var thumbMin = slider.querySelector('.filter-range__thumb--min');
    var thumbMax = slider.querySelector('.filter-range__thumb--max');
    var rangeContainer = slider.closest('.filter-range') ? slider.closest('.filter-range').querySelector('[data-filter-range]') : null;
    if (!rangeContainer || !thumbMin || !thumbMax) return;
    var sectionTitle = rangeContainer.closest('.filter-section').querySelector('.filter-section__title').textContent.trim();
    var labels = rangeContainer.querySelectorAll('.filter-range__label');
    var inputMin = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
    var inputMax = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
    var absMin = parseFloat(inputMin ? inputMin.getAttribute('min') || 0 : 0);
    var absMax = parseFloat(inputMax ? inputMax.getAttribute('max') || 100 : 100);
    var minPct = 0, maxPct = 100;

    function valToPct(val) {
      return ((val - absMin) / (absMax - absMin)) * 100;
    }

    function pctToVal(pct) {
      return Math.round(absMin + (pct / 100) * (absMax - absMin));
    }

    function syncThumbs() {
      minPct = valToPct(parseFloat(inputMin.value));
      maxPct = valToPct(parseFloat(inputMax.value));
      thumbMin.style.left = minPct + '%';
      thumbMax.style.left = maxPct + '%';
      fill.style.left = minPct + '%';
      fill.style.width = Math.max(0, maxPct - minPct) + '%';
    }

    function initThumb(thumb, isMin) {
      function getClientX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
      }

      function onMove(e) {
        var clientX = getClientX(e);
        var rect = slider.getBoundingClientRect();
        var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        if (isMin) pct = Math.min(pct, maxPct);
        else pct = Math.max(pct, minPct);
        thumb.style.left = pct + '%';
        if (isMin) minPct = pct; else maxPct = pct;
        fill.style.left = minPct + '%';
        fill.style.width = Math.max(0, maxPct - minPct) + '%';
        var newVal = pctToVal(pct);
        if (isMin) inputMin.value = newVal;
        else inputMax.value = newVal;
        addRangeTag(sectionTitle, inputMin.value, inputMax.value, rangeContainer);
      }

      function onEnd() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchend', onEnd);
        showSkeleton();
      }

      thumb.addEventListener('mousedown', function (e) {
        e.preventDefault();
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
      });
      thumb.addEventListener('touchstart', function (e) {
        e.preventDefault();
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
      });
    }

    initThumb(thumbMin, true);
    initThumb(thumbMax, false);
    syncThumbs();

    function onRangeChange() { syncThumbs(); }
    if (inputMin) inputMin.addEventListener('change', onRangeChange);
    if (inputMax) inputMax.addEventListener('change', onRangeChange);
  });

  /* ===== SHOW MORE COLORS ===== */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-section__show-more');
    if (!btn) return;
    var extra = btn.closest('.filter-section').querySelector('.filter-section__extra-colors');
    if (!extra) return;
    var hidden = extra.style.display === 'none' || extra.style.display === '';
    extra.style.display = hidden ? 'block' : 'none';
    btn.style.display = 'none';
  });

  /* ===== INIT ===== */
  if (activeFilters) {
    activeFilters.querySelectorAll('.filter-tag').forEach(function (t) { t.remove(); });
    document.querySelectorAll('.filter-checkbox input:checked, .filter-radio input:checked').forEach(function (el) {
      addFilterTag(el);
    });
    updateFilterBarVisibility();
  }

  /* ===== LOAD MORE ===== */
  var loadMore = document.querySelector('.pagination__load-more');
  if (loadMore) {
    loadMore.addEventListener('click', function () {
      showSkeleton();
      loadMore.textContent = '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...';
      loadMore.disabled = true;
      setTimeout(function () {
        loadMore.textContent = '\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0435\u0449\u0435';
        loadMore.disabled = false;
      }, 1500);
    });
  }

  /* ===== PAGINATION CHANGE ===== */
  document.addEventListener('pagination:change', function () {
    showSkeleton();
  });

  /* ===== MOBILE FILTER & SORT ===== */
  var mobileSortPopup = document.getElementById('mobileSortPopup');
  var mobileFilterDrawer = document.getElementById('mobileFilterDrawer');
  var mobileFilterBody = document.getElementById('mobileFilterBody');

  function moveSidebarToDrawer() {
    var sidebar = document.querySelector('.catalog-listing__sidebar');
    if (!sidebar || !mobileFilterBody) return;
    if (mobileFilterBody.children.length) return;
    while (sidebar.children.length) {
      mobileFilterBody.appendChild(sidebar.children[0]);
    }
  }

  function moveSidebarBack() {
    var sidebar = document.querySelector('.catalog-listing__sidebar');
    if (!sidebar || !mobileFilterBody) return;
    if (!mobileFilterBody.children.length) return;
    while (mobileFilterBody.children.length) {
      sidebar.appendChild(mobileFilterBody.children[0]);
    }
  }

  function handleMobileResize() {
    if (window.innerWidth <= 768) {
      moveSidebarToDrawer();
    } else {
      moveSidebarBack();
      if (mobileSortPopup) mobileSortPopup.classList.remove('open');
      if (mobileFilterDrawer) mobileFilterDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  handleMobileResize();
  window.addEventListener('resize', handleMobileResize);

  /* Mobile sort */
  var mobileSortBtn = document.querySelector('.catalog-listing__mobile-sort');
  if (mobileSortBtn && mobileSortPopup) {
    mobileSortBtn.addEventListener('click', function () {
      mobileSortPopup.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileSortPopup) {
    mobileSortPopup.addEventListener('click', function (e) {
      if (e.target.closest('.catalog-listing__mobile-sort-overlay, .catalog-listing__mobile-sort-close')) {
        mobileSortPopup.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ===== SORT LOGIC (desktop + mobile) ===== */
  function sortProducts(sortKey) {
    var grid = document.querySelector('.catalog-listing__product-grid');
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll(':scope > .product-card'));
    if (!cards.length) return;

    var sorted = cards.sort(function (a, b) {
      switch (sortKey) {
        case 'alphabet-az':
          return a.querySelector('.product-card__title').textContent.trim().localeCompare(b.querySelector('.product-card__title').textContent.trim());
        case 'alphabet-ya':
          return b.querySelector('.product-card__title').textContent.trim().localeCompare(a.querySelector('.product-card__title').textContent.trim());
        case 'expensive': {
          var pa = parseFloat(a.querySelector('.product-card__price').textContent.trim().replace(/[^\d]/g, '')) || 0;
          var pb = parseFloat(b.querySelector('.product-card__price').textContent.trim().replace(/[^\d]/g, '')) || 0;
          return pb - pa;
        }
        case 'cheap': {
          var pa = parseFloat(a.querySelector('.product-card__price').textContent.trim().replace(/[^\d]/g, '')) || 0;
          var pb = parseFloat(b.querySelector('.product-card__price').textContent.trim().replace(/[^\d]/g, '')) || 0;
          return pa - pb;
        }
        case 'collection':
          var ca = a.dataset.collection || '';
          var cb = b.dataset.collection || '';
          return ca.localeCompare(cb);
        case 'new':
        default:
          return 0;
      }
    });

    sorted.forEach(function (el) {
      grid.appendChild(el);
    });
  }

  function onSortSelect(sortKey, label) {
    document.querySelectorAll('.catalog-listing__sort-option').forEach(function (el) { el.classList.remove('active'); });
    var opt = document.querySelector('.catalog-listing__sort-option[data-sort="' + sortKey + '"]');
    if (opt) opt.classList.add('active');
    document.querySelectorAll('.catalog-listing__mobile-sort-option').forEach(function (el) { el.classList.remove('active'); });
    var mobOpt = document.querySelector('.catalog-listing__mobile-sort-option[data-sort="' + sortKey + '"]');
    if (mobOpt) mobOpt.classList.add('active');
    var mobLabel = document.querySelector('.catalog-listing__mobile-sort-label');
    if (mobLabel) mobLabel.textContent = label;
    var triggerSpan = sortTrigger ? sortTrigger.querySelector('span') : null;
    if (triggerSpan) triggerSpan.textContent = label;
    sortProducts(sortKey);
    if (sortContainer) sortContainer.classList.remove('active');
    if (mobileSortPopup) {
      mobileSortPopup.classList.remove('open');
      document.body.style.overflow = '';
    }
    showSkeleton();
  }

  /* Desktop sort dropdown clicks */
  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.catalog-listing__sort-option');
    if (opt) {
      e.preventDefault();
      onSortSelect(opt.dataset.sort, opt.textContent.trim());
    }
  });

  /* Mobile sort option clicks */
  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.catalog-listing__mobile-sort-option');
    if (opt) {
      onSortSelect(opt.dataset.sort, opt.textContent.trim());
    }
  });

  /* Mobile filter */
  var mobileFilterBtn = document.querySelector('.catalog-listing__mobile-filter-btn');
  if (mobileFilterBtn && mobileFilterDrawer) {
    mobileFilterBtn.addEventListener('click', function () {
      mobileFilterDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileFilterDrawer) {
    mobileFilterDrawer.addEventListener('click', function (e) {
      if (e.target.closest('.catalog-listing__mobile-filter-overlay, .catalog-listing__mobile-filter-close')) {
        mobileFilterDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
  var mobileFilterApply = document.querySelector('.catalog-listing__mobile-filter-apply');
  if (mobileFilterApply) {
    mobileFilterApply.addEventListener('click', function () {
      mobileFilterDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  var mobileFilterReset = document.querySelector('.catalog-listing__mobile-filter-reset');
  if (mobileFilterReset) {
    mobileFilterReset.addEventListener('click', function () {
      document.querySelectorAll('.filter-checkbox input:checked, .filter-radio input:checked').forEach(function (el) {
        el.checked = false;
        var wrapper = el.closest('.filter-checkbox');
        if (wrapper) wrapper.classList.remove('filter-checkbox--checked');
        wrapper = el.closest('.filter-radio');
        if (wrapper) wrapper.classList.remove('filter-radio--checked');
      });
      document.querySelectorAll('[data-filter-range]').forEach(function (container) {
        var labels = container.querySelectorAll('.filter-range__label');
        var minInput = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
        var maxInput = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
        if (minInput) { minInput.value = minInput.getAttribute('min') || 0; minInput.dispatchEvent(new Event('change')); }
        if (maxInput) { maxInput.value = maxInput.getAttribute('max') || 100; maxInput.dispatchEvent(new Event('change')); }
      });
      if (activeFilters) {
        activeFilters.querySelectorAll('.filter-tag').forEach(function (t) { t.remove(); });
      }
      updateFilterBarVisibility();
      showSkeleton();
      if (mobileFilterDrawer) {
        mobileFilterDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* Filter count badge */
  function updateFilterCount() {
    var count = document.querySelectorAll('.filter-checkbox input:checked, .filter-radio input:checked').length;
    document.querySelectorAll('[data-filter-range]').forEach(function (container) {
      var labels = container.querySelectorAll('.filter-range__label');
      var minInput = labels[0] ? labels[0].querySelector('.filter-range__input') : null;
      var maxInput = labels[labels.length - 1] ? labels[labels.length - 1].querySelector('.filter-range__input') : null;
      if (minInput && maxInput) {
        var absMin = parseFloat(minInput.getAttribute('min') || 0);
        var absMax = parseFloat(maxInput.getAttribute('max') || 100);
        if (parseFloat(minInput.value) > absMin || parseFloat(maxInput.value) < absMax) count++;
      }
    });
    var badge = document.querySelector('.catalog-listing__mobile-filter-count');
    if (badge) {
      badge.textContent = count || '';
      badge.style.display = count > 0 ? '' : 'none';
    }
  }
  document.addEventListener('change', function (e) {
    if (e.target.closest('.filter-checkbox input, .filter-radio input, .filter-range__input')) {
      updateFilterCount();
    }
  });
  updateFilterCount();
});
