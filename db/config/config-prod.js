// This config is currently used by sequelize-cli and when run from the db directory,
// needs to pop up a directory for the .env file
const cfg = require('dotenv').config({ path: '../../.env' });

const config = require("../../app/config/config.js")

console.log("config:", config);

module.exports = config;
