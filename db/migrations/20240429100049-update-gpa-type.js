'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('students', 'gpa', {
      type: Sequelize.FLOAT,
      allowNull: true, // Or false, depending on your requirements
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('students', 'gpa', {
      type: Sequelize.INTEGER,
      allowNull: true, // Or false, to match original schema
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
