// routes/latestProductRoutes.js
const express = require("express");
const router = express.Router();
const latestProductController = require("../controllers/latestProductController");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/latestproduct");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});
const upload = multer({ storage });

// Routes
router.get("/", latestProductController.getAllLatestProducts);
router.post("/", upload.array("images", 10), latestProductController.createLatestProduct);
router.delete("/:id", latestProductController.deleteLatestProduct);

module.exports = router;
