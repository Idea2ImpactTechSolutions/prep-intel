const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Schools', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    found_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    institution_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    intro_paragraph: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    primary_color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tagline: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    act_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    min_act_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sat_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    min_sat_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    diploma_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    gpa_requirement: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    in_state_tuition: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    out_state_tuition: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fees_per_semester: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    scholarship_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    financial_aid_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    application_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    interested_inquiry_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    publish_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deactivation_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'schools',
    schema: 'public',
    timestamps: false
  });
};
