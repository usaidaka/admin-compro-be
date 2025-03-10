'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostKratomBusiness extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostKratomBusiness.init({
    category_id: DataTypes.INTEGER,
    caption: DataTypes.TEXT,
    title: DataTypes.TEXT,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PostKratomBusiness',
  });
  return PostKratomBusiness;
};