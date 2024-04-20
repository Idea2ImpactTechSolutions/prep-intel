'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.removeColumn("recruits", "connection_initiator");
    await queryInterface.removeColumn("recruits", "connection_date");
    await queryInterface.removeColumn("recruits", "contacted");
    await queryInterface.removeColumn("recruits", "interested");
    await queryInterface.removeColumn("recruits", "is_viewable");

    await queryInterface.createTable('connection_requests', 
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            school_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                  model: 'schools',
                  key: 'id'
                }
            },
            initiator_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            initiator_role: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['student', 'recruiter']]
                }
            },
            recipient_id: {
                type: DataTypes.INTEGER
            },
            create_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            connection_accepted: {
                type: DataTypes.BOOLEAN
            },
            response_date: {
                type: DataTypes.DATE
            }
        }
    );

    await queryInterface.addConstraint("connection_requests"), {}
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.addColumn("recruits", "connection_initiator", {
        type: DataTypes.TEXT
    });
    await queryInterface.addColumn("recruits", "connection_date", {
        type: DataTypes.DATE
    });
    await queryInterface.addColumn("recruits", "contacted", {
        type: DataTypes.BOOLEAN
    });
    await queryInterface.addColumn("recruits", "interested", {
        type: DataTypes.BOOLEAN
    });
    await queryInterface.addColumn("recruits", "is_viewable", {
        type: DataTypes.BOOLEAN
    });
    await queryInterface.dropTable("connection_requests");
  }
};