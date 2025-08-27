const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');

router.get('/fornecedores', fornecedorController.getFornecedor);
router.post('/fornecedores', fornecedorController.createFornecedor);
router.put('/fornecedores/:id', fornecedorController.updateFornecedor);
router.delete('/fornecedores/:id', fornecedorController.deleteFornecedor);

module.exports = router;
