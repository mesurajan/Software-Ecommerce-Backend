const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getMyOrders,
  createOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/UserAuthMiddleware");
// CREATE order (after payment)
router.post("/", authMiddleware, createOrder);
// Admin / debug
router.get("/", getAllOrders);

// Logged-in user
router.get("/my", authMiddleware, getMyOrders);

// Single order
router.get("/:id", getOrderById);

module.exports = router;
