/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // It's a good practice to add 'await' to each queryInterface call in a try-catch block
    try {
      await queryInterface.addColumn('assets', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Reference to the user ID", // Optional: adds a comment to the column for clarity
        references: {
          model: 'users', // Name of the referenced table
          key: 'id'          // Key in the referenced table
        },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL' // or 'CASCADE', depending on your requirements
      });
      await queryInterface.addColumn('assets', 'filename', {
        type: Sequelize.STRING,
        comment: "Name of the file stored"
      });
    } catch (error) {
      console.error('Migration failed with error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // When reverting, you should remove columns in the reverse order of their addition
      await queryInterface.removeColumn('assets', 'filename');
      await queryInterface.removeColumn('assets', 'user_id');
    } catch (error) {
      console.error('Reversion of the migration failed with error:', error);
      throw error;
    }
  }
};
