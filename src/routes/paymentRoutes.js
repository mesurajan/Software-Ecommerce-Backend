const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/UserAuthMiddleware");
const {
  createCODOrder,
  initiateEsewaPayment,
  esewaSuccess,
  esewaFailure,
} = require("../controllers/paymentController");

// ================== COD ==================
router.post("/cod", authMiddleware, createCODOrder);

// ================== eSewa ==================
router.post("/esewa/initiate", authMiddleware, initiateEsewaPayment);

// Callbacks from eSewa
router.get("/esewa/success", esewaSuccess);
router.get("/esewa/failure", esewaFailure);

console.log("💚 Payment routes loaded");

module.exports = router;
