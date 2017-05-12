/**
 * Handles the gameplay
 *
 * @author Sven Boekelder
 *
 */

const EventEmitter = require('events').EventEmitter
const winston = require('winston')
const lodash = require('lodash')
const database = require('../lib/database')

const events = new EventEmitter()

const setTargets = function (data, callback) {
  database.connection.models.lobby.findById(data.lobbyId).then((lobby) => {
    if (typeof lobby === 'undefined' || lobby === null) {
      winston.error('Lobby not found')
      return callback('error_lobby_not_found')
    }

    if (typeof lobby.players === 'undefined' || lobby.players === null) {
      winston.error('Lobby doesn\'t have any players')
      return callback('error_lobby_no_players')
    }

    let targets = lodash(lobby.Players).groupBy('target')
    let targetCount = lodash.countBy(targets)

    console.log(lobby.players)

    for (let player of lobby.players) {
      // If the player does not have a target, assign one from the target object
      if (player.target == null) {
        for (let attempt of lobby.Players) {
          if (attempt.team !== player.team && targetCount.target <= 2) {
            player.target = attempt.id
            winston.log('Assigned %s', attempt.id)
            callback(attempt.id)
            break
          }
        }
      }
    }
  })
}

module.exports = {events, setTargets}
