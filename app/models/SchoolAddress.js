const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const SchoolAddress = sequelize.define(
  "school_address",
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
    type: {
      type: DataTypes.STRING,
    },
    street_address_1: {
      type: DataTypes.STRING,
    },
    street_address_2: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    postal: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SchoolAddress;
