var DataTypes = require("sequelize").DataTypes;
var _Accounts = require("./Accounts");
var _Accreditations = require("./Accreditations");
var _Amenities = require("./Amenities");
var _Applicants = require("./Applicants");
var _Departments = require("./Departments");
var _Extracurriculars = require("./Extracurriculars");
var _Managers = require("./Managers");
var _Messages = require("./Messages");
var _Notes = require("./Notes");
var _OptOutLogs = require("./OptOutLogs");
var _Phones = require("./Phones");
var _ProviderType = require("./ProviderType");
var _RecruiterStates = require("./RecruiterStates");
var _Recruiters = require("./Recruiters");
var _SchoolAccreditations = require("./SchoolAccreditations");
var _SchoolAddresses = require("./SchoolAddresses");
var _SchoolAmenities = require("./SchoolAmenities");
var _SchoolContacts = require("./SchoolContacts");
var _SchoolDepartments = require("./SchoolDepartments");
var _SchoolExtracurriculars = require("./SchoolExtracurriculars");
var _SchoolFormHistory = require("./SchoolFormHistory");
var _SchoolFormsHistory = require("./SchoolFormsHistory");
var _SchoolImages = require("./SchoolImages");
var _SchoolResearchPrograms = require("./SchoolResearchPrograms");
var _SchoolSocialMedias = require("./SchoolSocialMedias");
var _Schools = require("./Schools");
var _Sessions = require("./Sessions");
var _StudentConnections = require("./StudentConnections");
var _StudentDepartmentInterests = require("./StudentDepartmentInterests");
var _StudentExtracurriculars = require("./StudentExtracurriculars");
var _Students = require("./Students");
var _Users = require("./Users");
var _VerificationTokens = require("./VerificationTokens");

