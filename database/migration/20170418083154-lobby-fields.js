'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('lobbies', 'duration', {
      type: Sequelize.INTEGER(3),
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'amountOfPlayers', {
      type: Sequelize.INTEGER(2),
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'amountOfRounds', {
      type: Sequelize.INTEGER(2),
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'amountOfLifes', {
      type: Sequelize.INTEGER(2),
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'powerUpsEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'centerLatitude', {
      type: Sequelize.STRING,
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'centerLongitude', {
      type: Sequelize.STRING,
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'borderLatitude', {
      type: Sequelize.STRING,
      allowNull: false
    })
    queryInterface.addColumn('lobbies', 'borderLongitude', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('lobbies', 'duration')
    queryInterface.removeColumn('lobbies', 'amountOfPlayers')
    queryInterface.removeColumn('lobbies', 'amountOfRounds')
    queryInterface.removeColumn('lobbies', 'amountOfLifes')
    queryInterface.removeColumn('lobbies', 'powerUpsEnabled')
    queryInterface.removeColumn('lobbies', 'centerLatitude')
    queryInterface.removeColumn('lobbies', 'centerLongitude')
    queryInterface.removeColumn('lobbies', 'borderLatitude')
    queryInterface.removeColumn('lobbies', 'borderLongitude')
  }
};
