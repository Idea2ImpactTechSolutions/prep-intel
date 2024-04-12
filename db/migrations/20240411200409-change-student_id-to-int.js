'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the existing student_id column
    await queryInterface.removeColumn('student_department_interests', 'student_id');

    // Add a new student_id column with the INTEGER data type
    await queryInterface.addColumn('student_department_interests', 'student_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the new student_id column
    await queryInterface.removeColumn('student_department_interests', 'student_id');

    // Add back the original student_id column with the UUID data type
    await queryInterface.addColumn('student_department_interests', 'student_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
}

