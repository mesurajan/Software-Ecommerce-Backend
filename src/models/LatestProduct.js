// models/LatestProduct.js
const mongoose = require("mongoose");

const LatestProductItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productSlug: { type: String, required: true }, // copied from Product
  overrideImage: { type: String }, // optional admin-uploaded image
});

const LatestProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["New Arrivals", "Best Seller", "Featured", "Special Offer"],
      required: true,
    },
    products: [LatestProductItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LatestProduct", LatestProductSchema);
