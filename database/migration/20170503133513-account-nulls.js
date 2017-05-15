/**
 * Makes some fields that should be null actually nullable
 *
 * @author Roelof Roos
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'accounts',
      'preferredTeam',
      {
        allowNull: true,
        type: Sequelize.ENUM('black', 'red'),
        defaultValue: 'black'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'accounts',
      'preferredTeam',
      {
        allowNull: false,
        type: Sequelize.ENUM('black', 'red'),
        defaultValue: 'black'
      }
    )
  }
}
