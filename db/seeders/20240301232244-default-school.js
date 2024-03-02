'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('schools', [{
        id: 'b14e03a9-656a-4726-9d38-6f09c912a543',
        name: 'Test School',
        institution_type: 'College',
      }], {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('People', null, {});
  }
};
