/**
 * Player model
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = function (sequelize, DataTypes) {
  const Account = sequelize.define('account', {
    // Account ID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    // Account name
    name: {
      type: DataTypes.STRING(96),
      allowNull: false
    },
    // Account access token
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Account coint count
    coins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    },
    // Account coint count
    preferredTeam: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true,
      validate: {
        isNull: true,
        isInt: true,
        min: 0,
        max: 2
      }
    },
    // Account coint count
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    }
  }, {
    comment: 'Accounts, contain one or more players.',
    indexes: [
      {fields: ['id'], unique: true}
    ],
    classMethods: {
      associate: function (models) {
        // NOTE models contains all models
        Account.hasMany(models.player, {foreignKey: 'account'})
        Account.hasMany(models.purchase, {foreignKey: 'account'})
      }
    }
  })

  return Account
}
