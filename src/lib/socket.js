/**
 * Creates the socket object
 *
 * @author Sven Boekelder <sven@plplpl.nl>
 * @author Remco Schipper <github@remcoschipper.com>
 */

const webserver = require('./webserver')
const io = require('socket.io')
const winston = require('winston')
const socketioJwt = require('socketio-jwt')
const router = require('./router')

let listening = false

// Start webserver, the env determines if it's a dev or prod server
let server = webserver()

// Start socket connection over webserver
const socket = io.listen(server)

// Firstly authenticate the client, afterwards create a data object to store user data
socket.on('connection', socketioJwt.authorize({
  secret: process.env.JWT_SECRET,
  required: false
}))

// Let the router listen on the socket connection too.
router.linkSocket(socket)

// Export connection
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
