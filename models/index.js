'use strict';
require('dotenv').config();
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable],
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import models
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Food = require('./Food')(sequelize);
const Cart = require('./Cart')(sequelize);
const Favorite = require('./Favorite')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Address = require('./Address')(sequelize);

// ── Associations ──────────────────────────────────────────────────────────────

// User associations
User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems', onDelete: 'CASCADE' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });

// Category associations
Category.hasMany(Food, { foreignKey: 'categoryId', as: 'foods', onDelete: 'SET NULL' });

// Food associations
Food.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Food.hasMany(Cart, { foreignKey: 'foodId', as: 'cartEntries', onDelete: 'CASCADE' });
Food.hasMany(Favorite, { foreignKey: 'foodId', as: 'favEntries', onDelete: 'CASCADE' });
Food.hasMany(OrderItem, { foreignKey: 'foodId', as: 'orderItems', onDelete: 'CASCADE' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(Food, { foreignKey: 'foodId', as: 'food' });

// Favorite associations
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Food, { foreignKey: 'foodId', as: 'food' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Food, { foreignKey: 'foodId', as: 'food' });

// Address associations
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  Food,
  Cart,
  Favorite,
  Order,
  OrderItem,
  Address,
};
