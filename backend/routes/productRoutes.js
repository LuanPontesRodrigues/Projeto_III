const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/produtos', productController.getProducts);
router.post('/produtos', productController.createProduct);
router.put('/produtos/:id', productController.updateProduct);
router.delete('/produtos/:id', productController.deleteProduct);
router.get('/estoque', productController.getEstoque);


module.exports = router;
