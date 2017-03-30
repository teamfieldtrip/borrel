/**
  * Adds InventoryItem class
  *
  * @author Roelof Roos <github@roelof.io>
 */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('inventoryItems', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      player: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null
      },
      powerUp: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null
      },
      purchaseDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      useDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
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
    return queryInterface.dropTable('inventoryItem')
  }
}
