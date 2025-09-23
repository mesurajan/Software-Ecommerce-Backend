// src/middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Factory function: pass folder name when using
const upload = (folder) => {
  // uploads folder at project root
  const uploadPath = path.join(__dirname, "..", "..", "uploads", folder);

  // Ensure folder exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  };

  return multer({ storage, fileFilter });
};

module.exports = upload;
