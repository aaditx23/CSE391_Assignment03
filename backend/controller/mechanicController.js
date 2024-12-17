const { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } = require("firebase/firestore");
const db = require("../firebaseConfig"); 
const Mechanic = require("../schema/Mechanic")

// Create a new mechanic
async function createMechanic(req, res) {
  try {
    const mechanicData = new Mechanic(req.body).toPlainObject();
    const docRef = await addDoc(collection(db, "mechanics"), mechanicData);
    res.status(201).json({ success: true, message: "Mechanic created successfully", mechanicId: docRef.id });
  } catch (error) {
    console.error("Error creating mechanic:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Get all mechanics
async function getMechanics(req, res) {
  try {
    const snapshot = await getDocs(collection(db, "mechanics"));
    const mechanics = snapshot.docs.map((doc) => ({ mechanicId: doc.id, ...doc.data() }));
    res.status(200).json(mechanics);
  } catch (error) {
    console.error("Error fetching mechanics:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Get mechanic by ID
async function getMechanicById(req, res) {
  const { id } = req.params; // Get the id from the request parameters

  try {
    const mechanicRef = doc(db, "mechanics", id); // Reference to the mechanic document
    const mechanicSnapshot = await getDoc(mechanicRef);

    if (mechanicSnapshot.exists()) {
      // If the mechanic document exists, return the mechanic data
      res.status(200).json({ id: mechanicSnapshot.id, ...mechanicSnapshot.data() });
    } else {
      // If the mechanic is not found
      res.status(404).json({ error: "Mechanic not found" });
    }
  } catch (error) {
    console.error("Error fetching mechanic by ID:", error.message);
    res.status(500).json({ error: error.message });
  }
}


// Update a mechanic by ID
async function updateMechanic(req, res) {
  const { id } = req.params;
  const mechanicData = req.body;
  try {
    const mechanicRef = doc(db, "mechanics", id);
    await updateDoc(mechanicRef, mechanicData);
    res.status(200).json({ success: true, message: "Mechanic updated successfully" });
  } catch (error) {
    console.error("Error updating mechanic:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Delete a mechanic by ID
async function deleteMechanic(req, res) {
  const { id } = req.params;
  try {
    const mechanicRef = doc(db, "mechanics", id);
    await deleteDoc(mechanicRef);
    res.status(200).json({ success: true, message: "Mechanic deleted successfully" });
  } catch (error) {
    console.error("Error deleting mechanic:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createMechanic,
  getMechanics,
  getMechanicById,
  updateMechanic,
  deleteMechanic
};
