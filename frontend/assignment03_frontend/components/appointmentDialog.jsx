import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function AppointmentDialog({ appointment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: appointment.name || '',
    phone: appointment.phone || '',
    carLicense: appointment.carLicense || '',
    date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
    mechanicName: appointment.mechanicName || '',
  });

  const [mechanics, setMechanics] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mechanics');
        if (!response.ok) throw new Error('Failed to fetch mechanics');
        const data = await response.json();
        setMechanics(data);
      } catch (error) {
        console.error('Error fetching mechanics:', error.message);
      }
    };

    fetchMechanics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    // Validate if the selected mechanic has a free slot on the selected date
    const selectedMechanic = mechanics.find((mech) => mech.mechanicId === formData.mechanicName);
    if (selectedMechanic) {
      const freeSlots = 4 - selectedMechanic.appointmentIds.filter(
        (appt) => appt.date === formData.date
      ).length;

      if (freeSlots <= 0) {
        setError('The selected mechanic is fully booked on the chosen date.');
        return;
      }
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
        onClose();
      } else {
        setError(result.message || 'Failed to update the appointment.');
      }
    } catch (error) {
      setError('An error occurred while saving the appointment.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="carLicense">
            <Form.Label>Car License Number</Form.Label>
            <Form.Control
              type="text"
              name="carLicense"
              value={formData.carLicense}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Appointment Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="mechanicId">
            <Form.Label>Mechanic</Form.Label>
            <Form.Select
              name="mechanicId"
              value={formData.mechanicName}
              onChange={handleChange}
              required
            >
              <option value="">Select a Mechanic</option>
              {mechanics.map((mechanic) => {
                const freeSlots = 4 - mechanic.appointmentIds.length;
                const isDisabled = freeSlots === 0;
                console.log(appointment.mechanicName)

                return (
                  <option
                    key={mechanic.mechanicId}
                    value={mechanic.name}
                    disabled={isDisabled}
                    selected={mechanic.name === appointment.mechanicName}
                  >
                    {mechanic.name}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AppointmentDialog;
