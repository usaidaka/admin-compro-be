const Boom = require("boom");
const _ = require("lodash");

const db = require("../../models");
const { Op } = require("sequelize");
const GeneralHelper = require("./generalHelper");
const { encryptPayload } = require("../service/encryptionHelper");
const fileName = "server/helpers/authHelper.js";
const cloudinary = require("../service/cloudinary");

const bcrypt = require("bcryptjs");
const crypto = require("crypto-js");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const Mailer = require("../service/mailer");
const { getKey, setKey } = require("../service/redis");

const jwtSecretTokenCredential =
  process.env.JWT_SECRET_TOKEN_CREDENTIAL || "super_strong_key";
const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "super_strong_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
const jwtExpiresCredentialIn = process.env.JWT_EXPIRES_CREDENTIAL_IN || "24h";
const role = process.env.ROLE_ACCESS || "xxx";
const salt = bcrypt.genSaltSync(10);

// eslint-disable-next-line arrow-body-style
const __hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

// eslint-disable-next-line arrow-body-style
const __comparePassword = (payloadPass, dbPass) => {
  return bcrypt.compareSync(payloadPass, dbPass);
};

// eslint-disable-next-line arrow-body-style
const __generateToken = (data) => {
  return jwt.sign(data, jwtSecretToken, { expiresIn: jwtExpiresIn });
};

const __generateTokenCredential = (data) => {
  return jwt.sign(data, jwtSecretTokenCredential, {
    expiresIn: jwtExpiresCredentialIn,
  });
};

const login = async (dataObject) => {
  const { email, password } = dataObject;

  try {
    const admin = await db.Admin.findOne({
      where: { email },
      attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
    });

    if (_.isEmpty(admin)) {
      return Promise.reject(Boom.notFound("Admin not found"));
    }

    const isPassMatched = __comparePassword(password, admin.password);
    if (!isPassMatched) {
      return Promise.reject(Boom.badRequest("Wrong Password"));
    }

    const token = __generateToken({
      id: admin.id,
      email: admin.email,
      role: role,
    });

    const result = {
      email: admin.email,
    };

    return Promise.resolve({
      ok: true,
      message: "Log in successful",
      token,
      result,
    });
  } catch (err) {
    console.log([fileName, "login", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  login,
};
