import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function HelpInfo() {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>Help Information</h5>
      </Card.Header>
      <Card.Body>
        <p>Below is the approved format for filling out the form:</p>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Name:</strong> Enter your full name (e.g., John Doe).
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Address:</strong> Enter your complete address (e.g., 123 Main St, City, State, ZIP).
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Phone:</strong> Enter a 11-digit phone number (e.g., 12345678901). No dashes or spaces.
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Car License Number:</strong> Enter the car's license plate number (e.g., ABC1234).
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Car Engine Number:</strong> Enter the engine number of your car as shown on the registration (e.g., 1234XYZ5678).
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Appointment Date:</strong> Select a valid date for your appointment (must be today or later).
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Mechanic:</strong> Select a mechanic from the list. Only available mechanics with free slots are shown.
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default HelpInfo;
