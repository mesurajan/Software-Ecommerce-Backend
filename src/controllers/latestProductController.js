const LatestProduct = require("../models/LatestProduct");

exports.createLatestProduct = async (req, res) => {
  try {
    let { category, products } = req.body;

    // Fix multipart/form-data -> products arrives as string
    if (typeof products === "string") {
      products = JSON.parse(products);
    }

    // Attach uploaded image filenames
    if (req.files && req.files.length > 0) {
      products = products.map((prod, idx) => ({
        ...prod,
        productImage: req.files[idx]
          ? req.files[idx].filename
          : prod.productImage,
      }));
    }

    const latest = new LatestProduct({ category, products });
    await latest.save();

    res.status(201).json(latest);
  } catch (err) {
    console.error("❌ Create LatestProduct error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getLatestProducts = async (req, res) => {
  try {
    const data = await LatestProduct.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLatestProduct = async (req, res) => {
  try {
    let { category, products } = req.body;

    if (typeof products === "string") {
      products = JSON.parse(products);
    }

    if (req.files && req.files.length > 0) {
      products = products.map((prod, idx) => ({
        ...prod,
        productImage: req.files[idx]
          ? req.files[idx].filename
          : prod.productImage,
      }));
    }

    const updated = await LatestProduct.findByIdAndUpdate(
      req.params.id,
      { category, products },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Update LatestProduct error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLatestProduct = async (req, res) => {
  try {
    const deleted = await LatestProduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "✅ Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
