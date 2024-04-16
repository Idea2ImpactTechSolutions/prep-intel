const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const StudentDepartmentInterest = sequelize.define(
  "student_department_interests",
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
    }
  },
  {
    timestamps: false,
  }
);

module.exports = StudentDepartmentInterest;
