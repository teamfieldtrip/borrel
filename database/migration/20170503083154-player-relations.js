'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('players', 'account', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('players', 'lobby', {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      }),
      queryInterface.addColumn('players', 'host', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('players'),
      require('./20170322155137-player').up(queryInterface, Sequelize)
    ])
  }
}
