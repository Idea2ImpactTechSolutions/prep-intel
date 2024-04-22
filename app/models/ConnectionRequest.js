const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const School = require("./School");
const Users = require("./Users");

// TODO: Change school_id type to UUID

const ConnectionRequest = sequelize.define(
    'connection_request',
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        school_id: {
            type: DataTypes.INTEGER,
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
            defaultValue: DataTypes.NOW
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
        updatedAt: 'response_date',
        indexes: [
            {
                unique: true,
                fields: [
                    'school_id', 
                    'initiator_id', 
                    'initiator_role', 
                    'recipient_id'
                ]
            }
        ]
    }
);

ConnectionRequest.belongsTo(School, {
    foreignKey: 'school_id',
    constraints: false
});

ConnectionRequest.belongsTo(Users, {
    foreignKey: 'initiator_id',
    constraints: false,
    as: 'initiator'
});

ConnectionRequest.belongsTo(Users, {
    foreignKey: 'recipient_id',
    constraints: false,
    as: 'recipient'
});

Users.hasMany(ConnectionRequest, {
    foreign_key: 'initiator_id',
    constraints: false,
    as: 'initiator'
});

Users.hasMany(ConnectionRequest, {
    foreign_key: 'recipient_id',
    constraints: false,
    as: 'recipient'
});

module.exports = ConnectionRequest;