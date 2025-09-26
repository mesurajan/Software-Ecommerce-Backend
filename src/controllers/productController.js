const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category"); // <-- make sure you have this model

// Helper: resolve category (accepts id or name)
async function resolveCategory(categoryInput) {
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    return categoryInput; // already an ObjectId
  }
  // else find by name
  const cat = await Category.findOne({ name: categoryInput });
  if (!cat) throw new Error("Invalid category: " + categoryInput);
  return cat._id;
}

// Get all products (public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name slug");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create product (admin + seller)
exports.createProduct = async (req, res) => {
  try {
    const { productId, title, price, description, category } = req.body;

    const product = new Product({
      productId,
      title,
      price,
      description,
      category: mongoose.isValidObjectId(category) ? category : category,
      createdBy: req.user?._id,
      image: req.file ? `/uploads/product/${req.file.filename}` : null, // ✅ fixed path
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.category) {
      updateData.category = await resolveCategory(updateData.category);
    }
    if (req.file) updateData.image = `/uploads/product/${req.file.filename}`; // ✅ fixed path

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
