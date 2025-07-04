const express = require("express");
const router = express.Router();
const unidadesController = require("../controllers/unidadesController");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

router.post("/", auth, admin, unidadesController.criarUnidade);
router.get("/", auth, unidadesController.listarUnidades);
//router.put(":id", auth, admin, unidadesController.editarUnidade);
router.delete("/:id", auth, admin, unidadesController.deletarUnidade);

console.log('Unidades routes loaded!');

module.exports = router;