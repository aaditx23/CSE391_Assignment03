const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

// Define Routes
router.post("/appointments", appointmentController.createAppointment);
router.get("/appointments", appointmentController.getAppointments); 
router.get("/appointments/:appointmentId", appointmentController.getAppointmentById);
router.get("/appointments/by-date", appointmentController.getAppointmentsByDate);
router.patch("/appointments/:appointmentId", appointmentController.updateAppointment);
router.delete("/appointments/:appointmentId", appointmentController.deleteAppointment);
router.get("/appointments/:date", appointmentController.getClientAppointments);
router.get("/appointments/mechanic", appointmentController.getMechanicAppointments); 

module.exports = router;
