'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('messages', 'message_id', 'id');
    await queryInterface.renameColumn('messages', 'sender_id', 'recruiter_id');
    await queryInterface.renameColumn('messages', 'recipient_id', 'student_id');
    await queryInterface.renameColumn('messages', 'sent_at', 'create_date');

    // 3. Change column types if necessary
    await queryInterface.changeColumn('messages', 'recruiter_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('messages', 'student_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    // 4. Add new columns
    await queryInterface.addColumn('messages', 'school_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('messages', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });


    await queryInterface.addConstraint('messages', {
      fields: ['recruiter_id'],
      type: 'foreign key',
      name: 'message_recruiter_id_fkey',
      references: {
        table: 'recruiters',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('messages', {
      fields: ['student_id'],
      type: 'foreign key',
      name: 'message_student_id_fkey',
      references: {
        table: 'students',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('messages', {
      fields: ['school_id'],
      type: 'foreign key',
      name: 'message_school_id_fkey',
      references: {
        table: 'schools',
        field: 'id'
      },
      onDelete: 'SET NULL',  // Choose SET NULL or CASCADE based on your data integrity needs
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('messages', 'id', 'message_id');
    await queryInterface.renameColumn('messages', 'recruiter_id', 'sender_id');
    await queryInterface.renameColumn('messages', 'student_id', 'recipient_id');
    await queryInterface.renameColumn('messages', 'create_date', 'sent_at');

    await queryInterface.removeColumn('messages', 'school_id');
    await queryInterface.removeColumn('messages', 'status');

  }
};
