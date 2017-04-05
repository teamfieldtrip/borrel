/**
 * Player model
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = function (sequelize, DataTypes) {
  const GamePlayer = sequelize.define('gamePlayer', {
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
    // When the game started, or null if in lobby
    joinTime: {
      type: DataTypes.DATETIME,
      defaultValue: null,
      allowNull: true
    },
    // When the game ended, or null if still busy or not started
    leaveTime: {
      type: DataTypes.DATETIME,
      defaultValue: null,
      allowNull: true
    }
  }, {
    comment: 'A game - player link, which includes when the player joined and left',
    indexes: [
      {fields: ['id'], unique: true},
      {fields: ['game', 'player'], unique: true}
    ],
    timestamps: false,
    classMethods: {
      associate: function (models) {
        // A GamePlayer links a player to a game
        GamePlayer.belongsTo(models.player, {foreignKey: 'player'})
        GamePlayer.belongsTo(models.game, {foreignKey: 'game'})
      }
    }
  })

  return GamePlayer
}
