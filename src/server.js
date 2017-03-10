const http = require('http');
const io = require('socket.io');

let port = 14924;

// Create the server and set its response
let server = http.createServer((req, res) => { 
  res.writeHead(200,{ 'Content-Type': 'text/html' }); 
  res.end('<p style="font-family:monospace;">Listening..</p>');
});

let sock = io.listen(server);

sock.on('connection', function(socket){

  // emit an event to the socket
  socket.emit('request',
    () => {
      console.log("Request")
    }
  );

  // emit an event to all connected sockets
  socket.emit('broadcast',
    () => {
      console.log("Broadcast")
    }
  );

  socket.on('poll',
    (poll_data) => {
      console.log(poll_data)
    });
});

// Make server listen to the port
server.listen(port);
console.log("Server started on localhost:" + port);
