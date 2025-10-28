const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// ✅ Corrigido — a rota agora é apenas "/"
router.post('/', vendasController.createVenda);
router.get('/', vendasController.getVendas);

module.exports = router;
