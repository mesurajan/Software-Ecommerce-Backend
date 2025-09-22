const chalk = require("chalk")
const dotenv = require("dotenv");
dotenv.config({ quiet: true });


const connectDB = require("./config/db");
const app = require("./app");

// DB Connection
connectDB();

// Start server
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(
    chalk.blue.bold(`🚀 Server running on:`),
    chalk.yellowBright(`http://localhost:${PORT}`)
  );
  console.log(chalk.magentaBright("📦 Backend is ready to handle requests!"));
});