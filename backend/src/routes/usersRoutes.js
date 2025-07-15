
const express = require("express");
const router = express.Router();
const upload = require("../config/uploadsConfig");
const usuariosController = require("../controllers/usersController");
// Termo de Responsabilidade (PDF) upload/download/view
router.post("/:idUser/termo/upload", upload.single("termo"), usuariosController.uploadTermo);
router.get("/:idUser/termo/download", usuariosController.downloadTermo);
router.get("/:idUser/termo/view", usuariosController.viewTermo);
router.delete("/:idUser/termo", usuariosController.deleteTermo);

router.post("/", usuariosController.criarUsuario);
router.get("/", usuariosController.listarUsuarios);
router.put("/:id", usuariosController.editarUsuario);
router.delete("/:id", usuariosController.deletarUsuario);

console.log('Usuarios routes loaded!');

module.exports = router;