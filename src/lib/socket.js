/**
 * Creates the socket object
 *
 * @author Sven Boekelder <sven@plplpl.nl>
 * @author Remco Schipper <github@remcoschipper.com>
 */

const http = require('http')
const io = require('socket.io')
const winston = require('winston')
const socketioJwt = require('socketio-jwt')

let listening = false
const server = http.createServer((req, res) => {
  res.writeHead(403, { 'Content-Type': 'text/html' })
  res.end()
})
const socket = io.listen(server)

// Firstly authenticate the client, afterwards create a data object to store user data
socket.on('connection', socketioJwt.authorize({
  secret: process.env.JWT_SECRET,
  required: false
})).on('authenticated', (client) => {
  client.data = {}
})

exports.connection = socket

// Expose boot method.
exports.boot = function (callback) {
  if (listening === true) {
    throw new Error('Server already booted!')
  }
  let onListening = () => {
    server.removeListener('error', onError)
    winston.log('Server is listening')
    listening = true
    return callback(null)
  }
  let onError = (error) => {
    server.removeListener('listening', onError)
    winston.error('Socket error: %s', error)
    return callback(error)
  }

  let serverConfig = [
    process.env.SOCKET_PORT || 8080,
    process.env.SOCKET_HOST || 'localhost'
  ]

  winston.log('Server starting on %s:%d', serverConfig[1], serverConfig[0])

  server
    .listen(serverConfig[0], serverConfig[1])
    .once('listening', onListening)
    .once('error', onError)
}
