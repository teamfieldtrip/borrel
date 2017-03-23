/**
 * Seeds the account table with supreme leaders
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
const bcrypt = require('bcrypt')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('accounts', [{
      name: 'Brian',
      email: 'brian-the-second@king.com',
      password: bcrypt.hashSync('supreme-leader', 10),
      coins: 2147483647,
      token: null,
      experiencePoints: 2147483647,
      preferredTeam: 'red'
    }, {
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
    return queryInterface.bulkDelete('accounts', null, {})
  }
}
