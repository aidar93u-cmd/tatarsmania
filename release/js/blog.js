document.addEventListener('DOMContentLoaded', function () {

  var grid = document.querySelector('.blog-grid');
  if (!grid) return;
  var allCards = Array.from(grid.querySelectorAll('.blog-card'));
  var perPage = 12;
  var currentPage = 1;
  var filteredCards = allCards.slice();

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
      el.innerHTML = '<div class="blog-skeleton__image"></div><div class="blog-skeleton__body"><div class="blog-skeleton__line blog-skeleton__line--short"></div><div class="blog-skeleton__line blog-skeleton__line--medium"></div><div class="blog-skeleton__line"></div></div>';
      frag.appendChild(el);
    }
    return frag;
  }

  function render() {
    var start = (currentPage - 1) * perPage;
    var pageCards = filteredCards.slice(start, start + perPage);
    var totalShown = Math.min(start + perPage, filteredCards.length);
    var infoEl = document.querySelector('.blog-pagination__info');
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
      var filter = this.textContent.trim().toLowerCase();
      if (filter === 'все') {
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
    var pagesEl = document.querySelector('.blog-pagination__pages');
    var loadBtn = document.querySelector('.blog-pagination__load');
    var prevArrow = document.querySelector('.blog-pagination__arrow--prev');
    var nextArrow = document.querySelector('.blog-pagination__arrow--next');
    if (!pagesEl) return;

    if (currentPage >= totalPages) {
      if (loadBtn) loadBtn.style.display = 'none';
    } else {
      if (loadBtn) loadBtn.style.display = '';
    }

    if (prevArrow) {
      if (currentPage <= 1) prevArrow.classList.add('is-disabled');
      else prevArrow.classList.remove('is-disabled');
    }
    if (nextArrow) {
      if (currentPage >= totalPages) nextArrow.classList.add('is-disabled');
      else nextArrow.classList.remove('is-disabled');
    }

    var pages = [];
    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    pagesEl.innerHTML = '';
    pages.forEach(function (p) {
      var btn = document.createElement('button');
      btn.className = 'blog-pagination__page body';
      if (p === currentPage) btn.classList.add('is-active');
      if (p === '...') { btn.textContent = '...'; btn.disabled = true; }
      else { btn.textContent = p; btn.addEventListener('click', function () { currentPage = p; render(); }); }
      pagesEl.appendChild(btn);
    });
  }

  // ===== ARROWS =====
  var prevArrow = document.querySelector('.blog-pagination__arrow--prev');
  var nextArrow = document.querySelector('.blog-pagination__arrow--next');
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
  var loadBtn = document.querySelector('.blog-pagination__load');
  if (loadBtn) {
    loadBtn.addEventListener('click', function () {
      var totalPages = Math.ceil(filteredCards.length / perPage);
      if (currentPage < totalPages) { currentPage++; render(); }
    });
  }

  render();
});
