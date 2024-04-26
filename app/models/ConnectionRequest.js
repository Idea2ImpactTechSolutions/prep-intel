const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Recruiters = require("./Recruiters");
const School = require("./School");
const Students = require("./Students");

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
            allowNull: false,
            references: {
                model: School,
                key: "id"
            }
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Students,
                key: "id"
            }
        },
        recruiter_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Recruiters,
                key: "id"
            }
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
                    'student_id',
                    'recruiter_id'
                ]
            }
        ]
    }
);

ConnectionRequest.belongsTo(School, {
    foreignKey: 'school_id',
    constraints: false
});

ConnectionRequest.belongsTo(Recruiters, {
    foreignKey: 'recruiter_id',
    constraints: false
});

module.exports = ConnectionRequest;