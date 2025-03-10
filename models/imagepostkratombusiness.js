"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImagePostKratomBusiness extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImagePostKratomBusiness.belongsTo(models.PostKratomBusiness, {
        foreignKey: { name: "postKratomBusiness_id", allowNull: true },
        onDelete: "CASCADE",
      });
    }
  }
  ImagePostKratomBusiness.init(
    {
      postKratomBusiness_id: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ImagePostKratomBusiness",
      paranoid: true,
    }
  );
  return ImagePostKratomBusiness;
};
