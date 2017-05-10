/**
 * Handles the lobby creation
 *
 * @author Sven Boekelder
 */

const EventEmitter = require('events').EventEmitter
const winston = require('winston')
const lodash = require('lodash')
const database = require('../lib/database')

const events = new EventEmitter()

/**
 * Creates a lobby session
 * @param data Empty JSON for now
 * @param [callback] Will be called with a null and lobby id/error to indicate
 * success/failure
 */
const create = function (data, callback) {
  // Check if the callback is set, otherwise the call will cause an error
  callback = (typeof callback === 'function') ? callback : function () {}
  const fields = ['duration', 'powerUpsEnabled',
    'amountOfPlayers', 'amountOfRounds', 'amountOfLives',
    'centerLatitude', 'centerLongitude', 'borderLongitude', 'borderLatitude']
  // Build a new lobby instance
  database.connection.models.lobby.build(lodash.pick(data, fields)).save().then((lobby) => {
    // Assign the lobby id to the socket
    this.lobbyId = lobby.id
    // Emit the created event for other modules
    events.emit('created', lobby, this)
    // Let the client know it succeeded
    return callback(null, lobby.id)
  }).catch((error) => {
    winston.error('Lobby creation error: %s', error)
    return callback('Could not create a lobby instance')
  })
}

/**
 * Resumes the lobby session
 * @param data JSON with the lobby ID
 * @param [callback] Will be called with a null/error to indicate
 * success/failure
 */
const resume = function (data, callback) {
  // Get the lobby instance by id
  database.connection.models.lobby.findById(data.id).then((lobby) => {
    // Check if lobby exists
    if (typeof lobby === 'undefined' || lobby === null) {
      return callback('Could not find the lobby instance')
    }
    // Assign the lobby ID  to the socket
    this.lobbyId = lobby.id
    // Emit the resumed event for other modules
    events.emit('resumed', lobby, this)
    // Let the client know it succeeded
    return callback(null)
  }).catch((error) => {
    winston.error('Lobby resume error: %s', error)
    return callback('Could not find the lobby instance')
  })
}

const players = function (data, callback) {
  database.connection.models.lobby.findById(data.id).then((lobby) => {
    return callback(lobby.players)
  })
}

module.exports = {events, create, resume, players}
