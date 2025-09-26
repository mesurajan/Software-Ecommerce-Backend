const mongoose = require("mongoose");

const ChairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true }, // ✅ price added
  chairimage: { type: String }, // store uploaded file path
  productLink: { type: String }, // can be productId or URL
});

const TopCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // category header
    chairs: [ChairSchema], // 4 chairs inside
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopCategory", TopCategorySchema);
