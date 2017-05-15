/**
 * Handles the leaderboard
 *
 * @author Sven Boekelder
 */

const EventEmitter = require('events').EventEmitter
const winston = require('winston')
const lodash = require('lodash')
const database = require('../lib/database')
const socket = require('../lib/socket')

const events = new EventEmitter()

const getLeaderboard = function (lobbyId) {
  database.connection.models.player.findAll({ where: { lobby: lobbyId }
  }).then((players) => {
      return lodash.sortBy(players, 'score')
    }
  }
}

module.exports = {events, getLeaderboard}
