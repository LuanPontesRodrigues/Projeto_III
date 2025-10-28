const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get("/", clienteController.getClientes);
router.post("/", clienteController.createCliente);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

module.exports = router;
