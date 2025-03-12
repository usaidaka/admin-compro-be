"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostAquaticDirect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostAquaticDirect.hasMany(models.ImagePostAquaticDirect, {
        foreignKey: { name: "postAquaticDirect_id", allowNull: true },
        onDelete: "CASCADE",
      });

      PostAquaticDirect.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  PostAquaticDirect.init(
    {
      category_id: DataTypes.INTEGER,
      caption: DataTypes.TEXT,
      title: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PostAquaticDirect",
      paranoid: true,
    }
  );
  return PostAquaticDirect;
};
