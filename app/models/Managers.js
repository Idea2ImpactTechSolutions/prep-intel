const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Managers = sequelize.define(
    "managers",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       
    },
    {
        timestamps: false,
    }
);

module.exports = Managers;
