// routes/LatestProductRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/latestProductController");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// Admin create (append to existing category or create new)
// images uploaded to uploads/latestproducts
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").array("images", 10),
  controller.createLatestProduct
);

// Admin delete single doc by id
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteLatestProduct
);

// Admin delete category (delete all docs for that category)
router.delete(
  "/category/:category",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteByCategory
);

// Public: get all
router.get("/", controller.getLatestProducts);

module.exports = router;
