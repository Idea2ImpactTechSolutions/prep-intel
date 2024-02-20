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
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
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
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notification_method: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_claimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        create_date: {
            type: DataTypes.DATE,
        },
        claim_date: {
            type: DataTypes.DATE,
        },
        auth_code_expiration: {
            type: DataTypes.DATE,
        },
        deactivation_date: {
            type: DataTypes.DATE,
        },
        last_login_date: {
            type: DataTypes.DATE,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        // Model options (optional)
    }
);

module.exports = Recruiters;
