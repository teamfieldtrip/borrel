'use strict'

let uuids = [
  'aaf2a37c-1eb3-11e7-93ae-92361f002671',
  'aaf2a822-1eb3-11e7-93ae-92361f002671',
  'aaf2a9d0-1eb3-11e7-93ae-92361f002671',
  'aaf2ab42-1eb3-11e7-93ae-92361f002671'
]

module.exports = {
  up: function (queryInterface, Sequelize) {
    // Build the data
    let data = [
      {
        id: uuids.pop()
      },
      {
        id: uuids.pop()
      },
      {
        id: uuids.pop()
      },
      {
        id: uuids.pop()
      }
    ]

    // Create a map of all various promises that we use for each bulkInsert
    let promises = []
    data.forEach(function (row) {
      promises.push(queryInterface.bulkInsert('lobbies', [row], {}))
    })

    // Wait for all promises to complete. The up method expects a Promise to
    // be returned so it can call the 'then' method.
    return Promise.all(promises)
  },

  down: function (queryInterface, Sequelize) {
    var rows = []
    uuids.forEach(function (id) {
      rows.push({id: id})
    })
    return queryInterface.bulkDelete('lobbies', null, rows)
  }
}
