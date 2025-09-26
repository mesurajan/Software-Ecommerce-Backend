const TopCategory = require("../models/TopCategory");

// ✅ Get all
exports.getTopCategories = async (req, res) => {
  try {
    const categories = await TopCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};

// ✅ Create
exports.createTopCategory = async (req, res) => {
  try {
    const { title, chairs } = req.body;
    let parsedChairs = [];

    if (chairs) {
      parsedChairs = JSON.parse(chairs);
      if (req.files && req.files.length > 0) {
        parsedChairs = parsedChairs.map((c, i) => ({
          ...c,
          chairimage: req.files[i] ? `uploads/topcategories/${req.files[i].filename}` : c.chairimage,
        }));
      }
    }

    const newCategory = new TopCategory({ title, chairs: parsedChairs });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err });
  }
};

// ✅ Update
exports.updateTopCategory = async (req, res) => {
  try {
    const { title, chairs } = req.body;
    let parsedChairs = [];

    if (chairs) {
      parsedChairs = JSON.parse(chairs);
      if (req.files && req.files.length > 0) {
        parsedChairs = parsedChairs.map((c, i) => ({
          ...c,
          chairimage: req.files[i] ? `uploads/topcategories/${req.files[i].filename}` : c.chairimage,
        }));
      }
    }

    const updated = await TopCategory.findByIdAndUpdate(
      req.params.id,
      { title, chairs: parsedChairs },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err });
  }
};

// ✅ Delete
exports.deleteTopCategory = async (req, res) => {
  try {
    await TopCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err });
  }
};
