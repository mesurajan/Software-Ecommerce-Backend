// controllers/BannerController.js
const Banner = require("../models/BannerModels");
const folder = "banner"; // folder name inside uploads

// ========================= CREATE BANNER =========================
exports.createBanner = async (req, res) => {
  try {
    const { title, description, productLink, discountPercentage, subtitle, leftImage } = req.body;
    const image = req.file ? `/uploads/${folder}/${req.file.filename}` : null;
    if (!image) return res.status(400).json({ message: "Banner image is required" });

    const newBanner = new Banner({
      image,
      title,
      description,
      productLink,
      discountPercentage,
      subtitle,
      leftImage: "/uploads/Default/lightimage.png",
    });

    await newBanner.save();
    res.status(201).json({ message: "Banner created", banner: newBanner });
  } catch (err) {
    res.status(500).json({ message: "Error creating banner", error: err.message });
  }
};


// ========================= GET ALL BANNERS =========================
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Error fetching banners", error: err.message });
  }
};


// ========================= UPDATE BANNER =========================
exports.updateBanner = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${folder}/${req.file.filename}`;
    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ message: "Banner updated", banner: updatedBanner });
  } catch (err) {
    res.status(500).json({ message: "Error updating banner", error: err.message });
  }
};


// ========================= DELETE BANNER =========================
exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted successfully", banner: deletedBanner });
  } catch (err) {
    res.status(500).json({ message: "Error deleting banner", error: err.message });
  }
};
