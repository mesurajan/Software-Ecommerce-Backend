// routes/Slider2Routes.js
const express = require("express");
const router = express.Router();
const sliderController = require("../controllers/Slider2Controller");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// --- ADMIN ROUTES ---
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("product").array("images", 10),
  sliderController.createSlider
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("product").array("images", 10),
  sliderController.updateSlider
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  sliderController.deleteSlider
);

// --- PUBLIC ROUTES ---
router.get("/", sliderController.getSliders);

module.exports = router;
