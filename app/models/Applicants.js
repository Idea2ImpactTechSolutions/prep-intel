const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Applicants = sequelize.define(
    "applicants",
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
        application_status: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Applicants
