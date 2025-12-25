const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/UserAuthMiddleware");
const profileController = require("../controllers/UserProfileController");

// Logged-in user profile
router.get("/me", authMiddleware, profileController.getMyProfile);

module.exports = router;
