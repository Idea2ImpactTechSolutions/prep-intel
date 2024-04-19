'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding 'publish_date' column
    await queryInterface.addColumn('students', 'publish_date', {
      type: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing 'publish_date' column
    await queryInterface.removeColumn('students', 'publish_date');
  }
};
