const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // can be product name or SKU
  title: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true }, // uploaded image path
});

const latestProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["New Arrivals", "Best Seller", "Featured", "Special Offer"],
      required: true,
    },
    products: [productSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LatestProduct", latestProductSchema);
