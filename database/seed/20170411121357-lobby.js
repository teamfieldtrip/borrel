'use strict'

let uuids = [
  'aaf2a37c-1eb3-11e7-93ae-92361f002671',
  'aaf2a822-1eb3-11e7-93ae-92361f002671',
  'aaf2a9d0-1eb3-11e7-93ae-92361f002671',
  'aaf2ab42-1eb3-11e7-93ae-92361f002671'
]

let hostUuids = [
  '3345f5c2-4106-4c62-ba27-a826f35d2a37',
  '78e1b61b-59b9-457d-aa45-d6b4fac96ee5',
  '3345f5c2-4106-4c62-ba27-a826f35d2a37',
  '78e1b61b-59b9-457d-aa45-d6b4fac96ee5'
]

module.exports = {
  up: function (queryInterface, Sequelize) {
    // Build the data
    let data = [
      {
        id: uuids.pop(),
        host: hostUuids.pop(),
        public: false
      },
      {
        id: uuids.pop(),
        host: hostUuids.pop(),
        public: false
      },
      {
        id: uuids.pop(),
        host: hostUuids.pop(),
        public: true
      },
      {
        id: uuids.pop(),
        host: hostUuids.pop()
        public: true
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
