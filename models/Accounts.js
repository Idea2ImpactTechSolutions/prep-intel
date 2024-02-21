const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Accounts', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'provider_type',
        key: 'value'
      }
    },
    provider: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    providerAccountId: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    token_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    session_state: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'accounts',
    schema: 'public',
    timestamps: false
  });
};
