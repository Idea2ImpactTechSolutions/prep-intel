const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Recruiters = require("./Recruiters");
const School = require("./School");
const Students = require("./Students");

const ConnectionRequest = sequelize.define(
    "connection_requests",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        school_id: {
            type: DataTypes.UUID,
            allowNull: false
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
    },
    {
        timestamps: true,
        createdAt: 'create_date',
        updatedAt: 'response_date'
    }
);

ConnectionRequest.belongsTo(School, {
    foreignKey: 'school_id',
    constraints: false
});

ConnectionRequest.belongsTo(Students, {
    foreignKey: 'initiator_id',
    constraints: false
});

ConnectionRequest.belongsTo(Recruiters, {
    foreignKey: 'initiator_id',
    constraints: false
});

School.hasMany(ConnectionRequest, {
    foreignKey: 'school_id',
    constraints: false,
    scope: {
      initiator_role: 'student',
    }
  });

Students.hasMany(ConnectionRequest, {
    foreignKey: 'initiator_id',
    constraints: false,
    scope: {
      initiator_role: 'student',
    }
  });

Recruiters.hasMany(ConnectionRequest, {
    foreignKey: 'initiator_id',
    constraints: false,
    scope: {
        initiator_role: 'recruiter',
    }
});

module.exports = ConnectionRequest;