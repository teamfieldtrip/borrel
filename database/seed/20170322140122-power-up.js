/**
 * Seeds the power-up table with the most amazing power-ups
 *
 * @author Remco Schipper <github@remcoschipper.com>
 * @author Roelof Roos <github@roelof.io>
 */

let uuids = [
  '543fbfb8-f3cf-4104-b655-95c1d59e8836',
  '8d4aa374-a667-406a-8e06-06be0273528a',
  'bf7e56fa-004c-4de5-8d73-9062f508b829',
  '370f0b4e-fa8c-411b-abc2-831ecdb66660'
]

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('powerUps', [{
      id: uuids.shift(),
      name: 'Nuclear rocket',
      persistent: true
    }, {
      id: uuids.shift(),
      name: 'Kim\'s dogs',
      persistent: false
    }, {
      id: uuids.shift(),
      name: 'North Korean food',
      persistent: true
    }, {
      id: uuids.shift(),
      name: 'Iranian plague',
      persistent: false
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    let rows = []
    uuids.forEach(function (uuid) {
      rows.push({id: uuid})
    })

    return queryInterface.bulkDelete('powerUps', rows, {})
  }
}
