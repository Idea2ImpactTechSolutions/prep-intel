const { DataTypes } = require("sequelize");
const elephantsql = require("./ElephantSQL");

// Datsource: https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx
// HD2021 = "Institutional Characteristics ->	Directory information"
const ICDirectory = elephantsql.define(
  "hd_2021",
  {
    // Define model attributes
    UNITID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    INSTNM: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IALIAS: {
      type: DataTypes.INTEGER,
    },
    ADDR: {
      type: DataTypes.STRING,
    },
    CITY: {
      type: DataTypes.STRING,
    },
    STABBR: {
      type: DataTypes.STRING
    },
    ZIP: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    // Disable the automatic pluralization done by Sequelize
    freezeTableName: true,

    // Explicitly specify the table name
    tableName: 'HD2021'
  }
);

module.exports = ICDirectory;

