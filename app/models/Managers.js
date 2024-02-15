const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

// console.log({ DataTypes })
const Managers = sequelize.define(
    "managers",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        school_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        auth_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_claimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        date_claimed: {
            type: sequelize.literal("TIMESTAMP"),
        },
        auth_code_expiration: {
            type: sequelize.literal("TIMESTAMP"),
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        deactivation_date: {
            type: sequelize.literal("TIMESTAMP"),
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Managers;
