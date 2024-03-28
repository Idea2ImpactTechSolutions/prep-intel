'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Drop the old column
    await queryInterface.removeColumn('school_addresses', 'postal');

    // Add the new column
    await queryInterface.addColumn('school_addresses', 'postal', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // // Revert the changes made in the up method
    // await queryInterface.removeColumn('schools', 'new_column');
    // await queryInterface.addColumn('my_table', 'old_column', {
    //   type: Sequelize.STRING, // Change the type according to your needs
    //   allowNull: false,
    // });
  }
};