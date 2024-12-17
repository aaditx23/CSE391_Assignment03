import React from 'react';
import AppointmentList from '../components/appointmentList';  // Import the AppointmentList component

function AdminPage() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Admin - Manage Appointments</h1>
      <AppointmentList />  {/* Display the list of appointments */}
    </div>
  );
}

export default AdminPage;
