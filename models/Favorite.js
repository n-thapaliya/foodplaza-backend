'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Favorite = sequelize.define('Favorite', {
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
  }, {
    tableName: 'favorites',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['userId', 'foodId'] },
    ],
  });

  return Favorite;
};
