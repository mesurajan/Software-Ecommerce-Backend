// models/Slider2.js
const mongoose = require("mongoose");

const chairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  chairimage: { type: String, required: true }, // uploaded image path
  productLink: { type: String, required: true }, // optional product id or slug
});

const slider2Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    chairs: [chairSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider2", slider2Schema);
