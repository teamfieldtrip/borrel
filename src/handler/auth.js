/**
 * Handles the authentication events from the socket
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
const EventEmitter = require('events').EventEmitter
const jwt = require('jsonwebtoken')
const database = require('../lib/database')
const socket = require('../lib/socket')
const events = new EventEmitter()

const login = function (data, callback) {
  // Check if the callback is set, otherwise the call will cause an error
  callback = (typeof callback === 'function') ? callback : function () {}
  // Keep a short reference to the models
  const models = database.connection.models
  models.account.findOne({ where: { email: data.email } }).then((account) => {
    // Check if the account exists
    if (typeof account === 'undefined' || account === null) {
      return callback('Wrong email/password')
    }
    // Check if the password matches
    account.passwordMatches(data.password).then((result) => {
      if (!result) {
        return callback('Wrong email/password')
      }
      // Generate a token
      const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET)
      // Persist the token
      account.update({ token: token }).then(() => {
        return callback(null, token)
      }).catch((error) => {
        console.log(error)
        return callback('Could not update the account instance')
      })
    }).catch((error) => {
      console.log(error)
      return callback('Wrong email/password')
    })
  }).catch((error) => {
    console.log(error)
    return callback('Wrong email/password')
  })
}

/**
 * Export an event end-point
 * @type {EventEmitter}
 */
exports.events = events

/**
 * Attach events to the socket
 * @param callback
 * @returns {*}
 */
exports.boot = function (callback) {
  socket.connection.on('connection', (client) => {
    client.on('auth:login', login)
  })
  socket.connection.on('authenticated', (client) => {
    client.removeListener('auth:login', login)
  })
  return callback(null)
}
