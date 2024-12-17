// backend/routes/clientRoutes.js

const express = require("express");
const router = express.Router();
const clientController = require("../controller/clientController");

// Define Routes
router.post("/clients", clientController.createClient);
router.get("/clients", clientController.getClients); 
router.get("/clients/:clientId", clientController.getClientById);
router.patch("/clients/:clientId", clientController.updateClient);
router.delete("/clients/:clientId", clientController.deleteClient);

module.exports = router;
