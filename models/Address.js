'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Address = sequelize.define('Address', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Home',
    },
    house: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
  }, {
    tableName: 'addresses',
    timestamps: true,
  });

  return Address;
};
