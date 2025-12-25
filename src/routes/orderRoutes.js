const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getMyOrders,
} = require("../controllers/orderController");

const requireAuth = require("../middleware/userauthmiddleware");

// Admin / debug
router.get("/", getAllOrders);

// Logged-in user
router.get("/my", requireAuth, getMyOrders);

// Single order
router.get("/:id", getOrderById);

module.exports = router;
