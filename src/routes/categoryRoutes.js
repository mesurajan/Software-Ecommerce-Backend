const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/UserAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public
router.get("/", categoryController.getCategories);

// Admin only
router.post("/", authMiddleware, roleMiddleware(["admin"]), categoryController.createCategory);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), categoryController.updateCategory);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), categoryController.deleteCategory);

module.exports = router;
