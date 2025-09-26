const express = require("express");
const router = express.Router();

// Import individual routers
const authRoutes = require("./UserRoutes");
const bannerRoutes = require("./BannerRoutes");
const slider2Routes = require("./Slider2Routes");
const latestProductRoutes = require("./latestProductRoutes");
const discountItemRoutes = require("./DiscountItemRoutes");
const topCategoryRoutes = require("./TopCategoryRoutes"); // ✅ Import Top Categories routes

// Mount routers
router.use("/auth", authRoutes);
router.use("/banner", bannerRoutes);
router.use("/slider", slider2Routes);
router.use("/latestproduct", latestProductRoutes);
router.use("/discountitem", discountItemRoutes);
router.use("/topcategories", topCategoryRoutes); // ✅ Add new topcategories API

module.exports = router;
