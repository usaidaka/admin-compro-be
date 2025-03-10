"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImagePostAquaticDirect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImagePostAquaticDirect.belongsTo(models.PostAquaticDirect, {
        foreignKey: { name: "postAquaticDirect_id", allowNull: true },
        onDelete: "CASCADE",
      });
    }
  }
  ImagePostAquaticDirect.init(
    {
      postAquaticDirect_id: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ImagePostAquaticDirect",
      paranoid: true,
    }
  );
  return ImagePostAquaticDirect;
};
