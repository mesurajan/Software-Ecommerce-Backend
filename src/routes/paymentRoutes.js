const express = require("express");
const router = express.Router();

const {
  initiateEsewaPayment,
  esewaSuccess,
  esewaFailure,
} = require("../controllers/paymentController");

// Create payment
router.post("/esewa/initiate", initiateEsewaPayment);



// Callbacks from eSewa
router.get("/esewa/success", esewaSuccess);
router.get("/esewa/failure", esewaFailure);

console.log("💚 Payment routes loaded");

module.exports = router;
