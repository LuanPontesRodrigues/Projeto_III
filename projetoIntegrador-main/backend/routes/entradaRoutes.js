const express = require("express");
const router = express.Router();
const entradaController = require("../controllers/entradaController");
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get("/", entradaController.getEntradas);
router.post("/", entradaController.createEntrada);
router.put("/:id", entradaController.updateEntrada);
router.delete("/:id", entradaController.deleteEntrada);

module.exports = router;
