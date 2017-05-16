/**
 * Handles the GPS events from the socket
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
const winston = require('winston')
const player = require('./player')
const socket = require('socket.io')()
const database = require('../lib/database')

/**
 * Handle the GPS update events
 * @param data JSON object with latitude, longitude and timestamp
 * @param [callback] Will be called with a null/error to indicate success/failure
 * @returns {*}
 */
const update = function (data, callback) {
  // Check if the callback is set, otherwise the call will cause an error
  callback = (typeof callback === 'function') ? callback : function () {}
  // Check if all fields are present
  if (typeof data.time !== 'undefined' && typeof data.latitude !== 'undefined' &&
      typeof data.longitude !== 'undefined' && typeof data.time !== 'undefined') {
    // Check if the update is the newer than the last one (async, delay may occur)
    if (typeof this.data.gps.time !== 'undefined' && this.data.gps.time > data.time) {
      return callback('time')
    }
    // Check if the player moved
    if (this.data.gps.latitude === data.latitude && this.data.gps.longitude === data.longitude) {
      return callback('equal')
    }
    // Set the updated GPS data
    this.data.gps = data
    // Update the player instance
    database.connection.models.player.update({
      latitude: data.latitude,
      longitude: data.longitude
    }, {where: {id: this.playerId}}).then((player) => {
      // Emit the location update to the lobby
      socket.connection.to(`lobby-${player.lobby}`).emit('gps:updated', {
        player: player.id,
        latitude: data.latitude,
        longitude: data.longitude
      })
      // Let the client know it succeeded
      return callback(null, data.latitude, data.longitude)
    }).catch((error) => {
      winston.error('GPS update error: %s', error)
      return callback('Could not save the new coordinates to the database')
    })
  } else {
    return callback('Invalid fields')
  }
}

/**
 * Attach the events to the socket
 * @param player The player instance
 * @param socket The socket instance
 */
const attachEvents = function (player) {
  socket.data.gps = {}
  socket.sockets.on('gps:update', update)
}

/**
 * Attach the events to the player module
 * @param callback
 * @returns {*}
 */
exports.boot = function (callback) {
  player.events.on('created', attachEvents)
  player.events.on('resumed', attachEvents)
  return callback(null)
}
