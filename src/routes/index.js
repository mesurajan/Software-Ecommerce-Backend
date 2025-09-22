const express = require("express");
const router = express.Router();

// Import individual routers
const authRoutes = require("./UserRoutes");
const bannerRoutes = require("./BannerRoutes");

// Mount routers
router.use("/auth", authRoutes);       // User authentication & profile routes
router.use("/banner", bannerRoutes);   // Banner management routes

module.exports = router;
