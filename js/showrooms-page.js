// ===== SHOWROOMS PAGE — Data, Tabs, Skeleton, Map =====

;(function () {
  'use strict'

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
        " - фото " +
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
      '<div class="showroom-card__info" data-aos="fade-up" data-aos-delay="200">' +
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
      '<div class="showroom-card__photos" data-aos="fade-up" data-aos-delay="400">' +
      photoLinks +
      '</div>' +
      '<a href="' +
      item.mapsUrl +
      '" target="_blank" class="btn-yandex" data-aos="fade-up" data-aos-delay="600">' +
      svgPin +
      'ПОСТРОИТЬ МАРШРУТ' +
      '</a>' +
      '</div>'
    )
  }

  // ---- Render cards ----
  function renderCards(data) {
    var html = ''
    for (var i = 0; i < data.length; i++) {
      html += buildCardHTML(data[i], i)
    }
    listEl.innerHTML = html
    countEl.textContent = 'Найдено ' + data.length + ' шоурумов'

    if (window.updateShowroomStatus) {
      window.updateShowroomStatus()
    }
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

    var filtered
    if (city === 'all') {
      filtered = pageData
    } else {
      filtered = []
      for (var j = 0; j < pageData.length; j++) {
        if (pageData[j].city === city) {
          filtered.push(pageData[j])
        }
      }
    }

    renderCards(filtered)
    updateMapMarkers(city)

    if (window.AOS) {
      AOS.refresh()
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

  // ---- Skeleton → Content ----
  function showContent() {
    switchTab('all')

    skeletonEl.style.transition = 'opacity 0.5s ease-out'
    skeletonEl.style.opacity = '0'

    setTimeout(function () {
      skeletonEl.style.display = 'none'
      sectionEl.style.display = 'block'
      initShowroomsMap()
    }, 500)
  }

  // ---- Map ----
  function initShowroomsMap() {
    if (typeof ymaps === 'undefined') {
      setTimeout(initShowroomsMap, 500)
      return
    }

    ymaps.ready(function () {
      var mapCenter = [55.79, 49.12]

      showroomsMap = new ymaps.Map(
        'showroomMap',
        {
          center: mapCenter,
          zoom: 5,
          controls: ['zoomControl'],
        },
        {
          suppressMapOpenBlock: true,
          restrictZoom: false,
        },
      )

      showroomsMap.behaviors.disable('scrollZoom')

      buildAllMarkers()
      updateMapMarkers('all')
    })
  }

  var pinSvg =
    '<svg width="23" height="30" viewBox="0 0 23 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 11.7073C23 20.4878 11.5 30 11.5 30C11.5 30 0 20.4878 0 11.7073C0 5.24154 5.14873 0 11.5 0C17.8513 0 23 5.24154 23 11.7073Z" fill="#212121"/><path d="M11.425 18H10.5218V9.69413C10.2071 9.71035 9.86674 9.75993 9.49303 9.84426C8.18112 10.1406 7.37109 9.95273 7 9.79282V9.16175C7.08941 9.20984 7.78405 9.43237 9.11813 9.27021C9.62691 9.20841 10.1172 9 10.7556 9H11.425V18ZM12.2444 9C12.8828 9 13.3731 9.20841 13.8819 9.27021C15.2158 9.43235 15.9104 9.20988 16 9.16175V9.79282C15.6289 9.95272 14.8188 10.1405 13.507 9.84426C13.1333 9.75993 12.7929 9.71034 12.4782 9.69413V18H11.575V9H12.2444Z" fill="white"/></svg>'

  function buildAllMarkers() {
    var isMobile = window.innerWidth <= 690
    var iconSize = [23, 30]
    var iconOffset = isMobile ? [-25, -50] : [-16, -40]

    var now = new Date()
    var currentMinutes = now.getHours() * 60 + now.getMinutes()

    cityToMarkers = {}

    for (var i = 0; i < pageData.length; i++) {
      ;(function (item) {
        var open = item.open
        var close = item.close
        var statusText = 'Открыто'
        if (open && close) {
          var oh = parseInt(open.split(':')[0], 10)
          var om = parseInt(open.split(':')[1], 10)
          var ch = parseInt(close.split(':')[0], 10)
          var cm = parseInt(close.split(':')[1], 10)
          var openMin = oh * 60 + om
          var closeMin = ch * 60 + cm
          if (currentMinutes < openMin || currentMinutes >= closeMin) {
            statusText = 'Закрыто'
          }
        }

        var balloonHtml =
          '<div class="map-balloon">' +
          '<div class="map-balloon__body">' +
          '<div class="map-balloon__row map-balloon__row--address"><span>' +
          item.address +
          '</span><span>' +
          item.hours +
          '</span></div>' +
          '<div class="map-balloon__row"><a href="tel:' +
          item.phoneRaw +
          '" class="map-balloon__phone">' +
          item.phone +
          '</a></div>' +
          '<div class="map-balloon__row map-balloon__row--status"><span>' +
          statusText +
          '</span></div>' +
          '</div>' +
          '</div>'

        var placemark = new ymaps.Placemark(
          [item.lat, item.lng],
          { balloonContent: balloonHtml, hintContent: item.name },
          {
            iconLayout: 'default#imageWithContent',
            iconImageHref:
              'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSvg),
            iconImageSize: iconSize,
            iconImageOffset: iconOffset,
            balloonShadow: false,
          },
        )

        if (!cityToMarkers[item.city]) {
          cityToMarkers[item.city] = []
        }
        cityToMarkers[item.city].push(placemark)
      })(pageData[i])
    }
  }

  function updateMapMarkers(city) {
    if (!showroomsMap) return

    showroomsMap.geoObjects.removeAll()

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
      showroomsMap.geoObjects.add(markers[i])
    }

    if (markers.length > 0) {
      showroomsMap.setBounds(showroomsMap.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 50,
      })
    }
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', function () {
    initTabs()

    setTimeout(function () {
      showContent()
    }, 800)
  })
})()
