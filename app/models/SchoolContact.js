const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const SchoolContact = sequelize.define(
  "school_contact",
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    department_name: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SchoolContact;
