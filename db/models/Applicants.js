const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Applicants', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'schools',
        key: 'id'
      }
    },
    recruiter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'recruiters',
        key: 'id'
      }
    },
    applicant_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    eligible_for_enrollment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'applicants',
    schema: 'public',
    timestamps: false
  });
};
