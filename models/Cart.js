'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
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
      defaultValue: 1,
      validate: { min: 1 },
    },
  }, {
    tableName: 'carts',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['userId', 'foodId'] },
    ],
  });

  return Cart;
};
