/**
 * Lobby model
 *
 * @author Sven Boekelder
 * @author Remco Schipper
 */

module.exports = function (sequelize, DataTypes) {
  const Lobby = sequelize.define('lobby', {
    // Lobby ID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    amountOfPlayers: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    amountOfRounds: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    amountOfLives: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    powerUpsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    centerLatitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    centerLongitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    borderLatitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    borderLongitude: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // TODO Settings
  }, {
    comment: 'A lobby, contains players and settings.',
    indexes: [
      {fields: ['id'], unique: true}
    ],
    classMethods: {
      associate: function (models) {
        // The lobby always contains players
        Lobby.hasMany(models.player, {foreignKey: 'lobby', as: 'Players'})
        // The lobby always has one host
        Lobby.hasOne(models.player, {foreignKey: 'host'})
      }
    }
  })

  return Lobby
}
