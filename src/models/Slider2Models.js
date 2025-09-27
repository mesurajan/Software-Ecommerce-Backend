
// models/Slider2.js
const mongoose = require("mongoose");

const chairSchema = new mongoose.Schema({
  // --- Redundant (denormalized) fields for fast render ---
  title: { type: String, required: true },
  price: { type: Number, required: true },
  chairimage: { type: String, required: true }, // uploaded image path

  // --- Reference to Product ---
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  productSlug: { type: String }, // store slug for SEO / navigation
});

const slider2Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    chairs: [chairSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider2", slider2Schema);

