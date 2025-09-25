const express = require("express");
const router = express.Router();

// Import individual routers
const authRoutes = require("./UserRoutes");
const bannerRoutes = require("./BannerRoutes");
const slider2Routes = require("./Slider2Routes")


// Mount routers
router.use("/auth", authRoutes);       // User authentication & profile routes
router.use("/banner", bannerRoutes);   // Banner management routes
router.use("/slider",slider2Routes );


module.exports = router;
