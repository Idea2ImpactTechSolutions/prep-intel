const sequelize = require("./sequelize");
const School = require("./School");
const SchoolDepartment = require("./SchoolDepartment");
const SchoolAccreditation = require("./SchoolAccreditation");
const SchoolResearchProgram = require("./SchoolResearchProgram");
const SchoolContact = require("./SchoolContact");
const Managers = require("./Managers");
const Recruiters = require("./Recruiters")
const SchoolAddress = require("./SchoolAddress");
const SchoolSocialMedia = require("./SchoolSocialMedia");
const ICDirectory = require("./ICDirectory");

const models = {
  SchoolDepartment,
  School,
  SchoolAccreditation,
  Recruiters,
  SchoolResearchProgram,
  SchoolContact,
  SchoolAddress,
  Managers,
  SchoolSocialMedia,
  ICDirectory
};

// Model associations
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };
