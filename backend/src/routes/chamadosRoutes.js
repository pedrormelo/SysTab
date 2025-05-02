const express = require('express');
const router = express.Router();
const chamadosController = require('../controllers/chamadosController');

router.post('/', chamadosController.criarChamado);
router.get('/', chamadosController.listarChamado);
router.get('/:id', chamadosController.listarChamadoPorId);
router.put('/:id', chamadosController.atualizarChamado);
router.delete('/:id', chamadosController.deletarChamado);
router.patch('/:id/fechar', chamadosController.atualizarStatus);
router.get('/:id/pdf', chamadosController.gerarOS);

console.log('Chamados routes loaded!');

module.exports = router;
