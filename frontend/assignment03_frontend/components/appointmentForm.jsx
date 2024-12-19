import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Col } from 'react-bootstrap';

function AppointmentForm({mechanicsList}) {
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
  const mechanics = mechanicsList
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // useEffect(() => {
  //   // const fetchMechanics = async () => {
  //   //   try {
  //   //     const response = await fetch('https://cse391a03backend.vercel.app/api/mechanics');
  //   //     const data = await response.json();
  //   //     setMechanics(data);
  //   //   } catch (error) {
  //   //     console.error('Error fetching mechanics:', error);
  //   //   }
  //   // };

  //   // fetchMechanics();
  //   setMechanics(mechanicsList)
  //   console.log(mechanics)
  // }, []);

  const handleChange = (e) => {
    
    const { name, value } = e.target;
    console.log(name, value)

    if (name === 'mechanicName') {
      const selectedMechanic = mechanics.find((mechanic) => mechanic.name === value);
      setMechId(selectedMechanic ? selectedMechanic.mechanicId : '');
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    setError('');
  
    try {
      console.log("FORM DATA", formData);
      console.log("MECH ID", mechId);
  
      // Step 1: Fetch all appointments for the given date
      const appointmentsResponse = await fetch(`https://cse391a03backend.vercel.app/api/appointments?date=${formData.date}`);
      const appointments = await appointmentsResponse.json();
  
      if (appointmentsResponse.ok) {
        const clientHasAppointment = appointments.some(
          (appointment) => appointment.name === formData.name && appointment.mechanicId !== mechId
        );
  
        if (clientHasAppointment) {
          setError('You already have an appointment with another mechanic on the selected date.');
          return;
        }
  
        const response = await fetch('https://cse391a03backend.vercel.app/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        const result = await response.json();
  
        if (response.ok) {
          const appointmentId = result.id;
  
          const mechanicResponse = await fetch(`https://cse391a03backend.vercel.app/api/mechanics/${mechId}`);
          const mechanic = await mechanicResponse.json();
  
          if (mechanicResponse.ok) {
            const updatedAppointmentIds = [...mechanic.appointmentIds, appointmentId];
            console.log("NEW ARRAY", updatedAppointmentIds);
  
            const updateMechanicResponse = await fetch(`https://cse391a03backend.vercel.app/api/mechanics/${mechId}`, {
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
            setError('Mechanic not found.');
          }
        } else {
          setError(result.message);
        }
      } else {
        setError('Failed to fetch appointments.');
      }
    } catch (error) {
      setError('An error occurred while submitting the form.');
    }
    setIsLoading(false)
  };
  

  // const checkMechanicAvailability = async (mechanic, selectedDate) => {
  //   if (mechanic.appointmentIds && mechanic.appointmentIds.length > 0) {
  //     for (const appointmentId of mechanic.appointmentIds) {
  //       const appointmentResponse = await fetch(`https://cse391a03backend.vercel.app/api/appointments/${appointmentId}`);
  //       const appointment = await appointmentResponse.json();
  //       const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
  
  //       if (appointmentDate === selectedDate) {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // };
  
  

  const today = new Date().toISOString().split('T')[0];

  if(isLoading){
    return (
      <Modal show centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Updating Appointment Details</p>
        </Modal.Body>
      </Modal>
    );
  }

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
              pattern="[0-9]{11}"
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
                  <option 
                  key={mechanic.mechanicName} 
                  value={mechanic.mechanicName}
                  disabled={mechanic.appointmentIds.length >= 4}
                  >
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
