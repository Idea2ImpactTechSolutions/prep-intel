const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Users = sequelize.define(
    "users",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: false,
    }
);

module.exports = Users;
