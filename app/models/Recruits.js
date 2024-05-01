const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Recruiters = require("./Recruiters");
// const School = require("./School");
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
        },
        school_id: {
            type: DataTypes.STRING,
        },
        recruiter_id: {
            type: DataTypes.STRING,
        },
        criteria: {
            type: DataTypes.TEXT,
        },
        contacted: {
            type: DataTypes.BOOLEAN
        },
        interested: {
            type: DataTypes.BOOLEAN
        },
        create_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        application_date: {
            type: DataTypes.DATE,
        },
        application_status: {
            type: DataTypes.STRING,
        },
        applicant_status: {
            type: DataTypes.STRING,
        },
        is_applicant: {
            type: DataTypes.BOOLEAN,
        },
        is_viewable: {
            type: DataTypes.BOOLEAN
        }
    },
    {
        timestamps: true,
        createdAt: 'create_date',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: [
                    'school_id',
                    'student_id',
                    'recruiter_id'
                ]
            }
        ]
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

// Recruits.belongsTo(School, {
//     foreignKey: 'school_id', // This should match the foreignKey in the hasOne association
//     //as: 'sch' // Optional alias
// });

module.exports = Recruits
