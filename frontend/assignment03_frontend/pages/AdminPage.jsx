import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AppointmentList from '../components/appointmentList';
import MechanicsList from '../components/mechanicList';

function AdminPage() {
  return (
    <Container fluid style={{ minHeight: '100vh',width:'100vw',display: 'flex', justifyContent: 'center',overflowY: 'auto', marginTop: '70px' }}>
      

      <Col style={{justifyContent: 'center'}} >
        <div className="d-flex justify-content-center align-items-center" style={{ height: '20vh' }}>
          <h1 className="text-center w-100">Admin</h1>
        </div>
        <Row className="justify-content-center">
          <Col md={5} className="mb-4">
            {/* Card for Appointments */}
            <Card>
              <Card.Header>Appointments</Card.Header>
              <Card.Body>
                <AppointmentList />
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-4">
            {/* Card for Mechanics */}
            <Card>
              <Card.Header>Mechanics</Card.Header>
              <Card.Body>
                <MechanicsList />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

export default AdminPage;
