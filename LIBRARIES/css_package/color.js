//var colorWell = document.querySelector("#color1");
var colorWell

window.addEventListener("load", startup, false);

function startup() {
    $('input[type=color]').each(function() {
        var varbl = $(this).attr('varToChange');
        var startColor = $('HTML').css(varbl);
        startColor = startColor.replace(' ', '');
        $(this).attr('value', startColor);

        $(this).bind('input', updateFirst);
        $(this).bind('change', updateFinal);
    });
}

function updateFirst(event) {
    var col = event.target.value;
    var ths = $(this);
    var varbl = ths.attr('varToChange');
    $('HTML').css(varbl, col);
}


function updateFinal(event) {

}
