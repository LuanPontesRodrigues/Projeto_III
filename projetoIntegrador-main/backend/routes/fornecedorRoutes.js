const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');

router.get('/', fornecedorController.getFornecedor);
router.post('/', fornecedorController.createFornecedor);
router.put('/:id', fornecedorController.updateFornecedor);
router.delete('/:id', fornecedorController.deleteFornecedor);

module.exports = router;
