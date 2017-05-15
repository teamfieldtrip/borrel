/**
 * Handles the leaderboard
 *
 * @author Sven Boekelder
 */

const EventEmitter = require('events').EventEmitter
const winston = require('winston')
const lodash = require('lodash')
const database = require('../lib/database')

const events = new EventEmitter()

const results = function (data, callback) {
  database.connection.models.player.findAll({ where: { lobby: data.lobbyId }
  }).then((players) => {
    if (players === 'undefined' || players === null) {
      winston.error('Playerlist not found')
      return callback('error_no_players')
    }
    return lodash.sortBy(players, 'score')
  })
}

module.exports = {events, results}
