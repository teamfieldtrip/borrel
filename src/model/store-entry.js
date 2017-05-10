/**
 * Purchase model
 *
 * @author Roelof Roos <github@roelof.io>
 */

module.exports = function (sequelize, DataTypes) {
  const StoreEntry = sequelize.define('storeEntry', {
    // store entry ID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    // Cost of the item
    cost: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'storeEntries',
    comment: 'A store item, which can be bought.',
    indexes: [
      {fields: ['id'], unique: true}
    ],
    classMethods: {
      associate: function (models) {
        StoreEntry.hasMany(models.purchase, {foreignKey: 'item'})
        // StoreEntry.belongsTo(models.powerUp, {foreignKey: 'powerUp'})
      }
    }
  })

  return StoreEntry
}
