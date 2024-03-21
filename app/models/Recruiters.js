const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Recruits = require("./Recruits");
const Applicants = require("./Applicants");

const Recruiters = sequelize.define(
    "recruiters",
    {
        // Define model attributes
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
        },
        school_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        territories: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        // Model options (optional)
    }
);

Recruiters.hasMany(Applicants, { foreignKey: "recruiter_id", as: "applicants" });
Recruiters.hasMany(Recruits, { foreignKey: "recruiter_id", as: "recruits" });

module.exports = Recruiters;
