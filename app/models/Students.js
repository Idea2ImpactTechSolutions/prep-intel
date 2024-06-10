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
        dob: {
            type: DataTypes.DATE,
        },
        postal: {
            type: DataTypes.STRING,
        }, sat_score: {
            type: DataTypes.INTEGER,
        }, act_score: {
            type: DataTypes.INTEGER,
        }, gpa: {
            type: DataTypes.FLOAT,
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
            type: DataTypes.DATE,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        publish_date: {
            type: DataTypes.DATE,
        },
        majors: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        extracurriculars: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        gpa: {
          type: DataTypes.FLOAT,
        },
        act_score: {
          type: DataTypes.INTEGER,
        },
        sat_score: {
          type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Students;
