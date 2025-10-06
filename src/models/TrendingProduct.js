const mongoose = require("mongoose");

const trendingProductItemSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    chairimage: { type: String, required: true },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSlug: { type: String },
  },
  { _id: false }
);

const trendingProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Popular", "Seasonal", "Limited", "Recommended"],
      required: true,
    },
    products: [trendingProductItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrendingProduct", trendingProductSchema);
