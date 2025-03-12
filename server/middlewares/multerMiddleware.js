const multer = require("multer");

// Menyimpan file di memori
const storage = multer.memoryStorage();

// Filter hanya menerima gambar dengan format tertentu
const imageFilter = (req, file, cb) => {
  console.log("File received:", file.originalname);
  console.log("Detected mimetype:", file.mimetype);

  const allowedTypes = [
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/x-png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError = "Invalid file format";
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file format"));
  }
};

// Konfigurasi multer
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Maksimum 10MB per file
  fileFilter: imageFilter,
});

// Middleware untuk menangani single & multiple upload
const handleUploadImage = (req, res, next) => {
  const isMultipleUpload =
    req.path === "/posts" ||
    req.path === `/posts/${req.params?.post_id}/add-image`;
  const isSingleUpload =
    req.path === `/posts/${req.params?.post_id}/edit-image` && req.query; // Jika path adalah "/posts", maka multiple upload

  console.log(isMultipleUpload, "<isMultipleUpload");
  console.log(isSingleUpload, "<isSingleUpload");

  let uploader;
  if (isMultipleUpload) {
    uploader = upload.array("images", 10);
    uploader(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              error: "File size exceeded the limit (max 10MB per file)",
            });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
              error:
                "Invalid file format. Only JPEG, PNG, JPG, and WEBP are allowed.",
            });
          }
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  } else if (isSingleUpload) {
    upload.single("images")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).send({ error: "File size exceeded the limit" });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            res.status(400).send({ error: "Invalid file format" });
          }
        } else {
          res.status(400).send({ error: err.message });
        }
      } else {
        next();
      }
    });
  }
  // const uploader = isMultipleUpload
  //   ? upload.array("images", 5) // Maksimum 5 gambar
  //   : upload.single("images"); // Single upload

  // uploader(req, res, (err) => {
  //   if (err) {
  //     if (err instanceof multer.MulterError) {
  //       if (err.code === "LIMIT_FILE_SIZE") {
  //         return res.status(400).json({
  //           error: "File size exceeded the limit (max 10MB per file)",
  //         });
  //       } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
  //         return res.status(400).json({
  //           error:
  //             "Invalid file format. Only JPEG, PNG, JPG, and WEBP are allowed.",
  //         });
  //       }
  //     }
  //     return res.status(400).json({ error: err.message });
  //   }

  //   next();
  // });
};

module.exports = handleUploadImage;
