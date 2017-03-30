/**
 * Seeds the table with a number of players, who aren't hunting anyone yet.
 *
 * @author Roelof Roos <github@roelof.io>
 */

let uuids = [
  '4e82dd8a-9655-43c3-ac5d-7187152f4c25',
  'b12b2760-d224-4c61-a4a1-f66ba5732ed9',
  '86331762-c90d-45a7-8b27-ea46547cd024',
  '1a0d0813-40d5-4208-81c0-98650987e378'
]

module.exports = {
  up: function (queryInterface, Sequelize) {
    // Build the data
    let sets = [
      [new Date(), 12.34],
      [new Date('2017-03-24T10:23:12.000+01:00'), 0.79],
      [new Date('2017-02-18T23:39:59.000+01:00')],
      []
    ]

    let data = []

    sets.forEach(function (row, index) {
      let newRow = {id: uuids[index]}

      if (row[0]) {
        newRow.date = row[0]
      }

      if (row[1]) {
        newRow.cost = row[1]
      }
      data.push(newRow)
    })

    // Create a map of all various promises that we use for each bulkInsert
    let promises = []
    data.forEach(function (row) {
      promises.push(queryInterface.bulkInsert('purchases', [row], {}))
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
    return queryInterface.bulkDelete('purchases', null, rows)
  }
}
