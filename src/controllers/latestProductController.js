// controllers/latestProductController.js
const LatestProduct = require("../models/LatestProduct");
const path = require("path");

// Get all
exports.getAllLatestProducts = async (req, res) => {
  try {
    const products = await LatestProduct.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create
exports.createLatestProduct = async (req, res) => {
  try {
    const { category, products } = req.body;

    let parsedProducts = [];
    if (products) parsedProducts = JSON.parse(products);

    if (req.files && req.files.length) {
      parsedProducts = parsedProducts.map((p, i) => ({
        ...p,
        productImage: req.files[i]
          ? path.join("uploads", "latestproduct", req.files[i].filename)
          : "",
      }));
    }

    const latestProduct = new LatestProduct({
      category,
      products: parsedProducts,
    });

    await latestProduct.save();
    res.json(latestProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteLatestProduct = async (req, res) => {
  try {
    await LatestProduct.findByIdAndDelete(req.params.id);
    res.json({ message: "Latest product category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
