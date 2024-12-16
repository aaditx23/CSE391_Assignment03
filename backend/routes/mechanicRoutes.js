const express = require("express");
const router = express.Router();
const mechanicController = require("../controller/mechanicController");

router.post("/mechanics", mechanicController.createMechanic);
router.get("/mechanics", mechanicController.getMechanics);
router.put("/mechanics/:id", mechanicController.updateMechanic);
router.delete("/mechanics/:id", mechanicController.deleteMechanic);

module.exports = router;
