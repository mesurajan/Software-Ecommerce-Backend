const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: String,
        title: String,
        price: Number,
        quantity: Number,
      },
    ],

    shipping: {
      name: String,
      phone: String,
      address: String,
    },

    subtotal: Number,
    deliveryFee: Number,
    total: Number,

    paymentMethod: {
      type: String,
      default: "ESEWA",
    },

    paymentStatus: {
      type: String,
      default: "PENDING",
    },

    transaction_uuid: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
