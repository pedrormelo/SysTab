const express = require("express");
const router = express.Router();
const unidadesController = require("../controllers/unidadesController");

// router.post("/", unidadesController.cadastrarUnidade);
router.get("/", unidadesController.listarUnidades);
//router.put("/:id", unidadesController.editarUnidade);
// router.delete("/:id", unidadesController.deletarUnidade);

console.log('Unidades routes loaded!');

module.exports = router;