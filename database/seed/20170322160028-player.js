/**
 * Seeds the table with a number of players, who aren't hunting anyone yet.
 *
 * @author Roelof Roos <github@roelof.io>
 */

let uuids = [
  '2f2fcbee-5cae-4e9f-9ea7-39e86d9d02de',
  '935e5cdd-a91a-4772-b3a3-b14509f8067b',
  '97562f6b-f996-4b94-a858-5a1cb57f616a',
  '78f61c0f-1f03-4b76-9e12-828a4fa719f8'
]

module.exports = {
  up: function (queryInterface, Sequelize) {
    // Build the data
    let data = [
      {
        id: uuids.pop(),
        latitude: 52.874,
        longitude: 5.998,
        score: 12,
        team: 1,
        result: 4
      },
      {
        id: uuids.pop(),
        latitude: 52.834,
        longitude: 5.993,
        score: 14,
        team: 2
      },
      {
        id: uuids.pop(),
        latitude: 52.834,
        longitude: 6.001
      },
      {
        id: uuids.pop()
      }
    ]

    // Create a map of all various promises that we use for each bulkInsert
    let promises = []
    data.forEach(function (row) {
      promises.push(queryInterface.bulkInsert('players', [row], {}))
    })

    // Wait for all promises to complete. The up method expects a Promise to
    // be returned so it can call the `then` method.
    return Promise.all(promises)
  },

  down: function (queryInterface, Sequelize) {
    var rows = []
    uuids.forEach(function (id) {
      rows.push({id: id})
    })
    return queryInterface.bulkDelete('players', null, rows)
  }
}
