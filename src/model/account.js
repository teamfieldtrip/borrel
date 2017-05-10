/**
 * Player model
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */
const bcrypt = require('bcrypt')

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
    // Email address
    email: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    // Password
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      set: function (val) {
        this.setDataValue('password', bcrypt.hashSync(val, 10))
      }
    },
    // Account access token
    token: {
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
    experiencePoints: {
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
    instanceMethods: {
      passwordMatches: function (input) {
        return new Promise((resolve, reject) => {
          bcrypt.compare(input, this.getDataValue('password'), (error, result) => {
            if (error) {
              return reject(error)
            }
            return resolve(result)
          })
        })
      }
    },
    classMethods: {
      associate: function (models) {
        // NOTE models contains all models
        Account.hasMany(models.player, {foreignKey: 'account', as: 'players'})
        Account.hasMany(models.purchase, {foreignKey: 'account', as: 'purchases'})
      }
    }
  })

  return Account
}
