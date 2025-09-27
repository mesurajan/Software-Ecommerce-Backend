const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ---------------- Public Routes ----------------
router.get("/", productController.getProducts);

// ✅ Two routes (no `?`) to avoid path-to-regexp crash
router.get("/:id", productController.getProductDetails);
router.get("/:id/:slug", productController.getProductDetails);
router.get("/by-category/:categoryId", productController.getProductsByCategory);

// ---------------- Protected Routes (Admin + Seller) ----------------
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "seller"]),
  upload("product").single("image"), // ✅ single file
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "seller"]),
  upload("product").single("image"), // ✅ single file
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "seller"]),
  productController.deleteProduct
);

module.exports = router;
