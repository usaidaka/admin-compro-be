const Boom = require("boom");
const _ = require("lodash");

const db = require("../../models");
const { Op } = require("sequelize");
const GeneralHelper = require("./generalHelper");
const { encryptPayload } = require("../service/encryptionHelper");
const fileName = "server/helpers/userHelper.js";
const cloudinary = require("../service/cloudinary");

const getArticle = async (query) => {
    try {
      const { next, limit } = query;
  
      const currentPage = Number(next) || 0;
      const currentLimit = Number(limit) || 6;
  
      const formattedExclude = {
        exclude: ["deletedAt", "updatedAt"],
      };
  
      const formattedInclude = [
        {
          model: db.ImagePostAquaticDirect,
          attributes: ["image"],
        }
        ];
  
      const order =  [["createdAt", "DESC"]];
  
      const allPost = await db.PostAquaticDirect.findAll({
        attributes: formattedExclude,
        include: formattedInclude,
        limit: currentLimit,
        offset: currentPage,
        order,
      });

      return Promise.resolve({
        ok: true,
        message: "Get post successful",
        result: { articles: allPost },
      });
    } catch (err) {
      console.log([fileName, "GET ARTICLE AQUATIC DIRECT", "ERROR"], {
        info: `${err}`,
      });
      return Promise.reject(GeneralHelper.errorResponse(err));
    }
  };
  


  module.exports = {
    getArticle
  }