/**
  * Adds UUIDs to powerup table
  *
  * @author Roelof Roos <github@roelof.io>
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'powerUps',
      'id',
      {
        type: Sequelize.UUID,
        allowNull: false,
        autoIncrement: false
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'powerUps',
      'id',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
      }
    )
  }
}
