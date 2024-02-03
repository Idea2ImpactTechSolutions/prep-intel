const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Accreditation = sequelize.define(
  "accreditation",
  {
    // Define model attributes
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Model options (optional)
  }
);

module.exports = Accreditation;
