// controllers/LatestProductController.js
const LatestProduct = require("../models/LatestProduct");
const path = require("path");

exports.getLatestProducts = async (req, res) => {
  try {
    const docs = await LatestProduct.find().sort({ createdAt: 1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Create or append to a category.
 * Expects multipart/form-data:
 * - category (string)
 * - products (stringified JSON array) -> [{ productId, title, price, productImage }]
 * - images[] uploaded files (order corresponds to products where productImage is filename)
 */
exports.createLatestProduct = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ message: "category required" });

    // parse products JSON (from multipart/form-data)
    let parsedProducts = [];
    if (req.body.products) {
      parsedProducts = JSON.parse(req.body.products);
    }

    // map uploaded files to paths
    const uploaded = (req.files || []).map((f) =>
      path.join("uploads", "latestproducts", f.filename).replace(/\\/g, "/")
    );

    // Build final product objects (use uploaded image path if available)
    const finalProducts = parsedProducts.map((p, idx) => ({
      productId: p.productId || p.id || "",
      title: p.title || "",
      price: Number(p.price || 0),
      productImage: uploaded[idx] || p.productImage || "",
    }));

    // If category exists -> append products
    let existing = await LatestProduct.findOne({ category });
    if (existing) {
      existing.products.push(...finalProducts);
      await existing.save();
      return res.status(200).json(existing);
    }

    // else create new
    const newDoc = new LatestProduct({
      category,
      products: finalProducts,
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || err });
  }
};

// Delete a single latestProduct doc by id
exports.deleteLatestProduct = async (req, res) => {
  try {
    const deleted = await LatestProduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete all documents for a category (useful for admin UI "Delete category")
exports.deleteByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await LatestProduct.deleteMany({ category });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
