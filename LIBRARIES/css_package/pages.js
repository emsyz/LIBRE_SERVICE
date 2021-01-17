$('.table_js').wrapInner('<table><tr><td></table></tr></td>');
$('.scroll_js').wrapInner('<scroll></scroll>');

$('#headerExtend').on('click', function() {
    var state1 = 'shown';
    var state2 = 'shrunk';
    var header = $('header');
    var shown = header.hasClass(state1);
    if (shown) {
        header.removeClass(state1);
        header.addClass(state2);
    } else {
        header.removeClass(state2);
        header.addClass(state1);
    }
});
