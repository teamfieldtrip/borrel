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
const socket = require('../lib/socket')

const events = new EventEmitter()

/**
 * Assigns all players that don't have a target a target
 * @param  {Player[]} playerList List of players
 * @return {Player[]}            List of players, all with targets
 */
const assignTargets = (playerList) => {
  if (typeof playerList !== 'object') { return false }

  let t1 = lodash.filter(playerList, (ply) => { return ply.team === 1 })
  let t2 = lodash.filter(playerList, (ply) => { return ply.team === 0 })

  let assign = (sources, goals) => {
    let targets = lodash.clone(goals)

    sources.forEach((player) => {
      targets.forEach((target) => {
        if (player.target !== null) {
          return
        }

        let filterCount = lodash.filter(sources, (ply) => {
          return ply.target === target
        }).length
        if (filterCount < 2) {
          player.target = target.id
          console.log(`Assigning ${player.id} → ${target.id}`)
        }
      })
      targets = lodash.shuffle(targets)
    })
  }

  assign(t1, t2)
  assign(t2, t1)

  return playerList
}

const setTargets = function (data, callback) {
  database.connection.models.game.findById(data.gameId).then((game) => {
    if (typeof game === 'undefined' || game === null) {
      winston.error('Game not found')
      return callback('error_lobby_not_found')
    }

    if (typeof game.players === 'undefined' || game.players === null) {
      winston.error('Game doesn\'t have any players')
      return callback('error_game_no_players')
    }
    assignTargets(game.players)

    callback(null)
  })
}

/**
 * Validates a tagged person and hands out score if legitimate. Also clears the
 * current target, to pepare for setTargets.
 */
const tag = function (data, callback) {
  database.connection.models.player.findById(data.playerId).then((player) => {
    if (typeof player === 'undefined' || player === null) {
      winston.error('Player not found')
      return callback('error_player_not_found')
    }

    // Validate if the tagged person was the target
    if (player.target === data.targetId) {
      // +1 the score and set the current target to null, to prepare for
      // setTargets
      player.score++
      player.target = null

      socket.connection.to(`game-${this.data.game.id}`).emit('gameplay:tagged', {
        invoker: player.id,
        victim: data.targetId
      })

      console.log(player.id + ' tagged ' + data.targetId)

      callback('null')
    } else {
      winston.log('Tagged person is not the target')
      return callback('error_tagged_not_target')
    }
  })
}

module.exports = {events, assignTargets, setTargets, tag}
