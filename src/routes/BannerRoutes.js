const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/BannerController");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin-only routes
router.post("/", authMiddleware, roleMiddleware(["admin"]), bannerController.createBanner);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), bannerController.updateBanner);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), bannerController.deleteBanner);

// Public route to view banners
router.get("/", bannerController.getBanners);

module.exports = router;
