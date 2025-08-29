const dotenv = require("dotenv");
dotenv.config( {silent: true });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// Server
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
