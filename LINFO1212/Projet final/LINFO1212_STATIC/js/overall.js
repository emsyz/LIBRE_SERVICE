window.onload = function() {
  var main = $('main');
  $('.table_js').wrapInner('<table><tr><td></table></tr></td>');
  $('.scroll_js').wrapInner('<scroll></scroll>');

  var navHeight = $('nav').height();
  $('html').css('padding-top', navHeight + 40 + 'px');

  $('time').replaceWith((index,content) => get_date(content));

  var ct1 = count_children('.search_person', 'h5');
  var ct2 = count_children('.search_events', 'h5');

  $('.search_person h3').prepend(ct1  + " ");
  $('.search_events h3').prepend(ct2 + " ");
  $('.search_total').prepend((ct1 + ct2) + " ");

}

function get_date(d){
  var date = new Date(d);
  list_month = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return date.getDate() + " " + list_month[date.getMonth()] + " " + date.getFullYear();
}

function count_children(parent, specific) {
  var count = 0;
  var ths = $(parent);
  ths.find(specific).each(function() {
      count += 1;
  });
  return count;
}