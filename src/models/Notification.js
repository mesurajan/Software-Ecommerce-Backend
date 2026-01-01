// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["user", "order", "payment", "system"], required: true },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: "type" }, // can be orderId, userId, etc.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
