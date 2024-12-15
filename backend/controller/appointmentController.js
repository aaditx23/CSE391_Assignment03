const AppointmentSchema = require("../schema/appointmentSchema");
const appointmentModel = require("../model/appointmentModel");

async function createAppointment(req, res) {
  try {
    // Validate and construct data using the schema
    const appointmentData = new AppointmentSchema(req.body);

    // Check if client already has an appointment
    const clientAppointments = await appointmentModel.getClientAppointments(appointmentData.clientId, appointmentData.date);
    if (clientAppointments.length > 0) {
      return res.status(400).json({ error: "Client already has an appointment on this date." });
    }

    // Check if mechanic is fully booked
    const mechanicAppointments = await appointmentModel.getMechanicAppointments(appointmentData.mechanicId, appointmentData.date);
    if (mechanicAppointments.length >= appointmentModel.MAX_APPOINTMENTS_PER_MECHANIC) {
      return res.status(400).json({ error: "Selected mechanic is fully booked." });
    }

    // Create the appointment
    const newAppointmentId = await appointmentModel.createAppointment(appointmentData);
    res.status(201).json({ success: true, message: "Appointment created successfully.", id: newAppointmentId });
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getAppointments(req, res) {
  try {
    const appointments = await appointmentModel.getAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  createAppointment,
  getAppointments
};
