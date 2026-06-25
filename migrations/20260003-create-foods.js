'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foods', {
      id:          { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      categoryId:  {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'categories', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      name:        { type: Sequelize.STRING(150), allowNull: false },
      description: { type: Sequelize.TEXT,        allowNull: true  },
      price:       { type: Sequelize.DECIMAL(10,2), allowNull: false },
      image:       { type: Sequelize.STRING(500),  allowNull: true  },
      rating:      { type: Sequelize.DECIMAL(3,2), defaultValue: 4.0 },
      isVeg:       { type: Sequelize.BOOLEAN,      defaultValue: true },
      prepTime:    { type: Sequelize.STRING(50),   allowNull: true  },
      createdAt:   { type: Sequelize.DATE, allowNull: false },
      updatedAt:   { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('foods', ['categoryId']);
    await queryInterface.addIndex('foods', ['name']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('foods');
  },
};
