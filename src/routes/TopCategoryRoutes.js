const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getTopCategories,
  createTopCategory,
  updateTopCategory,
  deleteTopCategory,
} = require("../controllers/TopCategoryController");

// --- PUBLIC ---
router.get("/", getTopCategories);

// --- ADMIN (secure) ---
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("topcategories").array("images", 4), // up to 4 images per category
  createTopCategory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("topcategories").array("images", 4),
  updateTopCategory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteTopCategory
);

module.exports = router;
