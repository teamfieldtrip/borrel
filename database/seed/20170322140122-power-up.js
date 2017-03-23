/**
 * Seeds the power-up table with the most amazing power-ups
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('powerUps', [{
      name: 'Nuclear rocket',
      persistent: true
    }, {
      name: 'Kim\'s dogs',
      persistent: false
    }, {
      name: 'North Korean food',
      persistent: true
    }, {
      name: 'Iranian plague',
      persistent: false
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('powerUps', null, {})
  }
}
