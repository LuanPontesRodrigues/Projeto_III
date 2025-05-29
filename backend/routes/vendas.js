const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

router.post('/vendas', vendasController.createVenda);
router.get('/vendas', vendasController.getVendas);

module.exports = router;
