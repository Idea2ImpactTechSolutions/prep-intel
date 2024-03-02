// This config is currently used by sequelize-cli and when run from the db directory,
// needs to pop up a directory for the .env file
require('dotenv').config({ path: '../.env' });

const config = require("../../app/config/config")

// Overrides
config.dialectOptions.prependSearchPath  = true;
config.dialectOptions.ssl = false;

module.exports = config;
