const express = require("express");
const router = express.Router();
const controller = require("../controllers/TrendingProductController.js");
const authMiddleware = require("../middleware/UserAuthMiddleware.js");
const roleMiddleware = require("../middleware/roleMiddleware.js");
const upload = require("../middleware/upload.js");

// --- PUBLIC ---
router.get("/", controller.getTrendingProducts);

// --- ADMIN ---
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("trendingproducts").array("chairimage", 10),
  controller.createTrendingProduct
);

router.put(
  "/:docId/product/:productId",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("trendingproducts").single("chairimage"),
  controller.updateTrendingProduct
);

router.delete(
  "/product/:productId",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteTrendingProductById
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteTrendingProduct
);

router.delete(
  "/category/:category",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.deleteTrendingByCategory   // ✅ corrected
);

module.exports = router;
