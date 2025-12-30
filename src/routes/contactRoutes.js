const express = require("express");
const router = express.Router();
const { 
    submitContact, 
    getContacts ,
    deleteContact, 
    resolveContact
 } = require("../controllers/contactController");
const authMiddleware = require("../middleware/UserAuthMiddleware"); // your auth middleware
const adminMiddleware = require("../middleware/UserAuthMiddleware"); // optional, for admin routes

// Submit a contact message (logged-in user only)
router.post("/submit", authMiddleware, submitContact);

// Get all contacts (admin only)
router.get("/", authMiddleware, adminMiddleware, getContacts);

router.delete("/:id", authMiddleware, adminMiddleware, deleteContact);
router.patch("/:id/resolve", authMiddleware, adminMiddleware, resolveContact);
module.exports = router;
