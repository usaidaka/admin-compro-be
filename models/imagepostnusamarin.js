"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImagePostNusamarin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImagePostNusamarin.belongsTo(models.PostNusamarin, {
        foreignKey: { name: "postNusamarin_id", allowNull: true },
        onDelete: "CASCADE",
      });
    }
  }
  ImagePostNusamarin.init(
    {
      postNusamarin_id: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ImagePostNusamarin",
      paranoid: true,
    }
  );
  return ImagePostNusamarin;
};
