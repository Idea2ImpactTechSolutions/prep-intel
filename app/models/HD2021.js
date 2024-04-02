const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

// Datsource: https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx
// HD2021 = "Institutional Characteristics ->	Directory information"
const ICDirectory = sequelize.define(
  "hd_2021",
  {
    // Define model attributes
    unitid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    instnm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ialias: {
      type: DataTypes.INTEGER,
    },
    applurl: {
      type: DataTypes.STRING,
    },
    faidurl: {
      type: DataTypes.STRING,
    },
    applurl: {
      type: DataTypes.STRING,
    },
    addr: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    stabbr: {
      type: DataTypes.STRING
    },
    zip: {
      type: DataTypes.STRING
    },
    control: {
      type: DataTypes.INTEGER
    },
    iclevel: {
      type: DataTypes.INTEGER
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

