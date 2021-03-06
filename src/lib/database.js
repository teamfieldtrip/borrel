/**
 * Handles the creation of the database connection
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */

const async = require('async')
const Sequelize = require('sequelize')
const winston = require('winston')

/**
 * The models to load
 * @type {[Sequelize.Model]}
 */
const models = {
  account: require('../model/account'),
  player: require('../model/player'),
  lobby: require('../model/lobby'),
  inventoryItem: require('../model/inventory-item'),
  powerUp: require('../model/power-up'),
  purchase: require('../model/purchase'),
  storeEntry: require('../model/store-entry'),
  game: require('../model/game')
}

/**
 * Verifies the database credentials by connecting
 * @param {Sequelize} connection
 * @param {function} callback
 */
const verify = function (connection, callback) {
  connection.authenticate().then(() => {
    return callback(null, connection)
  }).catch((error) => {
    winston.error('Database error: %s', error.message)
    return callback('Could not connect to the database')
  })
}
/**
 * Loads the models and attaches them to the connection
 * @param {Sequelize} connection
 * @param {function} callback
 */
const load = function (connection, callback) {
  async.mapValuesSeries(models, (item, key, callback) => {
    return callback(null, item(connection, Sequelize))
  }, (error, results) => {
    return callback(error, connection, results)
  })
}
/**
 * Associates the models with each other (relations...)
 * @param {Sequelize} connection
 * @param models
 * @param {function} callback
 */
const associate = function (connection, models, callback) {
  async.forEachOf(models, (item, key, callback) => {
    if (typeof item.associate === 'function') {
      item.associate(models)
    }
    return callback(null)
  }, () => {
    return callback(null, connection)
  })
}

/**
 * Exposes the sequelize object to the world!
 * @type {null|Sequelize}
 */
exports.connection = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  pool: 10,
  storage: process.env.DB_PATH,
  logging: (process.env.DB_LOGGING === 'true'),
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
})

/**
 * Opens the database connection and prepares the models
 * @param {function} callback
 */
exports.boot = function (callback) {
  async.waterfall([async.constant(exports.connection), verify, load, associate], callback)
}
