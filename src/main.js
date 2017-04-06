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

const gps = require('./handler/gps')

// Powered by http://trumpipsum.net/
winston.log('I know words. I have the best words.')

// List of methods that start
const mainMethods = [
  database.boot,
  socket.boot,
  gps.boot
]

// Start methods
async.eachSeries(mainMethods, (fn, callback) => {
  // Log each invocation
  winston.log('Calling "%s" async', fn.name)

  // And fire and return it
  return fn(callback)
}, (error) => {
  // If the error is actually an error...
  if (error) {
    // Log it
    winston.error('Could not start: %s', error)

    // And abort
    process.exit(1)
  }
})

// TODO Setup database

// TODO Setup models

// TODO Handle sockets
