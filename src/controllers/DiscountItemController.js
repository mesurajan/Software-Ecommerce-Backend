import DiscountItem from "../models/DiscountItem.js";
import path from "path";
import fs from "fs";

// ✅ Get all
export const getDiscountItems = async (req, res) => {
  try {
    const docs = await DiscountItem.find().sort({ createdAt: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create
export const createDiscountItem = async (req, res) => {
  try {
    const { productId, category, title, subtitle, description, features, buttonText } = req.body;

    const imagePath =
      req.file?.filename &&
      path.join("uploads", "discountitems", req.file.filename).replace(/\\/g, "/");

    const doc = new DiscountItem({
      productId,
      category,
      title,
      subtitle,
      description,
      features: features ? JSON.parse(features) : [],
      buttonText,
      chairImage: imagePath || "",
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update
export const updateDiscountItem = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DiscountItem.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    const { productId, category, title, subtitle, description, features, buttonText } = req.body;

    if (productId) doc.productId = productId;
    if (category) doc.category = category;
    if (title) doc.title = title;
    if (subtitle) doc.subtitle = subtitle;
    if (description) doc.description = description;
    if (features) doc.features = JSON.parse(features);
    if (buttonText) doc.buttonText = buttonText;

    if (req.file) {
      if (doc.chairImage && fs.existsSync(doc.chairImage)) {
        fs.unlinkSync(doc.chairImage);
      }
      doc.chairImage = path
        .join("uploads", "discountitems", req.file.filename)
        .replace(/\\/g, "/");
    }

    await doc.save();
    res.json({ message: "Updated", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete
export const deleteDiscountItem = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DiscountItem.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    if (doc.chairImage && fs.existsSync(doc.chairImage)) {
      fs.unlinkSync(doc.chairImage);
    }

    await DiscountItem.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
