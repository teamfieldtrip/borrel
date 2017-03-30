/**
  * Adds UUIDs to account table
  *
  * @author Roelof Roos <github@roelof.io>
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'accounts',
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
      'accounts',
      'id',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
      }
    )
  }
}
