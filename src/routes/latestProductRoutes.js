const express = require("express");
const router = express.Router();
const latestProductController = require("../controllers/latestProductController");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// ADMIN ROUTES
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").array("images", 10),
  latestProductController.createLatestProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload("latestproducts").array("images", 10),
  latestProductController.updateLatestProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  latestProductController.deleteLatestProduct
);

// PUBLIC ROUTES
router.get("/", latestProductController.getLatestProducts);

module.exports = router;
