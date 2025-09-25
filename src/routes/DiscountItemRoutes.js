const express = require("express");
const router = express.Router();
const controller = require("../controllers/DiscountItemController.js");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// Admin create
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("discountitems").single("image"),
  controller.createDiscountItem
);

// Admin update
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("discountitems").single("image"),
  controller.updateDiscountItem
);

// Admin delete
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteDiscountItem
);

// Public
router.get("/", controller.getDiscountItems);

module.exports = router;
