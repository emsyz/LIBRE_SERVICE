window.onload = function() {
    var main = $('main');
    $('.table_js').wrapInner('<table><tr><td></table></tr></td>');
    $('.scroll_js').wrapInner('<scroll></scroll>');
  
    var navHeight = $('nav').height();
    $('html').css('padding-top', navHeight + 40 + 'px');
  
    $('time').replaceWith((index,content) => get_date(content));
    
    var socket = io.connect('https://localhost:8080', {'force new connection': true});
    var eventID = window.location.pathname.slice(12)
    socket.on('updateRegistration' + eventID, (newTotalPlaces, newPlacesLeft) =>{
      if (!$('#lastPlacesRequested').val()){
        $('#placesLeft').attr("value", newPlacesLeft);
        $('#placesRequested').attr("max", newPlacesLeft);
        if(newPlacesLeft > 0){
          $('#first_inscription').removeClass('hidde').show();
          $('#completeTitle').addClass('hidde').hide();
          $('#completeWarning').addClass('hidde').hide();
        } else{
          $('#first_inscription').addClass('hidde').hide();
          $('#completeTitle').removeClass('hidde').show();
          $('#completeWarning').removeClass('hidde').show();
        }
      } else {
        $('#placesRequested').attr("max", (newPlacesLeft + parseInt($('#lastPlacesRequested').val())));
        $('#placesLeft').attr("value", newPlacesLeft);
        $('#newPlacesLeft').text(newPlacesLeft+parseInt($('#lastPlacesRequested').val()));
      }
      $('#totalPlaces').attr("value", newTotalPlaces);
      $('#places').text((newPlacesLeft <=0) ? "Complet" : newPlacesLeft + "/ " + newTotalPlaces +" place(s) disponible(s)")
    });
    
    $('#first_inscription').submit(()=>{
      socket.emit('updateRegistration',  $('#totalPlaces').val(), $('#placesLeft').val(), $('#placesRequested').val(), 0, eventID);
    });
  
    $('#unsubscribe_form').submit(()=>{
      socket.emit('updateRegistration', $('#totalPlaces').val(), $('#placesLeft').val(), 0, $('#lastPlacesRequested').val(), eventID);
    });
  
    $('#change_inscription_form').submit(()=>{
      socket.emit('updateRegistration', $('#totalPlaces').val(), $('#placesLeft').val(), $('#placesRequested').val(), $('#lastPlacesRequested').val(), eventID);
    });
  
  }
  
  function get_date(d){
    var date = new Date(d);
    list_month = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    return date.getDate() + " " + list_month[date.getMonth()] + " " + date.getFullYear();
  }