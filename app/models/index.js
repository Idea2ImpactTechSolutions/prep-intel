const sequelize = require("./sequelize");
const School = require("./School");
const SchoolDepartment = require("./SchoolDepartment");
const SchoolAccreditation = require("./SchoolAccreditation");
const SchoolResearchProgram = require("./SchoolResearchProgram");
const SchoolContact = require("./SchoolContact");
const Managers = require("./Managers");
const Applicants = require("./Applicants");
const Recruits = require("./Recruits");
const Recruiters = require("./Recruiters")
const SchoolAddress = require("./SchoolAddress");
const Users = require("./Users")
const SchoolSocialMedia = require("./SchoolSocialMedia");
const Assets = require("./Assets");
const Students = require("./Students");
const HD2021 = require("./HD2021");

const models = {
  SchoolDepartment,
  School,
  SchoolAccreditation,
  Recruiters,
  SchoolResearchProgram,
  SchoolContact,
  SchoolAddress,
  Students,
  Applicants,
  Recruits,
  Users,
  Assets,
  Managers,
  SchoolSocialMedia,
  HD2021,
};

// Model associations
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };
