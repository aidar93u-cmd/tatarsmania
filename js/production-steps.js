document.addEventListener('DOMContentLoaded', function () {
	gsap.registerPlugin(ScrollTrigger)

	var wrappers = gsap.utils.toArray('.production-steps__card-wrapper')
	var cards = gsap.utils.toArray('.production-steps__card')

	if (!wrappers.length) return

	wrappers.forEach(function (wrapper, i) {
		var card = cards[i]
		var scale = 1
		var rotation = 0
		if (i !== cards.length - 1) {
			scale = 0.9 + 0.025 * i
			rotation = 0
		}
        gsap.to(card, {
					scale: scale,
					x: 0,
					transformOrigin: 'top center',
					ease: 'none',
					scrollTrigger: {
						trigger: wrapper,
						start: 'top ' + (100 + 120 * i),
						end: 'bottom 1200',
						endTrigger: '.production-steps__list',
						scrub: true,
						pin: wrapper,
						pinSpacing: false,
						id: i + 1,
					},
				})
	})
})
