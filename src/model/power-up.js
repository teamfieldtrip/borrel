/**
 * Power-up model
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */

module.exports = function (sequelize, DataTypes) {
  const PowerUp = sequelize.define('powerUp', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
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
        // Each inventory item may have a powerup
        PowerUp.hasMany(models.inventoryItem, {foreignKey: 'powerUp'})
        // Each store entry may be linked to a powerup
        PowerUp.hasMany(models.storeEntry, {foreignKey: 'powerUp'})
      }
    }
  })

  return PowerUp
}
