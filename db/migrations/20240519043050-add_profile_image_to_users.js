'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('users', 'profile_img', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: "Profile Image Url",
      }, { transaction });

      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING(30),
        allowNull: true,
        comment: "Phone Number",
      }, { transaction });
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove profile_image column
      await queryInterface.removeColumn('users', 'profile_image', { transaction });

      // Remove phone column
      await queryInterface.removeColumn('users', 'phone', { transaction });
    });
  }
};
