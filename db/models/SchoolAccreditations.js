const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolAccreditations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'schools',
        key: 'id'
      }
    },
    accreditation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'accreditations',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "The name of the school_accreditation"
    }
  }, {
    sequelize,
    tableName: 'school_accreditations',
    schema: 'public',
    timestamps: false
  });
};
