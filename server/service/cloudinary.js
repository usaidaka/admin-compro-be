const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (data, resourceType) =>
  new Promise((resolve, reject) => {
    let uploadStream;

    if (data.buffer) {
      uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: resourceType,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(data.buffer);
    } else {
      cloudinary.uploader
        .upload(data, {
          resource_type: resourceType,
          folder: resourceType,
        })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    }
  });

module.exports = {
  uploadToCloudinary,
};
