(function () {
    'use strict'

    // ===== Accordion Toggle =====
    var accordionHeaders = document.querySelectorAll('.partnership-accordion__header')
    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var accordion = this.closest('.partnership-accordion')
            if (accordion) {
                accordion.classList.toggle('partnership-accordion--open')
            }
        })
    })

})()
