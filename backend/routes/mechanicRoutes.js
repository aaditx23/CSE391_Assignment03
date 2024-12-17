const express = require("express");
const router = express.Router();
const mechanicController = require("../controller/mechanicController");

router.post("/mechanics", mechanicController.createMechanic);
router.get("/mechanics", mechanicController.getMechanics);
router.get("/mechanics/:id", mechanicController.getMechanicById);
router.patch("/mechanics/:id", mechanicController.updateMechanic);
router.delete("/mechanics/:id", mechanicController.deleteMechanic);

module.exports = router;
