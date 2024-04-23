'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding 'phone' column
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING
    });
    // Adding 'profile_img' column
    await queryInterface.addColumn('users', 'profile_image_id', {
      type: Sequelize.INTEGER
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing 'phone' column
    await queryInterface.removeColumn('users', 'phone');
    // Removing 'profile_img' column
    await queryInterface.removeColumn('users', 'profile_image_id');
  }
};
