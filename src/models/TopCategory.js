// models/TopCategory.js
const mongoose = require("mongoose");

const ChairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  chairimage: { type: String },

  // Reference to Product
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  // Store slug directly from Product (from dropdown selection in Admin UI)
  productSlug: { type: String, required: true },
});

const TopCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // section header
    chairs: [ChairSchema], // up to 4 chairs
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopCategory", TopCategorySchema);
