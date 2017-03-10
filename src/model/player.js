/**
 * Player model
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = function (sequelize, DataTypes) {
  const Player = sequelize.define('player', {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        // NOTE models contains all models
        Player.hasOne(models.account)
      }
    }
  })

  return Player
}
