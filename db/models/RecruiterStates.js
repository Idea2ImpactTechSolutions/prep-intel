const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RecruiterStates', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    recruiter_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'recruiters',
        key: 'id'
      }
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'schools',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'recruiter_states',
    schema: 'public',
    timestamps: false
  });
};
