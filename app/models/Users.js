const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Recruiters = require("./Recruiters");

const Users = sequelize.define(
    "users",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        profile_img: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        school_id: {
            type: DataTypes.STRING,
        },
        auth_code: {
            type: DataTypes.STRING,
        },
        account_claimed: {
            type: DataTypes.BOOLEAN,
        },
        date_claimed: {
            type: DataTypes.DATE,
        },
        school_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);


Users.hasMany(Recruiters, { foreignKey: "user_id", as: "recruiters" })


module.exports = Users;
