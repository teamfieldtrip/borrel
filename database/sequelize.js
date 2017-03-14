/**
 * Handles the creation of the database connection
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
require('dotenv').config()

module.exports = {
  'development': {
    'host': process.env.DB_HOST,
    'port': process.env.DB_PORT,
    'dialect': process.env.DB_DIALECT,
    'username': process.env.DB_USER,
    'password': process.env.DB_PASS,
    'database': process.env.DB_SCHEMA,
    'storage': process.env.DB_PATH,
    'seederStorage': 'sequelize'
  }
}
