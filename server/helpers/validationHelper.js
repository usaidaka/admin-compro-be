const Joi = require("joi");
const Boom = require("boom");

const createPost = (data) => {
  const schema = Joi.object({
    category_id: Joi.string().allow("").optional().description("1"),
    caption: Joi.string().allow("").optional().description("My post"),
    title: Joi.string().required().description("Title article"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().description("Active email"),
    password: Joi.string()
      .min(6)
      .required()
      .description("Should be between 8-20 characters"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  createPost,
  loginValidation,
};
