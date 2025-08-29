const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.profile);

// Role-based routes
router.get("/admin-dashboard", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/seller-dashboard", authMiddleware, roleMiddleware(["seller", "admin"]), (req, res) => {
  res.json({ message: "Welcome Seller/Admin" });
});

module.exports = router;
