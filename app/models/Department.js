const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Department = sequelize.define(
  "department",
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Model options (optional)
    timestamps: false,
  }
);

module.exports = Department;
