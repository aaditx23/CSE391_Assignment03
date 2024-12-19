import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

function AppointmentDialog({ appointment, onClose, onSave, mechanicsList }) {
  const [formData, setFormData] = useState({
    name: appointment.name || '',
    phone: appointment.phone || '',
    carLicense: appointment.carLicense || '',
    date: appointment.date || '', 
    mechanicName: appointment.mechanicName || '',
  });


const [error, setError] = useState('');
const [mechanic, setMechanic] = useState(appointment.mechanicName);
const [date, setDate] = useState(new Date(appointment.date).toISOString().split('T')[0]);
const [prevMechanicId, setPrevMechanicId] = useState();
const [newMechanicId, setNewMechanicId] = useState();
const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false)

useEffect(() => {
  const fetchMechanics = async () => {
    try {
      const response = await fetch(`https://cse391a03backend.vercel.app/api/mechanics`);
      if (!response.ok) throw new Error('Failed to fetch mechanics');
      const data = await response.json();

      const matchedMechanic = data.find(mechanic => mechanic.name === appointment.mechanicName);
      if (matchedMechanic) {
        setPrevMechanicId(matchedMechanic.mechanicId);
      }
      else{
        console.log("NOT FOUND")
      }
    } catch (error) {
      console.error('Error fetching mechanics:', error.message);
    } finally {
      
    }
  };

  fetchMechanics();
}, []);

useEffect(() => {
  
      console.log(prevMechanicId)
      if(prevMechanicId && !isSaving){
        setIsLoading(false);
      }
  const matchedMechanic = mechanicsList.find(mechanicObj => mechanicObj.name === mechanic);
  if (matchedMechanic) {
    setNewMechanicId(matchedMechanic.mechanicId);
  }
}, [mechanic, mechanicsList]);
  

  const handleSave = async (e) => {
    
    e.preventDefault();
    setError('');
    setIsSaving(true)
    setIsLoading(true)
    if(prevMechanicId !== newMechanicId ){
      const selectedMechanic = mechanicsList.find((mech) => mech.mechanicId === newMechanicId);
      if (selectedMechanic) {
        const freeSlots = 4 - selectedMechanic.appointmentIds.filter(
          (appt) => appt.date === date
        ).length;
    
        if (freeSlots <= 0) {
          setError('The selected mechanic is fully booked on the chosen date.');
          return;
        }
      }
    }
    
  
    try {
      
      if(prevMechanicId !== newMechanicId && prevMechanicId && newMechanicId){
        if (prevMechanicId) {
          const prevMechanic = mechanicsList.find(mechanic => mechanic.mechanicId === prevMechanicId);
          if (prevMechanic) {
            const updatedPrevMechanic = {
              ...prevMechanic,
              appointmentIds: prevMechanic.appointmentIds.filter(id => id !== appointment.id),
            };
    
            await fetch(`https://cse391a03backend.vercel.app/api/mechanics/${prevMechanicId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedPrevMechanic),
            });
          }
        }
    
        if (newMechanicId) {
          const newMechanic = mechanicsList.find(mechanic => mechanic.mechanicId === newMechanicId);
          if (newMechanic) {
            const updatedNewMechanic = {
              ...newMechanic,
              appointmentIds: [...newMechanic.appointmentIds, appointment.id],
            };
    
            await fetch(`https://cse391a03backend.vercel.app/api/mechanics/${newMechanicId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedNewMechanic),
            });
          }
        }
      }
  
      const response = await fetch(`https://cse391a03backend.vercel.app/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date,
          mechanicName: mechanic,
        }),
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

  if (isLoading) {
    if(isSaving){
      return (
        <Modal show onHide={onClose} centered>
          <Modal.Body className="text-center">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Updating Appointment Details</p>
          </Modal.Body>
        </Modal>
      );
    }
    else{
      return (
        <Modal show onHide={onClose} centered>
          <Modal.Body className="text-center">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading appointment details...</p>
          </Modal.Body>
        </Modal>
      );
    }
    
  }

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
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="carLicense">
            <Form.Label>Car License Number</Form.Label>
            <Form.Control
              type="text"
              name="carLicense"
              value={formData.carLicense}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Appointment Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)} 
              min={today}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="mechanicId">
            <Form.Label>Mechanic</Form.Label>
            <Form.Select
              name="mechanicId"
              value={mechanic}
              onChange={(e) => 
                setMechanic(e.target.value)
              } 
              required
            >
              <option value="">Select a Mechanic</option>
              {mechanicsList.map((mechanic) => {
                const freeSlots = 4 - mechanic.appointmentIds.length;
                const isDisabled = freeSlots === 0;

                return (
                  <option
                    key={mechanic.mechanicId}
                    value={mechanic.name}
                    disabled={isDisabled}
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
