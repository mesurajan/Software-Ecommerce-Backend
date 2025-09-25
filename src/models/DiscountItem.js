const mongoose = require("mongoose");

const discountItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // ✅ Added productId
    category: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    features: [{ type: String }],
    buttonText: { type: String, default: "Shop Now" },
    chairImage: { type: String , required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscountItem", discountItemSchema);
