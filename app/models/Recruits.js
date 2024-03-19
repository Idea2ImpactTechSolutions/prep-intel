const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Recruits = sequelize.define(
    "recruits",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        student_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recruiter_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        criteria: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        connection_initiator: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        connection_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        contacted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        interested: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        is_viewable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Recruits
