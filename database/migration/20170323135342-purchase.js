/**
  *
  *
  * @author Roelof Roos <github@roelof.io>
 */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('purchases', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      item: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null
      },
      account: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.00
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
    return queryInterface.dropTable('purchases')
  }
}
