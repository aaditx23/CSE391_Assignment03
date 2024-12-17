import React, { useState, useEffect } from 'react';
import AppointmentDialog from './appointmentDialog';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    // Fetch appointments from the server
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment to open the dialog
  };

  const handleDialogClose = () => {
    setSelectedAppointment(null); // Close the dialog by setting the selectedAppointment to null
  };

  const handleSave = (updatedAppointment) => {
    // Update the list with the saved changes
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.appointmentId === updatedAppointment.appointmentId
          ? updatedAppointment
          : appointment
      )
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Appointments List</h2>

      {/* Show message if appointments are empty */}
      {appointments.length === 0 ? (
        <p className="text-center">No appointments available.</p>
      ) : (
        <ul className="list-group">
          {appointments.map((appointment) => (
            <li
              key={appointment.appointmentId}
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={() => handleAppointmentClick(appointment)}
              style={{ cursor: 'pointer' }}
            >
              <span>
                {appointment.name} - {appointment.carLicense}
              </span>
            </li>
          ))}
        </ul>
      )}

      {selectedAppointment && (
        <AppointmentDialog
          appointment={selectedAppointment}
          onClose={handleDialogClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AppointmentList;
