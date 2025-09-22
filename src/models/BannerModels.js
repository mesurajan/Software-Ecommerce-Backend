const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },          
    description: { type: String, required: true },
    productLink: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // "Product" as string
    discountPercentage: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
