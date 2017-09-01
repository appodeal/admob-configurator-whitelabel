var Modal;
Modal = function() {
    if (!$(".ad_mediator_popup").length) {
        var popup = [
            '<div class="ad_mediator_popup" data-popup="ad_mediator_popup-1">',
            '    <div class="ad_mediator_popup-inner">',
            '        <div class="ad_mediator_popup-scroll">',
            '          <h2 class="ad_mediator_popup-title"></h2>',
            '          <p class="ad_mediator_popup-content"></p>',
            '        </div>',
            '        <p><a data-popup-close="ad_mediator_popup-1" href="#">Close</a></p>',
            '        <a class="ad_mediator_popup-close" data-popup-close="ad_mediator_popup-1" href="#">x</a>',
            '    </div>',
            '</div>'
        ].join('');
        $("body").append(popup);
    }
    this.popup = $(".ad_mediator_popup");
    this.title = $(".ad_mediator_popup-title");
    this.content = $(".ad_mediator_popup-content");
    var closeScript = "$('[data-popup-close]').on('click', function(e){$('.ad_mediator_popup').fadeOut(350); e.preventDefault();});";
    run_script(closeScript);
};

// show modal dialog
Modal.prototype.show = function(title, content) {
    this.title.html(title);
    this.content.html(content);
    this.popup.fadeIn(350);
};