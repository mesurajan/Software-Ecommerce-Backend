// routes/LatestProductRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/latestProductController");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// ✅ Admin create (append/create)
// allows manual override images
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").array("images", 10),
  controller.createLatestProduct
);

// ✅ Admin update single product inside a category doc
router.put(
  "/:docId/product/:productId",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").single("image"),
  controller.updateLatestProduct
);

// ✅ Admin delete single product inside category doc
router.delete(
  "/product/:productId",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteProductById
);

// ✅ Admin delete whole doc by id
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteLatestProduct
);

// ✅ Admin delete all docs for a category
router.delete(
  "/category/:category",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteByCategory
);

// ✅ Public: get all latest products
router.get("/", controller.getLatestProducts);

module.exports = router;
