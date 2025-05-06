const express = require("express");
const router = express.Router();
const empresasController = require("../controllers/empresasController");

router.post("/", empresasController.criarEmpresa);
router.get("/", empresasController.listarEmpresas);
router.delete("/:id", empresasController.deletarEmpresa);

module.exports = router;