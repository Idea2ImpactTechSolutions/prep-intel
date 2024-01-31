const sequelize = require("./sequelize");
const School = require("./School");
const SchoolDepartment = require("./SchoolDepartment");
const SchoolAccreditation = require("./SchoolAccreditation");
const SchoolResearchProgram = require("./SchoolResearchProgram");
const SchoolContact = require("./SchoolContact");
const SchoolAddress = require("./SchoolAddress");
const SchoolSocialMedia = require("./SchoolSocialMedia");
const HD2021 = require("./HD2021");

const models = {
  SchoolDepartment,
  School,
  SchoolAccreditation,
  SchoolResearchProgram,
  SchoolContact,
  SchoolAddress,
  SchoolSocialMedia,
  HD2021
};

// Model associations
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };
