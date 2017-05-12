/**
 * Change the lobby ID from INT to UUID
 *
 * @author Remco Schipper
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'players',
      'lobby',
      {
        type: Sequelize.UUID
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'players',
      'lobby',
      {
        type: Sequelize.INTEGER
      }
    )
  }
}
