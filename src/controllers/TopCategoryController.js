// controllers/TopCategoryController.js
const TopCategory = require("../models/TopCategory");
const Product = require("../models/Product");

// --- GET ---
exports.getTopCategories = async (req, res) => {
  try {
    const categories = await TopCategory.find().populate(
      "chairs.product",
      "title slug _id images"
    );
    res.json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: err.message });
  }
};

// --- CREATE ---
exports.createTopCategory = async (req, res) => {
  try {
    const { title, chairs } = req.body;
    const images = req.files || [];
    let parsedChairs = JSON.parse(chairs);

    parsedChairs = await Promise.all(
      parsedChairs.map(async (chair, idx) => {
        if (images[idx]) {
          // ✅ use uploaded file
          chair.chairimage = `/uploads/topcategories/${images[idx].filename}`;
        } else if (!chair.chairimage && chair.product) {
          // ✅ fallback to product's first image
          const prod = await Product.findById(chair.product).select("images");
          if (prod?.images?.length > 0) {
            chair.chairimage = prod.images[0];
          }
        }
        return chair;
      })
    );

    const category = new TopCategory({ title, chairs: parsedChairs });
    await category.save();
    res.json(category);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating category", error: err.message });
  }
};

// --- UPDATE ---
exports.updateTopCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, chairs } = req.body;
    const images = req.files || [];
    let parsedChairs = JSON.parse(chairs);

    parsedChairs = await Promise.all(
      parsedChairs.map(async (chair, idx) => {
        if (images[idx]) {
          chair.chairimage = `/uploads/topcategories/${images[idx].filename}`;
        } else if (!chair.chairimage && chair.product) {
          const prod = await Product.findById(chair.product).select("images");
          if (prod?.images?.length > 0) {
            chair.chairimage = prod.images[0];
          }
        }
        return chair;
      })
    );

    const updated = await TopCategory.findByIdAndUpdate(
      id,
      { title, chairs: parsedChairs },
      { new: true }
    ).populate("chairs.product", "title slug _id images");

    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating category", error: err.message });
  }
};

// --- DELETE ---
exports.deleteTopCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await TopCategory.findByIdAndDelete(id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error deleting category", error: err.message });
  }
};
