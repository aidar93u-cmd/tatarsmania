// ===== YANDEX MAP v3 — SHARED =====

;(function () {
  'use strict'

  var pinSvg =
    '<svg width="23" height="30" viewBox="0 0 23 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 11.7073C23 20.4878 11.5 30 11.5 30C11.5 30 0 20.4878 0 11.7073C0 5.24154 5.14873 0 11.5 0C17.8513 0 23 5.24154 23 11.7073Z" fill="#212121"/><path d="M11.425 18H10.5218V9.69413C10.2071 9.71035 9.86674 9.75993 9.49303 9.84426C8.18112 10.1406 7.37109 9.95273 7 9.79282V9.16175C7.08941 9.20984 7.78405 9.43237 9.11813 9.27021C9.62691 9.20841 10.1172 9 10.7556 9H11.425V18ZM12.2444 9C12.8828 9 13.3731 9.20841 13.8819 9.27021C15.2158 9.43235 15.9104 9.20988 16 9.16175V9.79282C15.6289 9.95272 14.8188 10.1405 13.507 9.84426C13.1333 9.75993 12.7929 9.71034 12.4782 9.69413V18H11.575V9H12.2444Z" fill="white"/></svg>'

  function buildBalloonHtml(address, hours, phone, phoneRaw, statusText) {
    return (
      '<div class="map-balloon__content">' +
      '<div class="map-balloon__address"><span>' +
      address +
      '</span><br><span>' +
      hours +
      '</span></div>' +
      '<a href="tel:' +
      phoneRaw +
      '" class="map-balloon__phone">' +
      phone +
      '</a></div>' +
      '<div class="map-balloon__status ' +
      (statusText === 'Открыто' ? 'is-open' : 'is-close') +
      '">' +
      statusText +
      '</div>'
    )
  }

  function calcStatus(open, close) {
    var now = new Date()
    var currentMinutes = now.getHours() * 60 + now.getMinutes()
    if (open && close) {
      var oh = parseInt(open.split(':')[0], 10)
      var om = parseInt(open.split(':')[1], 10)
      var ch = parseInt(close.split(':')[0], 10)
      var cm = parseInt(close.split(':')[1], 10)
      var openMin = oh * 60 + om
      var closeMin = ch * 60 + cm
      if (currentMinutes < openMin || currentMinutes >= closeMin) {
        return 'Закрыто'
      }
    }
    return 'Открыто'
  }

  

  function closeAllBalloons() {
    document.querySelectorAll('.custom-balloon.is-visible').forEach(function (b) {
      b.classList.remove('is-visible')
    })
  }

  document.addEventListener('click', closeAllBalloons)

  var YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker

  function ensureV3Api() {
    return new Promise(function (resolve) {
      var check = function () {
        if (typeof ymaps3 !== 'undefined' && ymaps3.ready) {
          ymaps3.ready.then(function () {
            YMap = ymaps3.YMap
            YMapDefaultSchemeLayer = ymaps3.YMapDefaultSchemeLayer
            YMapDefaultFeaturesLayer = ymaps3.YMapDefaultFeaturesLayer
            YMapMarker = ymaps3.YMapMarker
            resolve()
          })
        } else {
          setTimeout(check, 200)
        }
      }
      check()
    })
  }

  // ===== SIMPLE MAP MODE (index.html, contacts.html, checkout.html) =====
  function initSimpleMap() {
    var container = document.getElementById('showroomMap')
    if (!container) return

    showroomsMap = new YMap(container, {
      location: {
        center: [49.124, 55.779],
        zoom: 13,
      },
    })
    showroomsMap.addChild(new YMapDefaultSchemeLayer())

    showroomsMap.addChild(new YMapDefaultFeaturesLayer())

    var checkoutMode = document.querySelector('.checkout-delivery__map')
    if (checkoutMode) {
      window.__checkoutMap = showroomsMap
      window.__checkoutMarkers = []
    }

    document.querySelectorAll('.showroom-card[data-lat][data-lng]').forEach(function (card, index) {
      var lat = parseFloat(card.dataset.lat)
      var lng = parseFloat(card.dataset.lng)
      var name = card.querySelector('.showroom-card__name').textContent
      var address = card.querySelector('.showroom-card__address').textContent
      var phone = card.querySelector('.showroom-card__phone').textContent
      var hours = card.querySelector('.showroom-card__hours').textContent
      var phoneRaw = phone.replace(/\s|\(|\)|-/g, '')
      var statusText = calcStatus(card.dataset.open, card.dataset.close)
      var balloonHtml = buildBalloonHtml(address, hours, phone, phoneRaw, statusText)
      var markerEl = createMarkerElement(lat, lng, balloonHtml)
      var marker = new YMapMarker({ coordinates: [lng, lat] }, markerEl)
      showroomsMap.addChild(marker)

      if (checkoutMode) {
        window.__checkoutMarkers.push(marker)
        markerEl.addEventListener('click', function () {
          var select = document.querySelector('.checkout-delivery__select')
          if (select && select.options[index]) {
            select.selectedIndex = index
          }
        })
      }
    })
  }
  

  // ===== SHOWROOMS PAGE MODE =====
  var pageData = [
    // === Казань ===
    {
      city: 'казань',
      name: 'Чистопольская',
      address: 'г. Казань, Чистопольская 16/15',
      hours: 'Ежедневно 10:00-22:00',
      phone: '+7 (843) 528-08-44',
      phoneRaw: '78435280844',
      lat: 55.7878,
      lng: 49.1663,
      open: '10:00',
      close: '22:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/-/CDx~jK~r',
    },
    {
      city: 'казань',
      name: 'Проспект Победы',
      address: 'г. Казань, Проспект Победы 230',
      hours: 'Ежедневно 10:00-18:00',
      phone: '+7 (843) 570-63-45',
      phoneRaw: '78435706345',
      lat: 55.8041,
      lng: 49.1316,
      open: '10:00',
      close: '18:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/-/CDx~jK~r',
    },
    {
      city: 'казань',
      name: 'Баумана',
      address: 'г. Казань, ул. Баумана 44',
      hours: 'Ежедневно 10:00-21:00',
      phone: '+7 (843) 200-00-01',
      phoneRaw: '78432000001',
      lat: 55.7909,
      lng: 49.1081,
      open: '10:00',
      close: '21:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg'],
      mapsUrl: 'https://yandex.ru/maps/-/CDx~jK~r',
    },
    {
      city: 'казань',
      name: 'Савиново',
      address: 'г. Казань, ул. Савинова 12',
      hours: 'Ежедневно 09:00-20:00',
      phone: '+7 (843) 528-08-50',
      phoneRaw: '78435280850',
      lat: 55.8314,
      lng: 49.1738,
      open: '09:00',
      close: '20:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/-/CDx~jK~r',
    },
    {
      city: 'казань',
      name: 'Меридиан',
      address: 'г. Казань, ул. Меридианная 8',
      hours: 'Ежедневно 10:00-21:00',
      phone: '+7 (843) 528-08-55',
      phoneRaw: '78435280855',
      lat: 55.7536,
      lng: 49.1316,
      open: '10:00',
      close: '21:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg'],
      mapsUrl: 'https://yandex.ru/maps/-/CDx~jK~r',
    },
    {
      city: 'казань',
      name: 'Горки',
      address: 'г. Казань, пр. Победы 100',
      hours: 'Ежедневно 10:00-20:00',
      phone: '+7 (843) 528-08-60',
      phoneRaw: '78435280860',
      lat: 55.7954,
      lng: 49.1231,
      open: '10:00',
      close: '20:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/-/CDx~jK~r',
    },
    // === Москва ===
    {
      city: 'москва',
      name: 'Тверская',
      address: 'г. Москва, ул. Тверская 12',
      hours: 'Ежедневно 10:00-22:00',
      phone: '+7 (495) 123-45-67',
      phoneRaw: '74951234567',
      lat: 55.7612,
      lng: 37.6135,
      open: '10:00',
      close: '22:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    {
      city: 'москва',
      name: 'Кутузовский',
      address: 'г. Москва, Кутузовский пр-т 48',
      hours: 'Ежедневно 10:00-21:00',
      phone: '+7 (495) 234-56-78',
      phoneRaw: '74952345678',
      lat: 55.7424,
      lng: 37.5397,
      open: '10:00',
      close: '21:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    {
      city: 'москва',
      name: 'Садовая',
      address: 'г. Москва, Садовая-Кудринская 25',
      hours: 'Ежедневно 11:00-20:00',
      phone: '+7 (495) 345-67-89',
      phoneRaw: '74953456789',
      lat: 55.7689,
      lng: 37.5927,
      open: '11:00',
      close: '20:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    // === Санкт-Петербург ===
    {
      city: 'санкт-петербург',
      name: 'Невский',
      address: 'г. Санкт-Петербург, Невский пр-т 85',
      hours: 'Ежедневно 10:00-22:00',
      phone: '+7 (812) 123-45-67',
      phoneRaw: '78121234567',
      lat: 59.9311,
      lng: 30.3609,
      open: '10:00',
      close: '22:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    {
      city: 'санкт-петербург',
      name: 'Большой пр.',
      address: 'г. Санкт-Петербург, Большой пр. П.С. 62',
      hours: 'Ежедневно 10:00-21:00',
      phone: '+7 (812) 234-56-78',
      phoneRaw: '78122345678',
      lat: 59.9602,
      lng: 30.3016,
      open: '10:00',
      close: '21:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    // === Екатеринбург ===
    {
      city: 'екатеринбург',
      name: 'Ленина',
      address: 'г. Екатеринбург, пр-т Ленина 50',
      hours: 'Ежедневно 10:00-20:00',
      phone: '+7 (343) 123-45-67',
      phoneRaw: '73431234567',
      lat: 56.8361,
      lng: 60.6128,
      open: '10:00',
      close: '20:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    {
      city: 'екатеринбург',
      name: 'Малышева',
      address: 'г. Екатеринбург, ул. Малышева 84',
      hours: 'Ежедневно 10:00-21:00',
      phone: '+7 (343) 234-56-78',
      phoneRaw: '73432345678',
      lat: 56.8372,
      lng: 60.5973,
      open: '10:00',
      close: '21:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    {
      city: 'екатеринбург',
      name: 'Вайнера',
      address: 'г. Екатеринбург, ул. Вайнера 16',
      hours: 'Ежедневно 11:00-20:00',
      phone: '+7 (343) 345-67-89',
      phoneRaw: '73433456789',
      lat: 56.8394,
      lng: 60.6058,
      open: '11:00',
      close: '20:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    // === Новосибирск ===
    {
      city: 'новосибирск',
      name: 'Красный пр.',
      address: 'г. Новосибирск, Красный пр-т 38',
      hours: 'Ежедневно 10:00-22:00',
      phone: '+7 (383) 123-45-67',
      phoneRaw: '73831234567',
      lat: 55.0300,
      lng: 82.9200,
      open: '10:00',
      close: '22:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg', 'showroom-1c.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
    {
      city: 'новосибирск',
      name: 'Ленина',
      address: 'г. Новосибирск, ул. Ленина 21',
      hours: 'Ежедневно 10:00-21:00',
      phone: '+7 (383) 234-56-78',
      phoneRaw: '73832345678',
      lat: 55.0285,
      lng: 82.9305,
      open: '10:00',
      close: '21:00',
      photos: ['showroom-1a.jpg', 'showroom-1b.jpg'],
      mapsUrl: 'https://yandex.ru/maps/',
    },
  ]

  // ---- State ----
  var currentCity = 'all'
  var showroomsMap = null
  var cityToMarkers = {}

  // ---- DOM refs ----
  var skeletonEl = document.getElementById('showroomsSkeleton')
  var sectionEl = document.getElementById('showroomsSection')
  var listEl = document.getElementById('showroomList')
  var countEl = document.getElementById('showroomsCount')

  // ---- Build card HTML ----
  function buildCardHTML(item, index) {
    var photoLinks = ''
    for (var i = 0; i < item.photos.length; i++) {
      photoLinks +=
        '<a data-fancybox="showroom-page-' +
        index +
        '" href="assets/images/' +
        item.photos[i] +
        '" class="showroom-card__photo">' +
        '<img src="assets/images/' +
        item.photos[i] +
        '" alt="' +
        item.name +
        ' - фото ' +
        (i + 1) +
        '">' +
        '</a>'
    }

    var svgPin =
      '<svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 8C3.25 8 6.5 5.46341 6.5 3.12195C6.5 1.39775 5.04493 0 3.25 0C1.45507 0 0 1.39775 0 3.12195C0 5.46341 3.25 8 3.25 8ZM3.25 4.29268C3.9231 4.29268 4.46875 3.76853 4.46875 3.12195C4.46875 2.47537 3.9231 1.95122 3.25 1.95122C2.5769 1.95122 2.03125 2.47537 2.03125 3.12195C2.03125 3.76853 2.5769 4.29268 3.25 4.29268Z" fill="#212121"/></svg>'

    return (
      '<div class="showroom-card" data-lat="' +
      item.lat +
      '" data-lng="' +
      item.lng +
      '" data-open="' +
      item.open +
      '" data-close="' +
      item.close +
      '" data-city="' +
      item.city +
      '">' +
      '<div class="showroom-card__info">' +
      '<h3 class="showroom-card__name body-upper">' +
      item.name +
      '</h3>' +
      '<div class="showroom-card__address_hours">' +
      '<p class="showroom-card__address">' +
      item.address +
      '</p>' +
      '<p class="showroom-card__hours">' +
      item.hours +
      '</p>' +
      '</div>' +
      '<a href="tel:' +
      item.phoneRaw +
      '" class="showroom-card__phone">' +
      item.phone +
      '</a>' +
      '<span class="showroom-card__status"></span>' +
      '</div>' +
      '<div class="showroom-card__photos">' +
      photoLinks +
      '</div>' +
      '<a href="https://yandex.ru/maps/?rtext=~' +
      item.lat + ',' + item.lng +
      '" target="_blank" class="btn-yandex">' +
      svgPin +
      'ПОСТРОИТЬ МАРШРУТ' +
      '</a>' +
      '</div>'
    )
  }

  var osInstance = null

  function initOverlayScrollbars() {
    if (typeof OverlayScrollbars === 'undefined') return
    osInstance = OverlayScrollbars(listEl, {
      className: 'os-theme-tm',
      scrollbars: {
        visibility: 'visible',
        autoHide: 'never',
      },
      overflowBehavior: {
        x: 'hidden',
        y: 'scroll',
      },
    })
    if (osInstance) {
      var hostEl = osInstance.getElements().host
      if (hostEl) hostEl.style.maxHeight = '44.375rem'
    }
  }

  // ---- Filter cards by city (toggle display) ----
  function filterCards(city) {
    var cards = listEl.querySelectorAll('.showroom-card')
    var visibleCount = 0
    for (var i = 0; i < cards.length; i++) {
      var cardCity = cards[i].getAttribute('data-city')
      if (city === 'all' || cardCity === city) {
        cards[i].style.display = ''
        visibleCount++
      } else {
        cards[i].style.display = 'none'
      }
    }
    countEl.textContent = 'Найдено ' + visibleCount + ' шоурумов'
    if (osInstance) osInstance.update()
    if (window.updateShowroomStatus) window.updateShowroomStatus()
  }

  // ---- Tab switching ----
  function switchTab(city) {
    currentCity = city

    var tabs = document.querySelectorAll('.showrooms-tabs__btn')
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('showrooms-tabs__btn--active')
    }
    var activeTab = document.querySelector(
      '.showrooms-tabs__btn[data-city="' + city + '"]',
    )
    if (activeTab) {
      activeTab.classList.add('showrooms-tabs__btn--active')
    }

    filterCards(city)
    updateMapMarkers(city)

    if (window.AOS) {
      AOS.refresh()
    }
  }

  // ---- Skeleton → Content ----
  function showContent() {
    var html = ''
    for (var i = 0; i < pageData.length; i++) {
      html += buildCardHTML(pageData[i], i)
    }
    listEl.innerHTML = html
    countEl.textContent = 'Найдено ' + pageData.length + ' шоурумов'
    initOverlayScrollbars()

    switchTab('all')

    skeletonEl.style.transition = 'opacity 0.5s ease-out'
    skeletonEl.style.opacity = '0'

    setTimeout(function () {
      skeletonEl.style.display = 'none'
      sectionEl.style.display = 'block'
      initShowroomsMap()
    }, 500)
  }

  function panToCard(lat, lng) {
    if (!showroomsMap) return

    showroomsMap.update({
      location: {
        center: [lng, lat],
        zoom: 15,
      },
    })

    document.querySelectorAll('.custom-balloon.is-visible').forEach(function (b) {
      b.classList.remove('is-visible')
    })

    var markerEl = document.querySelector('.marker[data-lat="' + lat + '"][data-lng="' + lng + '"]')
    if (markerEl) {
      var balloon = markerEl.querySelector('.custom-balloon')
      if (balloon) balloon.classList.add('is-visible')
    }
  }

  // ---- Init tabs ----
  function initTabs() {
    var tabs = document.querySelectorAll('.showrooms-tabs__btn')
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        switchTab(this.dataset.city)
      })
    }
  }

  // ---- Showrooms Page Map (v3) ----
  function initShowroomsMap() {
    if (typeof ymaps3 === 'undefined') {
      setTimeout(initShowroomsMap, 500)
      return
    }

    ymaps3.ready.then(function () {
      YMap = ymaps3.YMap
      YMapDefaultSchemeLayer = ymaps3.YMapDefaultSchemeLayer
      YMapDefaultFeaturesLayer = ymaps3.YMapDefaultFeaturesLayer
      YMapMarker = ymaps3.YMapMarker

      var container = document.getElementById('showroomMap')
      if (!container) return

      showroomsMap = new YMap(container, {
        location: {
          center: [55.79, 49.12],
          zoom: 5,
        },
      })

      showroomsMap.addChild(new YMapDefaultSchemeLayer())
      showroomsMap.addChild(new YMapDefaultFeaturesLayer())

      // In v3, scrollZoom is disabled via YMap constructor settings or by not enabling it

      buildAllMarkers()
      updateMapMarkers('all')
    })
  }

  function buildAllMarkers() {
    cityToMarkers = {}

    for (var i = 0; i < pageData.length; i++) {
      ;(function (item) {
        var statusText = calcStatus(item.open, item.close)
        var balloonHtml = buildBalloonHtml(
          item.address,
          item.hours,
          item.phone,
          item.phoneRaw,
          statusText,
        )
        var markerEl = createMarkerElement(item.lat, item.lng, balloonHtml)
        var marker = new YMapMarker({ coordinates: [item.lng, item.lat] }, markerEl)

        if (!cityToMarkers[item.city]) {
          cityToMarkers[item.city] = []
        }
        cityToMarkers[item.city].push(marker)
      })(pageData[i])
    }
  }

  function createMarkerElement(lat, lng, balloonHtml) {
    var el = document.createElement('div')
    el.className = 'marker'
    el.setAttribute('data-lat', lat)
    el.setAttribute('data-lng', lng)
    el.innerHTML =
      '<div class="marker__icon">' + pinSvg + '</div>' +
      '<div class="custom-balloon">' + balloonHtml + '</div>'

    el.addEventListener('click', function (e) {
      e.stopPropagation()
      document.querySelectorAll('.custom-balloon.is-visible').forEach(function (b) {
        if (b !== el.querySelector('.custom-balloon')) {
          b.classList.remove('is-visible')
        }
      })
      el.querySelector('.custom-balloon').classList.toggle('is-visible')

      if (showroomsMap) {
        showroomsMap.update({
          location: {
            center: [lng, lat],
            zoom: 15,
          },
        })
      }

      scrollToCard(lat, lng)
    })

    return el
  }

  function scrollToCard(lat, lng) {
    var cards = listEl.querySelectorAll('.showroom-card')
    for (var i = 0; i < cards.length; i++) {
      var cLat = parseFloat(cards[i].getAttribute('data-lat'))
      var cLng = parseFloat(cards[i].getAttribute('data-lng'))
      if (cLat === lat && cLng === lng) {
        if (typeof OverlayScrollbars !== 'undefined') {
          var osInst = OverlayScrollbars(listEl)
          if (osInst) {
            var viewport = osInst.getElements().viewport
            var scrollY = cards[i].offsetTop - (viewport.clientHeight - cards[i].offsetHeight) / 2
            osInst.scroll({ y: scrollY }, 400)
          }
        }
        break
      }
    }
  }

  var activeMapMarkers = []

  function updateMapMarkers(city) {
    if (!showroomsMap) return

    // Remove previously added markers
    for (var i = 0; i < activeMapMarkers.length; i++) {
      showroomsMap.removeChild(activeMapMarkers[i])
    }
    activeMapMarkers = []

    var markers
    if (city === 'all') {
      markers = []
      for (var key in cityToMarkers) {
        if (cityToMarkers.hasOwnProperty(key)) {
          markers = markers.concat(cityToMarkers[key])
        }
      }
    } else if (cityToMarkers[city]) {
      markers = cityToMarkers[city]
    } else {
      markers = []
    }

    for (var i = 0; i < markers.length; i++) {
      showroomsMap.addChild(markers[i])
      activeMapMarkers.push(markers[i])
    }

    // Fit bounds — v3 way using location
    if (markers.length > 0) {
      var coords = markers.map(function (m) {
        return m.coordinates
      })
      var lats = coords.map(function (c) { return c[1] })
      var lngs = coords.map(function (c) { return c[0] })
      var minLat = Math.min.apply(null, lats)
      var maxLat = Math.max.apply(null, lats)
      var minLng = Math.min.apply(null, lngs)
      var maxLng = Math.max.apply(null, lngs)

      showroomsMap.update({
        location: {
          center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
          zoom: 5,
        },
      })
    }
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.showrooms-tabs')) {
      initTabs()
      setTimeout(function () {
        showContent()
      }, 800)
    } else if (document.querySelector('#showroomMap')) {
      ensureV3Api().then(function () {
        initSimpleMap()
      })
    }

    document.addEventListener('click', function (e) {
      var card = e.target.closest('.showroom-card')
      if (card && listEl && listEl.contains(card)) {
        var lat = parseFloat(card.getAttribute('data-lat'))
        var lng = parseFloat(card.getAttribute('data-lng'))
        if (!isNaN(lat) && !isNaN(lng)) {
          panToCard(lat, lng)
        }
      }
    })
  })
})()