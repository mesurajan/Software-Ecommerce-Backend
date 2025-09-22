const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green.bold("✅ MongoDB Connected Successfully!"));

    // Show environment
    console.log(
      chalk.cyan(`🛠 Running in ${process.env.NODE_ENV || "development"} mode`)
    );

    // Optionally show masked URI
    const uri = process.env.MONGO_URI;
    const maskedUri = uri.replace(/\/\/.*:/, "//****:"); // hide username/password
    console.log(chalk.yellow(`🔗 Connected to: ${maskedUri}`));

  } catch (err) {
    console.error(chalk.red.bold("❌ MongoDB Connection Failed:"), err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

