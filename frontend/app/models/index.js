const sequelize = require("./sequelize");
const School = require("./School");
const SchoolDepartment = require("./SchoolDepartment");
const SchoolAccreditation = require("./SchoolAccreditation");
const SchoolResearchProgram = require("./SchoolResearchProgram");

const models = {
  School,
  SchoolDepartment,
  SchoolAccreditation,
  SchoolResearchProgram,
};

// Model associations
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };
