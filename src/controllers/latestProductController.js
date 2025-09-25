// src/controllers/LatestProductController.js
import LatestProduct from "../models/LatestProduct.js";
import fs from "fs";
import path from "path";

// ✅ Get all latest products
export const getLatestProducts = async (req, res) => {
  try {
    const docs = await LatestProduct.find().sort({ createdAt: 1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✅ Create or append to a category
 * Expects multipart/form-data:
 * - category (string)
 * - products (stringified JSON array) -> [{ productId, title, price, productImage }]
 * - images[] uploaded files (order corresponds to products where productImage is filename)
 */
export const createLatestProduct = async (req, res) => {
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

// ✅ Delete a whole document by _id
export const deleteLatestProduct = async (req, res) => {
  try {
    const deleted = await LatestProduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete all documents for a category
export const deleteByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await LatestProduct.deleteMany({ category });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update a single product inside a document
export const updateLatestProduct = async (req, res) => {
  try {
    const { docId, productId } = req.params;
    const { title, price } = req.body;

    const doc = await LatestProduct.findById(docId);
    if (!doc) return res.status(404).json({ message: "Category doc not found" });

    const product = doc.products.id(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // update fields
    if (title) product.title = title;
    if (price) product.price = price;
    if (req.file) {
      product.productImage = `uploads/latestproducts/${req.file.filename}`;
    }

    await doc.save();

    res.json({ message: "✅ Product updated", updated: product });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// ✅ Delete a single product inside a category
export const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the category that contains this product
    const doc = await LatestProduct.findOne({ "products._id": productId });
    if (!doc) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find product inside category
    const product = doc.products.id(productId);

    // If product has an image, remove it
    if (product?.productImage) {
      const filePath = path.join("uploads/latestproducts", product.productImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove the product from products array
    doc.products = doc.products.filter((p) => p._id.toString() !== productId);

    // Optional: delete category if empty
    if (doc.products.length === 0) {
      await LatestProduct.deleteOne({ _id: doc._id });
    } else {
      await doc.save();
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
