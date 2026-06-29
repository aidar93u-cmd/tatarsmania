(function () {
    var overlay = document.getElementById('logoutModal');
    if (!overlay) return;

    var modal = overlay.querySelector('.logout-modal');
    var confirmBtn = overlay.querySelector('.logout-modal__confirm');
    var cancelBtn = overlay.querySelector('.logout-modal__cancel');
    var closeBtn = overlay.querySelector('.logout-modal__close');
    var trigger = document.querySelector('.account-nav__link--logout');

    function open() {
        overlay.classList.add('logout-overlay--visible');
        overlay.classList.remove('logout-overlay--hidden');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(function () {
            modal.classList.add('logout-modal--visible');
        });
    }

    function close() {
        modal.classList.remove('logout-modal--visible');
        overlay.classList.add('logout-overlay--hidden');
        document.body.style.overflow = '';
        setTimeout(function () {
            overlay.classList.remove('logout-overlay--visible');
        }, 300);
    }

    if (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            open();
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', close);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('logout-overlay--visible')) close();
    });
})();
