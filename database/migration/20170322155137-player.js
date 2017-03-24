/**
 * Defines the player entity
 *
 * @author Roelof Roos <github@roelof.io>
 */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('players', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      target: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null
      },
      team: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      result: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
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
    return queryInterface.dropTable('players')
  }
}
