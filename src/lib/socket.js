/**
 * Creates the socket object
 *
 * @author Sven Boekelder <sven@plplpl.nl>
 * @author Remco Schipper <github@remcoschipper.com>
 */

const http = require('http')
const io = require('socket.io')
const winston = require('winston')

const server = http.createServer((req, res) => {
  res.writeHead(403, { 'Content-Type': 'text/html' })
  res.end()
})

exports.connection = io.listen(server)
exports.boot = function (callback) {
  let onListening = () => {
    server.removeListener('error', onError)
    return callback(null)
  }
  let onError = (error) => {
    server.removeListener('listening', onError)
    winston.error('Socket error: %s', error)
    return callback(error)
  }
  server.listen(process.env.SOCKET_PORT).once('listening', onListening).once('error', onError)
}
