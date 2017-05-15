/**
  * Adds game links (via UUIDs) to player model
  *
  * @author Roelof Roos <github@roelof.io>
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('players', 'game', {
      type: Sequelize.UUID,
      allowNull: true
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('players', 'game')
  }
}
