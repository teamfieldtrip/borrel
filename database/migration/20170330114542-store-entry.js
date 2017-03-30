/**
  * Adds StoreEntry class
  *
  * @author Roelof Roos <github@roelof.io>
 */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('storeEntries', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      powerUp: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'powerUps',
          key: 'id'
        }
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
        validate: {
          min: 0
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('storeEntries')
  }
}
