const sequelize = require("./sequelize");
const School = require("./School");
const Extracurricular = require("./Extracurricular");
const SchoolDepartment = require("./SchoolDepartment");
const SchoolAccreditation = require("./SchoolAccreditation");
const SchoolResearchProgram = require("./SchoolResearchProgram");
const SchoolContact = require("./SchoolContact");
const Managers = require("./Managers");
const Applicants = require("./Applicants");
const Recruits = require("./Recruits");
const Recruiters = require("./Recruiters")
const SchoolAddress = require("./SchoolAddress");
const Messages = require("./Messages");
const StudentsDepartmentInterests = require("./StudentsDepartmentsInterests")
const StudentsExtracurriculars = require("./StudentExtracurrilars")
const Users = require("./Users")
const SchoolSocialMedia = require("./SchoolSocialMedia");
const Assets = require("./Assets");
const Students = require("./Students");
const HD2021 = require("./HD2021");
const StudentDepartmentInterest = require("./StudentDepartmentInterest");
const Department = require("./Department");
const ConnectionRequest = require("./ConnectionRequest");

const models = {
  SchoolDepartment,
  School,
  SchoolAccreditation,
  Recruiters,
  Messages,
  SchoolResearchProgram,
  SchoolContact,
  SchoolAddress,
  StudentsExtracurriculars,
  StudentsDepartmentInterests,
  Students,
  Applicants,
  Extracurricular,
  Recruits,
  Users,
  Assets,
  Managers,
  SchoolSocialMedia,
  HD2021,
  StudentDepartmentInterest,
  Department,
  ConnectionRequest
};

// references: {   model: Recruiters, key: "id" }
ConnectionRequest.belongsTo(Recruiters, {
  foreignKey: 'recruiter_id',
  constraints: false
});

// references: {   model: Students,   key: "id"
ConnectionRequest.belongsTo(Students, {
  foreignKey: 'student_id',
  constraints: false
});

// references: {   model: School,     key: "id" }
ConnectionRequest.belongsTo(School, {
  foreignKey: 'school_id',
  constraints: false
});

// Students.hasMany(Recruits, { foreignKey: "student_id", as: "recruits" })
// Students.hasMany(Applicants, { foreignKey: "student_id", as: "applicants" })

Students.belongsTo(Users, {
  foreignKey: 'user_id', // This should match the foreignKey in the hasOne association
});

Students.hasMany(ConnectionRequest, {
  foreignKey: 'student_id',
});

StudentDepartmentInterest.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'department',
});

// Model associations
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };
