/**
  * Creates a table for GamePlayer models and adds indexes
  *
  * @author Roelof Roos <github@roelof.io>
 */

const tableName = 'gamePlayers'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.resolve().then(() => {
      queryInterface.createTable(tableName, {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        joinTime: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        leaveTime: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        player: {
          type: Sequelize.UUID,
          allowNull: false
        },
        game: {
          type: Sequelize.UUID,
          allowNull: false
        }
      }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      })
    }).then(() => {
      queryInterface.addIndex(tableName, ['id'])
    }).then(() => {
      queryInterface.addIndex(tableName, ['player', 'game'])
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(tableName)
  }
}
