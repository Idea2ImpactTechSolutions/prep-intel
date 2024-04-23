'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.removeColumn('recruits', 'connection_initiator');
    await queryInterface.removeColumn('recruits', 'connection_date');
    await queryInterface.addConstraint('recruits', {
        type: 'unique',
        fields: [
            'school_id', 
            'student_id', 
            'recruiter_id'
        ],
        name: 'unique_recruit_school_student_recruiter'
    });

    await queryInterface.createTable('connection_requests', 
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            school_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: 'schools',
                  key: 'id'
                }
            },
            student_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'students',
                    key: 'id'
                }
            },
            recruiter_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    models: 'recruiters',
                    key: 'id'
                }
            },
            create_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            connection_accepted: {
                type: Sequelize.BOOLEAN
            },
            response_date: {
                type: Sequelize.DATE
            }
        }
    );
    await queryInterface.addConstraint('connection_requests', {
        type: 'unique',
        fields: [
            'school_id', 
            'student_id', 
            'recruiter_id'
        ],
        name: 'unique_connection_school_student_recruiter'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.addColumn('recruits', 'connection_initiator', {
        type: Sequelize.TEXT
    });
    await queryInterface.addColumn('recruits', 'connection_date', {
        type: Sequelize.DATE
    });
    await queryInterface.removeConstraint(
        'recruits',
        'unique_recruit_school_student_recruiter'
    );

    await queryInterface.dropTable('connection_requests');
    await queryInterface.removeConstraint(
        'connection_requests',
        'unique_connection_school_student_recruiter'
    );
  }
};