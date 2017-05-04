'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('players', 'account', {
        type: Sequelize.INTEGER,
        allowNull: false
      }),
      queryInterface.addColumn('players', 'lobby', {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      }),
      queryInterface.addColumn('players', 'host', {
        type: Sequelize.INTEGER,
        allowNull: false
      })
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('players', 'account'),
      queryInterface.removeColumn('players', 'lobby'),
      queryInterface.removeColumn('players', 'host')
    ])
  }
}
