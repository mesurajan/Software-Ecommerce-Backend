// controllers/notificationController.js
const Notification = require("../models/Notification");

// GET all notifications (admin)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE notification (used by events)
exports.createNotification = async ({ title, message, type, relatedId }) => {
  try {
    return await Notification.create({ title, message, type, relatedId });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
    return null;
  }
};

// MARK AS READ
exports.markAsRead = async (id) => {
  try {
    return await Notification.findByIdAndUpdate(id, { status: "read" }, { new: true });
  } catch (err) {
    console.error("Failed to mark notification as read:", err.message);
    return null;
  }
};
exports.deleteNotification = async (id) => {
  if (!id) return;
  try {
    await axios.delete(`${BACKEND_URL}/api/notifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications(); // refresh after delete
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete notification");
  }
};
