/**
 * Handles the player events from the socket
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
const EventEmitter = require('events').EventEmitter
const winston = require('winston')
const jwt = require('jsonwebtoken')
const database = require('../lib/database')

const events = new EventEmitter()
/**
 * Creates a player session
 * @todo Team choices etc
 * @param data Empty JSON for now
 * @param [callback] Will be called with a null and player id/error to indicate success/failure
 */
const create = function (data, callback) {
  // Check if the callback is set, otherwise the call will cause an error
  callback = (typeof callback === 'function') ? callback : function () {}

  jwt.verify(data.account, process.env.JWT_SECRET, (err, decoded) => {
    if (err !== null) {
      winston.error(err)
      return callback('Decoding fail')
    }
    if (decoded !== null | typeof (decoded) !== 'undefined') {
      // Build a new player instance
      database.connection.models.player.build({ account: decoded.id }).save().then((player) => {
        // Assign the player id to the socket
        this.data.player = { id: player.id }
        // Emit the created event for other modules
        events.emit('created', player, this)
        // Let the client know it succeeded
        return callback(null, player.id)
      }).catch((error) => {
        winston.error('Player creation error: %s', error)
        return callback('Could not create a player instance')
      })
    }
  })
}
/**
 * Resumes the player session
 * @todo Proper authentication checks
 * @param data JSON with the player ID
 * @param [callback] Will be called with a null/error to indicate success/failure
 */
const resume = function (data, callback) {
  // Check if the callback is set, otherwise the call will cause an error
  callback = (typeof callback === 'function') ? callback : function () {}
  // Get the player instance by id
  database.connection.models.player.findById(data.id).then((player) => {
    // Check if the player exists
    if (typeof player === 'undefined' || player === null) {
      return callback('Could not find the player instance')
    }
    // Assign the player id to the socket
    this.player = { id: player.id }
    // Emit the resumed event for other modules
    events.emit('resumed', player, this)
    // Let the client know it succeeded
    return callback(null)
  }).catch((error) => {
    winston.error('Player resume error: %s', error)
    return callback('Could not find the player instance')
  })
}

/**
* Returns a player from the database, but only if it exists.
 * @param  {string}  id ID of the Player.
 * @return {Promise}    Result of the query, as a Promise.
 */
const get = function (id) {
  return database.connection.models.player.findById(id).then((ply) => {
    if (ply === null || ply === undefined) {
      throw new Error('Player not found')
    }
    return ply
  })
}

module.exports = {events, create, resume, get}
