const express = require("express");
const router = express.Router();
const tabletsController = require("../controllers/tabletsController");

router.post("/", tabletsController.criarTablet);
router.get("/", tabletsController.listarTablets);
router.get("/busca", tabletsController.buscarTablet);
router.put("/:id", tabletsController.editarTablet);
router.delete("/:id", tabletsController.deletarTablet);

module.exports = router;
