const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
// const Users = require("./Users");

const Recruiters = sequelize.define(
    "recruiters",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
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
            type: DataTypes.INTEGER,
        },
        territories: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true,
        },
    },
    {
        timestamps: false,
        // Model options (optional)
    }
);



module.exports = Recruiters;
