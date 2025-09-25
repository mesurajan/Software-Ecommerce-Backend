const Slider2 = require("../models/Slider2Models");
const path = require("path");

// ✅ Get all sliders (public)
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider2.find();
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create a new slider (admin only)
exports.createSlider = async (req, res) => {
  try {
    const { title, chairs } = req.body;

    // req.body.chairs will come as JSON string
    const parsedChairs = chairs ? JSON.parse(chairs) : [];

    // Assign uploaded image paths
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) =>
        path.join("uploads", "product", file.filename)
      );
    }

    const finalChairs = parsedChairs.map((chair, idx) => ({
      ...chair,
      chairimage: uploadedImages[idx] || chair.chairimage, // use uploaded or fallback
    }));

    const newSlider = new Slider2({
      title,
      chairs: finalChairs,
    });

    await newSlider.save();
    res.status(201).json(newSlider);
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
    }));

    const updatedSlider = await Slider2.findByIdAndUpdate(
      req.params.id,
      { title, chairs: finalChairs },
      { new: true }
    );

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
