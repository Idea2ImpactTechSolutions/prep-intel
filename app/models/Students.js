const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Users = require("./Users");

const Students = sequelize.define(
    "students",
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dob: {
            type: DataTypes.DATE,
        },
        postal: {
            type: DataTypes.INTEGER,
        }, sat_score: {
            type: DataTypes.INTEGER,
        }, act_score: {
            type: DataTypes.INTEGER,
        }, gpa: {
            type: DataTypes.INTEGER,
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        graduation_year: {
            type: DataTypes.INTEGER,
        },
        high_school: {
            type: DataTypes.STRING,
        },
        guardian_first_name: {
            type: DataTypes.STRING,
        },
        guardian_last_name: {
            type: DataTypes.STRING,
        },
        guardian_email: {
            type: DataTypes.STRING,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
        },
        create_date: {
            type: DataTypes.DATE,
        },
        user_id: {
            type: DataTypes.INTEGER,
        }
    },
    {
        timestamps: false,
    }
);

// Students.hasMany(Recruits, { foreignKey: "student_id", as: "recruits" })
// Students.hasMany(Applicants, { foreignKey: "student_id", as: "applicants" })

Students.belongsTo(Users, {
    foreignKey: 'user_id', // This should match the foreignKey in the hasOne association
});


module.exports = Students;
