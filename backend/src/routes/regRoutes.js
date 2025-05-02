const express = require("express");
const router = express.Router();
const regController = require("../controllers/regController");

router.get("/", regController.listarRegionais);

module.exports = router;