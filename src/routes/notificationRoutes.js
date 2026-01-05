// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/UserAuthMiddleware");

// Get all notifications (admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { status: "read" }, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

// Create notification (triggered by events)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Failed to create notification" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
});

module.exports = router;
