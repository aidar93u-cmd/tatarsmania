document.addEventListener('DOMContentLoaded', function () {

    var $accordions = $('.partnership-accordion')

    $accordions.each(function () {
        var $this = $(this)
        if ($this.hasClass('partnership-accordion--open')) {
            $this.find('.partnership-accordion__body').show()
        }
    })

    $('.partnership-accordion__header').on('click', function () {
        var $accordion = $(this).closest('.partnership-accordion')
        var $body = $accordion.find('.partnership-accordion__body')
        $accordion.toggleClass('partnership-accordion--open')
        $body.stop(true, true).slideToggle(600)
    })

})
