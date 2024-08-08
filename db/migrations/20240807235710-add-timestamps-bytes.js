'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("assets", "bytes", {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn("assets", "createdAt", {
      type: Sequelize.DATE
    });

    await queryInterface.addColumn("assets", "updatedAt", {
      type: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("assets", "bytes");
    await queryInterface.removeColumn("assets", "createdAt");
    await queryInterface.removeColumn("assets", "updatedAt");
  }
};
