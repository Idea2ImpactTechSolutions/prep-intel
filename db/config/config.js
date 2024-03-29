// This config is currently used by sequelize-cli and when run from the db directory, defaults to /db/.env.localdb
const cfg = require('dotenv').config({path: './.env.localdb'});

const config = require("../../app/config/config.js")

module.exports = config;
