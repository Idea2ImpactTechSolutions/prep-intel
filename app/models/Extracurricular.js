const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Extracurricular = sequelize.define(
  "extracurricular",
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    // Model options (optional)
    timestamps: false,
  }
);

module.exports = Extracurricular;
