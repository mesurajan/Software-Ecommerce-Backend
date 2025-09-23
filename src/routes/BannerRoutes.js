// src/routes/BannerRoutes.js
const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/BannerController");
const authMiddleware = require("../middleware/UserAuthMiddleware"); 
const roleMiddleware = require("../middleware/roleMiddleware"); 
const upload = require("../middleware/upload"); 


// ========================= ADMIN ROUTES =========================

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("banner").single("image"), 
  bannerController.createBanner
);

// Update an existing banner by ID 
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("banner").single("image"), 
  bannerController.updateBanner
);

// Delete a banner by ID
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), bannerController.deleteBanner);

// ========================= PUBLIC ROUTE =========================
// Get all banners
router.get("/", bannerController.getBanners);

module.exports = router;
