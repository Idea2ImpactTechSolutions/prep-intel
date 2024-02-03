const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const SchoolResearchProgram = sequelize.define(
  "school_research_program",
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
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SchoolResearchProgram;
