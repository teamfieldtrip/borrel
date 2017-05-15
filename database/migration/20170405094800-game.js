/**
  * Creates a table for GamePlayer models and adds indexes
  *
  * @author Roelof Roos <github@roelof.io>
 */

const tableName = 'games'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      // Latitude and longitude of the game
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      // Radius, in meters, where the game takes place
      radius: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      // Is the game public?
      public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      // When the game started, or null if in lobby
      startTime: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true
      },
      // When the game ended, or null if still busy or not started
      endTime: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true
      },
      // True if the game was cancelled before it started
      cancelled: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false
      },
      // Game result
      // ENUM
      winner: {
        type: Sequelize.ENUM('tie', 'red', 'blue'),
        defaultValue: null,
        allowNull: true
      },
      // Remote keys
      host: {
        type: Sequelize.UUID,
        allowNull: false
      },
      // Metadata for Sequelize
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(tableName)
  }
}
