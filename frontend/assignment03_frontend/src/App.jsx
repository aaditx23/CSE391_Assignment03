import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/navbar';
import UserPanel from '../pages/UserPanel';
import AdminPage from '../pages/AdminPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/appointment" element={
            <Container fluid>
              <UserPanel />
            </Container>
          } />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

    </BrowserRouter>
  );
}

export default App;
