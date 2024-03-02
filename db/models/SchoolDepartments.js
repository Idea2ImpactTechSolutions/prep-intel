const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolDepartments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    major_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'schools',
        key: 'id'
      }
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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Name of department"
    }
  }, {
    sequelize,
    tableName: 'school_departments',
    schema: 'public',
    timestamps: false
  });
};
