const express = require("express");
const router = express.Router();
const tabletsController = require("../controllers/tabletsController");

router.post("/", tabletsController.criarTablet);
router.get("/", tabletsController.listarTablets);
router.get("/busca", tabletsController.buscarTablet);
router.get("/:id", tabletsController.buscarTabletPorId);
router.put("/:id", tabletsController.editarTablet);
router.delete("/:id", tabletsController.deletarTablet);

console.log("Tablets Routes Loaded");

module.exports = router;

