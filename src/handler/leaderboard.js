/**
 * Handles the leaderboard
 *
 * @author Sven Boekelder
 * @author Remco Schipper
 */

const EventEmitter = require('events').EventEmitter
const lodash = require('lodash')
const lobby = require('./lobby')

const events = new EventEmitter()

const results = function (callback) {
  lobby.getAccountsInLobby(this.data.lobby.id).then((players) => {
    const data = lodash.map(players, (player) => {
      return {
        player_id: player.player_id,
        score: player.score,
        name: player.name
      }
    })

    return callback(null, lodash.sortBy(data, 'score'))
  }).catch(() => {
    return callback('error_no_score')
  })
}

module.exports = {events, results}
