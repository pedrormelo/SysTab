const express = require('express');
const router = express.Router();
const { getTablets, searchTablets } = require('../controllers/tablets.controller');

router.get('/', getTablets);
router.get('/search', searchTablets);

module.exports = router;
