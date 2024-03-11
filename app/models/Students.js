const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Students = sequelize.define(
    "students",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        school_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATE,
        },
        password: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        graduation_year: {
            type: DataTypes.INTEGER,
        },
        high_school: {
            type: DataTypes.STRING,
        },
        guardian_first_name: {
            type: DataTypes.STRING,
        },
        guardian_last_name: {
            type: DataTypes.STRING,
        },
        guardian_email: {
            type: DataTypes.STRING,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
        },
        create_date: {
            type: DataTypes.DATETIME,
        },
        cancel_reason: {
            type: DataTypes.TEXT,
        },
        last_login_date: {
            type: DataTypes.DATETIME,
        }
    },
    {
        timestamps: false,
    }
);

module.exports = Students;
