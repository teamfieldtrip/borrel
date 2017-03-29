/**
 * Purchase model
 *
 * @author Roelof Roos <github@roelof.io>
 */

module.exports = function (sequelize, DataTypes) {
  const InventoryItem = sequelize.define('inventoryItem', {
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
    // Power-up that this inventory item belongs to
    powerUp: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    // Player that can use the item (game specific)
    player: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    //
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    //
    useDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    comment: 'An inventory item, traded in-game by a Player.',
    indexes: [
      {fields: ['id'], unique: true}
    ],
    classMethods: {
      associate: function (models) {
        // NOTE models contains all models
        // An inventory item is game-bound, so it's connected to a player.
        InventoryItem.belongsTo(models.player, {foreignKey: 'player'})
        // A purchase is always linked to a StoreItem
        // TODO Create StoreItem class
        // Purchase.hasOne(models.storeItem, {foreignKey: 'item'})
      }
    }
  })

  return InventoryItem
}
