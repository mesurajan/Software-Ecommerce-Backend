// models/UserModels.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);
