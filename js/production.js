document.addEventListener('DOMContentLoaded', function () {

    /* ===== VIDEO PLAY / PAUSE / MUTE ===== */
    var videoWrap = document.querySelector('.production-video__wrap');
    if (videoWrap) {
        var video = videoWrap.querySelector('.production-video__video');
        var playBtn = videoWrap.querySelector('.production-video__play');
        var pauseBtn = videoWrap.querySelector('.production-video__pause');
        var muteBtn = videoWrap.querySelector('.production-video__mute');
        var content = videoWrap.closest('.production-video__holder').querySelector('.production-video__content');

        if (video && playBtn && pauseBtn && muteBtn && content) {
            var muteIconOn = muteBtn.querySelector('.production-video__mute-on');
            var muteIconOff = muteBtn.querySelector('.production-video__mute-off');

            playBtn.addEventListener('click', function () {
                video.play();
                videoWrap.classList.add('is-playing');
                content.classList.add('is-playing');
            });

            pauseBtn.addEventListener('click', function () {
                video.pause();
                videoWrap.classList.remove('is-playing');
                content.classList.remove('is-playing');
            });

            muteBtn.addEventListener('click', function () {
                video.muted = !video.muted;
                muteIconOn.style.display = video.muted ? 'none' : 'block';
                muteIconOff.style.display = video.muted ? 'block' : 'none';
                muteBtn.setAttribute('aria-label', video.muted ? 'Р’РєР»СЋС‡РёС‚СЊ Р·РІСѓРє' : 'Р’С‹РєР»СЋС‡РёС‚СЊ Р·РІСѓРє');
            });

            videoWrap.addEventListener('click', function (e) {
                if (e.target === playBtn || playBtn.contains(e.target)) return;
                if (e.target === pauseBtn || pauseBtn.contains(e.target)) return;
                if (e.target === muteBtn || muteBtn.contains(e.target)) return;
                if (video.paused) {
                    video.play();
                    videoWrap.classList.add('is-playing');
                    content.classList.add('is-playing');
                } else {
                    video.pause();
                    videoWrap.classList.remove('is-playing');
                    content.classList.remove('is-playing');
                }
            });
        }
    }

    /* ===== ACCORDION ===== */
/* Accordion functionality is now handled in main.js (shared implementation) */
/* This file no longer contains accordion initialization to prevent duplicate animations */

});
document.addEventListener('DOMContentLoaded', function () {
	gsap.registerPlugin(ScrollTrigger)

	var wrappers = gsap.utils.toArray(
		'.production-steps--desktop .production-steps__card-wrapper',
	)
	var cards = gsap.utils.toArray(
		'.production-steps--desktop .production-steps__card',
	)

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
			scale: 1,
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
 