'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('favorites', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId:    { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      foodId:    { type: Sequelize.INTEGER, allowNull: false, references: { model: 'foods', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('favorites', ['userId', 'foodId'], { unique: true });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('favorites');
  },
};
