window.onload = function() {
    var main = $('main');
    $('.table_js').wrapInner('<table><tr><td></table></tr></td>');
    $('.scroll_js').wrapInner('<scroll></scroll>');
  
    var navHeight = $('nav').height();
    $('html').css('padding-top', navHeight + 40 + 'px');
  
    var socket = io.connect('https://localhost:8080', {'force new connection': true});
    
    var eventID = window.location.pathname.slice(16);
    
    socket.on('updateRegistration' + eventID, (totalPlaces, newPlacesLeft) =>{
      var lastTotalPlaces = parseInt($('#lastTotalPlaces').val());
      $('#places').attr("min", Math.max(lastTotalPlaces - newPlacesLeft, 1));
      $('#placesRequestedInfo').text(lastTotalPlaces - newPlacesLeft);
      $('#placesRequested').attr("value", lastTotalPlaces - newPlacesLeft);
    });
    
    $('#update_event').submit(()=>{
      socket.emit('updateRegistration',  $('#places').val(), $('#places').val(), $('#placesRequested').val(), 0, eventID);
    });  
  }