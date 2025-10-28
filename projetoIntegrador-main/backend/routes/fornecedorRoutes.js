const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', fornecedorController.getFornecedor);
router.post('/', fornecedorController.createFornecedor);
router.put('/:id', fornecedorController.updateFornecedor);
router.delete('/:id', fornecedorController.deleteFornecedor);

module.exports = router;
