// controllers/Slider2Controller.js
const Slider2 = require("../models/Slider2Models");
const path = require("path");

// ✅ Get all sliders (public)
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider2.find()
      .populate("chairs.product", "title slug price image"); // populate hybrid product ref
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create a new slider (admin only)
exports.createSlider = async (req, res) => {
  try {
    const { title, chairs } = req.body;

    // req.body.chairs may come as JSON string
    const parsedChairs = chairs ? JSON.parse(chairs) : [];

    // assign uploaded image paths
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) =>
        path.join("uploads", "product", file.filename)
      );
    }

    // build final chairs array
    const finalChairs = parsedChairs.map((chair, idx) => ({
      ...chair,
      chairimage: uploadedImages[idx] || chair.chairimage, // use new or existing
      product: chair.product || null, // mongoose ObjectId ref
    }));

    const newSlider = new Slider2({
      title,
      chairs: finalChairs,
    });

    await newSlider.save();
    const populated = await newSlider.populate("chairs.product", "title slug price image");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update slider
exports.updateSlider = async (req, res) => {
  try {
    const { title, chairs } = req.body;
    const parsedChairs = chairs ? JSON.parse(chairs) : [];

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) =>
        path.join("uploads", "product", file.filename)
      );
    }

    const finalChairs = parsedChairs.map((chair, idx) => ({
      ...chair,
      chairimage: uploadedImages[idx] || chair.chairimage,
      product: chair.product || null,
    }));

    const updatedSlider = await Slider2.findByIdAndUpdate(
      req.params.id,
      { title, chairs: finalChairs },
      { new: true }
    ).populate("chairs.product", "title slug price image");

    if (!updatedSlider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.json(updatedSlider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete slider
exports.deleteSlider = async (req, res) => {
  try {
    const deleted = await Slider2.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Slider not found" });
    }
    res.json({ message: "Slider deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
