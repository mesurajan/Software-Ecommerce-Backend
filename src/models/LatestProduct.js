// models/LatestProduct.js
const mongoose = require("mongoose");

const latestProductItemSchema = new mongoose.Schema(
  {
    // --- Denormalized snapshot for fast render ---
    title: { type: String, required: true }, // product title snapshot
    price: { type: Number, required: true }, // product price snapshot
    chairimage: { type: String, required: true }, // uploaded or fallback image

    // --- Reference to Product for sync ---
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSlug: { type: String }, // store slug for SEO/navigation
  },
  { _id: false } // ✅ prevent auto _id on subdocuments
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
