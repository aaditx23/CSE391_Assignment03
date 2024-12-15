const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const appointmentRoutes = require("./routes/appointmentRoutes");

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json());
// Routes
app.use("/api", appointmentRoutes);

// Create and Start Server
const PORT = 5000;
http.createServer(app).listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
