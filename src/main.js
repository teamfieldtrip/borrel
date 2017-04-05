/**
 * Main file, basically shouts that it's okay.
 *
 * Run this using `npm start`
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */
const async = require('async')
const winston = require('winston')

const database = require('./lib/database')
const socket = require('./lib/socket')

const auth = require('./handler/auth')
const player = require('./handler/player')
const gps = require('./handler/gps')

// Powered by http://trumpipsum.net/
console.log('I know words. I have the best words.')

async.eachSeries([database.boot, socket.boot, auth.boot, player.boot, gps.boot], (fn, callback) => {
  return fn(callback)
}, (error) => {
  if (error) {
    winston.error('Could not start: %s', error)
    process.exit(1)
  }
})

// TODO Setup database

// TODO Setup models

// TODO Handle sockets
