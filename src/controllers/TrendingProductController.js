import TrendingProduct from "../models/TrendingProduct.js";
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

// ✅ Get all trending products
export const getTrendingProducts = async (req, res) => {
  try {
    const docs = await TrendingProduct.find().sort({ createdAt: -1 });

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
export const createTrendingProduct = async (req, res) => {
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
      f.filename ? `uploads/trendingproducts/${f.filename}`.replace(/\\/g, "/") : null
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

    let existing = await TrendingProduct.findOne({ category });
    if (existing) {
      // avoid duplicates
      const existingIds = existing.products.map((p) => p._id.toString());
      const newOnes = finalProducts.filter((fp) => !existingIds.includes(fp._id.toString()));
      existing.products.push(...newOnes);
      await existing.save();
      return res.status(200).json(existing);
    }

    const newDoc = new TrendingProduct({ category, products: finalProducts });
    await newDoc.save();

    res.status(201).json(newDoc);
  } catch (err) {
    console.error("Create TrendingProduct error:", err);
    res.status(400).json({ error: err.message || err });
  }
};

// ✅ Delete a whole category by _id
export const deleteTrendingProduct = async (req, res) => {
  try {
    const deleted = await TrendingProduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete all docs for a category
export const deleteTrendingByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await TrendingProduct.deleteMany({ category });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update single product inside category
export const updateTrendingProduct = async (req, res) => {
  try {
    const { docId, productId } = req.params;

    const doc = await TrendingProduct.findById(docId);
    if (!doc) return res.status(404).json({ message: "Category doc not found" });

    const product = doc.products.find((p) => p._id.toString() === productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.body.productSlug) product.productSlug = req.body.productSlug;

    if (req.file) {
      const newPath = `uploads/trendingproducts/${req.file.filename}`.replace(/\\/g, "/");
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
export const deleteTrendingProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const doc = await TrendingProduct.findOne({ "products._id": productId });
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
      await TrendingProduct.deleteOne({ _id: doc._id });
    } else {
      await doc.save();
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
