const Sequelize = require("sequelize");
const config = require("../config/config.js");

// Required for pg support in production, verify in production before any future removal
dialectModule: require('pg');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

module.exports = sequelize;
