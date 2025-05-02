const express = require('express');
const router = express.Router();
const tabletsController = require('../controllers/tabletsController');

router.post('/', tabletsController.criarTablet);
router.get('/', tabletsController.listarTablets);
router.get('/:id', tabletsController.buscarTabletPorId);
router.put('/:id', tabletsController.atualizarTablet);
router.delete('/:id', tabletsController.deletarTablet);

console.log('Tablets routes loaded!');

module.exports = router;
