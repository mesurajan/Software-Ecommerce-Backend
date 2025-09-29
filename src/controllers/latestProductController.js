// src/controllers/LatestProductController.js
import LatestProduct from "../models/LatestProduct.js";
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

// ✅ Get all latest products
export const getLatestProducts = async (req, res) => {
  try {
    const docs = await LatestProduct.find().sort({ createdAt: -1 });

    const normalized = docs.map((doc) => ({
      _id: doc._id,
      category: doc.category,
      products: doc.products.map((p) => ({
        _id: p._id, // ✅ same as productId
        productId: p.product,
        title: p.title,
        price: p.price,
        slug: p.productSlug,
        chairimage: p.chairimage
          ? `/${p.chairimage.replace(/\\/g, "/")}`
          : "/uploads/default/lightimage.png",
      })),
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✅ Create or append to a category
 * Expects multipart/form-data:
 * - category (string)
 * - products (stringified JSON array) -> [{ productId }]
 * - images[] uploaded files (optional, chairimage)
 */
// CREATE or APPEND
export const createLatestProduct = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ message: "category required" });

    let parsedProducts = [];
    if (req.body.products) {
      try {
        parsedProducts = JSON.parse(req.body.products);
      } catch (e) {
        return res.status(400).json({ message: "Invalid products JSON" });
      }
    }

    // Map uploaded files
    const uploaded = (req.files || []).map((f) =>
      f.filename ? `uploads/latestproducts/${f.filename}`.replace(/\\/g, "/") : null
    );

    const finalProducts = [];
    for (let i = 0; i < parsedProducts.length; i++) {
      const prod = parsedProducts[i];
      const productDoc = await Product.findById(prod.productId).select("slug title price");
      if (!productDoc) continue;

      finalProducts.push({
        _id: prod.productId, // ✅ force _id = Product._id
        product: prod.productId,
        productSlug: productDoc.slug,
        title: productDoc.title,
        price: productDoc.price,
        chairimage: uploaded[i] || "/uploads/default/lightimage.png",
      });
    }

    let existing = await LatestProduct.findOne({ category });
    if (existing) {
      // avoid duplicates
      const existingIds = existing.products.map((p) => p._id.toString());
      const newOnes = finalProducts.filter((fp) => !existingIds.includes(fp._id.toString()));
      existing.products.push(...newOnes);
      await existing.save();
      return res.status(200).json(existing);
    }

    const newDoc = new LatestProduct({ category, products: finalProducts });
    await newDoc.save();

    res.status(201).json(newDoc);
  } catch (err) {
    console.error("Create LatestProduct error:", err);
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

// UPDATE single product
export const updateLatestProduct = async (req, res) => {
  try {
    const { docId, productId } = req.params;

    const doc = await LatestProduct.findById(docId);
    if (!doc) return res.status(404).json({ message: "Category doc not found" });

    const product = doc.products.find((p) => p._id.toString() === productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.body.productSlug) product.productSlug = req.body.productSlug;

    if (req.file) {
      const newPath = `uploads/latestproducts/${req.file.filename}`.replace(/\\/g, "/");
      product.chairimage = newPath;
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

    const doc = await LatestProduct.findOne({ "products._id": productId });
    if (!doc) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = doc.products.find((p) => p._id.toString() === productId);

    if (product?.chairimage) {
      const filePath = path.join(process.cwd(), product.chairimage);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          console.warn("⚠️ Failed to delete product image:", filePath);
        }
      }
    }

    doc.products = doc.products.filter((p) => p._id.toString() !== productId);

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
