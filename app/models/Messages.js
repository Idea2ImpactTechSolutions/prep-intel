const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Message = sequelize.define(
    "message",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        recruiter_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        student_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        message_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sender_role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recipient_role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        create_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

    },
    {
        timestamps: false,
    }
);

module.exports = Message;
