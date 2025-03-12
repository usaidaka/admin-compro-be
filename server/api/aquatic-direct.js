const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AquaticDirectHelper = require("../helpers/aquaticDirectHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");

const fileName = "server/api/aquatic-direct.js";

const listPost = async (request, reply) => {
  try {
    const query = request.query;
    const response = await AquaticDirectHelper.getPosts(query);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "GET LIST POST", "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const detailPost = async (request, reply) => {
  try {
    const { post_id } = request.params;

    const response = await AquaticDirectHelper.getDetailPost(post_id);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "GET DETAIL POST API", "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const addPost = async (request, reply) => {
  try {
    const images = request.files || (request.file ? [request.file] : []);

    const dataObject = request.body;

    Validation.createPost(dataObject);

    const response = await AquaticDirectHelper.createPost(dataObject, images);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "ADD POST  API", , "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const updatePost = async (request, reply) => {
  try {
    const { post_id } = request.params;
    const dataObject = request.body;

    Validation.createPost(dataObject);

    const response = await AquaticDirectHelper.updatePost(post_id, dataObject);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "EDIT POST API", "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const addImagePost = async (request, reply) => {
  try {
    const { post_id } = request.params;
    const images = request.files || (request.file ? [request.file] : []);

    const response = await AquaticDirectHelper.addImagePost({
      post_id,
      images,
    });

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "ADD IMAGE POST  API", "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const updateImagePost = async (request, reply) => {
  try {
    const { post_id } = request.params;
    const { imagepost_id } = request.query;
    const images = request.files || (request.file ? [request.file] : []);

    const response = await AquaticDirectHelper.updateImagePost({
      post_id,
      imagepost_id,
      images,
    });
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "EDIT POST API", "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deleteImagePost = async (request, reply) => {
  try {
    const { post_id } = request.params;
    const { imagepost_id } = request.query;

    const response = await AquaticDirectHelper.deleteImagePost({
      post_id,
      imagepost_id,
    });
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "EDIT POST API", "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deletePost = async (request, reply) => {
  try {
    const { post_id } = request.params;

    const response = await AquaticDirectHelper.deletePost({ post_id });
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "EDIT POST API", "AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/posts", listPost);
Router.get("/posts/:post_id", detailPost);
Router.post(
  "/posts",
  Middleware.validateToken,
  Middleware.isAdmin,
  handleUploadImage,
  addPost
);
Router.patch(
  "/posts/:post_id",
  Middleware.validateToken,
  Middleware.isAdmin,
  updatePost
);
Router.patch(
  "/posts/:post_id/add-image",
  Middleware.validateToken,
  Middleware.isAdmin,
  handleUploadImage,
  addImagePost
);
Router.patch(
  "/posts/:post_id/edit-image",
  Middleware.validateToken,
  Middleware.isAdmin,
  handleUploadImage,
  updateImagePost
);
Router.delete(
  "/posts/:post_id/delete-image",
  Middleware.validateToken,
  Middleware.isAdmin,
  deleteImagePost
);
Router.delete(
  "/posts/:post_id",
  Middleware.validateToken,
  Middleware.isAdmin,
  deletePost
);

module.exports = Router;
