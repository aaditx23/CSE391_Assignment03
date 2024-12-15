const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

// Define Routes
router.post("/appointments", appointmentController.createAppointment);
router.get("/allAppointments", appointmentController.getAppointments);

module.exports = router;
