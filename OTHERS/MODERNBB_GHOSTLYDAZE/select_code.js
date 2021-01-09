/*code par Ea sur le forum général de forumactif
https://forum.forumactif.com/t309759-bouton-selectionner-le-contenu-pour-les-balises-de-code
*/

function selectCode(e) {
    var s = $(e).closest("dl").find(".cont_code,code").get(0), range, selection;
    var a = s, z = s;
    while(a.nodeType == 1 && a.childNodes.length) a=a.firstChild;
    while(z.nodeType == 1 && z.childNodes.length) z=z.lastChild;
    if (!$(a).is('.fixff')) {
        var fix = $('<span class="fixff"/>').insertBefore(a);
    } else {
      a = a.nextSibling;
    }
    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(s);æ
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.setStart(a, 0);
        range.setEnd(z, z.nodeValue ? z.nodeValue.length : 0);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
$(function(){$("dl.codebox:not(.spoiler,.hidecode)  > dd.code, dl.codebox:not(.spoiler,.hidecode)  > dd > code").closest("dl").find('dt').append('<pl onClick="selectCode(this)" style="display: inline-block; position: relative; top: -4px; left: 100%; margin-left: -185px;">tous les attraper //</pl>')});
