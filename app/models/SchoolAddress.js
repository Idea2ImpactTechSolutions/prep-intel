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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    type: {
      type: DataTypes.STRING(50),
    },
    street_address_1: {
      type: DataTypes.STRING(255),
    },
    street_address_2: {
      type: DataTypes.STRING(255),
    },
    city: {
      type: DataTypes.STRING(100),
    },
    state: {
      type: DataTypes.STRING(100),
    },
    postal: {
      type: DataTypes.STRING(10),
    },
    country: {
      type: DataTypes.STRING(2),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SchoolAddress;
