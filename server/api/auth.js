const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthHelper = require("../helpers/authHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptPayload } = require("../service/decryptionHelper");

const fileName = "server/api/auth.js";

const login = async (request, reply) => {
  try {
    const decryptedData = decryptPayload(request.body);

    Validation.loginValidation(decryptedData);

    const { email, password } = decryptedData;
    const response = await AuthHelper.login({ email, password });

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "login", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.post("/login", login);

module.exports = Router;
