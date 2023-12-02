const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const SchoolAccreditation = sequelize.define(
  "school_accreditation",
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accreditation_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SchoolAccreditation;
