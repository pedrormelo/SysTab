const express = require('express');
const router = express.Router();
const { getCalls, createCall } = require('../controllers/calls.controller');

router.get('/', getCalls);
router.post('/', createCall);

module.exports = router;
