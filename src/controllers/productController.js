const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

// ---------------- Helper ----------------
async function resolveCategory(categoryInput) {
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    return categoryInput;
  }
  const cat = await Category.findOne({ name: categoryInput });
  if (!cat) throw new Error("Invalid category: " + categoryInput);
  return cat._id;
}

// ---------------- Public Controllers ----------------

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name slug");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID only (legacy route)
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

// Get product details (SEO-friendly with optional slug)
exports.getProductDetails = async (req, res) => {
  try {
    const { id, slug } = req.params;
    const product = await Product.findById(id).populate("category", "name slug");

    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ If slug mismatch → tell frontend to redirect
    if (slug && product.slug !== slug) {
      return res.json({
        redirect: `/admin/productDetails/${product._id}/${product.slug}`,
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Protected Controllers ----------------

// Create product
exports.createProduct = async (req, res) => {
  try {
    const {
      productId,
      title,
      subtitle,
      description,
      additionalInfo,
      price,
      oldPrice,
      discount,
      stock,
      brand,
      sku,
      weight,
      length,
      width,
      height,
      material,
      warranty,
      delivery,
      colors,
      videoUrl,
      category,
    } = req.body;

    const product = new Product({
      productId,
      title,
      subtitle,
      description,
      additionalInfo,
      price,
      oldPrice,
      discount,
      stock,
      brand,
      sku,
      weight,
      length,
      width,
      height,
      material,
      warranty,
      delivery,
      colors: Array.isArray(colors) ? colors : colors ? [colors] : [],
      videoUrl,
      category: await resolveCategory(category),
      createdBy: req.user?._id,
      image: req.file ? `/uploads/product/${req.file.filename}` : null, // ✅ single image
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

    if (req.file) {
      updateData.image = `/uploads/product/${req.file.filename}`;
    }

    // ✅ Ensure colors is always an array
    if (updateData.colors && !Array.isArray(updateData.colors)) {
      updateData.colors = [updateData.colors];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
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
