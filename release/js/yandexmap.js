ymaps.ready(initYandexMap)

function initYandexMap() {
	var mapCenter = [55.779, 49.124]

	var map = new ymaps.Map(
		'showroomMap',
		{
			center: mapCenter,
			zoom: 13,
			controls: ['zoomControl'],
		},
		{
			suppressMapOpenBlock: true,
			restrictZoom: false,
		},
	)

	map.behaviors.disable('scrollZoom')

	var pinSvg =
		'<svg width="23" height="30" viewBox="0 0 23 30" fill="none" xmlns="http://www.w3.org/2000/svg">' +
		'<path d="M23 11.7073C23 20.4878 11.5 30 11.5 30C11.5 30 0 20.4878 0 11.7073C0 5.24154 5.14873 0 11.5 0C17.8513 0 23 5.24154 23 11.7073Z" fill="#212121"/>' +
		'<path d="M11.425 18H10.5218V9.69413C10.2071 9.71035 9.86674 9.75993 9.49303 9.84426C8.18112 10.1406 7.37109 9.95273 7 9.79282V9.16175C7.08941 9.20984 7.78405 9.43237 9.11813 9.27021C9.62691 9.20841 10.1172 9 10.7556 9H11.425V18ZM12.2444 9C12.8828 9 13.3731 9.20841 13.8819 9.27021C15.2158 9.43235 15.9104 9.20988 16 9.16175V9.79282C15.6289 9.95272 14.8188 10.1405 13.507 9.84426C13.1333 9.75993 12.7929 9.71034 12.4782 9.69413V18H11.575V9H12.2444Z" fill="white"/>' +
		'</svg>'

	var isMobile = window.innerWidth <= 690

	var iconSize = [23, 30]

	// coordinate point is bottom center of pin
	var iconOffset = [-11.5, -30]

	document
		.querySelectorAll('.showroom-card[data-lat][data-lng]')
		.forEach(function (card) {
			var lat = parseFloat(card.dataset.lat)
			var lng = parseFloat(card.dataset.lng)

			var name =
				card.querySelector('.showroom-card__name')?.textContent.trim() || ''
			var address =
				card.querySelector('.showroom-card__address')?.textContent.trim() || ''
			var phone =
				card.querySelector('.showroom-card__phone')?.textContent.trim() || ''
			var hours =
				card.querySelector('.showroom-card__hours')?.textContent.trim() || ''

			var phoneRaw = phone.replace(/\s|\(|\)|-/g, '')

			var statusText = 'Открыто'
			var statusClass = 'is-open'

			var open = card.dataset.open
			var close = card.dataset.close

			if (open && close) {
				var now = new Date()
				var currentMinutes = now.getHours() * 60 + now.getMinutes()

				var openParts = open.split(':')
				var closeParts = close.split(':')

				var openMinutes =
					parseInt(openParts[0], 10) * 60 + parseInt(openParts[1], 10)

				var closeMinutes =
					parseInt(closeParts[0], 10) * 60 + parseInt(closeParts[1], 10)

				if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
					statusText = 'Закрыто'
					statusClass = 'is-close'
				}
			}

			var balloonHtml =
				'<div class="map-balloon">' +
				'<div class="map-balloon__header">' +
				'<div class="map-balloon__name">' +
				name +
				'</div>' +
				'</div>' +
				'<div class="map-balloon__body">' +
				'<div class="map-balloon__row map-balloon__row--address">' +
				'<span>' +
				address +
				'</span>' +
				'<span>' +
				hours +
				'</span>' +
				'</div>' +
				'<div class="map-balloon__row">' +
				'<a href="tel:' +
				phoneRaw +
				'" class="map-balloon__phone">' +
				phone +
				'</a>' +
				'</div>' +
				'<div class="map-balloon__row map-balloon__row--status">' +
				'<span class="' +
				statusClass +
				'">' +
				statusText +
				'</span>' +
				'</div>' +
				'</div>' +
				'</div>'

			var placemark = new ymaps.Placemark(
				[lat, lng],
				{
					balloonContent: balloonHtml,
					hintContent: name,
				},
				{
					iconLayout: 'default#imageWithContent',

					iconImageHref:
						'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSvg),

					iconImageSize: iconSize,
					iconImageOffset: [-11.5, -30],

					balloonShadow: false,

					balloonOffset: [0, -130],

					balloonPane: 'balloon',
				},
			)

			map.geoObjects.add(placemark)
		})
}
