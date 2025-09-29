const express = require("express");
const router = express.Router();
const controller = require("../controllers/latestProductController.js");
const authMiddleware = require("../middleware/UserAuthMiddleware.js");
const roleMiddleware = require("../middleware/roleMiddleware.js");
const upload = require("../middleware/upload.js");

// --- PUBLIC ---
// Get all latest products (grouped by category)
router.get("/", controller.getLatestProducts);

// --- ADMIN (secure) ---

// ✅ Create or append products to a category
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").array("chairimage", 10),
  controller.createLatestProduct
);

// ✅ Update a single product inside a category doc
router.put(
  "/:docId/product/:productId",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").single("chairimage"),
  controller.updateLatestProduct
);

// ✅ Delete a single product by productId (across category docs)
router.delete(
  "/product/:productId",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteProductById
);

// ✅ Delete whole category document by MongoDB _id
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteLatestProduct
);

// ✅ Delete all docs for a given category name
router.delete(
  "/category/:category",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteByCategory
);

module.exports = router;
