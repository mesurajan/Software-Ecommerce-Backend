const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    // category can be ObjectId (ref) OR plain string
    category: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      ref: "Category",
    },
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
