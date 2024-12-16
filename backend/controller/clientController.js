// backend/controller/clientController.js

const { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const db = require("../firebaseConfig");
const Client = require("../schema/Client");

// Create a new client
async function createClient(req, res) {
  try {
    const clientData = new Client(req.body).toPlainObject();
    const docRef = await addDoc(collection(db, "clients"), clientData);
    res.status(201).json({ success: true, message: "Client created successfully.", clientId: docRef.id });
  } catch (error) {
    console.error("Error creating client:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Get all clients
async function getClients(req, res) {
  try {
    const snapshot = await getDocs(collection(db, "clients"));
    const clients = snapshot.docs.map((doc) => ({ clientId: doc.id, ...doc.data() }));
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Get a single client by ID
async function getClientById(req, res) {
  try {
    const clientId = req.params.clientId;
    const clientDocRef = doc(db, "clients", clientId);
    const clientDoc = await getDoc(clientDocRef);
    if (clientDoc.exists()) {
      res.status(200).json({ clientId: clientDoc.id, ...clientDoc.data() });
    } else {
      res.status(404).json({ error: "Client not found." });
    }
  } catch (error) {
    console.error("Error fetching client by ID:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Update a client by ID
async function updateClient(req, res) {
  try {
    const clientId = req.params.clientId;
    const clientData = new Client(req.body).toPlainObject();
    const clientDocRef = doc(db, "clients", clientId);
    await updateDoc(clientDocRef, clientData);
    res.status(200).json({ success: true, message: "Client updated successfully." });
  } catch (error) {
    console.error("Error updating client:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Delete a client by ID
async function deleteClient(req, res) {
  try {
    const clientId = req.params.clientId;
    const clientDocRef = doc(db, "clients", clientId);
    await deleteDoc(clientDocRef);
    res.status(200).json({ success: true, message: "Client deleted successfully." });
  } catch (error) {
    console.error("Error deleting client:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};
