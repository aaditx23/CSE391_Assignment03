import {React, useState, useEffect} from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import MechanicsList from '../components/mechanicList';
import AppointmentForm from '../components/appointmentForm';
import HelpInfo from '../components/helpInfo'; // If you want to include the help info

function UserPanel() {
  const [mechanics, setMechanics] = useState([]);

  // Function to update mechanics list
  const updateMechanics = (newMechanics) => {
    setMechanics(newMechanics);
  };
  return (
    <Container fluid style={{ minHeight: '100vh',width:'100vw',display: 'flex', justifyContent: 'center',overflowY: 'auto', marginTop: '70px' }}>
      <Col  style={{justifyContent: 'center',}} >
        <div className="text-center mb-4">
          <h1>User Panel</h1>
        </div>
        
        <Row className="justify-content-center">
          <Col md={3} className="mb-4">
            <Card>
              <Card.Body>
                <MechanicsList updateMechanics={updateMechanics} />
              </Card.Body>
            </Card>
          </Col>

          <Col md={5} className="mb-4">
            <Card>
              <Card.Body>
                <AppointmentForm mechanicsList={mechanics }/>
              </Card.Body>
            </Card>
          </Col>

          {/* Help Info */}
          <Col md={3} className="mb-4">
            <HelpInfo />
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

export default UserPanel;
