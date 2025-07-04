
const express = require('express');
const router = express.Router();
const chamadosController = require('../controllers/chamadosController');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

router.post('/', auth, admin, chamadosController.criarChamado);
router.get('/atrasados', auth, chamadosController.listarChamadosAtrasados);
router.get('/', auth, chamadosController.listarChamados);
router.get('/gerar-os/:id/:tipo', auth, chamadosController.gerarOS);
router.get('/tablet/:id', auth, chamadosController.listarPorTablet);
router.get('/id/:id', auth, chamadosController.buscarChamadoPorIdChamado);
router.put('/:id', auth, admin, chamadosController.atualizarChamado);
router.delete('/:id', auth, admin, chamadosController.deletarChamado);
router.patch('/:id/fechar', auth, admin, chamadosController.fecharChamado);
router.patch('/:id/reabrir', auth, admin, chamadosController.reabrirChamado);
//router.get('/relatorio', chamadosController.gerarRelatorio);

console.log('Chamados routes loaded!');

module.exports = router;

