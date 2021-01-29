$('#change_inscription_button').click(function() {
    $('#unsubscribe_form').hide();
    $('#change_inscription_form').show();
});

$('#unsubscribe_button').click(function() {
    $('#unsubscribe_form').show();
    $('#change_inscription_form').hide();
});

$('#delete_event_button').click(function() {
    $('#delete_event_form').show();
});
