"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImagePostDiasporaFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImagePostDiasporaFund.belongsTo(models.PostAquaticDirect, {
        foreignKey: { name: "postDiasporaFund_id", allowNull: true },
        onDelete: "CASCADE",
      });
    }
  }
  ImagePostDiasporaFund.init(
    {
      postDiasporaFund_id: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ImagePostDiasporaFund",
      paranoid: true,
    }
  );
  return ImagePostDiasporaFund;
};
