const express = require('express');
const rateLimit = require("express-rate-limit");
const authController = require('../controllers/authController');
const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5, // máx 5 tentativas por IP nesse tempo
    message: { error: "Muitas tentativas de login. Tente novamente mais tarde." }
});

router.post("/login", loginLimiter, authController.login);

console.log("Auth Routes Loaded");

module.exports = router;
