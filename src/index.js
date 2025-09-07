const dotenv = require("dotenv");
dotenv.config({ quiet: true });

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// DB Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Safe logging middleware — only logs body for POST/PUT requests
app.use((req, res, next) => {
  if ((req.method === "POST" || req.method === "PUT") && req.body && Object.keys(req.body).length > 0) {
    console.log("📩 Request Body:", req.body);
  }
  next();
});

// Routes
const authRoutes = require("./routes/UserRoutes");
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
