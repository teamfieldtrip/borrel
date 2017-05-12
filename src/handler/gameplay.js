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

const create = function (data, callback) {

}

const setTargets = function (data, callback) {
  database.connection.models.lobby.findById(data.lobby.id).then((lobby) => {
    if (typeof lobby === 'undefined' || lobby === null) {
      return callback('error_lobby_not_found')
    }

    targets = lodash(lobby.players).groupBy('target')
    targetCount = lodash.countBy(targets)

    for (let player of lobby.players) {
      // If the player does not have a target, assign one from the target object
      if (player.target == null) {
        for (let attempt of lobby.players) {
          if (attempt.team != player.team && targetCount.target <= 2){
            player.target = attempt.id;
            callback(attempt.id)
            break
          }
        }
      }
    }
  })
}


