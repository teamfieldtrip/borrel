/**
 * Seeds the account table with supreme leaders
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
const bcrypt = require('bcrypt')

let uuids = [
  '3345f5c2-4106-4c62-ba27-a826f35d2a37',
  '78e1b61b-59b9-457d-aa45-d6b4fac96ee5'
]

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('accounts', [{
      id: uuids.shift(),
      name: 'Brian',
      email: 'brian-the-second@king.com',
      password: bcrypt.hashSync('supreme-leader', 10),
      coins: 2147483647,
      token: null,
      experiencePoints: 2147483647,
      preferredTeam: 'red'
    }, {
      id: uuids.shift(),
      name: 'Kim Jong-Un',
      email: 'kim@north-korea',
      password: bcrypt.hashSync('brian', 10),
      coins: 1,
      token: null,
      experiencePoints: 1,
      preferredTeam: 'black'
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    var rows = []
    uuids.forEach(function (id) {
      rows.push({id: id})
    })
    return queryInterface.bulkDelete('accounts', rows, {})
  }
}
