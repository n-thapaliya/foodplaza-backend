'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn('orders', 'addressId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'addresses', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addIndex('orders', ['addressId']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('orders', ['addressId']);
    await queryInterface.removeColumn('orders', 'addressId');
    await queryInterface.removeColumn('users', 'isActive');
  },
};
