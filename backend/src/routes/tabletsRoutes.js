const express = require('express');
const router = express.Router();
const tabletsController = require('../controllers/tabletsController');

router.post('/', tabletsController.criarTablet);
router.get('/', tabletsController.listarTablets);


module.exports = router;
