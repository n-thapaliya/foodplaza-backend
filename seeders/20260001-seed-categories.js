'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      { id: 1,  name: 'Pizza',     image: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 2,  name: 'Burger',    image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 3,  name: 'Pasta',     image: 'https://cdn-icons-png.flaticon.com/512/5787/5787016.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 4,  name: 'Sandwich',  image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 5,  name: 'Salad',     image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 6,  name: 'Drinks',    image: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 7,  name: 'Dessert',   image: 'https://cdn-icons-png.flaticon.com/512/3081/3081967.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 8,  name: 'Sides',     image: 'https://cdn-icons-png.flaticon.com/512/5787/5787100.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 9,  name: 'Indian',    image: 'https://cdn-icons-png.flaticon.com/512/857/857681.png',   createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'Chinese',   image: 'https://cdn-icons-png.flaticon.com/512/2718/2718224.png', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
