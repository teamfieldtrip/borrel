/**
 * Player model
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = function (sequelize, DataTypes) {
  const Player = sequelize.define('player', {
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
    // Latitude and longitude
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    // The obtained score
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    // Target
    target: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true
    },
    // Team
    team: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        max: 2,
        min: 0
      }
    },
    // Game result
    // ENUM value:
    // 1: win
    // 2: lose
    // 3: tie
    // 4: disconnect
    result: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true,
      validate: {
        min: 1,
        max: 4
      }
    }
  }, {
    comment: 'A player, takes part in a game and has powerups.',
    indexes: [
      {fields: ['id'], unique: true}
    ],
    classMethods: {
      associate: function (models) {
        // A player is always linked to an account
        // Player.belongsTo(models.account, {foreignKey: 'account'})
        // A player also has an account
        Player.hasMany(models.inventoryItem, {foreignKey: 'player'})
      }
    }
  })

  return Player
}
