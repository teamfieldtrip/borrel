const http = require('http')
const io = require('socket.io')

const port = 14924

// Create the server and set its response
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<p style="font-family:monospace;">Listening..</p>')
})

const sock = io.listen(server)

sock.on('connection', function (socket) {
  // emit an event to the socket
  socket.emit('request',
    () => {
      console.log('Request')
    }
  )

  // emit an event to all connected sockets
  socket.emit('broadcast',
    () => {
      console.log('Broadcast')
    }
  )

  socket.on('poll',
    (pollData) => {
      console.log(pollData)
    })
})

// Make server listen to the port
server.listen(port)
console.log('Server started on localhost:' + port)
