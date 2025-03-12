const Boom = require("boom");
const _ = require("lodash");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const fileName = "server/helpers/aquaticDirectHelper.js";
const cloudinary = require("../service/cloudinary");

const getPosts = async (query) => {
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
      },
      {
        model: db.Category,
        attributes: ["category"],
        as: "category",
      },
    ];

    const order = [["createdAt", "DESC"]];

    const allPost = await db.PostAquaticDirect.findAll({
      attributes: formattedExclude,
      include: formattedInclude,
      limit: currentLimit,
      offset: currentPage,
      order,
    });

    if (_.isEmpty(allPost)) {
      return Promise.resolve({
        ok: true,
        message: "Posts list not found",
        result: {},
      });
    }

    const transformedPosts = allPost.map((post) => ({
      ...post.toJSON(),
      category: post.category?.category || null,
    }));

    return Promise.resolve({
      ok: true,
      message: "Get post successful",
      result: transformedPosts,
    });
  } catch (err) {
    console.log([fileName, "GET POST AQUATIC DIRECT HELPER", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getDetailPost = async (post_id) => {
  try {
    const formattedExclude = {
      exclude: ["deletedAt", "updatedAt"],
    };

    const formattedInclude = [
      {
        model: db.ImagePostAquaticDirect,
        attributes: ["image"],
      },
      {
        model: db.Category,
        attributes: ["category"],
        as: "category",
      },
    ];

    const post = await db.PostAquaticDirect.findOne({
      where: { id: post_id },
      attributes: formattedExclude,
      include: formattedInclude,
    });

    if (!post) {
      return Promise.resolve({
        ok: true,
        message: "Detail post not found",
        result: {},
      });
    }

    const transformedPost = {
      ...post.toJSON(),
      category: post.category?.category || null,
    };

    return Promise.resolve({
      ok: true,
      message: "Get detail post successful",
      result: transformedPost,
    });
  } catch (err) {
    console.log([fileName, "GET POST DETAIL AQUATIC DIRECT HELPER", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createPost = async (dataObject, images) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { category_id, caption, title } = dataObject;

    if (!images || images.length === 0) {
      return Promise.reject(Boom.badRequest("Images cannot be empty"));
    }

    let imageResults = [];
    if (_.isArray(images)) {
      const uploadPromises = images.map((img) =>
        cloudinary.uploadToCloudinary(img, "image")
      );
      imageResults = await Promise.all(uploadPromises);

      if (imageResults.some((result) => !result)) {
        throw Boom.internal("Cloudinary image upload failed");
      }
    } else {
      const singleImageResult = await cloudinary.uploadToCloudinary(
        images,
        "image"
      );
      if (!singleImageResult)
        throw Boom.internal("Cloudinary image upload failed");
      imageResults.push(singleImageResult);
    }

    const post = await db.PostAquaticDirect.create(
      {
        category_id: isNaN(Number(category_id)) ? null : Number(category_id),
        title,
        caption,
      },
      { transaction }
    );

    await db.ImagePostAquaticDirect.bulkCreate(
      imageResults.map((img) => ({
        postAquaticDirect_id: post.id,
        image: img.url,
      })),
      { transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Create post successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log(["CREATE POST AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const addImagePost = async (dataObject) => {
  const transaction = await db.sequelize.transaction();
  const { post_id, images } = dataObject;
  try {
    if (!images || images.length === 0) {
      return Promise.reject(Boom.badRequest("Images cannot be empty"));
    }

    let imageResults = [];
    if (_.isArray(images)) {
      const uploadPromises = images.map((img) =>
        cloudinary.uploadToCloudinary(img, "image")
      );
      imageResults = await Promise.all(uploadPromises);

      if (imageResults.some((result) => !result)) {
        throw Boom.internal("Cloudinary image upload failed");
      }
    } else {
      const singleImageResult = await cloudinary.uploadToCloudinary(
        images,
        "image"
      );
      if (!singleImageResult)
        throw Boom.internal("Cloudinary image upload failed");
      imageResults.push(singleImageResult);
    }

    await db.ImagePostAquaticDirect.bulkCreate(
      imageResults.map((img) => ({
        postAquaticDirect_id: post_id,
        image: img.url,
      })),
      { transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Create post successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log(["CREATE POST AQUATIC DIRECT", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const updatePost = async (post_id, dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { category_id, caption, title } = dataObject;

    const isPostExist = await db.PostAquaticDirect.findOne({
      where: { id: post_id },
    });

    if (_.isEmpty(isPostExist)) {
      return Promise.reject(Boom.notFound("Post not found"));
    }

    await db.Post.update(
      {
        category_id: category_id ? category_id : isPostExist.category_id,
        caption: caption ? caption : isPostExist.caption,
        title: title ? title : isPostExist.title,
      },
      { where: { id: post_id }, transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Update post successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "update post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const updateImagePost = async (dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { post_id, imagepost_id, images } = dataObject;

    if (!images) {
      return Promise.reject(Boom.badRequest("Image cannot be empty"));
    }

    const existingImage = await db.ImagePostAquaticDirect.findOne({
      where: { id: imagepost_id, postAquaticDirect_id: post_id },
      include: [
        {
          model: db.PostAquaticDirect,
          as: "PostAquaticDirect",
        },
      ],
      transaction,
    });
    console.log(existingImage, "<existingImage");
    if (!existingImage) {
      return Promise.reject(Boom.notFound("ImagePost not found"));
    }

    // Upload gambar baru ke Cloudinary
    const uploadedImage = await cloudinary.uploadToCloudinary(
      images[0],
      "image"
    );

    if (!uploadedImage) {
      throw Boom.internal("Cloudinary image upload failed");
    }

    await db.ImagePostAquaticDirect.update(
      { image: uploadedImage.url },
      { where: { id: imagepost_id }, transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: `[${existingImage.PostAquaticDirect?.title}] Image updated successfully`,
      newImage: uploadedImage.url,
    });
  } catch (err) {
    await transaction.rollback();
    console.log(["UPDATE IMAGE POST", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteImagePost = async (dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { post_id, imagepost_id } = dataObject;

    const existingImage = await db.ImagePostAquaticDirect.findOne({
      where: { id: imagepost_id, postAquaticDirect_id: post_id },
      transaction,
    });

    if (_.isEmpty(existingImage)) {
      return Promise.reject(Boom.notFound("Image Post Not Found"));
    }

    await db.ImagePostAquaticDirect.destroy({
      where: { id: imagepost_id },
      transaction,
      force: false,
    });

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: `Image deleted successfully`,
    });
  } catch (err) {
    await transaction.rollback();
    console.log(["UPDATE IMAGE POST", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deletePost = async (dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { post_id } = dataObject;

    const existingPost = await db.PostAquaticDirect.findOne({
      where: { id: post_id },
      transaction,
    });

    if (_.isEmpty(existingPost)) {
      return Promise.reject(Boom.notFound("Post Not Found"));
    }

    await db.PostAquaticDirect.destroy({
      where: { id: post_id },
      transaction,
      force: false,
    });

    await db.ImagePostAquaticDirect.destroy({
      where: { postAquaticDirect_id: post_id },
      transaction,
      force: false,
    });

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: `Post deleted successfully`,
    });
  } catch (err) {
    await transaction.rollback();
    console.log(["UPDATE IMAGE POST", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getPosts,
  getDetailPost,
  createPost,
  updatePost,
  updateImagePost,
  addImagePost,
  deleteImagePost,
  deletePost,
};
