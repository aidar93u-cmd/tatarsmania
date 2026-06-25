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
    var $accordionItems = $('.production-accordion__item');

    $accordionItems.each(function () {
        var $this = $(this);
        if ($this.hasClass('production-accordion__item--open')) {
            $this.find('.production-accordion__body').show();
        }
    });

    $('.production-accordion__header').on('click', function () {
        var $item = $(this).closest('.production-accordion__item');
        var $body = $item.find('.production-accordion__body');
        $item.toggleClass('production-accordion__item--open');
        $body.stop(true, true).slideToggle(600);
    });

});
