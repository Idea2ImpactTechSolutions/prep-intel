const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Recruiters = require("./Recruiters");
const School = require("./School");
const Students = require("./Students");

const Recruits = sequelize.define(
    "recruits",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        student_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recruiter_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        criteria: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        connection_initiator: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        connection_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        contacted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        interested: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        application_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        application_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_applicant: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        is_viewable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

Recruits.belongsTo(Students, {
    foreignKey: 'student_id', // This should match the foreignKey in the hasOne association
    // as: 'student' // Optional alias
});

Recruits.belongsTo(Recruiters, {
    foreignKey: 'recruiter_id', // This should match the foreignKey in the hasOne association
    //as: 'rec' // Optional alias
});

Recruits.belongsTo(School, {
    foreignKey: 'school_id', // This should match the foreignKey in the hasOne association
    //as: 'sch' // Optional alias
});

module.exports = Recruits
