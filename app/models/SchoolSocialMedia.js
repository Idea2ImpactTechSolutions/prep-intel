import { DataTypes} from "./sequelize";import { sequelize} from "./sequelize";
const SchoolSocialMedia = sequelize.define(
  "school_social_medias",
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    social_media: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SchoolSocialMedia;
