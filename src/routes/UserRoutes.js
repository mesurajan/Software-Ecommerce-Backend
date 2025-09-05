// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/UserAuthController");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/UserModels"); 

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.profile);

// Role-based dashboards
router.get("/admin-dashboard", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/seller-dashboard", authMiddleware, roleMiddleware(["seller", "admin"]), (req, res) => {
  res.json({ message: "Welcome Seller/Admin" });
});

// ✅ Get all users (admin only)
router.get("/users", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ Get all customers (buyers)
router.get("/customers", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customers" });
  }
});

// Get all sellers
router.get("/sellers", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select("-password");
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sellers" });
  }
});


// Update user
router.put("/users/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Delete user
router.delete("/users/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});


module.exports = router;
