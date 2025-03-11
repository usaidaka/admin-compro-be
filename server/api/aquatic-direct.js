const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AquaticDirectHelper = require("../helpers/aquaticDirectHelper")
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptPayload } = require("../service/decryptionHelper");

const fileName = "server/api/aquatic-direct.js";

const listArticle = async (request, reply) => {
  try {
    const query = request.query;
    const response = await AquaticDirectHelper.getArticle(query)
    
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "GET LIST ARTICLE", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/articles", listArticle);
module.exports = Router;
