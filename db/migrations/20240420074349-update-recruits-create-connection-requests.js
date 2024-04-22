'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.removeColumn('recruits', 'connection_initiator');
    await queryInterface.removeColumn('recruits', 'connection_date');
    await queryInterface.removeColumn('recruits', 'contacted');
    await queryInterface.removeColumn('recruits', 'interested');
    await queryInterface.removeColumn('recruits', 'is_viewable');

    await queryInterface.createTable('connection_requests', 
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            school_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                  model: 'schools',
                  key: 'id'
                }
            },
            initiator_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            initiator_role: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [['student', 'recruiter']]
                }
            },
            recipient_id: {
                type: Sequelize.INTEGER
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
            'initiator_id', 
            'initiator_role',
            'recipient_id'
        ],
        name: 'unique_school_initiator_role_recipient'
    });
    await queryInterface.addConstraint('connection_requests', {
        'type': 'check',
        fields: ['initiator_role'],
        name: 'check_initiator_role',
        where: {
            initiator_role: ['student', 'recruiter']
        }
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
    await queryInterface.addColumn('recruits', 'contacted', {
        type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('recruits', 'interested', {
        type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('recruits', 'is_viewable', {
        type: Sequelize.BOOLEAN
    });

    await queryInterface.dropTable('connection_requests');
    await queryInterface.removeConstraint(
        'connection_requests',
        'unique_school_initiator_role_recipient'
    );
    await queryInterface.removeConstraint(
        'connection_requests',
        'check_initiator_role'
    );
  }
};