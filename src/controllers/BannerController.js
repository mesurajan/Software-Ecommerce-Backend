const Banner = require("../models/BannerModels");

// Create a new banner (Admin only)
exports.createBanner = async (req, res) => {
  try {
    // Destructure data from request body
    const { image, title, description, productLink, discountPercentage } = req.body;

    // Create a new Banner instance
    const newBanner = new Banner({ image, title, description, productLink, discountPercentage });

    // Save the banner to the database
    await newBanner.save();

    // Respond with success
    res.status(201).json({ message: "Banner created successfully", banner: newBanner });
  } catch (err) {
    res.status(500).json({ message: "Error creating banner", error: err.message });
  }
};

// Get all banners (Public)
exports.getBanners = async (req, res) => {
  try {
    // Fetch banners and populate product info
    const banners = await Banner.find().populate("productLink", "name price");
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Error fetching banners", error: err.message });
  }
};

// Update a banner (Admin only)
exports.updateBanner = async (req, res) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Banner updated successfully", banner: updatedBanner });
  } catch (err) {
    res.status(500).json({ message: "Error updating banner", error: err.message });
  }
};

// Delete a banner (Admin only)
exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted successfully", banner: deletedBanner });
  } catch (err) {
    res.status(500).json({ message: "Error deleting banner", error: err.message });
  }
};
