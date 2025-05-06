const express = require('express');
const router = express.Router();
const chamadosController = require('../controllers/chamadosController');

router.post('/', chamadosController.criarChamado); 
router.get('/atrasados', chamadosController.listarChamadosAtrasados); 
router.get('/', chamadosController.listarChamados); 
router.get('/gerar-os/:id/:tipo', chamadosController.gerarOS); 
router.get('/:id', chamadosController.listarChamadoPorTablet); 
router.get('/id/:id', chamadosController.buscarChamadoPorIdChamado); 
router.put('/:id', chamadosController.atualizarChamado); 
router.delete('/:id', chamadosController.deletarChamado); 
router.patch('/:id/fechar', chamadosController.fecharChamado); 
//router.get('/relatorio', chamadosController.gerarRelatorio);


console.log('Chamados routes loaded!');
module.exports = router;

