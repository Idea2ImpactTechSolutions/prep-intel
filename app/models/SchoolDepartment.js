const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const SchoolDepartment = sequelize.define(
  "school_department",
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    major_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    act_required: {
      type: DataTypes.BOOLEAN,
    },
    min_act_score: {
      type: DataTypes.INTEGER,
    },
    diploma_required: {
      type: DataTypes.BOOLEAN,
    },
    gpa_requirement: {
      type: DataTypes.DOUBLE,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SchoolDepartment;