function initModels(sequelize) {
  var Accounts = _Accounts(sequelize, DataTypes);
  var Accreditations = _Accreditations(sequelize, DataTypes);
  var Amenities = _Amenities(sequelize, DataTypes);
  var Applicants = _Applicants(sequelize, DataTypes);
  var Departments = _Departments(sequelize, DataTypes);
  var Extracurriculars = _Extracurriculars(sequelize, DataTypes);
  var Managers = _Managers(sequelize, DataTypes);
  var Messages = _Messages(sequelize, DataTypes);
  var Notes = _Notes(sequelize, DataTypes);
  var OptOutLogs = _OptOutLogs(sequelize, DataTypes);
  var Phones = _Phones(sequelize, DataTypes);
  var ProviderType = _ProviderType(sequelize, DataTypes);
  var RecruiterStates = _RecruiterStates(sequelize, DataTypes);
  var Recruiters = _Recruiters(sequelize, DataTypes);
  var SchoolAccreditations = _SchoolAccreditations(sequelize, DataTypes);
  var SchoolAddresses = _SchoolAddresses(sequelize, DataTypes);
  var SchoolAmenities = _SchoolAmenities(sequelize, DataTypes);
  var SchoolContacts = _SchoolContacts(sequelize, DataTypes);
  var SchoolDepartments = _SchoolDepartments(sequelize, DataTypes);
  var SchoolExtracurriculars = _SchoolExtracurriculars(sequelize, DataTypes);
  var SchoolFormHistory = _SchoolFormHistory(sequelize, DataTypes);
  var SchoolFormsHistory = _SchoolFormsHistory(sequelize, DataTypes);
  var SchoolImages = _SchoolImages(sequelize, DataTypes);
  var SchoolResearchPrograms = _SchoolResearchPrograms(sequelize, DataTypes);
  var SchoolSocialMedias = _SchoolSocialMedias(sequelize, DataTypes);
  var Schools = _Schools(sequelize, DataTypes);
  var Sessions = _Sessions(sequelize, DataTypes);
  var StudentConnections = _StudentConnections(sequelize, DataTypes);
  var StudentDepartmentInterests = _StudentDepartmentInterests(sequelize, DataTypes);
  var StudentExtracurriculars = _StudentExtracurriculars(sequelize, DataTypes);
  var Students = _Students(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var VerificationTokens = _VerificationTokens(sequelize, DataTypes);

  SchoolAccreditations.belongsTo(Accreditations, { as: "accreditation", foreignKey: "accreditation_id"});
  Accreditations.hasMany(SchoolAccreditations, { as: "school_accreditations", foreignKey: "accreditation_id"});
  SchoolAmenities.belongsTo(Amenities, { as: "amenity", foreignKey: "amenity_id"});
  Amenities.hasMany(SchoolAmenities, { as: "school_amenities", foreignKey: "amenity_id"});
  SchoolExtracurriculars.belongsTo(Extracurriculars, { as: "extracurricular_activity", foreignKey: "extracurricular_activity_id"});
  Extracurriculars.hasMany(SchoolExtracurriculars, { as: "school_extracurriculars", foreignKey: "extracurricular_activity_id"});
  Accounts.belongsTo(ProviderType, { as: "type_provider_type", foreignKey: "type"});
  ProviderType.hasMany(Accounts, { as: "accounts", foreignKey: "type"});
  Applicants.belongsTo(Recruiters, { as: "recruiter", foreignKey: "recruiter_id"});
  Recruiters.hasMany(Applicants, { as: "applicants", foreignKey: "recruiter_id"});
  Notes.belongsTo(Recruiters, { as: "recruiter", foreignKey: "recruiter_id"});
  Recruiters.hasMany(Notes, { as: "notes", foreignKey: "recruiter_id"});
  OptOutLogs.belongsTo(Recruiters, { as: "recruiter", foreignKey: "recruiter_id"});
  Recruiters.hasMany(OptOutLogs, { as: "opt_out_logs", foreignKey: "recruiter_id"});
  RecruiterStates.belongsTo(Recruiters, { as: "recruiter", foreignKey: "recruiter_id"});
  Recruiters.hasMany(RecruiterStates, { as: "recruiter_states", foreignKey: "recruiter_id"});
  StudentDepartmentInterests.belongsTo(SchoolDepartments, { as: "department", foreignKey: "department_id"});
  SchoolDepartments.hasMany(StudentDepartmentInterests, { as: "student_department_interests", foreignKey: "department_id"});
  Applicants.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(Applicants, { as: "applicants", foreignKey: "school_id"});
  OptOutLogs.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(OptOutLogs, { as: "opt_out_logs", foreignKey: "school_id"});
  Phones.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(Phones, { as: "phones", foreignKey: "school_id"});
  RecruiterStates.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(RecruiterStates, { as: "recruiter_states", foreignKey: "school_id"});
  Recruiters.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(Recruiters, { as: "recruiters", foreignKey: "school_id"});
  SchoolAccreditations.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolAccreditations, { as: "school_accreditations", foreignKey: "school_id"});
  SchoolAddresses.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolAddresses, { as: "school_addresses", foreignKey: "school_id"});
  SchoolAmenities.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolAmenities, { as: "school_amenities", foreignKey: "school_id"});
  SchoolContacts.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolContacts, { as: "school_contacts", foreignKey: "school_id"});
  SchoolDepartments.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolDepartments, { as: "school_departments", foreignKey: "school_id"});
  SchoolExtracurriculars.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolExtracurriculars, { as: "school_extracurriculars", foreignKey: "school_id"});
  SchoolImages.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolImages, { as: "school_images", foreignKey: "school_id"});
  SchoolResearchPrograms.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolResearchPrograms, { as: "school_research_programs", foreignKey: "school_id"});
  SchoolSocialMedias.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(SchoolSocialMedias, { as: "school_social_media", foreignKey: "school_id"});
  StudentConnections.belongsTo(Schools, { as: "school", foreignKey: "school_id"});
  Schools.hasMany(StudentConnections, { as: "student_connections", foreignKey: "school_id"});
  Applicants.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(Applicants, { as: "applicants", foreignKey: "student_id"});
  Notes.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(Notes, { as: "notes", foreignKey: "student_id"});
  OptOutLogs.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(OptOutLogs, { as: "opt_out_logs", foreignKey: "student_id"});
  StudentConnections.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(StudentConnections, { as: "student_connections", foreignKey: "student_id"});
  StudentDepartmentInterests.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(StudentDepartmentInterests, { as: "student_department_interests", foreignKey: "student_id"});
  StudentExtracurriculars.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(StudentExtracurriculars, { as: "student_extracurriculars", foreignKey: "student_id"});
  Accounts.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Accounts, { as: "accounts", foreignKey: "userId"});
  Sessions.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Sessions, { as: "sessions", foreignKey: "userId"});

  return {
    Accounts,
    Accreditations,
    Amenities,
    Applicants,
    Departments,
    Extracurriculars,
    Managers,
    Messages,
    Notes,
    OptOutLogs,
    Phones,
    ProviderType,
    RecruiterStates,
    Recruiters,
    SchoolAccreditations,
    SchoolAddresses,
    SchoolAmenities,
    SchoolContacts,
    SchoolDepartments,
    SchoolExtracurriculars,
    SchoolFormHistory,
    SchoolFormsHistory,
    SchoolImages,
    SchoolResearchPrograms,
    SchoolSocialMedias,
    Schools,
    Sessions,
    StudentConnections,
    StudentDepartmentInterests,
    StudentExtracurriculars,
    Students,
    Users,
    VerificationTokens,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
