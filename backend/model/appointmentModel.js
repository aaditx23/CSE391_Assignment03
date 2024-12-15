// backend/model/appointmentModel.js

const db = require("../firebaseConfig");
const { collection, addDoc, getDocs, query, where } = require("firebase/firestore");

const MAX_APPOINTMENTS_PER_MECHANIC = 4;

// Get all appointments
async function getAppointments() {
  const snapshot = await getDocs(collection(db, "appointments"));
  return snapshot.docs.map(doc => doc.data());
}


// Get appointments by client on a specific date
async function getClientAppointments(clientId, date) {
  const q = query(
    collection(db, "appointments"),
    where("clientId", "==", clientId),
    where("date", "==", date)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

// Get appointments by mechanic on a specific date
async function getMechanicAppointments(mechanicId, date) {
  const q = query(
    collection(db, "appointments"),
    where("mechanicId", "==", mechanicId),
    where("date", "==", date)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

// Create a new appointment
async function createAppointment(data) {
  const docRef = await addDoc(collection(db, "appointments"), data);
  return docRef.id;
}

module.exports = {
  getAppointments,
  getClientAppointments,
  getMechanicAppointments,
  createAppointment,
  MAX_APPOINTMENTS_PER_MECHANIC
};
