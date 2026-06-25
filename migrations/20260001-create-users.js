'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:           { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      fullName:     { type: Sequelize.STRING(100), allowNull: false },
      email:        { type: Sequelize.STRING(150), allowNull: false, unique: true },
      phone:        { type: Sequelize.STRING(20),  allowNull: true,  unique: true },
      password:     { type: Sequelize.STRING(255), allowNull: false },
      profileImage: { type: Sequelize.STRING(500), allowNull: true },
      isVerified:   { type: Sequelize.BOOLEAN,     defaultValue: false },
      otpCode:      { type: Sequelize.STRING(10),  allowNull: true },
      otpExpiry:    { type: Sequelize.DATE,         allowNull: true },
      otpPurpose:   { type: Sequelize.ENUM('verify','reset'), allowNull: true },
      refreshToken: { type: Sequelize.TEXT,         allowNull: true },
      createdAt:    { type: Sequelize.DATE, allowNull: false },
      updatedAt:    { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
