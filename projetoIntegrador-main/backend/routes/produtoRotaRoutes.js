const express = require('express');
const router = express.Router();
const produtoRotaController = require('../controllers/produtoRotaController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', produtoRotaController.getProdutosEmRota);
router.post('/', produtoRotaController.createProdutoEmRota);
router.patch('/:id/status', produtoRotaController.marcarComoRecebido);
router.delete('/:id', produtoRotaController.deleteProdutoEmRota);

module.exports = router;
