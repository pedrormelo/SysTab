const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.cadastrarUser);
router.get('/', usersController.listarUsers);
router.put('/:id', usersController.editarUser);
router.delete('/:id', usersController.deletarUser);

console.log('Users routes loaded!');

module.exports = router;
