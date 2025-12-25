const User = require("../models/UserModels");

// GET logged-in user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      age: user.age,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
