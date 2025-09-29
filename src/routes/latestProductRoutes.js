const express = require("express");
const router = express.Router();
const controller = require("../controllers/latestProductController.js");
const authMiddleware = require("../middleware/UserAuthMiddleware.js");
const roleMiddleware = require("../middleware/roleMiddleware.js");
const upload = require("../middleware/upload.js");

// --- PUBLIC ---
router.get("/", controller.getLatestProducts);

// --- ADMIN (secure) ---

// ✅ Admin create (append/create)
// allows uploading up to 10 chairimages
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").array("chairimage", 10), // 👈 field name = "chairimage"
  controller.createLatestProduct
);

// ✅ Admin update single product inside a category doc
router.put(
  "/:docId/product/:productId",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").single("chairimage"), // 👈 field name = "chairimage"
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

module.exports = router;
