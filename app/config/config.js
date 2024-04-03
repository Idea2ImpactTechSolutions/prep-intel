require('dotenv').config();

// Allow for config based overrides of SSL options, specifically for local dev.
let dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false, // Required due to self-signing
  },
}

if (process.env.LOCAL_DB === 'true') {
  dialectOptions.ssl = false;
}

const config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "postgres",
  dialectOptions,
};


module.exports = config;
