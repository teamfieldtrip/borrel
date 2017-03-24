/**
 * Purchase model
 *
 * @author Roelof Roos <github@roelof.io>
 */

module.exports = function (sequelize, DataTypes) {
  const Purchase = sequelize.define('purchase', {
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
    // Item that was purchased
    item: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    // Account that bought the item
    account: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    //
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // The obtained score
    cost: {
      type: DataTypes.FLOAT,
      defaultValue: 0.00,
      allowNull: false,
      validate: {
        min: 0.00
      }
    }
  }, {
    comment: 'A purchase, made by an account and associated with a StoreItem.',
    indexes: [
      {fields: ['id'], unique: true}
    ],
    classMethods: {
      associate: function (models) {
        // NOTE models contains all models
        // A purchase is always linked to an account
        Purchase.belongsTo(models.account, {foreignKey: 'account'})
        // A purchase is always linked to a StoreItem
        // TODO Create StoreItem class
        // Purchase.hasOne(models.storeItem, {foreignKey: 'item'})
      }
    }
  })

  return Purchase
}
