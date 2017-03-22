/**
 * Defines the account entity
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(64)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(254)
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      coins: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      token: {
        allowNull: true,
        type: Sequelize.STRING(64)
      },
      experiencePoints: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      preferredTeam: {
        allowNull: false,
        type: Sequelize.ENUM('black', 'red'),
        defaultValue: 'black'
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('accounts')
  }
}
