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

/**
 * Sets targets for the players that don't have one assigned yet.
 */
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

    lobby.players.forEach(player) => {
      // If the player does not have a target, assign one from the target object
      if (player.target == null) {
        lobby.Players.forEach(attempt) => {
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

/**
 * Validates a tagged person and hands out score if legitimate. Also clears the
 * current target, to pepare for setTargets.
 */
const tag = function(data, callback) {
  database.connection.models.player.findById(data.playerId).then((player) => {
    if (typeof player === 'undefined' || player === null) {
      winston.error('Player not found')
      return callback('error_player_not_found')
    }

    // Validate if the tagged person was the target
    if (player.target == data.targetId) {
      // +1 the score and set the current target to null, to prepare for
      // setTargets
      player.score++
      player.target = null
    } else {
      winston.log('Tagged person is not the target')
      return callback('error_tagged_not_target')
    }
  }
}

module.exports = {events, setTargets, tag}
