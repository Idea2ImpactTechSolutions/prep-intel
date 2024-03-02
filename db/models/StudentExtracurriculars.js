const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StudentExtracurriculars', {
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
    extracurricular_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activity_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    high_school_activity: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    college_activity: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'student_extracurriculars',
    schema: 'public',
    timestamps: false
  });
};
