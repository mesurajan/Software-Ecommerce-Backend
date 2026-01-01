const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");
const notificationController = require("./notificationController");
const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP
exports.signup = async (req, res) => {
  const { name, phone, address, age, email, password, role } = req.body;

  if (!name || !phone || !address || !age || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phone,
      address,
      age,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await newUser.save();

   await notificationController.createNotification({
  title: "New User Registered",
  message: `User ${newUser.name} has signed up.`,
  type: "user",
  relatedId: newUser._id,
});


    res.json({ message: "Signup successful", user: { email: newUser.email, role: newUser.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// PROFILE
exports.profile = async (req, res) => {
  res.json({ message: `Welcome ${req.user.name}`, role: req.user.role });
};
