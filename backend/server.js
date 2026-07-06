const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const serviceRoutes = require("./routes/serviceRoutes");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/services", serviceRoutes);
app.use("/chat", chatRoutes);
app.use("/upload", uploadRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GovPath Backend Running Successfully",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});