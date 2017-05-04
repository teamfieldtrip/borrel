'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('lobbies', 'host', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('lobbies', 'duration', {
        type: Sequelize.INTEGER(3),
        defaultValue: 1200,
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'amountOfPlayers', {
        type: Sequelize.INTEGER(2),
        defaultValue: 4,
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'amountOfRounds', {
        type: Sequelize.INTEGER(2),
        defaultValue: 1,
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'amountOfLives', {
        type: Sequelize.INTEGER(2),
        defaultValue: 1,
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'powerUpsEnabled', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'centerLatitude', {
        type: Sequelize.STRING,
        defaultValue: '52.36878505130836',
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'centerLongitude', {
        type: Sequelize.STRING,
        defaultValue: '4.9003274738788605',
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'borderLatitude', {
        type: Sequelize.STRING,
        defaultValue: '4.887398891150951',
        allowNull: false
      }),
      queryInterface.addColumn('lobbies', 'borderLongitude', {
        type: Sequelize.STRING,
        defaultValue: '52.35672342362662',
        allowNull: false
      })
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('lobbies', 'host'),
      queryInterface.removeColumn('lobbies', 'duration'),
      queryInterface.removeColumn('lobbies', 'amountOfPlayers'),
      queryInterface.removeColumn('lobbies', 'amountOfRounds'),
      queryInterface.removeColumn('lobbies', 'amountOfLives'),
      queryInterface.removeColumn('lobbies', 'powerUpsEnabled'),
      queryInterface.removeColumn('lobbies', 'centerLatitude'),
      queryInterface.removeColumn('lobbies', 'centerLongitude'),
      queryInterface.removeColumn('lobbies', 'borderLatitude'),
      queryInterface.removeColumn('lobbies', 'borderLongitude')
    ])
  }
}
