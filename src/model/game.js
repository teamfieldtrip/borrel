/**
 * Player model
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = function (sequelize, DataTypes) {
  const Game = sequelize.define('game', {
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
    // Latitude and longitude of the game
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    // Radius, in meters, where the game takes place
    radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    // Is the game public?
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    // When the game started, or null if in lobby
    startTime: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    },
    // When the game ended, or null if still busy or not started
    endTime: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    },
    // True if the game was cancelled before it started
    cancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    // Game result
    // ENUM
    winner: {
      type: DataTypes.ENUM('tie', 'red', 'blue'),
      defaultValue: null,
      allowNull: true
    }
  }, {
    comment: 'A game, which has a playing field (lat, lng, rad) and results.',
    indexes: [
      {fields: ['id'], unique: true}
    ],
    classMethods: {
      associate: function (models) {
        // A game always has a host
        Game.belongsTo(models.account, {foreignKey: 'host'})
        // A game also has players, which includes the host (as a player)
        Game.hasMany(models.player, {foreignKey: 'game'})
      }
    }
  })

  return Game
}
