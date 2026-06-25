'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id:              { type: Sequelize.INTEGER,        autoIncrement: true, primaryKey: true },
      userId:          { type: Sequelize.INTEGER,        allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      totalAmount:     { type: Sequelize.DECIMAL(10,2),  allowNull: false },
      paymentMethod:   { type: Sequelize.ENUM('cod','gpay','phonepe','paytm','razorpay','card'), defaultValue: 'cod' },
      paymentStatus:   { type: Sequelize.ENUM('pending','paid','failed','refunded'),             defaultValue: 'pending' },
      orderStatus:     { type: Sequelize.ENUM('placed','confirmed','preparing','out_for_delivery','delivered','cancelled'), defaultValue: 'placed' },
      deliveryAddress: { type: Sequelize.TEXT,           allowNull: false },
      deliveryLat:     { type: Sequelize.DECIMAL(10,7),  allowNull: true  },
      deliveryLng:     { type: Sequelize.DECIMAL(10,7),  allowNull: true  },
      notes:           { type: Sequelize.TEXT,           allowNull: true  },
      createdAt:       { type: Sequelize.DATE, allowNull: false },
      updatedAt:       { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('orders', ['userId']);
    await queryInterface.addIndex('orders', ['orderStatus']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_paymentMethod";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_paymentStatus";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_orderStatus";');
  },
};
