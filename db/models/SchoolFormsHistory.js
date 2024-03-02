const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolFormsHistory', {
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    version_data: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    publish_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_modified_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    last_modified_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'school_forms_history',
    schema: 'public',
    timestamps: false
  });
};
