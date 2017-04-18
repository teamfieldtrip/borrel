/**
 * Lobby model
 *
 * @author Sven Boekelder
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
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      primaryKey: false
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
        Lobby.hasMany(models.player, {foreignKey: 'lobby'})
        // The lobby always has one host
        Lobby.hasOne(models.player, {foreignKey: 'host'})
      }
    }
  })

  return Lobby
}
