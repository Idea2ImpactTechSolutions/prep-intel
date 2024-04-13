const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Student = require("./Students")

const StudentsExtracurriculars = sequelize.define(
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

Student.hasOne(StudentsExtracurriculars, {
    foreignKey: "student_id",
})

StudentsExtracurriculars.belongsTo(Student, {
    foreignKey: 'student_id', // This should match the foreignKey in the hasOne association
});



module.exports = StudentsExtracurriculars;
