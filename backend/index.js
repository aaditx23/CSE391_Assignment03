const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const appointmentRoutes = require("./routes/appointmentRoutes");
const clientRoutes = require("./routes/clientRoutes")
const mechanicRoutes = require("./routes/mechanicRoutes")



// Initialize Express
const app = express();

// Middleware
app.use(express.json());
// Routes
app.use("/api", appointmentRoutes);
app.use("/api", clientRoutes)
app.use("/api", mechanicRoutes)

// Create and Start Server
const PORT = 5000;
http.createServer(app).listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
