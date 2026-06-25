'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onDelete: 'CASCADE',
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'foods', key: 'id' },
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Price at the time of order',
    },
  }, {
    tableName: 'order_items',
    timestamps: false,
  });

  return OrderItem;
};
