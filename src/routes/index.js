const express = require("express");
const router = express.Router();

// Import individual routers
const authRoutes = require("./UserRoutes");
const bannerRoutes = require("./BannerRoutes");
const slider2Routes = require("./Slider2Routes")
const latestProductRoutes = require("./latestProductRoutes")

// Mount routers
router.use("/auth", authRoutes);       
router.use("/banner", bannerRoutes);  
router.use("/slider",slider2Routes );
router.use("/latestproduct",latestProductRoutes );



module.exports = router;
