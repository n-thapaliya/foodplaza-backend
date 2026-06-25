'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Food = sequelize.define('Food', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 4.0,
      validate: { min: 0, max: 5 },
    },
    isVeg: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    prepTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    tableName: 'foods',
    timestamps: true,
  });

  return Food;
};
