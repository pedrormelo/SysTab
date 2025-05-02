const express = require('express');
const router = express.Router();
const chamadosController = require('../controllers/chamadosController');

router.post('/', chamadosController.criarChamado);
router.get('/', chamadosController.listarChamado);


module.exports = router;
