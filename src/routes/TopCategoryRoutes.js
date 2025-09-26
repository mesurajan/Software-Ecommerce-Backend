const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/UserAuthMiddleware"); // ✅ like slider2
const roleMiddleware = require("../middleware/roleMiddleware");     // ✅ same as slider2
const {
  getTopCategories,
  createTopCategory,
  updateTopCategory,
  deleteTopCategory,
} = require("../controllers/TopCategoryController");

// PUBLIC
router.get("/", getTopCategories);

// ADMIN
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("topcategories").array("images", 4), // ✅ allow 4 images
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
