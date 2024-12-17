import { useState, useEffect } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';

function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    carLicense: '',
    carEngine: '',
    date: '',
    mechanicName: ''
  });

  const [mechId, setMechId] = useState('')
  const [mechanics, setMechanics] = useState([]);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mechanics');
        const data = await response.json();
        setMechanics(data);
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      }
    };

    fetchMechanics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mechanicName') {
      const selectedMechanic = mechanics.find((mechanic) => mechanic.name === value);
      setMechId(selectedMechanic ? selectedMechanic.mechanicId : '');
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      console.log("FORM DATA", formData);
      console.log("MECH ID", mechId);
  
      const mechanicResponse = await fetch(`http://localhost:5000/api/mechanics/${mechId}`);
      const mechanic = await mechanicResponse.json();
  
      if (mechanicResponse.ok) {

        const isMechanicAvailable = await checkMechanicAvailability(mechanic, formData.date);
        
        if (!isMechanicAvailable) {
          setError('Mechanic is not available on the selected date.');
          return;
        }
  
        // Step 3: Submit the appointment
        const response = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        const result = await response.json();
  
        if (response.ok) {
          const appointmentId = result.id;
  
          const updatedAppointmentIds = [...mechanic.appointmentIds, appointmentId];
          console.log("NEW ARRAY", updatedAppointmentIds);
  
          const updateMechanicResponse = await fetch(`http://localhost:5000/api/mechanics/${mechId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appointmentIds: updatedAppointmentIds
            })
          });
  
          const updateResult = await updateMechanicResponse.json();
  
          if (updateMechanicResponse.ok) {
            alert('Appointment successfully created and mechanic updated!');
            setFormData({
              name: '',
              address: '',
              phone: '',
              carLicense: '',
              carEngine: '',
              date: '',
              mechanicName: ''
            });
          } else {
            setError('Failed to update mechanic.');
          }
        } else {
          setError(result.message);
        }
      } else {
        setError('Mechanic not found.');
      }
    } catch (error) {
      setError('An error occurred while submitting the form.');
    }
  };
  

  const checkMechanicAvailability = async (mechanic, selectedDate) => {
    if (mechanic.appointmentIds && mechanic.appointmentIds.length > 0) {
      for (const appointmentId of mechanic.appointmentIds) {
        const appointmentResponse = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`);
        const appointment = await appointmentResponse.json();
        const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
  
        if (appointmentDate === selectedDate) {
          return false;
        }
      }
    }
    return true;
  };
  
  

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Book an Appointment</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Name */}
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        {/* Address */}
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address:</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        {/* Phone */}
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
            />
          </Form.Group>
        </Col>

        {/* Car License Number */}
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="carLicense">
            <Form.Label>Car License Number:</Form.Label>
            <Form.Control
              type="text"
              name="carLicense"
              value={formData.carLicense}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        {/* Car Engine Number */}
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="carEngine">
            <Form.Label>Car Engine Number:</Form.Label>
            <Form.Control
              type="text"
              name="carEngine"
              value={formData.carEngine}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        {/* Appointment Date */}
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Appointment Date:</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
            />
          </Form.Group>
        </Col>

        {/* Mechanic */}
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="mechanicName">
            <Form.Label>Mechanic:</Form.Label>
            <Form.Control
              as="select"
              name="mechanicName"
              value={formData.mechanicName}
              onChange={handleChange}
              required
            >
              <option value="">Select a Mechanic</option>
              {mechanics.map((mechanic) => {
                return (
                  <option key={mechanic.mechanicName} value={mechanic.mechanicName}>
                    {mechanic.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Submit Button */}
        <div className="d-grid">
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AppointmentForm;