'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cod', 'gpay', 'phonepe', 'paytm', 'razorpay', 'card'),
      defaultValue: 'cod',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    orderStatus: {
      type: DataTypes.ENUM('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
      defaultValue: 'placed',
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deliveryLat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    deliveryLng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'orders',
    timestamps: true,
  });

  return Order;
};
