const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://ruojcnyk:cToljUcXjm_tPWgDq3XyjMhFfhJJQdAQ@kashin.db.elephantsql.com/ruojcnyk", {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    }
  }
}
);

module.exports = sequelize;
