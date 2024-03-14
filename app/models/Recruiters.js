const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

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
            type: DataTypes.STRING,
            allowNull: false,
        },
        territories: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        // Model options (optional)
    }
);

module.exports = Recruiters;
