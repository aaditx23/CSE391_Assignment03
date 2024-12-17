import React, { useState, useEffect } from 'react';

function AppointmentDialog({ appointment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: appointment.name || '',
    phone: appointment.phone || '',
    carLicense: appointment.carLicense || '',
    date: appointment.date || '',
    mechanicId: appointment.mechanicId || ''
  });

  const [mechanics, setMechanics] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [mechanicName, setMechanicName] = useState('');  // To store mechanic's name

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mechanics');
        const data = await response.json();
        setMechanics(data);

        // Find the mechanic's name based on the mechanicId
        const selectedMechanic = data.find(mechanic => mechanic.mechanicId === appointment.mechanicId);
        if (selectedMechanic) {
          setMechanicName(selectedMechanic.name);
        }
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchMechanics();
    fetchAppointments();
  }, [appointment.mechanicId]);  // Re-fetch mechanics if the mechanicId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If mechanic is changed, update mechanicName
    if (name === 'mechanicId') {
      const selectedMechanic = mechanics.find(mechanic => mechanic.mechanicId === value);
      setMechanicName(selectedMechanic ? selectedMechanic.name : '');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    // Check if mechanic is available on selected date
    const mechanicAppointments = appointments.filter(
      (appointment) => appointment.mechanicId === formData.mechanicId
    );

    const isDateTaken = mechanicAppointments.some(
      (appointment) => appointment.date === formData.date
    );

    if (isDateTaken) {
      setError('This mechanic is not available on the selected date.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointment.appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        onSave(result);
        onClose(); // Close the dialog on success
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred while saving the appointment.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Appointment</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="carLicense" className="form-label">Car License Number:</label>
                <input
                  type="text"
                  id="carLicense"
                  name="carLicense"
                  className="form-control"
                  value={formData.carLicense}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Appointment Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mechanicId" className="form-label">Mechanic:</label>
                <select
                  id="mechanicId"
                  name="mechanicId"
                  className="form-select"
                  value={formData.mechanicId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Mechanic</option>
                  {mechanics.map((mechanic) => {
                    const freeSlots = 4 - mechanic.appointmentIds.length;
                    const isDisabled = freeSlots === 0;

                    return (
                      <option
                        key={mechanic.mechanicId}
                        value={mechanic.mechanicId}
                        disabled={isDisabled}
                        style={{ backgroundColor: isDisabled ? '#d6d6d6' : 'transparent' }}
                      >
                        {mechanic.name} - Free Slots: {freeSlots}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDialog;
