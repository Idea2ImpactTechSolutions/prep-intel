const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

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
        
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recruiter_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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



module.exports = ConnectionRequest;