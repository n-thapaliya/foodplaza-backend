'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId:    { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      label:     { type: Sequelize.STRING(50),  defaultValue: 'Home' },
      house:     { type: Sequelize.STRING(200), allowNull: false },
      street:    { type: Sequelize.STRING(200), allowNull: true  },
      city:      { type: Sequelize.STRING(100), allowNull: false },
      state:     { type: Sequelize.STRING(100), allowNull: false },
      pincode:   { type: Sequelize.STRING(10),  allowNull: false },
      isDefault: { type: Sequelize.BOOLEAN,     defaultValue: false },
      lat:       { type: Sequelize.DECIMAL(10,7), allowNull: true },
      lng:       { type: Sequelize.DECIMAL(10,7), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('addresses');
  },
};
