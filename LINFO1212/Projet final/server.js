var app = require("./app");

var https = require('https');
var fs = require('fs');

var server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
   }, app);
   
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
    socket.on('updateRegistration', (totalPlaces, placesLeft, placesRequested, lastPlacesRequested, eventID) =>{
        socket.broadcast.emit('updateRegistration' + eventID , parseInt(totalPlaces), parseInt(placesLeft) + parseInt(lastPlacesRequested) - parseInt(placesRequested))
    });
});

server.listen(8080);