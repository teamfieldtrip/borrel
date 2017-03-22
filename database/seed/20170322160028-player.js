/**
 * Seeds the table with a number of players, who aren't hunting anyone yet.
 *
 * @author Roelof Roos <github@roelof.io>
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('players', [
      {
        id: '2F2FCBEE-5CAE-4E9F-9EA7-39E86D9D02DE',
        latitude: 52.874,
        longitude: 5.998,
        score: 12,
        team: 1
      },
      {
        id: '935E5CDD-A91A-4772-B3A3-B14509F8067B',
        latitude: 52.834,
        longitude: 5.993,
        score: 14,
        team: 2
      },
      {
        id: '97562F6B-F996-4B94-A858-5A1CB57F616A',
        latitude: 52.834,
        longitude: 6.001
      },
      {
        id: '78F61C0F-1F03-4B76-9E12-828A4FA719F8'
      }
    ], {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('players', null, [
      {id: '2F2FCBEE-5CAE-4E9F-9EA7-39E86D9D02DE'},
      {id: '935E5CDD-A91A-4772-B3A3-B14509F8067B'},
      {id: '97562F6B-F996-4B94-A858-5A1CB57F616A'},
      {id: '78F61C0F-1F03-4B76-9E12-828A4FA719F8'}
    ])
  }
}
