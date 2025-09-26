const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ---------------- Public Routes ----------------
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// ---------------- Protected Routes (Admin + Seller) ----------------
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "seller"]),
  upload("product").single("image"), // ✅ saves inside /uploads/product
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "seller"]),
  upload("product").single("image"), // ✅ saves inside /uploads/product
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "seller"]),
  productController.deleteProduct
);

module.exports = router;
