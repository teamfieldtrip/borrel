/**
* Handles creation and iteration on games.
 *
 * @author Sven Boekelder
 * @author Remco Schipper
 */

const EventEmitter = require('events').EventEmitter
const winston = require('winston')
const lodash = require('lodash')
const geolib = require('geolib')

// Handlers
const database = require('../lib/database')
const socket = require('../lib/socket')

// Models
const Lobby = require('../model/lobby')
// const Game = require('./game')

// Helpers
const gameplay = require('./gameplay')
const player = require('./player')

const events = new EventEmitter()

/**
 * Contains keys that can be sent to the server
 *
 * @type {Object}
 */
const publicValues = {
  player: [
    'id', 'latitude', 'longitude',
    'score', 'target', 'team',
    'result'
  ],
  game: [
    'id', 'latitude', 'longitude',
    'radius', 'public', 'startTime',
    'endTime', 'cancelled', 'winner'
  ]
}

/**
 * Returns the name of the room for this game.
 *
 * @param  {String|Game} game The game to join, Game model or ID
 * @return {String|null}      Game name
 */
const roomName = (game) => {
  if (typeof game === 'string') {
    return 'game-' + game
  } else {
    return null
  }
}

/**
 * Returns a clean version of the given object.
 *
 * @param  {String} type    Key to use, one of publicValues
 * @param  {Object} content Object to clean
 * @return {Object}         Clean object
 */
const clean = (type, content) => {
  return lodash.fill(content, publicValues[type])
}

/**
 * Returns a game from the database, but only if it exists.
 * @param  {string}  id ID of the game.
 * @return {Promise}    Result of the query, as a Promise.
 */
const get = function (id) {
  return database.connection.models.game.findById(id).then((game) => {
    if (game === null || game === undefined) {
      throw new Error('Game not found')
    }
    return game
  })
}

/**
 * Builds an object containing the game ID, game information, player list and
 * the next target.
 *
 * @param  {String} playerId ID of the player
 * @param  {String} gameId   ID of the game
 * @return {object}          Information
 */
const buildInformationData = (playerId, gameId) => {
  if (playerId === null || typeof playerId !== 'string') {
    throw new Error('invalid player!')
  }
  if (gameId === null || typeof gameId !== 'string') {
    throw new Error('invalid player!')
  }
  let resultData = {}

  new Promise(function (resolve, reject) {
    if (playerId === null || typeof playerId !== 'string') {
      return reject(new Error('invalid player!'))
    }
    if (gameId === null || typeof gameId !== 'string') {
      return reject(new Error('invalid player!'))
    }
    resolve()
  }).then(() => {
    return get(gameId)
  }).then((game) => {
    // Add gmae info
    resultData.id = game.id
    resultData.game = clean('game', game)

    // Build a clean player list
    let playerList = []
    game.players.forEach((ply) => {
      playerList.push(clean('player', ply))
    })

    // And add it
    resultData.players = playerList

    // Get current player
    return player.get(playerId)
  }).then((player) => {
    // Get the player target, and send it to the player as well
    resultData.target = clean('player', player.target)

    // But make sure the player's target isn't send.
    resultData.target.target = null
  }).catch((error) => {
    winston.error('Join game failed: %s', error)
    throw new Error('Failed to retrieve information!')
  })
}

/**
 * Creates a game in the database from a lobby
 *
 * @param {Lobby} lobby the lobby this game is based on.
 * @param {Callable} callback Called with an error if there's an error. If all
 * went well a lobby-wide event is emitted.
 */
const create = function (lobby, callback) {
  if (!(lobby instanceof Lobby)) {
    winston.error('Lobby is of invalid type!')
    winston.log(lobby)
    return callback('lobby_create_failed')
  }

  // Get lobby ID
  let lobbyId = lobby.id
  let gameId = null

  // Determine radius
  let radius = geolib.getDistance(
    {latitude: lobby.centerLatitude, longitude: lobby.centerLongitude},
    {latitude: lobby.borderLatitude, longitude: lobby.borderLongitude},
    1 // distance in meters.
  )

  // Set endtime
  let startTime = new Date()
  let endTime = new Date(startTime.getTime() + (lobby.duration * 60 * 1000))

  // Build a new game
  database.connection.models.game.build({
    latitude: lobby.centerLatitude,
    longitude: lobby.centerLongitude,
    radius: radius,
    public: lobby.public,
    startTime: startTime,
    endTime: endTime,
    host: lobby.host
  }).save().then((game) => {
    // Store game ID
    gameId = game.id

    return database.connection.models.player.update(
      { game: gameId },
      { where: { lobby: lobbyId } }
    )
  }).then(() => {
    // Move all players in this lobby to the given game.
    return database.connection.models.player.findAll(
      { where: { game: gameId } }
    )
  }).then((players) => {
    // Get list of targets
    players = gameplay.assignTargets(players)

    // Update them all
    let poms = []
    players.forEach((ply) => {
      poms.push(ply.save(['target']))
    })

    return Promise.all(poms)
  }).then(() => {
    // Inform everyone in the lobby to move to the given game.
    socket.connection.to(`lobby-${lobbyId}`).emit('lobby:ready', gameId)

    // Report there was no error
    return callback(null, gameId)
  }).catch((error) => {
    winston.error('Game creation error: %s', error)
    return callback('error_game_create', 'Could not start a game')
  })
}

/**
 * Joins a game. Called after the game is created by users indivudally, since
 * the create game method tells all users to join.
 *
 * @param  {Object}   data     Data sent by the user, usually just the game ID
 * @param  {Function} callback
 */
const join = function (data, callback) {
  if (typeof this.data.game === 'string') {
    return callback('You\'re already in a game.')
  }

  if (typeof data.id !== 'string') {
    return callback('Not a valid game to join!')
  }

  let gameId = data.id
  let resultData = {}

  get(gameId).then((game) => {
    // Update the game, but it should be the same
    gameId = game.id

    // Join the channel for this room
    this.join(roomName(gameId))

    // Add game ID to the connection data
    this.data.game = gameId

    // Build a clean player list
    let playerList = []
    game.players.forEach((ply) => {
      playerList.push(clean('player', ply))
    })

    resultData.game = clean('game', game)
    resultData.players = playerList

    // Get current player
    return player.get(this.data.player)
  }).then((player) => {
    // Get the player target, and send it to the player as well
    resultData.target = clean('player', player.target)
    this.data.target = player.target.id

    // But make sure the player's target isn't send.
    resultData.target.target = null
  }).catch((error) => {
    winston.error('Join game failed: %s', error)
    return callback('join_failed')
  })
}

/**
 * Returns information about the game. Should actually come from the server to
 * the client, but that's currenlty not working.
 *
 * @param  {object}   data     Data of the request
 * @param  {Function} callback Callback to socket.io
 */
const info = function (data, callback) {
  if (typeof this.data.game === 'undefined' || this.data.game === null) {
    return callback('error_not_in_game')
  }

  buildInformationData(this.data.player, this.data.game).then((data) => {
    callback(null, data)
  }).catch((error) => {
    winston.error('Failed to send info request; %s', error)
    callback('Failed to send info request')
  })
}

/**
 * Tags a player. Steps:
 * 1. verify the data
 * 2. verify the tag
 * 3. inform the tagged player he's dead (and count it)
 * 4. inform the taggee that the tag's vaid (and count it)
 * 5. assign the taggee a new target
 *
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const tag = (data, callback) => {
  if (typeof this.data.game !== 'string' || this.data.target !== 'string') {
    return callback('error_not_in_game')
  }

  // TODO
}

module.exports = {events, create, join, info, tag}
