const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Users = require("./Users");
const Departments = require("./Department");
const Students = require("./Students");

const StudentsDepartmentInterests = sequelize.define(
    "student_department_interests",
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
        department_id: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
    }
);

// Students.hasMany(Recruits, { foreignKey: "student_id", as: "recruits" })
// Students.hasMany(Applicants, { foreignKey: "student_id", as: "applicants" })

Students.hasOne(StudentsDepartmentInterests, {
    foreignKey: "department_id",
})

StudentsDepartmentInterests.belongsTo(Students, {
    foreignKey: 'department_id', // This should match the foreignKey in the hasOne association
});

Departments.hasOne(StudentsDepartmentInterests, {
    foreignKey: "department_id"
})

StudentsDepartmentInterests.belongsTo(Users, {
    foreignKey: 'department_id', // This should match the foreignKey in the hasOne association
});


module.exports = StudentsDepartmentInterests;
