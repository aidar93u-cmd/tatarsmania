document.addEventListener('DOMContentLoaded', function () {

  var grid = document.querySelector('.blog-grid');
  if (!grid) return;
  var allCards = Array.from(grid.querySelectorAll('.blog-card'));
  var perPage = 12;
  var currentPage = 1;
  var filteredCards = allCards.slice();
  var paginationEl = document.querySelector('.blog-pagination');

  function getCategory(card) {
    var dc = card.getAttribute('data-category');
    if (dc) return dc.toLowerCase();
    var el = card.querySelector('.blog-card__category');
    return el ? el.textContent.trim().toLowerCase() : '';
  }

  function getDateVal(card) {
    var el = card.querySelector('.blog-card__date');
    if (!el) return '';
    var parts = el.textContent.trim().split('.');
    if (parts.length === 3) return parts[2] + parts[1] + parts[0];
    return '';
  }

  function getWordEnding(n) {
    var lastDigit = n % 10;
    var lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 19) return 'ов';
    if (lastDigit === 1) return '';
    if (lastDigit >= 2 && lastDigit <= 4) return 'а';
    return 'ов';
  }

  function createSkeletons(count) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'blog-skeleton';
      el.innerHTML = '<div class="blog-skeleton__image"></div><div class="blog-skeleton__body"><div class="blog-skeleton__line blog-skeleton__line--category"></div><div class="blog-skeleton__line blog-skeleton__line--title" style="width:85%"></div><div class="blog-skeleton__line blog-skeleton__line--title" style="width:55%"></div><div class="blog-skeleton__line blog-skeleton__line--desc" style="width:90%"></div><div class="blog-skeleton__line blog-skeleton__line--desc" style="width:45%"></div></div>';
      frag.appendChild(el);
    }
    return frag;
  }

  function render() {
    // scroll to top of grid on pagination change
    if (grid && currentPage > 1) {
      var top = grid.getBoundingClientRect().top + window.pageYOffset - 130;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }

    var start = (currentPage - 1) * perPage;
    var pageCards = filteredCards.slice(start, start + perPage);
    var totalShown = Math.min(start + perPage, filteredCards.length);
    var infoEl = document.querySelector('.blog-pagination .pagination__info');
    if (infoEl) infoEl.textContent = 'Показано ' + totalShown + ' из ' + filteredCards.length;
    var countEl = document.querySelector('.blog-news__count');
    if (countEl) {
      var noun = countEl.getAttribute('data-noun') || 'материал';
      countEl.textContent = 'Найдено ' + filteredCards.length + ' ' + noun + getWordEnding(filteredCards.length);
    }
    updatePagination();

    // hide all cards, show skeletons
    allCards.forEach(function (c) { c.style.display = 'none'; });
    grid.classList.add('is-loading');
    grid.appendChild(createSkeletons(pageCards.length));

    setTimeout(function () {
      // remove skeletons
      var skeletons = grid.querySelectorAll('.blog-skeleton');
      skeletons.forEach(function (s) { s.remove(); });
      grid.classList.remove('is-loading');
      // show actual cards
      pageCards.forEach(function (c) { c.style.display = ''; });
      if (typeof AOS !== 'undefined') AOS.refresh();
    }, 400);
  }

  // ===== TABS =====
  var tabs = document.querySelectorAll('.blog-news__tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      this.classList.add('is-active');
      var filter = this.getAttribute('data-filter') || this.textContent.trim().toLowerCase();
      if (filter === 'all') {
        filteredCards = allCards.slice();
      } else {
        filteredCards = allCards.filter(function (c) { return getCategory(c) === filter; });
      }
      currentPage = 1;
      render();
    });
  });

  // ===== SORT DROPDOWN =====
  var sortContainer = document.querySelector('.blog-news__sort');
  if (sortContainer) {
    sortContainer.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
    });
    document.addEventListener('click', function () {
      var sc = document.querySelector('.blog-news__sort');
      if (sc) sc.classList.remove('active');
    });
  }

  var sortOptions = document.querySelectorAll('.blog-news__sort-option');
  sortOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      sortOptions.forEach(function (o) { o.classList.remove('active'); });
      this.classList.add('active');
      var text = this.textContent.trim();
      var triggerSpan = document.querySelector('.blog-news__sort-trigger span');
      if (triggerSpan) triggerSpan.textContent = text;
      document.querySelector('.blog-news__sort').classList.remove('active');
      var order = text === 'Сначала новые' ? -1 : text === 'Сначала старые' ? 1 : 0;
      if (order !== 0) {
        filteredCards.sort(function (a, b) {
          return order * (getDateVal(a) < getDateVal(b) ? -1 : getDateVal(b) < getDateVal(a) ? 1 : 0);
        });
      } else {
        filteredCards.sort(function (a, b) {
          return allCards.indexOf(a) - allCards.indexOf(b);
        });
      }
      currentPage = 1;
      render();
    });
  });

  // ===== PAGINATION =====
  function updatePagination() {
    var totalPages = Math.ceil(filteredCards.length / perPage);
    if (paginationEl) paginationEl.style.display = totalPages <= 1 ? 'none' : '';
    var nav = document.querySelector('.pagination__nav[data-pagination-manual]');
    var loadBtn = document.querySelector('.pagination__load-more');
    var prevArrow = document.querySelector('.pagination__arrow--prev');
    var nextArrow = document.querySelector('.pagination__arrow--next');
    if (!nav || totalPages <= 1) return;

    if (currentPage >= totalPages) {
      if (loadBtn) loadBtn.style.display = 'none';
    } else {
      if (loadBtn) loadBtn.style.display = '';
    }

    if (prevArrow) {
      if (currentPage <= 1) prevArrow.classList.add('pagination__arrow--disabled');
      else prevArrow.classList.remove('pagination__arrow--disabled');
    }
    if (nextArrow) {
      if (currentPage >= totalPages) nextArrow.classList.add('pagination__arrow--disabled');
      else nextArrow.classList.remove('pagination__arrow--disabled');
    }

    var pages = [];
    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    var node = prevArrow.nextSibling;
    while (node && node !== nextArrow) {
      var nextNode = node.nextSibling;
      node.parentNode.removeChild(node);
      node = nextNode;
    }

    pages.forEach(function (p) {
      var el;
      if (p === '...') {
        el = document.createElement('span');
        el.className = 'pagination__ellipsis';
        el.textContent = '...';
      } else {
        el = document.createElement('button');
        el.className = 'pagination__link body-l-strong';
        if (p === currentPage) el.classList.add('pagination__link--active');
        el.textContent = p;
        el.addEventListener('click', function () { currentPage = p; render(); });
      }
      nav.insertBefore(el, nextArrow);
    });
  }

  // ===== ARROWS =====
  var prevArrow = document.querySelector('.pagination__arrow--prev');
  var nextArrow = document.querySelector('.pagination__arrow--next');
  if (prevArrow) {
    prevArrow.addEventListener('click', function () {
      var totalPages = Math.ceil(filteredCards.length / perPage);
      if (currentPage > 1) { currentPage--; render(); }
    });
  }
  if (nextArrow) {
    nextArrow.addEventListener('click', function () {
      var totalPages = Math.ceil(filteredCards.length / perPage);
      if (currentPage < totalPages) { currentPage++; render(); }
    });
  }

  // ===== LOAD MORE =====
  var loadBtn = document.querySelector('.pagination__load-more');
  if (loadBtn) {
    loadBtn.addEventListener('click', function () {
      var totalPages = Math.ceil(filteredCards.length / perPage);
      if (currentPage < totalPages) { currentPage++; render(); }
    });
  }

  render();
});
