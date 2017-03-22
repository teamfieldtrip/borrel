/**
 * Power-up model
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('powerUp', {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    persistent: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        // TODO add relations
      }
    }
  })
}
