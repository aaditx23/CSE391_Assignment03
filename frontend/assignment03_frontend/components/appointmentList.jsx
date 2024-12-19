import React, { useState, useEffect } from 'react';
import { ListGroup, Alert, Spinner } from 'react-bootstrap';
import AppointmentDialog from '../components/appointmentDialog';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch appointments and handle errors
  const fetchAppointments = async () => {
    setLoading(true); // Set loading state to true when fetching starts
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Error fetching appointments: ' + err.message);
    } finally {
      setLoading(false); // Set loading state to false after the fetch completes
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleDialogClose = () => {
    setSelectedAppointment(null);
  };

  // Triggered when appointment is updated in AppointmentDialog
  const handleSave = async (updatedAppointment) => {
    setLoading(true); // Start loading when updating the appointment
    try {
      // Directly trigger data fetching after update
      await fetchAppointments(); // Fetch appointments after the update
    } catch (error) {
      setError('Error updating appointments: ' + error.message);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    fetchAppointments(); // Initial fetch when component mounts
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Appointments List</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading appointments...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : appointments.length === 0 ? (
        <p className="text-center">No appointments available.</p>
      ) : (
        <ListGroup>
          {appointments.map((appointment) => (
            <ListGroup.Item
              key={appointment.appointmentId}
              className="d-flex justify-content-between align-items-center"
              onClick={() => handleAppointmentClick(appointment)}
              style={{ cursor: 'pointer' }}
            >
              <span>
                {appointment.name} - {appointment.carLicense}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
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
