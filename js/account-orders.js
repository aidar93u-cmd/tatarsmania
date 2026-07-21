;(function () {
	'use strict'

	var PER_PAGE = 6

	var TAB_FILTERS = {
		active: ['processing', 'confirmed', 'transit'],
		completed: ['completed', 'canceled'],
	}

	var st = { tab: 'active', sort: 'default', page: 1 }
	var dom = {}

	function collectCards() {
		return Array.prototype.slice.call(dom.list.querySelectorAll('.orders-card'))
	}

	function filterByTab(cards) {
		var allowed = TAB_FILTERS[st.tab] || TAB_FILTERS.active
		return cards.filter(function (c) {
			return allowed.indexOf(c.dataset.status) !== -1
		})
	}

	function countFiltered() {
		return filterByTab(collectCards()).length
	}

	function sortCards(cards) {
		var sorted = cards.slice()
		switch (st.sort) {
			case 'date-old':
				sorted.sort(function (a, b) {
					return a.dataset.date.localeCompare(b.dataset.date)
				})
				break
			case 'id':
				sorted.sort(function (a, b) {
					return parseInt(a.dataset.id, 10) - parseInt(b.dataset.id, 10)
				})
				break
			case 'amount-asc':
				sorted.sort(function (a, b) {
					return parseFloat(a.dataset.total) - parseFloat(b.dataset.total)
				})
				break
			case 'amount-desc':
				sorted.sort(function (a, b) {
					return parseFloat(b.dataset.total) - parseFloat(a.dataset.total)
				})
				break
			default:
				sorted.sort(function (a, b) {
					return b.dataset.date.localeCompare(a.dataset.date)
				})
		}
		return sorted
	}

	function arrangeDOM() {
		var all = collectCards()
		var filtered = filterByTab(all)
		var sorted = sortCards(filtered)
		var total = sorted.length
		var totalPages = Math.ceil(total / PER_PAGE) || 1
		if (dom.pagination) dom.pagination.style.display = totalPages <= 1 ? 'none' : ''
		var p = Math.min(st.page, totalPages)
		var start = (p - 1) * PER_PAGE
		var pageCards = sorted.slice(start, start + PER_PAGE)

		all.forEach(function (c) {
			c.style.display = 'none'
		})
		pageCards.forEach(function (c) {
			c.style.display = ''
		})

		var parent = dom.list
		var ref = parent.firstChild
		pageCards.forEach(function (c) {
			parent.insertBefore(c, ref)
			ref = c.nextSibling
		})

		var n = total
		var w = ['заказ', 'заказа', 'заказов']
		var cs = [2, 0, 1, 1, 1, 2]
		dom.count.textContent =
			'Всего ' +
			n +
			' ' +
			w[n % 100 > 4 && n % 100 < 20 ? 2 : cs[Math.min(n % 10, 5)]]

		var startI = (p - 1) * PER_PAGE + 1
		var endI = Math.min(p * PER_PAGE, total)
		dom.paginationInfo.textContent =
			total > 0
				? 'Показано ' + startI + '\u2013' + endI + ' из ' + total
				: 'Нет заказов'

		dom.loadMore.style.display = p < totalPages ? '' : 'none'
		dom.pageLinks.forEach(function (btn, i) {
			var np = i + 1
			btn.style.display = np <= totalPages ? '' : 'none'
			btn.classList.toggle('pagination__link--active', np === p)
		})
		dom.prevArrow.classList.toggle('pagination__arrow--disabled', p <= 1)
		dom.nextArrow.classList.toggle(
			'pagination__arrow--disabled',
			p >= totalPages,
		)
	}

	function wrapWithSkeleton(fn) {
		dom.list.classList.add('orders-list--loading')
		dom.skeleton.classList.add('orders-skeleton--visible')
		setTimeout(function () {
			fn()
			dom.list.classList.remove('orders-list--loading')
			dom.skeleton.classList.remove('orders-skeleton--visible')
			initGalleries()
		}, 400)
	}

	function initGalleries() {
		dom.list.querySelectorAll('.js-order-gallery').forEach(function (el) {
			if (el.offsetParent === null) return
			if (el.swiper) {
				el.swiper.update()
				return
			}
			if (el.querySelectorAll('.swiper-slide').length < 2) return
			if (!el._galleryClickGuard) {
				el._galleryClickGuard = true
				el.addEventListener('click', function (e) {
					if (el.swiper && el.swiper.touches.diff !== 0) e.preventDefault()
				})
			}
			el.swiper = new Swiper(el, {
				slidesPerView: 3,
				spaceBetween: 6,
				speed: 400,
				simulateTouch: true,
				navigation: {
					nextEl: el.querySelector('.js-gallery-next'),
					prevEl: el.querySelector('.js-gallery-prev'),
				},
			})
		})
	}

	function onTabClick(tab) {
		if (tab === st.tab) return
		st.tab = tab
		st.page = 1
		dom.tabs.forEach(function (b) {
			b.classList.toggle('orders-tabs__btn--active', b.dataset.tab === tab)
		})
		wrapWithSkeleton(arrangeDOM)
	}

	function onSortChange(sort) {
		if (sort === st.sort) return
		st.sort = sort
		st.page = 1
		wrapWithSkeleton(arrangeDOM)
	}

	function onPageNav(page) {
		var total = countFiltered()
		var tp = Math.ceil(total / PER_PAGE) || 1
		if (page === 'prev') page = st.page - 1
		if (page === 'next') page = st.page + 1
		page = Math.max(1, Math.min(page, tp))
		if (page === st.page) return
		st.page = page
		window.scrollTo({ top: 0, behavior: 'smooth' })
		wrapWithSkeleton(arrangeDOM)
	}

	function onLoadMore() {
		var total = countFiltered()
		if (st.page < Math.ceil(total / PER_PAGE)) {
			st.page++
			window.scrollTo({ top: 0, behavior: 'smooth' })
			wrapWithSkeleton(arrangeDOM)
		}
	}

	function boot() {
		dom.list = document.querySelector('.js-orders-list')
		dom.skeleton = document.querySelector('.js-orders-skeleton')
		dom.pagination = document.querySelector('.js-orders-pagination')
		dom.count = document.querySelector('.js-orders-count')
		dom.tabs = document.querySelectorAll('.js-orders-tabs .orders-tabs__btn')
		dom.paginationInfo = document.querySelector('.js-pagination-info')
		dom.loadMore = document.querySelector('.js-load-more')
		dom.pageLinks = document.querySelectorAll('.js-page-nav .pagination__link')
		dom.prevArrow = document.querySelector(
			'.js-page-nav .pagination__arrow--prev',
		)
		dom.nextArrow = document.querySelector(
			'.js-page-nav .pagination__arrow--next',
		)

		if (!dom.list) return

		dom.tabs.forEach(function (b) {
			b.addEventListener('click', function () {
				onTabClick(b.dataset.tab)
			})
		})

		document.addEventListener('sort:change', function (e) {
			if (e.detail.containerId === 'orders-sort') {
				onSortChange(e.detail.sortKey)
			}
		})

		document
			.querySelector('.js-page-nav')
			.addEventListener('click', function (e) {
				var t = e.target.closest('[data-page]')
				if (t) onPageNav(t.dataset.page)
			})
		dom.loadMore.addEventListener('click', onLoadMore)

		arrangeDOM()
		initGalleries()
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot)
	} else {
		boot()
	}
})()
