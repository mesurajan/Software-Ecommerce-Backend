const Order = require("../models/Order");

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "_id name email") // 🔹 populate user info
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "_id name email"); // 🔹 populate user info

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "_id name email") // 🔹 populate user info
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE order (after payment success)
const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user._id, // 🔥 REQUIRED
      items: req.body.items,
      shipping: req.body.shipping,
      subtotal: req.body.subtotal,
      deliveryFee: req.body.deliveryFee,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod || "ESEWA",
      paymentStatus: "PAID",
      transaction_uuid: req.body.transaction_uuid,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getMyOrders,
  createOrder,
};
