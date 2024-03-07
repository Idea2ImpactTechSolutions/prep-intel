const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const SchoolDepartment = require("./SchoolDepartment");
const SchoolAccreditation = require("./SchoolAccreditation");
const SchoolResearchProgram = require("./SchoolResearchProgram");
const SchoolSocialMedia = require("./SchoolSocialMedia");
const Assets = require("./Assets");
const SchoolContact = require("./SchoolContact");
const SchoolAddress = require("./SchoolAddress");

const School = sequelize.define(
  "school",
  {
    // Define model attributes
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    found_date: {
      type: DataTypes.DATE,
    },
    institution_type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    intro_paragraph: {
      type: DataTypes.STRING,
    },
    primary_color: {
      type: DataTypes.INTEGER,
    },
    tagline: {
      type: DataTypes.STRING,
    },
    act_required: {
      type: DataTypes.BOOLEAN,
    },
    min_act_score: {
      type: DataTypes.INTEGER,
    },
    sat_required: {
      type: DataTypes.BOOLEAN,
    },
    min_sat_score: {
      type: DataTypes.INTEGER,
    },
    diploma_required: {
      type: DataTypes.BOOLEAN,
    },
    gpa_requirement: {
      type: DataTypes.INTEGER,
    },
    in_state_tuition: {
      type: DataTypes.DOUBLE,
    },
    out_state_tuition: {
      type: DataTypes.DOUBLE,
    },
    fees_per_semester: {
      type: DataTypes.DOUBLE,
    },
    scholarship_url: {
      type: DataTypes.STRING,
    },
    financial_aid_url: {
      type: DataTypes.STRING,
    },
    application_url: {
      type: DataTypes.STRING,
    },
    interested_inquiry_url: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
    },
    publish_date: {
      type: DataTypes.DATE,
    },
    deactivation_date: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
  }
);

School.hasMany(Assets, { foreignKey: "school_id", as: "assets" })
// School.hasMany(SchoolDepartment, { foreignKey: "schoolId", as: "departments" });
School.hasMany(SchoolDepartment, {
  foreignKey: "school_id",
  as: "school_departments",
});
School.hasMany(SchoolAccreditation, {
  foreignKey: "school_id",
  as: "school_accreditations",
});
School.hasMany(SchoolResearchProgram, {
  foreignKey: "school_id",
  as: "school_research_programs",
});

School.hasOne(SchoolAddress, {
  foreignKey: "school_id",
  as: "school_address",
});
School.hasMany(SchoolContact, {
  foreignKey: "school_id",
  as: "school_contacts",
});
School.hasMany(SchoolSocialMedia, {
  foreignKey: "school_id",
  as: "school_social_medias",
});

module.exports = School;
