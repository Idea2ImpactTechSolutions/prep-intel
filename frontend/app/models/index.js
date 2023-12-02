const sequelize = require("./sequelize");
const School = require("./School");

const models = {
  School,
};

// Model associations
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

console.log("models", models);

module.exports = { sequelize, models };
