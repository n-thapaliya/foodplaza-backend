'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name:      { type: Sequelize.STRING(100), allowNull: false, unique: true },
      image:     { type: Sequelize.STRING(500), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
