'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  }, {
    tableName: 'categories',
    timestamps: true,
  });

  return Category;
};
