'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id:       { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orderId:  { type: Sequelize.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onDelete: 'CASCADE' },
      foodId:   { type: Sequelize.INTEGER, allowNull: false, references: { model: 'foods',  key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price:    { type: Sequelize.DECIMAL(10,2), allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('order_items');
  },
};
