/**
 * The char limit of the token field was too low
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'accounts',
      'token',
      {
        type: Sequelize.STRING
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'accounts',
      'token',
      {
        type: Sequelize.STRING(64)
      }
    )
  }
}
