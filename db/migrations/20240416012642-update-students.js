'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding 'postal' column
    await queryInterface.addColumn('students', 'postal', {
      type: Sequelize.INTEGER
    });
    // Adding 'sat_score' column
    await queryInterface.addColumn('students', 'sat_score', {
      type: Sequelize.INTEGER
    });
    // Adding 'act_score' column
    await queryInterface.addColumn('students', 'act_score', {
      type: Sequelize.INTEGER
    });
    // Adding 'gpa' column
    await queryInterface.addColumn('students', 'gpa', {
      type: Sequelize.INTEGER
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing 'postal' column
    await queryInterface.removeColumn('students', 'postal');
    // Removing 'sat_score' column
    await queryInterface.removeColumn('students', 'sat_score');
    // Removing 'act_score' column
    await queryInterface.removeColumn('students', 'act_score');
    // Removing 'gpa' column
    await queryInterface.removeColumn('students', 'gpa');
  }
};
