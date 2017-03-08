var http = require('http');
var io = require('socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){ 
    // Send HTML headers and message
    res.writeHead(200,{ 'Content-Type': 'text/html' }); 
    res.end('<p style="font-family:monospace;">Listening..</p>');
});

var sock = io.listen(server);

sock.on('connection', function(socket){
  socket.emit('request',
	() => {console.log("Request")}
  ); // emit an event to the socket

  socket.emit('broadcast',
	() => {console.log("Broadcast")}
  ); // emit an event to all connected sockets

  socket.on('reply', 
	() => {console.log("Reply")}
  ); // listen to the event

  socket.on('gps',(gps_location) => {
		console.log(gps_location)
	});
});


server.listen(3000);
console.log("Server started on localhost:3000");
// console.log(server);
