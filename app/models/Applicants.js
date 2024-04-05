const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Recruiters = require("./Recruiters");
const School = require("./School");
const Students = require("./Students");

const Applicants = sequelize.define(
    "applicants",
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
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        application_status: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        applicant_status: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

Applicants.belongsTo(Students, {
    foreignKey: 'student_id', // This should match the foreignKey in the hasOne association
    // as: 'student' // Optional alias
});

Applicants.belongsTo(Recruiters, {
    foreignKey: 'recruiter_id', // This should match the foreignKey in the hasOne association
    //as: 'rec' // Optional alias
});

Applicants.belongsTo(School, {
    foreignKey: 'school_id', // This should match the foreignKey in the hasOne association
    //as: 'sch' // Optional alias
});

module.exports = Applicants
