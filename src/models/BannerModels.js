// models/BannerModels.js
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },         // main banner image
    title: { type: String, required: true },         // banner title
    subtitle: { type: String },                      // optional subtitle
    description: { type: String, required: true },  // banner description
    productLink: { type: String },                   // now stores product name instead of ObjectId
    leftImage: { type: String, default: "/uploads/Default/lightimage.png" },                     // optional left image
    discountPercentage: { type: Number, default: 0 } // discount percentage
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
