const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

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
    name: {
      type: DataTypes.STRING,
    },
    intro_paragraph: {
      type: DataTypes.BOOLEAN,
    },
    primary_color: {
      type: DataTypes.INTEGER,
    },
    tagline: {
      type: DataTypes.BOOLEAN,
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

module.exports = School;
