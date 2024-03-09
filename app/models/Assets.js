import { DataTypes} from "./sequelize";import { sequelize} from "./sequelize";
const Assets = sequelize.define(
    "assets",
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
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Assets;
