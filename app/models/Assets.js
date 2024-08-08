const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Assets = sequelize.define(
    "assets",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        school_id: {
            type: DataTypes.INTEGER,
        },
        s3_key: {
            type: DataTypes.STRING,
        },
        user_id: {
          type: DataTypes.INTEGER,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bytes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Assets;
