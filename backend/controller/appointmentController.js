// backend/controllers/appointmentController.js

const { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } = require("firebase/firestore");
const db = require("../firebaseConfig");
const Appointment = require("../schema/Appointment");

// Create a new appointment
async function createAppointment(req, res) {
  try {
    const appointmentData = new Appointment(req.body).toPlainObject();
    const docRef = await addDoc(collection(db, "appointments"), appointmentData);
    
    res.status(201).json({
      success: true,
      message: "Appointment created successfully.",
      id: docRef.id
    });
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Get all appointments
async function getAppointments(req, res) {
  try {
    const snapshot = await getDocs(collection(db, "appointments"));
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Get appointment by ID
async function getAppointmentById(req, res) {
  try {
    const { appointmentId } = req.params;
    const docRef = doc(db, "appointments", appointmentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).json({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).json({ error: "Appointment not found." });
    }
  } catch (error) {
    console.error("Error fetching appointment by ID:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Get appointments by date
async function getAppointmentsByDate(req, res) {
  try {
    const { date } = req.query;
    const q = query(collection(db, "appointments"), where("date", "==", date));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(appointments);
    } else {
      res.status(404).json({ error: "No appointments found for the selected date." });
    }
  } catch (error) {
    console.error("Error fetching appointments by date:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}


async function updateAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const { date, mechanicName } = req.body;
    console.log(date, mechanicName)
    
    const docRef = doc(db, "appointments", appointmentId);
    
    // Update the document with the provided data
    await updateDoc(docRef, 
      {
        date: date,
        mechanicName: mechanicName
      }
    );

    res.status(200).json({ success: true, message: "Appointment updated successfully." });
  } catch (error) {
    console.error("Error updating appointment:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}


// Delete an appointment
async function deleteAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const docRef = doc(db, "appointments", appointmentId);
    
    // Delete the document
    await deleteDoc(docRef);
    
    res.status(200).json({ success: true, message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Get appointments by client on a specific date
async function getClientAppointments(req, res) {
  try {
    const { date } = req.query;
    const q = query(
      collection(db, "appointments"),
      where("date", "==", date)
    );
    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching client appointments:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Get appointments by mechanic on a specific date
async function getMechanicAppointments(req, res) {
  try {
    const { mechanicId, date } = req.query;
    const q = query(
      collection(db, "appointments"),
      where("mechanicId", "==", mechanicId),
      where("date", "==", date)
    );
    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching mechanic appointments:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getAppointmentsByDate,
  updateAppointment,
  deleteAppointment,
  getClientAppointments,
  getMechanicAppointments
};
