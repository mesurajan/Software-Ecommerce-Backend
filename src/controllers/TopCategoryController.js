// controllers/TopCategoryController.js
const TopCategory = require("../models/TopCategory");

exports.getTopCategories = async (req, res) => {
  try {
    const categories = await TopCategory.find().populate(
      "chairs.product",
      "title slug _id"
    );
    res.json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: err.message });
  }
};

exports.createTopCategory = async (req, res) => {
  try {
    const { title, chairs } = req.body;

    // Handle uploaded images
    const images = req.files || [];
    let parsedChairs = JSON.parse(chairs);

    parsedChairs = parsedChairs.map((chair, idx) => ({
      ...chair,
      chairimage: images[idx] ? `/uploads/topcategories/${images[idx].filename}` : chair.chairimage,
    }));

    const category = new TopCategory({
      title,
      chairs: parsedChairs,
    });

    await category.save();
    res.json(category);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating category", error: err.message });
  }
};

exports.updateTopCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, chairs } = req.body;

    const images = req.files || [];
    let parsedChairs = JSON.parse(chairs);

    parsedChairs = parsedChairs.map((chair, idx) => ({
      ...chair,
      chairimage: images[idx] ? `/uploads/topcategories/${images[idx].filename}` : chair.chairimage,
    }));

    const updated = await TopCategory.findByIdAndUpdate(
      id,
      { title, chairs: parsedChairs },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating category", error: err.message });
  }
};

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
