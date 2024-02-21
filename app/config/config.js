require("dotenv").config();

// config/config.js

module.exports = {
  username: process.env.DB_USERNAME || "dev_username",
  password: process.env.DB_PASSWORD || "dev_password",
  database: process.env.DB_NAME || "my_database_dev",
  host: process.env.DB_HOST || "localhost",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Note: Setting this to false can be insecure
    },
  },
  // other configurations...
};
