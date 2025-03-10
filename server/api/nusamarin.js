const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptPayload } = require("../service/decryptionHelper");

const fileName = "server/api/aquatic-direct.js";

const getTest = async (request, reply) => {
  try {
    return reply.send("test");
  } catch (err) {
    console.log([fileName, "add Route", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/getTest", getTest);
module.exports = Router;
