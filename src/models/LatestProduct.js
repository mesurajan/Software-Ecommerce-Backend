const mongoose = require("mongoose");

const latestProductItemSchema = new mongoose.Schema(
  {
    // ✅ Force _id = Product._id (no random new ObjectId)
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Snapshot for fast rendering
    title: { type: String, required: true },
    price: { type: Number, required: true },
    chairimage: { type: String, required: true },

    // Reference
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSlug: { type: String },
  },
  { _id: false } // prevent Mongoose from creating another _id
);

const latestProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["New Arrivals", "Best Seller", "Featured", "Special Offer"],
      required: true,
    },
    products: [latestProductItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LatestProduct", latestProductSchema);
