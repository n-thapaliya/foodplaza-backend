'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('addresses', ['userId'], { name: 'addresses_user_id_idx' });
    await queryInterface.addIndex('order_items', ['orderId'], { name: 'order_items_order_id_idx' });
    await queryInterface.addIndex('order_items', ['foodId'], { name: 'order_items_food_id_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('order_items', 'order_items_food_id_idx');
    await queryInterface.removeIndex('order_items', 'order_items_order_id_idx');
    await queryInterface.removeIndex('addresses', 'addresses_user_id_idx');
  },
};
