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

const getAccountsInLobby = function (lobbyId, hostId) {
  return new Promise((resolve, reject) => {
    database.connection.models.player.findAll({ where: { lobby: lobbyId } }).then((players) => {
      let ids = lodash.map(players, (player) => { return player.id })

      if (typeof hostId !== 'undefined') {
        ids.push(hostId)
      }

      return database.connection.models.account.findAll({ where: { id: { in: ids } } })
    }).then((accounts) => {
      return resolve(lodash.map(accounts, (account) => {
        return { id: account.id, name: account.name }
      }))
    }).catch(reject)
  })
}

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
  const modelData = lodash.pick(data,fields)
  modelData.host = this.data.player.id
  database.connection.models.lobby.build(modelData).save().then((lobby) => {
    // Assign the lobby id to the socket
    this.data.lobby = {id: lobby.id}
    // Emit the created event for other modules
    events.emit('created', lobby, this)
    // Let the client know it succeeded
    return callback(null, lobby.id)
  }).catch((error) => {
    winston.error('Lobby creation error: %s', error)
    return callback('Could not create a lobby instance')
  })
}

const join = function (data, callback) {
  if (typeof this.data.lobby === 'undefined') {
    database.connection.models.lobby.findById(data.id).then((lobby) => {
      if (typeof lobby === 'undefined' || lobby === null) {
        return callback('error_lobby_not_found')
      }

      getAccountsInLobby(lobby.id, lobby.host).then((accounts) => {
        if (accounts.length === lobby.amountOfPlayers) {
          return callback('error_lobby_full')
        }

        database.connection.models.player.update({ lobby: lobby.id }, { where: { id: this.data.player.id } }).then(() => {
          this.data.lobby = { id: lobby.id }
          this.join('lobby-' + lobby.id)

          return callback(null)
        }).catch((error) => {
          winston.error('Could not update player: %s', error)
          return callback('error_lobby_data')
        })
      }).catch((error) => {
        winston.error('Could not find accounts in lobby: %s', error)
        return callback('error_lobby_data')
      })
    }).catch((error) => {
      winston.error('Lobby find error: %s', error)
      return callback('error_lobby_data')
    })
  } else {
    return callback('error_player_joined')
  }
}

const info = function (data, callback) {
  if (typeof this.data.lobby === 'undefined') {
    database.connection.models.lobby.findById(data.id).then((lobby) => {
      if (typeof lobby === 'undefined' || lobby === null) {
        return callback('error_lobby_not_found')
      }

      getAccountsInLobby(lobby.id, lobby.host).then((accounts) => {
        if (accounts.length === lobby.amountOfPlayers) {
          return callback('error_lobby_full')
        }

        let host = lodash.find(accounts, (account) => { return account.id === lobby.host })
        if (typeof host === 'undefined') {
          host = { name: 'UNKNOWN' }
        }

        return callback(null, accounts.length, lobby.amountOfPlayers, host.name)
      }).catch((error) => {
        winston.error('Could not find accounts in lobby: %s', error)
        return callback('error_lobby_data')
      })
    }).catch((error) => {
      winston.error('Lobby find error: %s', error)
      return callback('error_lobby_data')
    })
  } else {
    return callback('error_player_joined')
  }
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

module.exports = {events, create, resume, info, join, players}
